module Types {
    public type Question = {
        question: Text;
        questionType: Text;
        description: Text;
        images: [Text];
        required: Bool;
        incorrect_answers: [Text];
        correct_answers: [Text];
    };

    public type QA = {
        image: Text;
        title: Text;
        description: Text;
        shareLink: Text;
        participants: Nat;
        start: Nat;
        end: Nat;
        questions: [Question];
    };

    public type QAGetParams = {
        search: Text;
        sortBy: {
            key: Text;
            value: Text;
        };
        page: Nat;
        pageSize: Nat;
    };
};