import QATypes "../qa_index/types";
import PaginationTypes "../../types/pagination";

module ResponseTypes {
  public type Answer = {
    answer : Text;
    isCorrect : Bool;
    file : Text;
    isOpen : Bool;
  };

  public type ExportAnswer = {
    author : QAAuthor;
    answers : [Answer];
  };

  public type ExportResponse = {
    quest : QATypes.QA;
    answers : [ExportAnswer];
  };

  public type FetchParams = {
    sortBy : {
      key : Text;
      value : Text;
    };
    page : Int;
    pageSize : Int;
  };

  public type ListResult = {
    data : [QAAuthor];
    pagination : PaginationTypes.Pagination;
  };

  public type QAAuthor = {
    identity : Text;
    username : Text;
    filled : Nat;
  };

  public type QAResponseParams = {
    shareLink : Text;
    identity : Text;
  };

  public type ResponseParams = {
    shareLink : Text;
    answers : [Answer];
    filled : Nat;
  };
};
