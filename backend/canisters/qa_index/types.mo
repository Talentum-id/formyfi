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
        page: Int;
        pageSize: Int;
    };

    public type Pagination = {
        total: Nat;
        count: Int;
        per_page: Int;
        current_page: Int;
        total_pages: Float;
    };

    public type ListResult = {
        data: [QA];
        pagination: Pagination;
    };
};