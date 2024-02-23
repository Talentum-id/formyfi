import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Error "mo:base/Error";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Map "mo:base/HashMap";
import Nat "mo:base/Nat";
import Order "mo:base/Order";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Types "types";
import Utils "../user_index/utils";

actor QAIndex {
  type Answer = Types.Answer;
  type FetchParams = Types.QAGetParams;
  type QA = Types.QA;
  type QaResponse = Types.ShowQAResult;
  type Question = Types.Question;
  type List = Types.ListResult;

  stable var QAEntries : [(Text, [QA])] = [];
  stable var shareLinkEntries : [(Text, Text)] = [];

  let QAs = Map.fromIter<Text, [QA]>(QAEntries.vals(), 1000, Text.equal, Text.hash);
  let shareLinks = Map.fromIter<Text, Text>(shareLinkEntries.vals(), 1000, Text.equal, Text.hash);

  public query func list(params : FetchParams) : async List {
    if (params.identity == "") {
      throw Error.reject("Identity is not specified");
    };

    switch (QAs.get(params.identity)) {
      case null {
        {
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
      case (?userQAs) filter(userQAs, params);
    };
  };

  public query func show(shareLink : Text) : async ?QaResponse {
    switch (shareLinks.get(shareLink)) {
      case null null;
      case (?identity) {
        switch (QAs.get(identity)) {
          case null null;
          case (?userQAs) {
            switch (Array.find<QA>(userQAs, func x = x.shareLink == shareLink)) {
              case null null;
              case (?quest) {
                ?{
                  quest;
                  owner = identity;
                };
              };
            };
          };
        };
      };
    };
  };

  public shared ({ caller }) func store(data : QA, character : Utils.Character) : async () {
    let identity = await Utils.authenticate(caller, true, character);

    if (not (validate(data))) {
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

  public func incrementParticipants(shareLink : Text) : async () {
    switch (shareLinks.get(shareLink)) {
      case null return;
      case (?identity) {
        switch (QAs.get(identity)) {
          case null return;
          case (?qas) {
            let userQAs = Array.map<QA, QA>(
              qas,
              func quest = {
                image = quest.image;
                title = quest.title;
                description = quest.description;
                shareLink = quest.shareLink;
                participants = if (quest.shareLink == shareLink) quest.participants + 1 else quest.participants;
                start = quest.start;
                end = quest.end;
                questions = quest.questions;
              },
            );

            QAs.put(identity, userQAs);
          };
        };
      };
    };
  };

  public shared ({ caller }) func delete(shareLink : Text, character : Utils.Character) : async () {
    let identity = await Utils.authenticate(caller, true, character);

    switch (QAs.get(identity)) {
      case null return;
      case (?userQAs) {
        QAs.put(identity, Array.filter<QA>(userQAs, func x = x.shareLink != shareLink));
      };
    };

    shareLinks.delete(shareLink);
  };

  func filter(qas : [QA], params : FetchParams) : List {
    var data = qas;
    let { search; page; pageSize; sortBy } = params;

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

    if (search != "") {
      let formattedSearch = Text.toLowercase(search);

      data := Array.filter<QA>(data, func qa = Text.contains(Text.toLowercase(qa.title), #text formattedSearch));
    };

    if (sortBy.key != "") {
      let order = if (sortBy.value == "asc") "asc" else "desc";

      data := Array.sort<QA>(
        data,
        func(x : QA, y : QA) {
          let (key1 : Text, key2 : Text) = switch (sortBy.key) {
            case "shareLink" (x.shareLink, y.shareLink);
            case "participants" (Nat.toText(x.participants), Nat.toText(y.participants));
            case "start" (Nat.toText(x.start), Nat.toText(y.start));
            case "end" (Nat.toText(x.end), Nat.toText(y.end));
            case _ (x.title, y.title);
          };

          switch (order) {
            case "asc" {
              if (key1 > key2) #greater else if (key1 < key2) #less else #equal;
            };
            case _ {
              if (key1 > key2) #less else if (key1 < key2) #greater else #equal;
            };
          };
        },
      );
    };

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
      var QAIter = Array.slice<QA>(data, Int.abs(offset), Int.abs(limit));

      data := Iter.toArray(QAIter);
    };

    data := Array.map<QA, QA>(
      data,
      func x = {
        image = x.image;
        title = x.title;
        description = x.description;
        shareLink = x.shareLink;
        participants = x.participants;
        start = x.start;
        end = x.end;
        questions = [];
      },
    );

    { data; pagination };
  };

  func validate(data : QA) : Bool {
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
      title == "" or description == "" or shareLink == "" or image == "" or start == 0 or end == 0
    ) {
      return false;
    };

    if (questions.size() < 1) {
      return false;
    };

    true;
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
