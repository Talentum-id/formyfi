import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Float "mo:base/Float";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Debug "mo:base/Debug";
import Int "mo:base/Int";
import Bool "mo:base/Bool";
import Hash "mo:base/Hash";
import List "mo:base/List";
import Types "types";
import Utils "../user_index/utils";

actor NftIndex {
    type NFTCollection = Types.NFTCollection;
    type FetchParams = Types.QAGetParams;
    type List = Types.ListResult;
    type IdentityNftKey = Types.IdentityNftKey;

    private func hashIdentityNft(key: IdentityNftKey): Hash.Hash {
        let identityHash = Text.hash(key.identity);
        let hashHash = Text.hash(key.hash);
        let nftHash = Hash.hash(key.nft_id);

        return identityHash ^ hashHash ^ nftHash;
    };

    private func eqIdentityNft(a: IdentityNftKey, b: IdentityNftKey): Bool {
        Text.equal(a.identity, b.identity) and Text.equal(a.hash, b.hash) and a.nft_id == b.nft_id
    };

    private stable var nextId: Nat = 1;
    private stable var collectionsEntries : [(Nat, NFTCollection)] = [];
    private stable var identityNftEntries : [(IdentityNftKey, Bool)] = [];

    private let collections = HashMap.HashMap<Nat, NFTCollection>(0, Nat.equal, Hash.hash);
    private let identityNftRelations = HashMap.HashMap<IdentityNftKey, Bool>(0, eqIdentityNft, hashIdentityNft);

    public shared({ caller }) func createCollection(collection: NFTCollection, character : Utils.Character) : async () {
        let identity = await Utils.authenticate(caller, false, character);
        let id = nextId;
        nextId += 1;

        let newCollection : NFTCollection = {
            id = id;
            name = collection.name;
            symbol = collection.symbol;
            uri = collection.uri;
            description = collection.description;
            nftType = collection.nftType;
            file = collection.file;
            blockchain_id = collection.blockchain_id;
            max_supply = collection.max_supply;
            available = collection.max_supply;
            transferable = collection.transferable;
            unlimited_supply = collection.unlimited_supply;
            contract_address = collection.contract_address;
            token_id = collection.token_id;
            owner = identity;
            meta = collection.meta;
        };

        collections.put(id, newCollection);
    };

    public shared({ caller }) func updateCollection(id: Nat, updates: NFTCollection, character : Utils.Character) : async () {
        let identity = await Utils.authenticate(caller, false, character);

        switch (collections.get(id)) {
            case null {
                Debug.trap("NFT collection is not found");
            };
            case (?existingCollection) {
                if (identity != existingCollection.owner) {
                    Debug.trap("You are not the owner of this collection");
                };

                let updatedCollection : NFTCollection = {
                    id = id;
                    name = updates.name;
                    symbol = updates.symbol;
                    uri = updates.uri;
                    description = updates.description;
                    nftType = updates.nftType;
                    file = updates.file;
                    blockchain_id = updates.blockchain_id;
                    max_supply = updates.max_supply;
                    available = updates.available;
                    transferable = updates.transferable;
                    unlimited_supply = updates.unlimited_supply;
                    contract_address = updates.contract_address;
                    token_id = updates.token_id;
                    owner = existingCollection.owner;
                    meta = updates.meta;
                };
                
                collections.put(id, updatedCollection);
            };
        };
    };

    public shared({ caller }) func deleteCollection(id: Nat, character : Utils.Character) : async () {
        let identity = await Utils.authenticate(caller, false, character);
        
        switch (collections.get(id)) {
            case null {
                Debug.trap("NFT collection is not found");
            };
            case (?existingCollection) {
                if (identity != existingCollection.owner) {
                    Debug.trap("You are not the owner of this collection");
                };

                collections.delete(id);
            };
        };
    };

    public query func getCollection(id: Nat) : async NFTCollection {
        switch (collections.get(id)) {
            case null {
                Debug.trap("NFT collection is not found");
            };
            case (?collection) collection;
        };
    };

    public query func getList(params: FetchParams) : async List {
        if (params.identity == "") {
            Debug.trap("Identity is not specified");
        };

        var data = Array.filter(
            Iter.toArray(collections.vals()),
            func (c: NFTCollection) : Bool {
                return c.owner == params.identity;
            }
        );

        let { search; page; pageSize; sortBy } = params;

        if (collections.size() < 1) {
            return {
                pagination = {
                    total = 0;
                    count = 0;
                    per_page = 10;
                    current_page = 1;
                    total_pages = 1;
                };
                data = [];
            };
        };

        if (search != "") {
            let formattedSearch = Text.toLowercase(search);

            data := Array.filter<NFTCollection>(data, func collection = Text.contains(Text.toLowercase(collection.name), #text formattedSearch));
        };

        if (sortBy.key != "") {
            let order = if (sortBy.value == "asc") "asc" else "desc";

            data := Array.sort<NFTCollection>(
                data,
                func(x : NFTCollection, y : NFTCollection) {
                let (key1 : Text, key2 : Text) = switch (sortBy.key) {
                    case _ (x.name, y.name);
                };

                switch (order) {
                    case "asc" {
                        if (key1 > key2) #greater else if (key1 < key2) #less else #equal;
                    };
                    case _ {
                        if (key1 > key2) #less else if (key1 < key2) #greater else #equal;
                    };
                };
                },
            );
        };
        
        let pagination = {
            total = data.size();
            count = params.pageSize;
            per_page = params.pageSize;
            current_page = params.page;
            total_pages = Float.ceil(Float.fromInt(data.size()) / Float.fromInt(params.pageSize));
        };

        if (page != 0 and pageSize != 0) {
            var offset : Int = page - 1;
            offset := offset * pageSize;

            var limit : Int = if (data.size() < offset + pageSize) data.size() else offset + pageSize;
            var collectionIter = Array.slice<NFTCollection>(data, Int.abs(offset), Int.abs(limit));

            data := Iter.toArray(collectionIter);
        };

        data := Array.map<NFTCollection, NFTCollection>(
            data,
            func x = {
                id = x.id;
                name = x.name;
                symbol = x.symbol;
                uri = x.uri;
                description = x.description;
                nftType = x.nftType;
                file = x.file;
                blockchain_id = x.blockchain_id;
                max_supply = x.max_supply;
                available = x.available;
                transferable = x.transferable;
                unlimited_supply = x.unlimited_supply;
                contract_address = x.contract_address;
                token_id = x.token_id;
                owner = x.owner;
                meta = x.meta;
            },
        );

        { data; pagination };
    };

    public shared({ caller }) func storeIdentityNftRelation(data : IdentityNftKey, character: Utils.Character) : async () {
        let identity = await Utils.authenticate(caller, false, character);
        
        switch (collections.get(data.nft_id)) {
            case null {
                Debug.trap("NFT collection not found");
            };
            case (?collection) {
                if (collection.available < 1) {
                    Debug.trap("NFT collection is sold out");
                };

                if (not collection.unlimited_supply) {
                    let updatedCollection : NFTCollection = {
                        id = collection.id;
                        name = collection.name;
                        symbol = collection.symbol;
                        uri = collection.uri;
                        description = collection.description;
                        nftType = collection.nftType;
                        file = collection.file;
                        blockchain_id = collection.blockchain_id;
                        max_supply = collection.max_supply;
                        available = collection.available - 1;
                        transferable = collection.transferable;
                        unlimited_supply = collection.unlimited_supply;
                        contract_address = collection.contract_address;
                        token_id = collection.token_id;
                        owner = collection.owner;
                        meta = collection.meta;
                    };
                    
                    collections.put(collection.id, updatedCollection);
                };
            };
        };
        
        let key : IdentityNftKey = {
            identity = identity;
            hash = data.hash;
            nft_id = data.nft_id;
        };
        
        identityNftRelations.put(key, true);
    };
    
    public query func checkIdentityNftRelation(identity: Text, nftId: Nat) : async Bool {
        let allRelations = Iter.toArray(identityNftRelations.entries());
        for ((k, exists) in allRelations.vals()) {
            if (Text.equal(k.identity, identity) and k.nft_id == nftId and exists) {
                return true;
            };
        };

        return false;
    };

    system func preupgrade() {
        collectionsEntries := Iter.toArray(collections.entries());
        identityNftEntries := Iter.toArray(identityNftRelations.entries());
    };

    system func postupgrade() {
        for ((id, collection) in Iter.fromArray(collectionsEntries)) {
            collections.put(id, collection);
        };
        collectionsEntries := [];
        
        for ((key, exists) in Iter.fromArray(identityNftEntries)) {
            identityNftRelations.put(key, exists);
        };
        identityNftEntries := [];
    };
}