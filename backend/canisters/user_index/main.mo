import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Map "mo:base/HashMap";
import Iter "mo:base/Iter";
import Error "mo:base/Error";
import StatsTypes "../stats_index/types";
import MetricsIndex "canister:metrics_index";
import Text "mo:base/Text";
import Types "./types";
import Utils "utils";

actor UserIndex {
  let SUPERADMIN = "darkcoder";

  type UserData = Types.UserData;
  type ProfileData = {
    user : UserData;
    stats : ?StatsTypes.Data;
  };

  stable var userEntries : [(Text, UserData)] = [];
  stable var usernameEntries : [(Text, Text)] = [];
  stable var adminUsernames : [Text] = [];

  let users = Map.fromIter<Text, UserData>(userEntries.vals(), 1000, Text.equal, Text.hash);
  let usernames = Map.fromIter<Text, Text>(usernameEntries.vals(), 1000, Text.equal, Text.hash);

  public query func getUsersAmount() : async Nat {
    users.size();
  };

  public shared ({ caller }) func register(data : UserData, character : Utils.Character) : async ?UserData {
    let { provider; fullName; username; avatar; banner } = data;
    let identity = await Utils.authenticate(caller, true, character);

    if (username.size() == 0) {
      throw Error.reject("Username cannot be empty");
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
              banner;
              username;
              avatar;
              forms_created = 0;
            },
          );
          usernames.put(username, identity);
        };
        case (?_) {};
      };
    };

    users.get(identity);
  };

  public query func findUser(identity : Text) : async ?UserData {
    users.get(identity);
  };

  public query func getUsers(identities : [Text]) : async [?UserData] {
    let data = Buffer.fromArray<?UserData>([]);

    for (identity in identities.vals()) {
      data.add(users.get(identity));
    };

    Buffer.toArray(data);
  };

  public query func fetchAdmins() : async [Text] {
    if (Array.find<Text>(adminUsernames, func x = x == SUPERADMIN) == null) {
      let adminsBuffer = Buffer.fromArray<Text>(adminUsernames);
      adminsBuffer.add(SUPERADMIN);

      adminUsernames := Buffer.toArray(adminsBuffer);
    };

    adminUsernames;
  };

  public shared ({ caller }) func addAdmin(username : Text, character : Utils.Character) : async () {
    let identity = await Utils.authenticate(caller, true, character);
    await checkAdminRights(identity);

    if (await findUsername(username)) {
      switch (Array.find<Text>(adminUsernames, func x = x == username)) {
        case null {
          var usernamesBuffer = Buffer.fromArray<Text>(adminUsernames);
          usernamesBuffer.add(username);

          adminUsernames := Buffer.toArray(usernamesBuffer);
        };
        case (?_) throw Error.reject("Username is already an Admin");
      };
    } else {
      throw Error.reject("This username does not exist");
    };
  };

  public shared ({ caller }) func deleteAdmin(username : Text, character : Utils.Character) : async () {
    let identity = await Utils.authenticate(caller, true, character);
    await checkAdminRights(identity);

    if (username == SUPERADMIN) {
      throw Error.reject("This username is super-admin and cannot be removed");
    };

    if (await findUsername(username)) {
      switch (Array.find<Text>(adminUsernames, func x = x == username)) {
        case null throw Error.reject("Username is already an Admin");
        case (?_) {
          adminUsernames := Array.filter<Text>(adminUsernames, func x = x != username);
        };
      };
    } else {
      throw Error.reject("This username does not exist");
    };
  };

  public query func findByUsername(username : Text) : async ?Text {
    switch (usernames.get(username)) {
      case null null;
      case (?identity) ?identity;
    };
  };

  public query func findUsername(username : Text) : async Bool {
    usernames.get(username) != null;
  };

  public shared ({ caller }) func me(character : Utils.Character) : async ProfileData {
    let identity = await Utils.authenticate(caller, false, character);

    switch (users.get(identity)) {
      case null throw Error.reject(Utils.DEFAULT_ERROR);
      case (?user) {
        let stats = await MetricsIndex.findStats(identity);

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

        if (user.username == SUPERADMIN) {
          throw Error.reject(SUPERADMIN # " is only super-admin, hence username cannot be updated");
        };

        if (user.username != data.username) {
          let existingUsername = await findUsername(data.username);

          if (existingUsername) throw Error.reject("This username already exists");

          usernames.delete(user.username);
          usernames.put(data.username, identity);

          if (Array.find<Text>(adminUsernames, func x = x == user.username) != null) {
            adminUsernames := Array.filter<Text>(adminUsernames, func x = x != user.username);

            let usernamesBuffer = Buffer.fromArray<Text>(adminUsernames);
            usernamesBuffer.add(data.username);

            adminUsernames := Buffer.toArray(usernamesBuffer);
          };
        };

        users.get(identity);
      };
    };
  };

  public query func readAll() : async Text {
    var pairs = "";

    for ((key, value) in users.entries()) {
      pairs := "(" # key # ", " # value.username # ", " # value.fullName # ") " # pairs;
    };

    for ((key, value) in usernames.entries()) {
      pairs := "(" # key # ", " # value # ") " # pairs;
    };

    return pairs;
  };

  public func reset() : async () {
    for ((key, value) in users.entries()) {
      users.delete(key);
    };

    for ((key, value) in usernames.entries()) {
      usernames.delete(key);
    };

    adminUsernames := [];
  };

  public query func checkAdminRights(identity : Text) : async () {
    switch (users.get(identity)) {
      case null {
        throw Error.reject("You don't have an Admin rights");
      };
      case (?callerData) {
        if (
          Array.find<Text>(adminUsernames, func x = x == callerData.username) == null and
          callerData.username != SUPERADMIN
        ) {
          throw Error.reject("You don't have an Admin rights");
        };
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
