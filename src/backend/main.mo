import Types "types/interview-system";
import InterviewLib "lib/interview-system";
import InterviewApiMixin "mixins/interview-system-api";
import List "mo:core/List";
import Map "mo:core/Map";

actor {
  let profiles = Map.empty<Types.UserId, Types.UserProfile>();
  let sessions = Map.empty<Types.SessionId, Types.InterviewSession>();
  let answers = List.empty<Types.AnswerRecord>();
  let questions = List.fromArray<Types.Question>(InterviewLib.seedQuestions());
  let nextSessionId : Types.Counter = { var count = 0 };

  include InterviewApiMixin(profiles, sessions, answers, questions, nextSessionId);
};
