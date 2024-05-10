import Iter "mo:base/Iter";
import Map "mo:base/HashMap";
import Text "mo:base/Text";
import Types "/types";

actor StatsIndex {
  type StatsData = Types.Data;

  stable var statsEntries : [(Text, StatsData)] = [];

  let stats = Map.fromIter<Text, StatsData>(statsEntries.vals(), 1000, Text.equal, Text.hash);

  public func incrementFormCreated(identity : Text) {
    switch (stats.get(identity)) {
      case null {
        stats.put(
          identity,
          {
            forms_created = 1;
            forms_completed = 0;
            points = 5;
          },
        );
      };
      case (?stat) {
        stats.put(
          identity,
          {
            forms_created = stat.forms_created + 1;
            forms_completed = stat.forms_completed;
            points = stat.points + 5;
          },
        );
      };
    };
  };

  public func incrementFormCompleted(identity : Text, points : Nat) {
    switch (stats.get(identity)) {
      case null {
        stats.put(
          identity,
          {
            forms_created = 0;
            forms_completed = 1;
            points;
          },
        );
      };
      case (?stat) {
        stats.put(
          identity,
          {
            forms_created = stat.forms_created;
            forms_completed = stat.forms_completed;
            points = points + stat.points;
          },
        );
      };
    };
  };

  public query func findStats(identity : Text) : async ?StatsData {
    switch (stats.get(identity)) {
      case null null;
      case (?stats) ?stats;
    };
  };

  system func preupgrade() {
    statsEntries := Iter.toArray(stats.entries());
  };

  system func postupgrade() {
    statsEntries := [];
  };
};
