import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Map "mo:base/HashMap";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Types "/types";

actor MetricsIndex {
  type GeneralStatsData = Types.GeneralData;
  type List = Types.ListResult;
  type Params = Types.FetchParams;
  type ProjectList = Types.ListResultPerProject;
  type ProjectStatsData = Types.ProjectData;
  type StatsData = Types.Data;

  stable var statsPerProjectEntries : [(Text, [ProjectStatsData])] = [];
  stable var statsEntries : [(Text, StatsData)] = [];
  stable var generalStats : [GeneralStatsData] = [];

  let FORMS_CREATED_POINTS = 5;
  let stats = Map.fromIter<Text, StatsData>(statsEntries.vals(), 1000, Text.equal, Text.hash);
  let statsPerProject = Map.fromIter<Text, [ProjectStatsData]>(statsPerProjectEntries.vals(), 1000, Text.equal, Text.hash);

  public query func list(params : Params) : async List {
    var data = generalStats;
    let { page; pageSize } = params;

    if (data.size() < 1) {
      return {
        pagination = {
          total = 0;
          count = 0;
          per_page = 10;
          current_page = 1;
          total_pages = 1;
        };
        data = [];
      };
    };

    data := Array.sort<GeneralStatsData>(
      data,
      func(x : GeneralStatsData, y : GeneralStatsData) {
        let (key1 : Nat, key2 : Nat) = (x.points, y.points);

        if (key1 > key2) #less else if (key2 > key1) #greater else #equal;
      },
    );

    let pagination = {
      total = data.size();
      count = params.pageSize;
      per_page = params.pageSize;
      current_page = params.page;
      total_pages = Float.ceil(Float.fromInt(data.size()) / Float.fromInt(params.pageSize));
    };

    if (page != 0 and pageSize != 0) {
      var offset : Int = page - 1;
      offset := offset * pageSize;

      var limit : Int = if (data.size() < offset + pageSize) data.size() else offset + pageSize;
      var slicedData = Array.slice<GeneralStatsData>(data, Int.abs(offset), Int.abs(limit));

      data := Iter.toArray(slicedData);
    };

    { data; pagination };
  };

  public query func listPerProject(identity : Text, params : Params) : async ProjectList {
    switch (statsPerProject.get(identity)) {
      case null {
        return {
          pagination = {
            total = 0;
            count = 0;
            per_page = 10;
            current_page = 1;
            total_pages = 1;
          };
          data = [];
        };
      };
      case (?statistics) {
        var data = statistics;
        let { page; pageSize } = params;

        data := Array.sort<ProjectStatsData>(
          data,
          func(x : ProjectStatsData, y : ProjectStatsData) {
            let (key1 : Nat, key2 : Nat) = (x.points, y.points);

            if (key1 > key2) #less else if (key2 > key1) #greater else #equal;
          },
        );

        let pagination = {
          total = data.size();
          count = params.pageSize;
          per_page = params.pageSize;
          current_page = params.page;
          total_pages = Float.ceil(Float.fromInt(data.size()) / Float.fromInt(params.pageSize));
        };

        if (page != 0 and pageSize != 0) {
          var offset : Int = page - 1;
          offset := offset * pageSize;

          var limit : Int = if (data.size() < offset + pageSize) data.size() else offset + pageSize;
          var slicedData = Array.slice<ProjectStatsData>(data, Int.abs(offset), Int.abs(limit));

          data := Iter.toArray(slicedData);
        };

        { data; pagination };
      };
    };
  };

  public func incrementFormCreated(identity : Text) {
    switch (stats.get(identity)) {
      case null {
        stats.put(
          identity,
          {
            forms_created = 1;
            forms_completed = 0;
            points = FORMS_CREATED_POINTS;
          },
        );

        let statistics = Buffer.fromArray<GeneralStatsData>(generalStats);

        statistics.add({
          forms_created = 1;
          forms_completed = 0;
          points = FORMS_CREATED_POINTS;
          identity;
          total_invited = ?0;
        });

        generalStats := Buffer.toArray(statistics);
      };
      case (?stat) {
        stats.put(
          identity,
          {
            forms_created = stat.forms_created + 1;
            forms_completed = stat.forms_completed;
            points = stat.points + FORMS_CREATED_POINTS;
          },
        );

        switch (Array.find<GeneralStatsData>(generalStats, func item = item.identity == identity)) {
          case null {
            let statistics = Buffer.fromArray<GeneralStatsData>(generalStats);

            statistics.add({
              forms_created = 1;
              forms_completed = 0;
              points = FORMS_CREATED_POINTS;
              identity;
              total_invited = ?0;
            });

            generalStats := Buffer.toArray(statistics);
          };
          case (?userStats) {
            switch (
              Array.indexOf<GeneralStatsData>(
                userStats,
                generalStats,
                func(stat1 : GeneralStatsData, stat2 : GeneralStatsData) : Bool = stat1 == stat2,
              )
            ) {
              case null ();
              case (?index) {
                let statsData = Buffer.fromArray<GeneralStatsData>(generalStats);

                statsData.put(
                  index,
                  {
                    identity = userStats.identity;
                    points = userStats.points + FORMS_CREATED_POINTS;
                    forms_created = userStats.forms_created + 1;
                    forms_completed = userStats.forms_completed;
                    total_invited = userStats.total_invited;
                  },
                );

                generalStats := Buffer.toArray<GeneralStatsData>(statsData);
              };
            };
          };
        };
      };
    };
  };

  public func addPoints(identity : Text, earnedPoints : ?Nat) : async () {
    switch (earnedPoints) {
      case null ignore null;
      case (?p) {
        let points = p;
        switch (stats.get(identity)) {
          case null {
            stats.put(
              identity,
              {
                forms_created = 0;
                forms_completed = 0;
                points;
              },
            );

            let statistics = Buffer.fromArray<GeneralStatsData>(generalStats);

            statistics.add({
              forms_created = 0;
              forms_completed = 0;
              points;
              identity;
              total_invited = ?1;
            });

            generalStats := Buffer.toArray(statistics);
          };
          case (?stat) {
            stats.put(
              identity,
              {
                forms_created = stat.forms_created;
                forms_completed = stat.forms_completed;
                points = stat.points + points;
              },
            );

            switch (Array.find<GeneralStatsData>(generalStats, func item = item.identity == identity)) {
              case null {
                let statistics = Buffer.fromArray<GeneralStatsData>(generalStats);

                statistics.add({
                  forms_created = 0;
                  forms_completed = 0;
                  points;
                  identity;
                  total_invited = ?1;
                });

                generalStats := Buffer.toArray(statistics);
              };
              case (?userStats) {
                switch (
                  Array.indexOf<GeneralStatsData>(
                    userStats,
                    generalStats,
                    func(stat1 : GeneralStatsData, stat2 : GeneralStatsData) : Bool = stat1 == stat2,
                  )
                ) {
                  case null ();
                  case (?index) {
                    let statsData = Buffer.fromArray<GeneralStatsData>(generalStats);
                    let total_invited = switch (userStats.total_invited) {
                      case null ?1;
                      case (?n) {
                        let result = n + 1;

                        ?result;
                      };
                    };

                    statsData.put(
                      index,
                      {
                        identity = userStats.identity;
                        points = userStats.points + points;
                        forms_created = userStats.forms_created;
                        forms_completed = userStats.forms_completed;
                        total_invited;
                      },
                    );

                    generalStats := Buffer.toArray<GeneralStatsData>(statsData);
                  };
                };
              };
            };
          };
        };
      };
    };
  };

  public func addPointsPerProject(project : Text, identity : Text, pointsAddition : ?Nat) : async () {
    let points = switch (pointsAddition) {
      case null 0;
      case (?result) result;
    };

    switch (statsPerProject.get(project)) {
      case null {
        statsPerProject.put(project, [{ identity; points; forms_completed = 0; total_invited = ?1 }]);
      };
      case (?statistics) {
        switch (Array.find<ProjectStatsData>(statistics, func item = item.identity == identity)) {
          case null {
            let statsData = Buffer.fromArray<ProjectStatsData>(statistics);

            statsData.add({
              identity;
              points;
              forms_completed = 0;
              total_invited = ?1;
            });

            statsPerProject.put(project, Buffer.toArray(statsData));
          };
          case (?userStatsPerProject) {
            switch (
              Array.indexOf<ProjectStatsData>(
                userStatsPerProject,
                statistics,
                func(stat1 : ProjectStatsData, stat2 : ProjectStatsData) : Bool = stat1 == stat2,
              )
            ) {
              case null ();
              case (?index) {
                let statsData = Buffer.fromArray<ProjectStatsData>(statistics);
                let total_invited = switch (userStatsPerProject.total_invited) {
                  case null ?1;
                  case (?result) {
                    let number = result;
                    let total = result + 1;

                    ?total;
                  };
                };

                statsData.put(
                  index,
                  {
                    identity;
                    points = userStatsPerProject.points + points;
                    forms_completed = userStatsPerProject.forms_completed;
                    total_invited;
                  },
                );

                statsPerProject.put(project, Buffer.toArray(statsData));
              };
            };
          };
        };
      };
    };
  };

  public func incrementFormCompleted(qaOwner : Text, identity : Text, generalPoints : Nat, points : Nat) {
    await incrementGeneralPoints(identity, generalPoints);
    await incrementPointsPerProject(qaOwner, identity, points);
  };

  public query func findStats(identity : Text) : async ?StatsData {
    switch (stats.get(identity)) {
      case null null;
      case (?stats) ?stats;
    };
  };

  public query func findUserStats(identities : [Text]) : async [?StatsData] {
    let data = Buffer.fromArray<?StatsData>([]);

    for (identity in identities.vals()) {
      data.add(stats.get(identity));
    };

    Buffer.toArray(data);
  };

  func incrementGeneralPoints(identity : Text, points : Nat) : async () {
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

        let statistics = Buffer.fromArray<GeneralStatsData>(generalStats);

        statistics.add({
          forms_created = 0;
          forms_completed = 1;
          points;
          identity;
          total_invited = ?0;
        });

        generalStats := Buffer.toArray(statistics);
      };
      case (?stat) {
        stats.put(
          identity,
          {
            forms_created = stat.forms_created;
            forms_completed = stat.forms_completed + 1;
            points = points + stat.points;
          },
        );

        switch (Array.find<GeneralStatsData>(generalStats, func item = item.identity == identity)) {
          case null {
            let statistics = Buffer.fromArray<GeneralStatsData>(generalStats);

            statistics.add({
              forms_created = 0;
              forms_completed = 1;
              points;
              identity;
              total_invited = ?0;
            });

            generalStats := Buffer.toArray(statistics);
          };
          case (?userStats) {
            switch (
              Array.indexOf<GeneralStatsData>(
                userStats,
                generalStats,
                func(stat1 : GeneralStatsData, stat2 : GeneralStatsData) : Bool = stat1 == stat2,
              )
            ) {
              case null ();
              case (?index) {
                let statsData = Buffer.fromArray<GeneralStatsData>(generalStats);

                statsData.put(
                  index,
                  {
                    identity = userStats.identity;
                    points = userStats.points + points;
                    forms_created = userStats.forms_created;
                    forms_completed = userStats.forms_completed + 1;
                    total_invited = userStats.total_invited;
                  },
                );

                generalStats := Buffer.toArray<GeneralStatsData>(statsData);
              };
            };
          };
        };
      };
    };
  };

  func incrementPointsPerProject(project : Text, identity : Text, points : Nat) : async () {
    switch (statsPerProject.get(project)) {
      case null {
        statsPerProject.put(project, [{ identity; points; forms_completed = 1; total_invited = ?0 }]);
      };
      case (?statistics) {
        switch (Array.find<ProjectStatsData>(statistics, func item = item.identity == identity)) {
          case null {
            let statsData = Buffer.fromArray<ProjectStatsData>(statistics);

            statsData.add({
              identity;
              points;
              forms_completed = 1;
              total_invited = ?0;
            });

            statsPerProject.put(project, Buffer.toArray(statsData));
          };
          case (?userStatsPerProject) {
            switch (
              Array.indexOf<ProjectStatsData>(
                userStatsPerProject,
                statistics,
                func(stat1 : ProjectStatsData, stat2 : ProjectStatsData) : Bool = stat1 == stat2,
              )
            ) {
              case null ();
              case (?index) {
                let statsData = Buffer.fromArray<ProjectStatsData>(statistics);

                statsData.put(
                  index,
                  {
                    identity;
                    points = userStatsPerProject.points + points;
                    forms_completed = userStatsPerProject.forms_completed + 1;
                    total_invited = userStatsPerProject.total_invited;
                  },
                );

                statsPerProject.put(project, Buffer.toArray(statsData));
              };
            };
          };
        };
      };
    };
  };

  public query func readAll() : async Text {
    var pairs = "";

    for ((key, value) in stats.entries()) {
      pairs := "(" # key # ", " # debug_show (value) # ") " # pairs;
    };

    for ((key, value) in statsPerProject.entries()) {
      pairs := "(" # key # ", " # debug_show (value) # ") " # pairs;
    };

    return pairs;
  };

  public func reset() : async () {
    for ((key, value) in stats.entries()) {
      stats.delete(key);
    };

    for ((key, value) in statsPerProject.entries()) {
      statsPerProject.delete(key);
    };

    generalStats := [];
  };

  system func preupgrade() {
    statsEntries := Iter.toArray(stats.entries());
    statsPerProjectEntries := Iter.toArray(statsPerProject.entries());
  };

  system func postupgrade() {
    statsEntries := [];
    statsPerProjectEntries := [];
  };
};
