import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Map "mo:base/HashMap";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Error "mo:base/Error";
import Iter "mo:base/Iter";
import Time "mo:base/Time";
import Types "/types";
import QAIndex "canister:qa_index";
import UserIndex "canister:user_index";

actor ResponseIndex {
  type Answer = Types.Answer;
  type Author = Types.QAAuthor;
  type ResponseParams = Types.QAResponseParams;
  type Data = Types.ResponseParams;

  stable var authorsViaQAEntries : [(Text, [Author])] = [];
  stable var responseEntries : [(Text, [Answer])] = [];

  let authorsViaQA = Map.fromIter<Text, [Author]>(authorsViaQAEntries.vals(), 1000, Text.equal, Text.hash);
  let responses = Map.fromIter<Text, [Answer]>(responseEntries.vals(), 1000, Text.equal, Text.hash);

  public query func list(shareLink : Text) : async [Author] {
    switch (authorsViaQA.get(shareLink)) {
      case null [];
      case (?authors) authors;
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

  public shared ({ caller }) func store(data : Data) : async () {
    let identity = Principal.toText(caller);
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
