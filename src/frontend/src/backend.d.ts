import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type UserId = Principal;
export type Timestamp = bigint;
export interface SessionSummary {
    difficulty: Difficulty;
    totalScore: bigint;
    timestamp: Timestamp;
    category: Category;
    sessionId: SessionId;
}
export interface SubmitAnswerResult {
    answerRecord: AnswerRecord;
    nlpResult: NlpAnalysisResult;
}
export interface NlpAnalysisResult {
    overallScore: bigint;
    grammarScore: bigint;
    sentiment: string;
    feedback: string;
    betterAnswer: string;
    confidenceScore: bigint;
    keywordScore: bigint;
}
export interface InterviewSessionPublic {
    id: SessionId;
    startTime: Timestamp;
    endTime?: Timestamp;
    userId: UserId;
    difficulty: Difficulty;
    questionsAttempted: bigint;
    totalScore: bigint;
    category: Category;
    isComplete: boolean;
}
export interface AnswerRecord {
    sentimentScore: bigint;
    grammarScore: bigint;
    feedback: string;
    confidenceScore: bigint;
    totalScore: bigint;
    keywordScore: bigint;
    questionId: QuestionId;
    sessionId: SessionId;
    answerText: string;
}
export type QuestionId = bigint;
export type SessionId = bigint;
export interface Question {
    id: QuestionId;
    difficulty: Difficulty;
    text: string;
    maxAnswerLength: bigint;
    expectedKeywords: Array<string>;
    minAnswerLength: bigint;
    category: Category;
    sampleBetterAnswer: string;
}
export interface UserProfilePublic {
    id: UserId;
    name: string;
    scoreHistory: Array<SessionSummary>;
    totalSessions: bigint;
}
export enum Category {
    MachineLearning = "MachineLearning",
    AIConcepts = "AIConcepts",
    Database = "Database",
    PythonBasics = "PythonBasics",
    DataStructures = "DataStructures"
}
export enum Difficulty {
    Beginner = "Beginner",
    Advanced = "Advanced",
    Intermediate = "Intermediate"
}
export interface backendInterface {
    getQuestions(category: Category, difficulty: Difficulty): Promise<Array<Question>>;
    getSessionResults(sessionId: SessionId): Promise<Array<AnswerRecord> | null>;
    getUserProfile(): Promise<UserProfilePublic | null>;
    getUserSessions(): Promise<Array<InterviewSessionPublic>>;
    startSession(category: Category, difficulty: Difficulty): Promise<InterviewSessionPublic>;
    submitAnswer(sessionId: SessionId, questionId: QuestionId, answerText: string): Promise<SubmitAnswerResult>;
    updateUserProfile(name: string): Promise<UserProfilePublic>;
}
