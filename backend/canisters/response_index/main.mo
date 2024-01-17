import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Map "mo:base/HashMap";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Error "mo:base/Error";
import Time "mo:base/Time";
import Types "/types";
import QAIndex "canister:qa_index";

actor ResponseIndex {
  type Answer = Types.Answer;
  type Response = Types.Response;

  stable var responseEntries : [(Text, [Response])] = [];
  stable var responseAuthorEntries : [(Text, [Text])] = [];

  let responses = Map.fromIter<Text, [Response]>(responseEntries.vals(), 1000, Text.equal, Text.hash);
  let responseAuthors = Map.fromIter<Text, [Text]>(responseAuthorEntries.vals(), 1000, Text.equal, Text.hash);

  public shared({caller}) func store(shareLink: Text, answer: Answer, filled : ?Nat) : async() {
    let identity = Principal.toText(caller);
    let qa = await QAIndex.show(shareLink);

    let questionsSize = switch (qa) {
      case null throw Error.reject("Q&A does not exist");
      case (?qa) qa.questions.size();
    };

    switch (responseAuthors.get(shareLink)) {
      case null {
        responseAuthors.put(shareLink, [identity]);
      };
      case (?authors) {
        if (Array.find<Text>(authors, func author = author == identity) == null) {
          let QAauthors = Buffer.fromArray<Text>(authors);
          QAauthors.add(identity);

          responseAuthors.put(shareLink, Buffer.toArray(QAauthors));
        }
      };
    };

    switch (responses.get(identity)) {
      case null {
        responses.put(identity, [{
          questionLink = shareLink;
          answers = [answer];
          filled = null;
        }]);
      };
      case (?qaResponses) {
        switch (Array.find<Response>(qaResponses, func response = response.questionLink == shareLink)) {
          case null {
            let qas = Buffer.fromArray<Response>(qaResponses);
            qas.add({
              questionLink = shareLink;
              answers = [answer];
              filled = null;
            });

            responses.put(identity, Buffer.toArray(qas));
          };
          case (?response) {
            let answers = Buffer.fromArray<Answer>(response.answers);
            answers.add(answer);

            let qas = Array.map<Response, Response>(qaResponses, func qaResponse = {
              questionLink = qaResponse.questionLink;
              answers = Buffer.toArray(answers);
              filled = if (questionsSize == answers.size()) filled else null; 
            });

            responses.put(identity, qas);
          };
        };
      };
    };
  };
};
