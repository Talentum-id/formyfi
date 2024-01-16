import QATypes "../qa_index/types";
import PaginationTypes "../types/Pagination";

module ResponseTypes {
    public type Answer = {
        answer: Text;
        isCorrect: Bool;
    };

    public type Response = {
        questionLink: Text;
        answers: [Answer];        
        filled: ?Nat;
    };

    public type ListResult = {
        data: [{
            qa: {
                question: Text;
                shareLink: Text;
            };
            answer: Answer;
        }];
        pagination: PaginationTypes.Pagination;
    };
};