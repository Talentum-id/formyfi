import QATypes "../qa_index/types";
import PaginationTypes "../../types/Pagination";

module ResponseTypes {
  public type Answer = {
    answer : Text;
    isCorrect : Bool;
    file : Text;
  };

  public type QAAuthor = {
    identity : Text;
    filled : Nat;
  };

  public type QAResponseParams = {
    shareLink : Text;
    identity : Text;
  };

  public type QAResponseResult = {
    general : ?QAAuthor;
    answers : ?[Answer];
  };

  public type ResponseParams = {
    shareLink : Text;
    answer : Answer;
    filled : Nat;
  };
};
