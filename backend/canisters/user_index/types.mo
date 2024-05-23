module UserTypes {
  public type UserData = {
    provider : Text;
    fullName : Text;
    username : Text;
    avatar : ?Text;
    forms_created : Nat;
  };
};
