import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface UserData { 'username' : string, 'fullName' : string }
export interface _SERVICE {
  'findUser' : ActorMethod<[], [] | [UserData]>,
  'findUsername' : ActorMethod<[string], boolean>,
  'readAll' : ActorMethod<[], string>,
  'register' : ActorMethod<[string, string], [] | [UserData]>,
  'reset' : ActorMethod<[], undefined>,
}
