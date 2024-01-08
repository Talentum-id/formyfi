import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Answer { 'isCorrect' : boolean, 'answer' : string }
export interface FetchParams {
  'sortBy' : { 'key' : string, 'value' : string },
  'page' : bigint,
  'pageSize' : bigint,
  'search' : string,
}
export interface QA {
  'end' : bigint,
  'title' : string,
  'participants' : bigint,
  'description' : string,
  'start' : bigint,
  'shareLink' : string,
  'questions' : Array<Question>,
  'image' : string,
}
export interface Question {
  'files' : Array<string>,
  'question' : string,
  'answers' : Array<Answer>,
  'description' : string,
  'questionType' : string,
  'required' : boolean,
}
export interface _SERVICE {
  'delete' : ActorMethod<[string], undefined>,
  'list' : ActorMethod<[FetchParams], Array<QA>>,
  'readAll' : ActorMethod<[], string>,
  'reset' : ActorMethod<[], undefined>,
  'show' : ActorMethod<[string], [] | [QA]>,
  'store' : ActorMethod<[QA], undefined>,
}
