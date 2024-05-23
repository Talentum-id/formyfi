import PaginationTypes "../../types/pagination";

module StatsTypes {
  public type Data = {
    forms_created : Nat;
    forms_completed : Nat;
    points : Nat;
  };

  public type FetchParams = {
    page : Int;
    pageSize : Int;
  };

  public type GeneralData = {
    forms_created : Nat;
    forms_completed : Nat;
    points : Nat;
    identity : Text;
  };

  public type ListResult = {
    data : [GeneralData];
    pagination : PaginationTypes.Pagination;
  };

  public type ProjectData = {
    identity : Text;
    points : Nat;
    forms_completed : Nat;
  };

  public type ListResultPerProject = {
    data : [ProjectData];
    pagination : PaginationTypes.Pagination;
  };
};
