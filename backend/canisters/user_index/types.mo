module UserTypes {
  public type UserData = {
    provider : Text;
    fullName : Text;
    username : Text;
    avatar : ?Text;
    banner : ?Text;
    forms_created : Nat;
  };
};
