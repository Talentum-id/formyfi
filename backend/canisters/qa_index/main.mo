import Map "mo:base/HashMap";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Error "mo:base/Error";
import Buffer "mo:base/Buffer";
import Order "mo:base/Order";
import Types "types";

actor QAIndex {
    type QA = Types.QA;
    type FetchParams = Types.QAGetParams;

    stable var QAEntries: [(Text, [QA])] = [];
    stable var shareLinkEntries: [(Text, Text)] = [];

    let QAs = Map.fromIter<Text, [QA]>(QAEntries.vals(), 1000, Text.equal, Text.hash);
    let shareLinks = Map.fromIter<Text, Text>(shareLinkEntries.vals(), 1000, Text.equal, Text.hash);

    public shared({caller}) func list(params: FetchParams): async [QA] {
        switch (QAs.get(Principal.toText(caller))) {
            case null [];
            case (?userQAs) filter(userQAs, params);
        };
    };

    public query func show(shareLink: Text): async ?QA {
        switch (shareLinks.get(shareLink)){
            case null null; 
            case (?identity) {
                switch (QAs.get(identity)) {
                    case null null;
                    case (?userQAs) Array.find<QA>(userQAs, func x = x.shareLink == shareLink);
                };
            };
        };
    };

    public shared({caller}) func store(data: QA) : async () {
        let identity = Principal.toText(caller);

        if (not (validate(data, identity))) {
            throw Error.reject("Please, fill required fields!");
        };

        let shareLinkExists = await show(data.shareLink);

        if (shareLinkExists != null) {
            throw Error.reject("This share link already exists!");
        };

        switch (QAs.get(identity)) {
            case null {
                QAs.put(identity, [data]);
            };
            case (?userQA) {
                let qas = Buffer.fromArray<QA>(userQA);
                qas.add(data);

                QAs.put(identity, Buffer.toArray(qas));
            };
        };

        shareLinks.put(data.shareLink, identity);
    };

    public shared({caller}) func delete(shareLink: Text): async () {
        let identity = Principal.toText(caller);

        switch (QAs.get(identity)) {
            case null return;
            case (?userQAs) {
                QAs.put(identity, Array.filter<QA>(userQAs, func x = x.shareLink != shareLink));
            };
        };

        shareLinks.delete(shareLink);
    };

    func filter(qas: [QA], params: FetchParams) : [QA] {
        var userQAs = qas;
        let {search; page; pageSize; sortBy} = params;

        if (userQAs.size() < 1) {
            return qas;
        };

        if (search != "") {
            let formattedSearch = Text.toLowercase(search);

            userQAs := Array.filter<QA>(userQAs, func qa = Text.contains(Text.toLowercase(qa.title), #text formattedSearch));
        };

        if (sortBy.key != "") {
            let order = if (sortBy.value == "asc") "asc" else "desc";

            userQAs := Array.sort<QA>(userQAs, func (x: QA, y: QA) {
                let (key1: Text, key2: Text) = switch (sortBy.key) {
                    case "shareLink" (x.shareLink, y.shareLink);
                    case "participants" (Nat.toText(x.participants), Nat.toText(y.participants));
                    case "start" (Nat.toText(x.start), Nat.toText(y.start));
                    case "end" (Nat.toText(x.end), Nat.toText(y.end));
                    case _ (x.title, y.title);
                };

                switch (order) {
                    case "asc" {
                        if (key1 > key2) #greater else if (key1 < key2) #less else #equal
                    };
                    case _ {
                        if (key1 > key2) #less else if (key1 < key2) #greater else #equal
                    };
                }
            });
        };

        if (page != 0 and pageSize != 0) {
            var offset: Nat = page - 1;
            offset := offset * pageSize;

            var limit = if (userQAs.size() < offset + pageSize) userQAs.size() else offset + pageSize; 
            var QAIter = Array.slice<QA>(userQAs, offset, limit);

            userQAs := Iter.toArray(QAIter);
        };

        userQAs;
    };

    func validate(data: QA, identity: Text): Bool {
        let {
            title;
            description;
            image;
            start;
            end;
            shareLink;
            questions;
        } = data;

        if (
            title == ""
            or description == ""
            or shareLink == ""
            or image == ""
            or start == 0
            or end == 0
        ) {
            return false;
        };

        if (questions.size() < 1) {
            return false;
        };

        true;
    };

    public query func readAll(): async Text {
        var pairs = "";

        for ((key, value) in QAs.entries()) {
            pairs := "(" # key # ", " # debug_show(value) # ") " # pairs
        };

        for ((key, value) in shareLinks.entries()) {
            pairs := "(" # key # ", " # value # ") " # pairs
        };

        return pairs;
    };

    public func reset(): async () {
        for ((key, value) in QAs.entries()) {
            QAs.delete(key);
        };

        for ((key, value) in shareLinks.entries()) {
            shareLinks.delete(key);
        };
    };

    system func preupgrade() {
        QAEntries := Iter.toArray(QAs.entries());
        shareLinkEntries := Iter.toArray(shareLinks.entries());
    };

    system func postupgrade() {
        QAEntries := [];
        shareLinkEntries := [];
    };
};