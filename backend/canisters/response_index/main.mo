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

actor ResponseIndex {
  type Answer = Types.Answer;
  type Author = Types.QAAuthor;
  type ResponseParams = Types.QAResponseParams;
  type Data = Types.ResponseParams;
  type ResponseResult = Types.QAResponseResult;

  stable var authorsViaQAEntries : [(Text, [Author])] = [];
  stable var responseEntries : [(Text, [Answer])] = [];

  let authorsViaQA = Map.fromIter<Text, [Author]>(authorsViaQAEntries.vals(), 1000, Text.equal, Text.hash);
  let responses = Map.fromIter<Text, [Answer]>(responseEntries.vals(), 1000, Text.equal, Text.hash);

  public query func list(shareLink: Text) : async [Author] {
    switch (authorsViaQA.get(shareLink)) {
      case null [];
      case (?authors) authors;
    };
  };

  public query func show(params: ResponseParams) : async ResponseResult {
    let {identity; shareLink} = params;
    let responseIdentifier = identity # "-" # shareLink;

    let response = switch (authorsViaQA.get(shareLink)) {
        case null null;
        case (?qaAuthors) Array.find<Author>(qaAuthors, func author = author.identity == identity);
    };

    {
      general = response;
      answers = responses.get(responseIdentifier);
    }
  };

  public shared({caller}) func store(data: Data) : async() {
    let identity = Principal.toText(caller);
    let {shareLink; answer; filled} = data;
    let responseIdentifier = identity # "-" # shareLink;

    let questionsSize = switch (await QAIndex.show(shareLink)) {
      case null throw Error.reject("Q&A not found");
      case (?qa) qa.questions.size();
    };  

    switch (responses.get(responseIdentifier)) {
      case null responses.put(responseIdentifier, [answer]);
      case (?qaAuthors) {
        switch (responses.get(responseIdentifier)) {
          case null {
            responses.put(responseIdentifier, [answer]);

            if (questionsSize == 1) {
              ignore saveAuthorQA(identity, data);
            }
          };
          case (?answers) {
            let qaAnswers = Buffer.fromArray<Answer>(answers);
            qaAnswers.add(answer);

            responses.put(responseIdentifier, Buffer.toArray(qaAnswers));

            if (questionsSize == qaAnswers.size()) {
              ignore saveAuthorQA(identity, data);
            }
          };
        };
      };
    };
  };

  private func saveAuthorQA(identity: Text, data: Data): async() {
    let {shareLink; filled} = data; 

    switch (authorsViaQA.get(shareLink)) {
      case null {
        authorsViaQA.put(shareLink, [{
          identity;
          filled;
        }]);
      };
      case (?authors) {
        if (Array.find<Author>(authors, func author = author.identity == identity) == null) {
          let qaAuthors = Buffer.fromArray<Author>(authors);
          qaAuthors.add({
            identity;
            filled;
          });

          authorsViaQA.put(shareLink, Buffer.toArray(qaAuthors));
        }
      };
    };

    ignore QAIndex.incrementParticipants(shareLink);
  };

  public query func readAll(): async Text {
    var pairs = "";

    for ((key, value) in authorsViaQA.entries()) {
        pairs := "(" # key # ", " # debug_show(value) # ") " # pairs
    };

    for ((key, value) in responses.entries()) {
        pairs := "(" # key # ", " # debug_show(value) # ") " # pairs
    };

    return pairs;
  };

  public func reset(): async () {
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
