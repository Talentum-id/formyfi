module Types {
    public type Answer = {
        answer: Text;
        isCorrect: Bool;
    };

    public type Question = {
        question: Text;
        questionType: Text;
        description: Text;
        files: [Text];
        required: Bool;
        answers: [Answer];
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