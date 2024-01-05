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

    let QAs = Map.fromIter<Text, [QA]>(QAEntries.vals(), 1000, Text.equal, Text.hash);

    public shared({caller}) func store(data: QA) : async () {
        let identity = Principal.toText(caller);

        if (not (validate(data))) {
            throw Error.reject("Please, fill required fields!");
        };

        let QACheck = QAs.get(identity);

        switch (QACheck) {
            case null {
                QAs.put(identity, [data]);
            };
            case (?userQA) {
                let qas = Buffer.fromArray<QA>(userQA);
                qas.add(data);

                QAs.put(identity, Buffer.toArray(qas));
            };
        };
    };

    public shared({caller}) func get(params: FetchParams): async [QA] {
        let QACheck = QAs.get(Principal.toText(caller));

        switch (QACheck) {
            case null [];
            case (?userQAs) filter(userQAs, params);
        };
    };

    public shared({caller}) func delete(index: Nat): async () {
        let identity = Principal.toText(caller);
        let QACheck = QAs.get(identity);

        switch (QACheck) {
            case null return;
            case (?userQAs) {
                let qas = Buffer.fromArray<QA>(userQAs);

                switch(qas.getOpt(index)) {
                    case null return;
                    case (qa) {
                        ignore qas.remove(index);

                        QAs.put(identity, Buffer.toArray(qas));
                    };
                };
            };
        };
    };

    func filter (qas: [QA], params: FetchParams) : [QA] {
        var userQAs = qas;
        let {search; page; pageSize; sortBy} = params;

        if (userQAs.size() < 1) {
            return qas;
        };

        if (search != "") {
            userQAs := Array.filter<QA>(userQAs, func qa = Text.contains(qa.title, #text search));
        };

        if (sortBy.key != "") {
            let order = if (sortBy.value == "asc") "asc" else "desc";

            userQAs := Array.sort<QA>(userQAs, func (x: QA, y: QA) {
                let (key1: Text, key2: Text) = switch (sortBy.key) {
                    case "shareLink" (x.shareLink, y.shareLink);
                    case "participants" (debug_show(x.participants), debug_show(y.participants));
                    case "start" (debug_show(x.start), debug_show(y.start));
                    case "end" (debug_show(x.end), debug_show(y.end));
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
            let offset = page * pageSize;
            var QAIter = Array.slice<QA>(userQAs, offset, offset + pageSize);

            userQAs := Iter.toArray(QAIter);
        };

        userQAs;
    };

    func validate(data: QA): Bool {
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

        return pairs;
    };

    public func reset(): async () {
        for ((key, value) in QAs.entries()) {
            QAs.delete(key);
        };
    };

    system func preupgrade() {
        QAEntries := Iter.toArray(QAs.entries());
    };

    system func postupgrade() {
        QAEntries := [];
    };
};