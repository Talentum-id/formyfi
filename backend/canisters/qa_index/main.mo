import Map "mo:base/HashMap";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Error "mo:base/Error";
import Buffer "mo:base/Buffer";
import Types "types";

actor QAIndex {
    type QA = Types.QA;

    stable var QAEntries: [(Text, [QA])] = [];

    let QAs = Map.fromIter<Text, [QA]>(QAEntries.vals(), 1000, Text.equal, Text.hash);

    public shared({caller}) func store(data: QA) : async () {
        let identity = Principal.toText(caller);

        if (not (validate(data))) {
            throw Error.reject("Please, fill required fields!");
        };

        let QACheck = QAs.get(identity);

        switch(QACheck) {
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


    public shared({caller}) func delete(index: Nat): async () {
        let identity = Principal.toText(caller);
        let QACheck = QAs.get(identity);

        switch(QACheck) {
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

        for((key, value) in QAs.entries()) {
            pairs := "(" # key # ", " # debug_show(value) # ") " # pairs
        };

        return pairs;
    };

    public func reset(): async () {
        for((key, value) in QAs.entries()) {
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