import Principal "mo:base/Principal";

actor {
  public query ({caller}) func greet() : async Text {
    return "Hello, " # Principal.toText(caller) # "!";
  };
};
