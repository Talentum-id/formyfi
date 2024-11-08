module UserTypes {
  public type ExtraIdentity = {
    primaryIdentity : Text;
    provider : Text;
    title : Text;
    connector : Text;
  };
  public type UserData = {
    provider : Text;
    fullName : Text;
    username : Text;
    avatar : ?Text;
    banner : ?Text;
    forms_created : Nat;
    extraIdentities : ?[Text];
    title : ?Text;
  };
};
