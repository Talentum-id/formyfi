import Text "mo:base/Text";
import RBTree "mo:base/RBTree";
import Map "mo:base/HashMap";
import Principal "mo:base/Principal";
import Buffer "mo:base/Buffer";
import Iter "mo:base/Iter";
import Error "mo:base/Error";
import Utils "utils";

actor UserIndex {
  type UserData = {
    provider : Text;
    fullName : Text;
    username : Text;
  };

  stable var userEntries : [(Text, UserData)] = [];
  stable var usernameEntries : [(Text, Text)] = [];

  let users = Map.fromIter<Text, UserData>(userEntries.vals(), 1000, Text.equal, Text.hash);
  let usernames = Map.fromIter<Text, Text>(usernameEntries.vals(), 1000, Text.equal, Text.hash);

  public shared ({ caller }) func register(data : UserData, character : Utils.Character) : async ?UserData {
    let { provider; fullName; username } = data;
    let identity = await Utils.authenticate(caller, true, character);

    if (username.size() == 0 or fullName.size() == 0) {
      throw Error.reject("Username and Full name cannot be empty");
    };

    if (username.size() < 4 or username.size() > 18) {
      throw Error.reject("Username should have from 4 to 18 characters.");
    };

    if (await findUsername(username)) {
      throw Error.reject("This username already exists");
    } else {
      switch (users.get(identity)) {
        case null {
          users.put(
            identity,
            {
              provider;
              fullName;
              username;
            },
          );
          usernames.put(username, identity);
        };
        case (?user) {};
      };
    };

    users.get(identity);
  };

  public query func findUser(identity : Text) : async ?UserData {
    users.get(identity);
  };

  public query func findUsername(username : Text) : async Bool {
    usernames.get(username) != null;
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
