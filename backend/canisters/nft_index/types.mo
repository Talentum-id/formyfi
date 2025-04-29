import PaginationTypes "../../types/pagination";

module NftType {
    public type TokenId = {
        #Text: Text;
        #Nat: Nat;
        #Null;
    };

    public type Meta = {
        pubKeyObjectID: Text;
        tokenDataObjectID: Text;
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
        available: Nat;
        transferable: Bool;
        unlimited_supply: Bool;
        contract_address: Text;
        token_id: TokenId;
        owner: Text;
        meta: ?Meta;
    };

    public type IdentityNftKey = {
        identity: Text;
        hash: Text;
        nft_id: Nat;
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