import Text "mo:base/Text";
import RBTree "mo:base/RBTree";
import Map "mo:base/HashMap";
import Principal "mo:base/Principal";
import Buffer "mo:base/Buffer";
import Iter "mo:base/Iter";
import Error "mo:base/Error";

actor UserIndex {
    stable var userEntries : [(Principal, Text)] = [];
    stable var usernameEntries : [(Text, Principal)] = [];

    let users = Map.fromIter<Principal, Text>(userEntries.vals(), 10000, Principal.equal, Principal.hash);
    let usernames = Map.fromIter<Text, Principal>(usernameEntries.vals(), 10000, Text.equal, Text.hash);

    public shared({caller}) func register(username: Text, fullName: Text): async() {
        if (username.size() == 0 or fullName.size() == 0) {
            throw Error.reject("Username and Full name cannot be empty");
        };

        if (usernames.get(username) != null) {
            throw Error.reject("This username already exists");
        } else {
            switch(users.get(caller)) {
                case null {
                    users.put(caller, username # "<==>" # fullName);
                    usernames.put(username, caller);
                };
                case(?id) { };
            };
        }
    };

    public query({caller}) func findUser(): async ?Text {
        users.get(caller);
    };

    public query func findUsername(username: Text): async Bool {
        usernames.get(username) != null;
    };

    public query func readAll(): async Text {
        var pairs = "";

        for((key, value) in users.entries()) {
            pairs := "(" # Principal.toText(key) # ", " # value # ") " # pairs
        };

        for((key, value) in usernames.entries()) {
            pairs := "(" # key # ", " # Principal.toText(value) # ") " # pairs
        };

        return pairs;
    };

    public func reset(): async() {
        for((key, value) in users.entries()) {
            users.delete(key);
        };

        for((key, value) in usernames.entries()) {
            usernames.delete(key);
        };
    };

    system func preupgrade() {
        userEntries := Iter.toArray(users.entries());
        usernameEntries := Iter.toArray(usernames.entries());
    };

    system func postupgrade() {
        userEntries := [];
        usernameEntries := [];
    };
};