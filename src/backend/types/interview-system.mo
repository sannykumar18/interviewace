import Common "common";

module {
  public type UserId = Common.UserId;
  public type Timestamp = Common.Timestamp;
  public type SessionId = Common.SessionId;
  public type QuestionId = Common.QuestionId;

  public type Category = {
    #PythonBasics;
    #MachineLearning;
    #DataStructures;
    #AIConcepts;
    #Database;
  };

  public type Difficulty = {
    #Beginner;
    #Intermediate;
    #Advanced;
  };

  public type Question = {
    id : QuestionId;
    text : Text;
    category : Category;
    difficulty : Difficulty;
    expectedKeywords : [Text];
    minAnswerLength : Nat;
    maxAnswerLength : Nat;
    sampleBetterAnswer : Text;
  };

  public type UserProfile = {
    id : UserId;
    var name : Text;
    var totalSessions : Nat;
    var scoreHistory : [SessionSummary];
  };

  public type SessionSummary = {
    sessionId : SessionId;
    category : Category;
    difficulty : Difficulty;
    totalScore : Nat;
    timestamp : Timestamp;
  };

  public type InterviewSession = {
    id : SessionId;
    userId : UserId;
    category : Category;
    difficulty : Difficulty;
    startTime : Timestamp;
    var endTime : ?Timestamp;
    var questionsAttempted : Nat;
    var totalScore : Nat;
    var isComplete : Bool;
  };

  public type AnswerRecord = {
    sessionId : SessionId;
    questionId : QuestionId;
    answerText : Text;
    keywordScore : Nat;
    grammarScore : Nat;
    confidenceScore : Nat;
    sentimentScore : Nat;
    totalScore : Nat;
    feedback : Text;
  };

  public type NlpAnalysisResult = {
    keywordScore : Nat;
    grammarScore : Nat;
    confidenceScore : Nat;
    sentiment : Text;
    overallScore : Nat;
    feedback : Text;
    betterAnswer : Text;
  };

  // Shared (non-mutable) types for API boundary
  public type UserProfilePublic = {
    id : UserId;
    name : Text;
    totalSessions : Nat;
    scoreHistory : [SessionSummary];
  };

  public type InterviewSessionPublic = {
    id : SessionId;
    userId : UserId;
    category : Category;
    difficulty : Difficulty;
    startTime : Timestamp;
    endTime : ?Timestamp;
    questionsAttempted : Nat;
    totalScore : Nat;
    isComplete : Bool;
  };

  public type SubmitAnswerResult = {
    answerRecord : AnswerRecord;
    nlpResult : NlpAnalysisResult;
  };

  public type Counter = { var count : Nat };
};
