import PaginationTypes "../../types/pagination";

module NftType {
    public type TokenId = {
        #Text: Text;
        #Nat: Nat;
        #Null;
    };

    public type ListResult = {
        data : [NFTCollection];
        pagination : PaginationTypes.Pagination;
    };

    public type NFTCollection = {
        id: Nat;
        name: Text;
        symbol: Text;
        uri: Text;
        description: Text;
        nftType: Text;
        file: ?Text;
        blockchain_id: Nat;
        max_supply: Nat;
        transferable: Bool;
        unlimited_supply: Bool;
        contract_address: Text;
        token_id: TokenId;
        owner: Text;
    };

    public type QAGetParams = {
        identity : Text;
        search : Text;
        sortBy : {
            key : Text;
            value : Text;
        };
        page : Int;
        pageSize : Int;
    };
}