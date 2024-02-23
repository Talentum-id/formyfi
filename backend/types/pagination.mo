module PaginationTypes {
  public type Pagination = {
    total : Nat;
    count : Int;
    per_page : Int;
    current_page : Int;
    total_pages : Float;
  };
};
