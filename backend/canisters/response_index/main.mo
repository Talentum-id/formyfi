import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Buffer "mo:base/Buffer";
import Error "mo:base/Error";
import Float "mo:base/Float";
import Hex "./utils/hex";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Map "mo:base/HashMap";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Types "/types";
import QAIndex "canister:qa_index";
import StatsIndex "canister:stats_index";
import Utils "../user_index/utils";
import UserIndex "canister:user_index";

actor ResponseIndex {
  type Answer = Types.Answer;
  type Author = Types.QAAuthor;
  type Data = Types.ResponseParams;
  type ExportAnswer = Types.ExportAnswer;
  type ExportResponse = Types.ExportResponse;
  type FetchParams = Types.FetchParams;
  type List = Types.ListResult;
  type QAList = Types.QAListResult;
  type QA = Types.QA;
  type ResponseParams = Types.QAResponseParams;

  stable var authorsViaQAEntries : [(Text, [Author])] = [];
  stable var qasViaAuthorEntries : [(Text, [QA])] = [];
  stable var responseEntries : [(Text, [Answer])] = [];

  let qasViaAuthor = Map.fromIter<Text, [QA]>(qasViaAuthorEntries.vals(), 1000, Text.equal, Text.hash);
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

  public query func listQas(identity : Text, params : FetchParams) : async QAList {
    switch (qasViaAuthor.get(identity)) {
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
      case (?qas) filterQAs(qas, params);
    };
  };

  public query func show(params : ResponseParams) : async [Answer] {
    let { identity; shareLink } = params;
    let responseIdentifier = identity # "-" # shareLink;

    switch (responses.get(responseIdentifier)) {
      case null [];
      case (?answers) answers;
    };
  };

  public shared ({ caller }) func store(data : Data, character : Utils.Character) : async () {
    let identity = await Utils.authenticate(caller, false, character);
    let user = await UserIndex.findUser(identity);

    if (user == null) {
      throw Error.reject("Unregistered users cannot complete forms");
    };

    let { shareLink; answers } = data;
    let responseIdentifier = identity # "-" # shareLink;

    switch (await QAIndex.show(shareLink)) {
      case null throw Error.reject("Q&A not found");
      case (?qa) {
        let questions = qa.quest.questions;

        switch (responses.get(responseIdentifier)) {
          case null {
            var index = 0;
            var answersCount = 0;

            if (answers.size() != questions.size()) {
              throw Error.reject("The answers don't match the questions");
            };

            for (answer in answers.vals()) {
              let sanitizedAnswer = Text.trim(answer.answer, #char ' ');

              if (sanitizedAnswer == "" and questions[index].required == true) {
                throw Error.reject("Required questions should be answered");
              };

              if (sanitizedAnswer != "") {
                answersCount += 1;
              };


              index += 1;
            };

            responses.put(responseIdentifier, answers);

            StatsIndex.incrementFormCompleted(qa.owner, identity, answersCount);

            ignore saveAuthorQA(identity, data, qa.quest.title);
          };
          case (?answers) {
            throw Error.reject("The user already completed this Q&A");
          };
        };
      };
    };
  };

  public shared func deleteByShareLink(shareLink : Text) : async [Text] {
    var answerImages = Buffer.fromArray<Text>([]);

    authorsViaQA.delete(shareLink);

    for ((key, value) in responses.entries()) {
      var identificator = "-" #shareLink;

      if (Text.endsWith(key, #text identificator)) {
        for (indexedAnswer in value.vals()) {
          if (indexedAnswer.file.size() > 0) {
            answerImages.add(indexedAnswer.file);
          };
        };

        responses.delete(key);
      };
    };

    for ((key, value) in qasViaAuthor.entries()) {
      let filteredValue = Array.filter<QA>(value, func item = item.shareLink != shareLink);

      qasViaAuthor.put(key, filteredValue);
    };

    Buffer.toArray(answerImages);
  };

  public shared ({ caller }) func export(shareLink : Text, character : Utils.Character) : async ExportResponse {
    let identity = await Utils.authenticate(caller, true, character);

    switch (await QAIndex.show(shareLink)) {
      case null throw Error.reject("Q&A does not exist");
      case (?qa) {
        let { quest; owner } = qa;

        if (identity != owner) {
          throw Error.reject("Only Q&A owner can export it");
        };

        let params = {
          search = "";
          sortBy = {
            key = "";
            value = "";
          };
          page = 0;
          pageSize = 0;
        };

        let { data } = await list(shareLink, params);

        if (data.size() == 0) {
          return {
            quest;
            answers = [];
          };
        };

        let answers = Buffer.fromArray<ExportAnswer>([]);

        for (author in data.vals()) {
          answers.add({
            author;
            answers = await show({
              shareLink;
              identity = author.identity;
            });
          });
        };

        return {
          quest;
          answers = Buffer.toArray(answers);
        };
      };
    };
  };

  private func saveAuthorQA(identity : Text, data : Data, title : Text) : async () {
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

    switch (qasViaAuthor.get(identity)) {
      case null {
        qasViaAuthor.put(identity, [{ filled; shareLink; title }]);
      };
      case (?qas) {
        if (Array.find<QA>(qas, func qa = qa.shareLink == shareLink) == null) {
          let authorQAs = Buffer.fromArray<QA>(qas);

          authorQAs.add({
            filled;
            shareLink;
            title;
          });

          qasViaAuthor.put(identity, Buffer.toArray(authorQAs));
        };
      };
    };

    ignore QAIndex.incrementParticipants(shareLink);
  };

  func filter(authors : [Author], params : FetchParams) : List {
    var data = authors;
    let { page; pageSize; sortBy; search } = params;

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

      data := Array.filter<Author>(data, func author = Text.contains(Text.toLowercase(author.username), #text formattedSearch));
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

  func filterQAs(qas : [QA], params : FetchParams) : QAList {
    var data = qas;
    let { page; pageSize; sortBy; search } = params;

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
            case "filled" (Nat.toText(x.filled), Nat.toText(y.filled));
            case "shareLink" (x.shareLink, y.shareLink);
            case "title" (x.title, y.title);
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
      var AuthorIter = Array.slice<QA>(data, Int.abs(offset), Int.abs(limit));

      data := Iter.toArray(AuthorIter);
    };

    data := Array.map<QA, QA>(
      data,
      func x = {
        filled = x.filled;
        shareLink = x.shareLink;
        title = x.title;
      },
    );

    { data; pagination };
  };

  type VETKD_SYSTEM_API = actor {
    vetkd_public_key : ({
      canister_id : ?Principal;
      derivation_path : [Blob];
      key_id : { curve : { #bls12_381 }; name : Text };
    }) -> async ({ public_key : Blob });
    vetkd_encrypted_key : ({
      public_key_derivation_path : [Blob];
      derivation_id : Blob;
      key_id : { curve : { #bls12_381 }; name : Text };
      encryption_public_key : Blob;
    }) -> async ({ encrypted_key : Blob });
  };

  let vetkd_system_api : VETKD_SYSTEM_API = actor ("h6gim-oiaaa-aaaao-a3siq-cai");

  public shared func symmetricKeyVerification() : async Text {
    let { public_key } = await vetkd_system_api.vetkd_public_key({
      canister_id = null;
      derivation_path = Array.make(Text.encodeUtf8("response_symmetric_key"));
      key_id = { curve = #bls12_381; name = "test_key_1" };
    });

    Hex.encode(Blob.toArray(public_key));
  };

  public shared ({ caller }) func encryptedSymmetricKey(
    identifier : Text,
    encryption_public_key : Blob,
    character : Utils.Character,
  ) : async Text {
    let identity = await Utils.authenticate(caller, true, character);

    let buf = Buffer.Buffer<Nat8>(32);
    buf.append(Buffer.fromArray(Blob.toArray(Text.encodeUtf8(identifier))));
    buf.append(Buffer.fromArray(Blob.toArray(Text.encodeUtf8(identity))));
    let derivation_id = Blob.fromArray(Buffer.toArray(buf));

    let { encrypted_key } = await vetkd_system_api.vetkd_encrypted_key({
      derivation_id;
      public_key_derivation_path = Array.make(Text.encodeUtf8("response_symmetric_key"));
      key_id = { curve = #bls12_381; name = "test_key_1" };
      encryption_public_key;
    });

    Hex.encode(Blob.toArray(encrypted_key));
  };

  public query func readAll() : async Text {
    var pairs = "";

    for ((key, value) in authorsViaQA.entries()) {
      pairs := "(" # key # ", " # debug_show (value) # ") " # pairs;
    };

    for ((key, value) in qasViaAuthor.entries()) {
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

    for ((key, value) in qasViaAuthor.entries()) {
      qasViaAuthor.delete(key);
    };

    for ((key, value) in responses.entries()) {
      responses.delete(key);
    };
  };

  system func preupgrade() {
    authorsViaQAEntries := Iter.toArray(authorsViaQA.entries());
    qasViaAuthorEntries := Iter.toArray(qasViaAuthor.entries());
    responseEntries := Iter.toArray(responses.entries());
  };

  system func postupgrade() {
    authorsViaQAEntries := [];
    qasViaAuthorEntries := [];
    responseEntries := [];
  };
};
