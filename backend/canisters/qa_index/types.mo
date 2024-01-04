module Types {
    public type Question = {
        question: Text;
        required: Bool;
        incorrect_answers: [Text];
        correct_answers: [Text];
    };

    public type QA = {
        image: Text;
        title: Text;
        description: Text;
        shareLink: Text;
        participants: Int;
        start: Int;
        end: Int;
        questions: [Question];
    };

};