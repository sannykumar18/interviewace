import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  AnswerRecord,
  Category,
  Difficulty,
  InterviewSessionPublic,
  NlpAnalysisResult,
  Question,
  QuestionId,
  SessionId,
  SubmitAnswerResult,
  UserProfilePublic,
} from "../backend.d";

// Re-export types for convenience
export type {
  AnswerRecord,
  Category,
  Difficulty,
  InterviewSessionPublic,
  NlpAnalysisResult,
  Question,
  SessionId,
  QuestionId,
  SubmitAnswerResult,
  UserProfilePublic,
};

function useBackendActor() {
  return useActor(createActor);
}

// ── Query Keys ────────────────────────────────────────────────────────────────

export const queryKeys = {
  userProfile: ["userProfile"] as const,
  userSessions: ["userSessions"] as const,
  questions: (category: Category, difficulty: Difficulty) =>
    ["questions", category, difficulty] as const,
  sessionResults: (sessionId: SessionId) =>
    ["sessionResults", sessionId.toString()] as const,
};

// ── Queries ───────────────────────────────────────────────────────────────────

export function useGetUserProfile() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<UserProfilePublic | null>({
    queryKey: queryKeys.userProfile,
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getUserProfile();
      return result ?? null;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetUserSessions() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<InterviewSessionPublic[]>({
    queryKey: queryKeys.userSessions,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserSessions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetQuestions(
  category: Category,
  difficulty: Difficulty,
  enabled = true,
) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Question[]>({
    queryKey: queryKeys.questions(category, difficulty),
    queryFn: async () => {
      if (!actor) return [];
      return actor.getQuestions(category, difficulty);
    },
    enabled: !!actor && !isFetching && enabled,
  });
}

export function useGetSessionResults(sessionId: SessionId | null) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<AnswerRecord[] | null>({
    queryKey: queryKeys.sessionResults(sessionId ?? BigInt(0)),
    queryFn: async () => {
      if (!actor || sessionId === null) return null;
      const result = await actor.getSessionResults(sessionId);
      return result ?? null;
    },
    enabled: !!actor && !isFetching && sessionId !== null,
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useUpdateUserProfile() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation<UserProfilePublic, Error, string>({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateUserProfile(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userProfile });
    },
  });
}

export function useStartSession() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation<
    InterviewSessionPublic,
    Error,
    { category: Category; difficulty: Difficulty }
  >({
    mutationFn: async ({ category, difficulty }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.startSession(category, difficulty);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userSessions });
    },
  });
}

export function useSubmitAnswer() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation<
    SubmitAnswerResult,
    Error,
    { sessionId: SessionId; questionId: QuestionId; answerText: string }
  >({
    mutationFn: async ({ sessionId, questionId, answerText }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitAnswer(sessionId, questionId, answerText);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.sessionResults(variables.sessionId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.userSessions });
      queryClient.invalidateQueries({ queryKey: queryKeys.userProfile });
    },
  });
}
