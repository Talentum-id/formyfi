import PaginationTypes "../../types/pagination";
import Text "mo:base/Text";

module QATypes {
  public type Answer = {
    answer : Text;
    isCorrect : Bool;
  };

  public type ListResult = {
    data : [QA];
    pagination : PaginationTypes.Pagination;
  };

  public type DiscordVerification = {
    link : Text;
    server : Text;
  };

  public type Question = {
    question : Text;
    questionType : Text;
    description : Text;
    file : Text;
    required : Bool;
    answers : [Answer];
    fileAllowed : Bool;
    openAnswerAllowed : Bool;
    parameters : ?Text;
    twitter : ?TwitterVerification;
    discord : ?DiscordVerification;
    points: ?Nat;
  };

  public type QA = {
    image : Text;
    title : Text;
    description : Text;
    shareLink : Text;
    participants : Nat;
    start : Nat;
    end : Nat;
    questions : [Question];
    thxMessage : ?ThanksMessage;
    branches : ?Text;
    refCodePoints : ?Nat;
  };

  public type ThanksMessage = {
    title : Text;
    file : Text;
    description : Text;
  };

  public type TwitterVerification = {
    follow : Text;
    reply : Text;
    retweet : Text;
  };

  public type QAGetParams = {
    identity : Text;
    search : Text;
    sortBy : {
      key : Text;
      value : Text;
    };
    page : Int;
    pageSize : Int;
  };

  public type ShowQAResult = {
    owner : Text;
    quest : QA;
  };

  public type QACustomization = {
    color: ?Text;
    url: ?Text;
  };
};
