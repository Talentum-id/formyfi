import Error "mo:base/Error";
import Principal "mo:base/Principal";
import Text "mo:base/Text";

module {
  public let DEFAULT_PRINCIPAL = "m7ob5-xdzun-z3vt2-6oujc-gfm2t-2lt5p-bw5kn-2tatc-fjkti-eko6j-jqe";
  public let DEFAULT_ERROR = "You are not authenticated";

  public func authenticate(caller : Principal, notAnonynmous : Bool, character : Text) : async Text {
    if (notAnonynmous and Principal.isAnonymous(caller)) {
      throw Error.reject(DEFAULT_ERROR);
    };

    if (Principal.toText(caller) == DEFAULT_PRINCIPAL) {
      let identity = Text.trim(character, #char ' ');

      if (identity.size() == 0) throw Error.reject(DEFAULT_ERROR) else return identity;
    };

    Principal.toText(caller);
  };

};
