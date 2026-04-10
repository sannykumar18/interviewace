import Types "../types/interview-system";
import InterviewLib "../lib/interview-system";
import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

mixin (
  profiles : Map.Map<Types.UserId, Types.UserProfile>,
  sessions : Map.Map<Types.SessionId, Types.InterviewSession>,
  answers : List.List<Types.AnswerRecord>,
  questions : List.List<Types.Question>,
  nextSessionId : Types.Counter,
) {
  // --- Profile ---

  public shared ({ caller }) func getUserProfile() : async ?Types.UserProfilePublic {
    switch (profiles.get(caller)) {
      case (?profile) { ?InterviewLib.toPublicProfile(profile) };
      case null { null };
    };
  };

  public shared ({ caller }) func updateUserProfile(name : Text) : async Types.UserProfilePublic {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous callers are not allowed");
    };
    switch (profiles.get(caller)) {
      case (?profile) {
        profile.name := name;
        InterviewLib.toPublicProfile(profile);
      };
      case null {
        let profile = InterviewLib.newProfile(caller, name);
        profiles.add(caller, profile);
        InterviewLib.toPublicProfile(profile);
      };
    };
  };

  // --- Questions ---

  public query func getQuestions(category : Types.Category, difficulty : Types.Difficulty) : async [Types.Question] {
    InterviewLib.filterQuestions(questions, category, difficulty);
  };

  // --- Sessions ---

  public shared ({ caller }) func startSession(
    category : Types.Category,
    difficulty : Types.Difficulty,
  ) : async Types.InterviewSessionPublic {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous callers are not allowed");
    };
    switch (profiles.get(caller)) {
      case null {
        let profile = InterviewLib.newProfile(caller, "");
        profiles.add(caller, profile);
      };
      case _ {};
    };
    let sessionId = nextSessionId.count;
    nextSessionId.count += 1;
    let now = Time.now();
    let session = InterviewLib.newSession(sessionId, caller, category, difficulty, now);
    sessions.add(sessionId, session);
    InterviewLib.toPublicSession(session);
  };

  public shared ({ caller }) func submitAnswer(
    sessionId : Types.SessionId,
    questionId : Types.QuestionId,
    answerText : Text,
  ) : async Types.SubmitAnswerResult {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous callers are not allowed");
    };
    let session = switch (sessions.get(sessionId)) {
      case (?s) { s };
      case null { Runtime.trap("Session not found") };
    };
    if (not Principal.equal(session.userId, caller)) {
      Runtime.trap("Unauthorized: session belongs to a different user");
    };
    if (session.isComplete) {
      Runtime.trap("Session is already complete");
    };
    let question = switch (questions.find(func(q : Types.Question) : Bool { q.id == questionId })) {
      case (?q) { q };
      case null { Runtime.trap("Question not found") };
    };
    let nlpResult = InterviewLib.analyzeAnswer(question, answerText);
    let answerRecord : Types.AnswerRecord = {
      sessionId;
      questionId;
      answerText;
      keywordScore = nlpResult.keywordScore;
      grammarScore = nlpResult.grammarScore;
      confidenceScore = nlpResult.confidenceScore;
      sentimentScore = InterviewLib.sentimentToScore(nlpResult.sentiment);
      totalScore = nlpResult.overallScore;
      feedback = nlpResult.feedback;
    };
    answers.add(answerRecord);
    session.questionsAttempted += 1;
    let prevTotal = session.totalScore * (session.questionsAttempted - 1);
    session.totalScore := (prevTotal + nlpResult.overallScore) / session.questionsAttempted;
    session.isComplete := true;
    session.endTime := ?Time.now();
    switch (profiles.get(caller)) {
      case (?profile) {
        let summary : Types.SessionSummary = {
          sessionId;
          category = session.category;
          difficulty = session.difficulty;
          totalScore = session.totalScore;
          timestamp = Time.now();
        };
        InterviewLib.addSessionSummary(profile, summary);
      };
      case null {};
    };
    { answerRecord; nlpResult };
  };

  public shared ({ caller }) func getSessionResults(sessionId : Types.SessionId) : async ?[Types.AnswerRecord] {
    switch (sessions.get(sessionId)) {
      case (?session) {
        if (not Principal.equal(session.userId, caller)) {
          Runtime.trap("Unauthorized: session belongs to a different user");
        };
        let sessionAnswers = answers.filter(func(a : Types.AnswerRecord) : Bool {
          a.sessionId == sessionId
        });
        ?sessionAnswers.toArray();
      };
      case null { null };
    };
  };

  public shared ({ caller }) func getUserSessions() : async [Types.InterviewSessionPublic] {
    let userSessions = List.empty<Types.InterviewSessionPublic>();
    for ((_, session) in sessions.entries()) {
      if (Principal.equal(session.userId, caller)) {
        userSessions.add(InterviewLib.toPublicSession(session));
      };
    };
    userSessions.toArray();
  };
};
