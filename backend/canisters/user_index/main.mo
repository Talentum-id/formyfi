import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Debug "mo:base/Debug";
import Map "mo:base/HashMap";
import Iter "mo:base/Iter";
import StatsTypes "../stats_index/types";
import MetricsIndex "canister:metrics_index";
import Text "mo:base/Text";
import Types "./types";
import Utils "utils";

actor UserIndex {
  let SUPERADMIN = "darkcoder";
  let DEFAULT_IDENTITY_INCORRECT_INDEX = 100001;

  type ExtraIdentity = Types.ExtraIdentity;
  type UserData = Types.UserData;
  type ProfileData = {
    user : UserData;
    stats : ?StatsTypes.Data;
    extraIdentities : [?ExtraIdentity];
  };
  type UserDataByExtraIdentity = {
    identity : Text;
    user : ?UserData;
  };

  stable var userEntries : [(Text, UserData)] = [];
  stable var usernameEntries : [(Text, Text)] = [];
  stable var adminUsernames : [Text] = [];
  stable var extraIdentityEntries : [(Text, ExtraIdentity)] = [];

  let users = Map.fromIter<Text, UserData>(userEntries.vals(), 1000, Text.equal, Text.hash);
  let usernames = Map.fromIter<Text, Text>(usernameEntries.vals(), 1000, Text.equal, Text.hash);
  let extraIdentities = Map.fromIter<Text, ExtraIdentity>(extraIdentityEntries.vals(), 1000, Text.equal, Text.hash);

  public query func getUsersAmount() : async Nat {
    users.size();
  };

  public shared ({ caller }) func register(data : UserData, character : Utils.Character) : async ?UserData {
    let { provider; fullName; username; avatar; banner; title; connector } = data;
    let identity = await Utils.authenticate(caller, true, character);

    if (username.size() == 0) {
      Debug.trap("Username cannot be empty");
    };

    if (username.size() < 4 or username.size() > 18) {
      Debug.trap("Username should have from 4 to 18 characters.");
    };

    if (await findUsername(username)) {
      Debug.trap("This username already exists");
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
              extraIdentities = ?[];
              title;
              connector;
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

  public query func findByExtraIdentity(identity : Text) : async ?UserDataByExtraIdentity {
    switch (extraIdentities.get(identity)) {
      case null null;
      case (?extraIdentity) {
        let identity = extraIdentity.primaryIdentity;
        let user = users.get(identity);

        ?{ identity; user };
      };
    };
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

  public shared ({ caller }) func addTitle(title : Text, character : Utils.Character) : async () {
    let identity = await Utils.authenticate(caller, false, character);

    switch (users.get(identity)) {
      case null ignore null;
      case (?user) {
        let {
          provider;
          fullName;
          username;
          avatar;
          banner;
          extraIdentities;
          forms_created;
          connector;
        } = user;

        users.put(
          identity,
          {
            provider;
            fullName;
            banner;
            username;
            avatar;
            forms_created;
            extraIdentities;
            title = ?title;
            connector;
          },
        );
      };
    };
  };

  public shared ({ caller }) func addConnector(connector : Text, character : Utils.Character) : async () {
    let identity = await Utils.authenticate(caller, false, character);

    switch (users.get(identity)) {
      case null ignore null;
      case (?user) {
        let { provider; fullName; username; avatar; banner; extraIdentities; forms_created; title } = user;

        users.put(
          identity,
          {
            provider;
            fullName;
            banner;
            username;
            avatar;
            forms_created;
            extraIdentities;
            title;
            connector = ?connector;
          },
        );
      };
    };
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
        case (?_) Debug.trap("Username is already an Admin");
      };
    } else {
      Debug.trap("This username does not exist");
    };
  };

  public shared ({ caller }) func deleteAdmin(username : Text, character : Utils.Character) : async () {
    let identity = await Utils.authenticate(caller, true, character);
    await checkAdminRights(identity);

    if (username == SUPERADMIN) {
      Debug.trap("This username is super-admin and cannot be removed");
    };

    if (await findUsername(username)) {
      switch (Array.find<Text>(adminUsernames, func x = x == username)) {
        case null Debug.trap("Username is already an Admin");
        case (?_) {
          adminUsernames := Array.filter<Text>(adminUsernames, func x = x != username);
        };
      };
    } else {
      Debug.trap("This username does not exist");
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
      case null Debug.trap(Utils.DEFAULT_ERROR);
      case (?user) {
        let stats = await MetricsIndex.findStats(identity);
        let extraIdentities = switch (user.extraIdentities) {
          case null [];
          case (?userIdentities) await getExtraIdentities(userIdentities);
        };

        { user; stats; extraIdentities };
      };
    };
  };

  public shared ({ caller }) func addExtraIdentity(
    extraIdentity : Text,
    extraProvider : Text,
    character : Utils.Character,
    identityTitle : Text,
    connectorName : Text,
  ) : async () {
    let identity = await Utils.authenticate(caller, false, character);

    switch (extraIdentities.get(extraIdentity)) {
      case null {
        switch (users.get(identity)) {
          case null Debug.trap("User does not exist");
          case (?user) {
            if (users.get(extraIdentity) != null) {
              Debug.trap("This identity is already attached");
            };

            let { provider; fullName; username; avatar; banner; title; forms_created; connector } = user;
            let userIdentities = switch (user.extraIdentities) {
              case null Buffer.fromArray<Text>([]);
              case (?identities) Buffer.fromArray<Text>(identities);
            };

            if (Buffer.contains<Text>(userIdentities, extraIdentity, Text.equal)) {
              Debug.trap("This identity is already attached");
            };

            userIdentities.add(extraIdentity);
            users.put(
              identity,
              {
                provider;
                fullName;
                banner;
                username;
                avatar;
                forms_created;
                extraIdentities = ?Buffer.toArray(userIdentities);
                title;
                connector;
              },
            );
            extraIdentities.put(
              extraIdentity,
              {
                primaryIdentity = identity;
                title = identityTitle;
                provider = extraProvider;
                connector = connectorName;
              },
            );
          };
        };
      };
      case (?_) {
        Debug.trap("This identity is already attached");
      };
    };
  };

  public query func getExtraIdentities(identities : [Text]) : async [?ExtraIdentity] {
    let data = Buffer.fromArray<?ExtraIdentity>([]);

    for (identity in identities.vals()) {
      data.add(extraIdentities.get(identity));
    };

    Buffer.toArray(data);
  };

  public shared ({ caller }) func deleteExtraIdentity(extraIdentity : Text, character : Utils.Character) : async () {
    let identity = await Utils.authenticate(caller, false, character);

    switch (extraIdentities.get(extraIdentity)) {
      case null ignore null;
      case (?userIdentity) {
        switch (users.get(identity)) {
          case null Debug.trap("User does not exist");
          case (?user) {
            var index = DEFAULT_IDENTITY_INCORRECT_INDEX;
            let { provider; fullName; username; avatar; banner; title; connector } = user;
            let userIdentities = switch (user.extraIdentities) {
              case null Buffer.fromArray<Text>([]);
              case (?identities) {
                switch (Array.indexOf<Text>(extraIdentity, identities, Text.equal)) {
                  case null ignore null;
                  case (?extraIdentityIndex) {
                    index := extraIdentityIndex;
                  };
                };

                Buffer.fromArray<Text>(identities);
              };
            };

            if (
              index == DEFAULT_IDENTITY_INCORRECT_INDEX or
              userIdentity.primaryIdentity != identity
            ) {
              Debug.trap("This identity belongs to another user");
            };

            ignore userIdentities.remove(index);
            users.put(
              identity,
              {
                provider;
                fullName;
                banner;
                username;
                avatar;
                forms_created = 0;
                extraIdentities = ?Buffer.toArray(userIdentities);
                title;
                connector;
              },
            );
            extraIdentities.delete(extraIdentity);
          };
        };
      };
    };
  };

  public shared ({ caller }) func updateMe(character : Utils.Character, data : UserData) : async ?UserData {
    let identity = await Utils.authenticate(caller, false, character);

    switch (users.get(identity)) {
      case null Debug.trap(Utils.DEFAULT_ERROR);
      case (?user) {
        users.put(identity, data);

        if (user.username == SUPERADMIN and data.username != user.username) {
          Debug.trap(SUPERADMIN # " is only super-admin, hence username cannot be updated");
        };

        if (user.username != data.username) {
          let existingUsername = await findUsername(data.username);

          if (existingUsername) Debug.trap("This username already exists");

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
      pairs := pairs # "(" # key # " -- " # value.username # " -- " # value.fullName # ")\n\n";
    };

    for ((key, value) in usernames.entries()) {
      pairs := pairs # "(" # key # " -- " # value # ")\n\n";
    };

    for ((key, value) in extraIdentities.entries()) {
      pairs := pairs # "(" # key # " -- " # value.primaryIdentity # " -- " # value.provider # ")\n\n";
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

    for ((key, value) in extraIdentities.entries()) {
      extraIdentities.delete(key);
    };

    adminUsernames := [];
  };

  public query func checkAdminRights(identity : Text) : async () {
    switch (users.get(identity)) {
      case null {
        Debug.trap("You don't have an Admin rights");
      };
      case (?callerData) {
        if (
          Array.find<Text>(adminUsernames, func x = x == callerData.username) == null and
          callerData.username != SUPERADMIN
        ) {
          Debug.trap("You don't have an Admin rights");
        };
      };
    };
  };

  system func preupgrade() {
    userEntries := Iter.toArray(users.entries());
    usernameEntries := Iter.toArray(usernames.entries());
    extraIdentityEntries := Iter.toArray(extraIdentities.entries());
  };

  system func postupgrade() {
    userEntries := [];
    usernameEntries := [];
    extraIdentityEntries := [];
  };
};
