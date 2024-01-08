export const idlFactory = ({ IDL }) => {
  const UserData = IDL.Record({ 'username' : IDL.Text, 'fullName' : IDL.Text });
  return IDL.Service({
    'findUser' : IDL.Func([], [IDL.Opt(UserData)], ['query']),
    'findUsername' : IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    'readAll' : IDL.Func([], [IDL.Text], ['query']),
    'register' : IDL.Func([IDL.Text, IDL.Text], [IDL.Opt(UserData)], []),
    'reset' : IDL.Func([], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
