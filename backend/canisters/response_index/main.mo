import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Error "mo:base/Error";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Map "mo:base/HashMap";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Types "/types";
import QAIndex "canister:qa_index";
import Utils "../user_index/utils";
import UserIndex "canister:user_index";

actor ResponseIndex {
  type Answer = Types.Answer;
  type Author = Types.QAAuthor;
  type Data = Types.ResponseParams;
  type FetchParams = Types.FetchParams;
  type List = Types.ListResult;
  type ResponseParams = Types.QAResponseParams;

  stable var authorsViaQAEntries : [(Text, [Author])] = [];
  stable var responseEntries : [(Text, [Answer])] = [];

  let authorsViaQA = Map.fromIter<Text, [Author]>(authorsViaQAEntries.vals(), 1000, Text.equal, Text.hash);
  let responses = Map.fromIter<Text, [Answer]>(responseEntries.vals(), 1000, Text.equal, Text.hash);

  public query func list(shareLink : Text, params : FetchParams) : async List {
    switch (authorsViaQA.get(shareLink)) {
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
      case (?authors) filter(authors, params);
    };
  };

  public query func show(params : ResponseParams) : async [Answer] {
    let { identity; shareLink } = params;
    let responseIdentifier = identity # "-" # shareLink;

    let response = switch (authorsViaQA.get(shareLink)) {
      case null null;
      case (?qaAuthors) Array.find<Author>(qaAuthors, func author = author.identity == identity);
    };

    switch (responses.get(responseIdentifier)) {
      case null [];
      case (?answers) answers;
    };
  };

  public shared ({ caller }) func store(data : Data, character : Utils.Character) : async () {
    let identity = await Utils.authenticate(caller, true, character);
    let { shareLink; answers; filled } = data;
    let responseIdentifier = identity # "-" # shareLink;

    switch (await QAIndex.show(shareLink)) {
      case null throw Error.reject("Q&A not found");
      case (?qa) {
        let questions = qa.quest.questions;

        switch (responses.get(responseIdentifier)) {
          case null {
            var index = 0;

            if (answers.size() != questions.size()) {
              throw Error.reject("The answers don't match the questions");
            };

            for (answer in answers.vals()) {
              if (answer.answer == "" and questions[index].required == true) {
                throw Error.reject("Required questions should be answered");
              };

              index += 1;
            };

            responses.put(responseIdentifier, answers);

            ignore saveAuthorQA(identity, data);
          };
          case (?answers) {
            throw Error.reject("The user already completed this Q&A");
          };
        };
      };
    };
  };

  private func saveAuthorQA(identity : Text, data : Data) : async () {
    let { shareLink; filled } = data;
    let username = switch (await UserIndex.findUser(identity)) {
      case null "Undefined";
      case (?user) user.username;
    };

    switch (authorsViaQA.get(shareLink)) {
      case null {
        authorsViaQA.put(shareLink, [{ username; identity; filled }]);
      };
      case (?authors) {
        if (Array.find<Author>(authors, func author = author.identity == identity) == null) {
          let qaAuthors = Buffer.fromArray<Author>(authors);

          qaAuthors.add({
            username;
            identity;
            filled;
          });

          authorsViaQA.put(shareLink, Buffer.toArray(qaAuthors));
        };
      };
    };

    ignore QAIndex.incrementParticipants(shareLink);
  };

  func filter(authors : [Author], params : FetchParams) : List {
    var data = authors;
    let { page; pageSize; sortBy } = params;

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

    if (sortBy.key != "") {
      let order = if (sortBy.value == "asc") "asc" else "desc";

      data := Array.sort<Author>(
        data,
        func(x : Author, y : Author) {
          let (key1 : Text, key2 : Text) = switch (sortBy.key) {
            case "participant" (x.username, y.username);
            case "filled" (Nat.toText(x.filled), Nat.toText(y.filled));
            case _ (Nat.toText(x.filled), Nat.toText(y.filled));
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
      var AuthorIter = Array.slice<Author>(data, Int.abs(offset), Int.abs(limit));

      data := Iter.toArray(AuthorIter);
    };

    data := Array.map<Author, Author>(
      data,
      func x = {
        username = x.username;
        identity = x.identity;
        filled = x.filled;
      },
    );

    { data; pagination };
  };

  public query func readAll() : async Text {
    var pairs = "";

    for ((key, value) in authorsViaQA.entries()) {
      pairs := "(" # key # ", " # debug_show (value) # ") " # pairs;
    };

    for ((key, value) in responses.entries()) {
      pairs := "(" # key # ", " # debug_show (value) # ") " # pairs;
    };

    return pairs;
  };

  public func reset() : async () {
    for ((key, value) in authorsViaQA.entries()) {
      authorsViaQA.delete(key);
    };

    for ((key, value) in responses.entries()) {
      responses.delete(key);
    };
  };

  system func preupgrade() {
    authorsViaQAEntries := Iter.toArray(authorsViaQA.entries());
    responseEntries := Iter.toArray(responses.entries());
  };

  system func postupgrade() {
    authorsViaQAEntries := [];
    responseEntries := [];
  };
};
