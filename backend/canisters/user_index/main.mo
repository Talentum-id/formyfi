import Text "mo:base/Text";
import Map "mo:base/HashMap";
import Iter "mo:base/Iter";
import Error "mo:base/Error";
import Types "../stats_index/types";
import StatsIndex "canister:stats_index";
import Utils "utils";

actor UserIndex {
  type ProfileData = {
    user : UserData;
    stats : ?Types.Data;
  };

  type UserData = {
    provider : Text;
    fullName : Text;
    username : Text;
    avatar : ?Text;
  };

  stable var userEntries : [(Text, UserData)] = [];
  stable var usernameEntries : [(Text, Text)] = [];

  let users = Map.fromIter<Text, UserData>(userEntries.vals(), 1000, Text.equal, Text.hash);
  let usernames = Map.fromIter<Text, Text>(usernameEntries.vals(), 1000, Text.equal, Text.hash);

  public shared ({ caller }) func register(data : UserData, character : Utils.Character) : async ?UserData {
    let { provider; fullName; username; avatar } = data;
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
              avatar;
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

  public shared ({ caller }) func me(character : Utils.Character) : async ProfileData {
    let identity = await Utils.authenticate(caller, false, character);

    switch (users.get(identity)) {
      case null throw Error.reject(Utils.DEFAULT_ERROR);
      case (?user) {
        let stats = await StatsIndex.findStats(identity);

        { user; stats };
      };
    };
  };

  public shared ({ caller }) func updateMe(character : Utils.Character, data : UserData) : async ?UserData {
    let identity = await Utils.authenticate(caller, false, character);

    switch (users.get(identity)) {
      case null throw Error.reject(Utils.DEFAULT_ERROR);
      case (?user) {
        users.put(identity, data);

        if (user.username != data.username) {
          let existingUsername = await findUsername(data.username);

          if (existingUsername) throw Error.reject("This username already exists");

          usernames.delete(user.username);
          usernames.put(data.username, identity);
        };

        users.get(identity);
      };
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
