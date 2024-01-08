export const idlFactory = ({ IDL }) => {
  const FetchParams = IDL.Record({
    'sortBy' : IDL.Record({ 'key' : IDL.Text, 'value' : IDL.Text }),
    'page' : IDL.Nat,
    'pageSize' : IDL.Nat,
    'search' : IDL.Text,
  });
  const Answer = IDL.Record({ 'isCorrect' : IDL.Bool, 'answer' : IDL.Text });
  const Question = IDL.Record({
    'files' : IDL.Vec(IDL.Text),
    'question' : IDL.Text,
    'answers' : IDL.Vec(Answer),
    'description' : IDL.Text,
    'questionType' : IDL.Text,
    'required' : IDL.Bool,
  });
  const QA = IDL.Record({
    'end' : IDL.Nat,
    'title' : IDL.Text,
    'participants' : IDL.Nat,
    'description' : IDL.Text,
    'start' : IDL.Nat,
    'shareLink' : IDL.Text,
    'questions' : IDL.Vec(Question),
    'image' : IDL.Text,
  });
  return IDL.Service({
    'delete' : IDL.Func([IDL.Text], [], []),
    'list' : IDL.Func([FetchParams], [IDL.Vec(QA)], []),
    'readAll' : IDL.Func([], [IDL.Text], ['query']),
    'reset' : IDL.Func([], [], []),
    'show' : IDL.Func([IDL.Text], [IDL.Opt(QA)], ['query']),
    'store' : IDL.Func([QA], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
