import Error "mo:base/Error";
import Principal "mo:base/Principal";
import Text "mo:base/Text";

module {
  public type Character = {
    character : Text;
    identity : Text;
  };

  public let DEFAULT_PRINCIPAL = "aiejz-jhkgg-utkv3-mfj3n-276jr-zm3si-esy6s-cqxr5-ebyca-w6enn-aae";
  public let DEFAULT_ERROR = "You are not authenticated";

  public func authenticate(caller : Principal, anonymous : Bool, identificator : Character) : async Text {
    let { character } = identificator;

    if (not (Principal.isAnonymous(caller))) {
      return Principal.toText(caller);
    };

    if (not (anonymous) and character != DEFAULT_PRINCIPAL) {
      throw Error.reject(DEFAULT_ERROR);
    };

    let extraIdentity = Text.trim(character, #char ' ');

    if (extraIdentity.size() == 0) {
      if (anonymous) return Principal.toText(caller) else throw Error.reject(DEFAULT_ERROR);
    } else {
      extraIdentity;
    };
  };
};
