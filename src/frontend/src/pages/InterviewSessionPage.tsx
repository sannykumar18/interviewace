import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useGetQuestions, useSubmitAnswer } from "../hooks/use-backend";
import {
  CATEGORY_BADGE_CLASS,
  CATEGORY_LABELS,
  Category,
  Difficulty,
} from "../types";

const TIMER_SECONDS = 30;

interface NlpFeedbackPanelProps {
  keywordScore: number;
  grammarScore: number;
  confidenceScore: number;
  sentiment: string;
  betterAnswer: string;
  keywords: string[];
}

function NlpFeedbackPanel({
  keywordScore,
  grammarScore,
  confidenceScore,
  sentiment,
  betterAnswer,
  keywords,
}: NlpFeedbackPanelProps) {
  return (
    <Card className="shadow-card h-full">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-sm font-semibold">
          Real-time NLP Feedback
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">
            Keywords
          </p>
          <div className="flex flex-wrap gap-1.5">
            {keywords.slice(0, 5).map((kw) => (
              <Badge key={kw} className="badge-ml border-0 text-xs">
                {kw}
              </Badge>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg border border-border p-2.5 text-center">
            <p className="text-[10px] text-muted-foreground font-medium">
              Grammar
            </p>
            <p className="font-display text-lg font-bold text-foreground">
              {grammarScore}%
            </p>
          </div>
          <div className="rounded-lg border border-border p-2.5 text-center">
            <p className="text-[10px] text-muted-foreground font-medium">
              Confidence
            </p>
            <p className="font-display text-lg font-bold text-foreground">
              {confidenceScore}%
            </p>
          </div>
          <div className="rounded-lg border border-border p-2.5 text-center">
            <p className="text-[10px] text-muted-foreground font-medium">
              Sentiment
            </p>
            <p
              className={cn(
                "font-display text-sm font-bold",
                sentiment === "Positive"
                  ? "score-excellent"
                  : "text-muted-foreground",
              )}
            >
              {sentiment}
            </p>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">
            Keyword Score
          </p>
          <Progress value={keywordScore} className="h-2" />
          <p className="text-right text-xs text-muted-foreground mt-0.5">
            {keywordScore}%
          </p>
        </div>
        {betterAnswer && (
          <div className="rounded-lg border border-border bg-secondary/40 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Suggested Better Answer
            </p>
            <p className="text-xs text-foreground leading-relaxed">
              {betterAnswer}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function InterviewSessionPage() {
  const { sessionId } = useParams({ from: "/interview/$sessionId" });
  const navigate = useNavigate();
  const sessionBigInt = BigInt(sessionId);

  const storedMeta = (() => {
    try {
      return JSON.parse(
        localStorage.getItem(`session-${sessionId}`) ?? "{}",
      ) as Record<string, string>;
    } catch {
      return {} as Record<string, string>;
    }
  })();

  const category: Category =
    (storedMeta.category as Category) ?? Category.MachineLearning;
  const difficulty: Difficulty =
    (storedMeta.difficulty as Difficulty) ?? Difficulty.Intermediate;

  const { data: questions, isLoading } = useGetQuestions(category, difficulty);
  const { mutate: submitAnswer, isPending: isSubmitting } = useSubmitAnswer();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [lastNlp, setLastNlp] = useState<{
    keywordScore: number;
    grammarScore: number;
    confidenceScore: number;
    sentiment: string;
    betterAnswer: string;
  } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const MAX_WORDS = 300;

  const currentQuestion = questions?.[currentIndex];
  const wordCount =
    answer.trim() === "" ? 0 : answer.trim().split(/\s+/).length;
  const timerPercent = Math.max(0, (timeLeft / TIMER_SECONDS) * 100);

  // Pure imperative timer start — not a useEffect, avoids stale closure issues
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(TIMER_SECONDS);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  // Start timer on mount
  useEffect(() => {
    startTimer();
    return stopTimer;
  }, [startTimer, stopTimer]);

  const advanceOrFinish = useCallback(() => {
    if (!questions) return;
    setLastNlp(null);
    setAnswer("");
    setCurrentIndex((prev) => {
      if (prev < questions.length - 1) {
        startTimer();
        return prev + 1;
      }
      navigate({ to: "/results/$sessionId", params: { sessionId } });
      return prev;
    });
  }, [questions, navigate, sessionId, startTimer]);

  const handleSubmit = useCallback(
    (auto = false) => {
      if (!currentQuestion || isSubmitting) return;
      if (!auto && answer.trim().length < 10) {
        toast.error("Please write at least 10 characters before submitting.");
        return;
      }
      stopTimer();
      submitAnswer(
        {
          sessionId: sessionBigInt,
          questionId: currentQuestion.id,
          answerText: answer || "—",
        },
        {
          onSuccess: (result) => {
            setLastNlp({
              keywordScore: Number(result.nlpResult.keywordScore),
              grammarScore: Number(result.nlpResult.grammarScore),
              confidenceScore: Number(result.nlpResult.confidenceScore),
              sentiment: result.nlpResult.sentiment,
              betterAnswer: result.nlpResult.betterAnswer,
            });
            toast.success(`Score: ${Number(result.nlpResult.overallScore)}%`);
            setTimeout(advanceOrFinish, 1200);
          },
          onError: () => {
            toast.error("Failed to submit. Moving to next question.");
            advanceOrFinish();
          },
        },
      );
    },
    [
      currentQuestion,
      isSubmitting,
      answer,
      sessionBigInt,
      submitAnswer,
      stopTimer,
      advanceOrFinish,
    ],
  );

  // Auto-advance when timer expires
  useEffect(() => {
    if (timeLeft <= 0) {
      stopTimer();
      if (answer.trim().length >= 3) {
        handleSubmit(true);
      } else {
        advanceOrFinish();
      }
    }
  }, [timeLeft, answer, handleSubmit, advanceOrFinish, stopTimer]);

  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-64 col-span-1" />
          <Skeleton className="h-64 col-span-1" />
          <Skeleton className="h-64 col-span-1" />
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="p-6 max-w-xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle className="w-10 h-10 text-destructive mb-3" />
        <p className="font-semibold text-foreground mb-1">No questions found</p>
        <p className="text-sm text-muted-foreground mb-4">
          No questions available for this category and difficulty level.
        </p>
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate({ to: "/interview" })}
        >
          Back to Setup
        </Button>
      </div>
    );
  }

  const displayTime = Math.max(0, timeLeft);
  const mins = String(Math.floor(displayTime / 60)).padStart(2, "0");
  const secs = String(displayTime % 60).padStart(2, "0");

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-xl font-bold text-foreground">
            Active Interview Practice
          </h1>
          <Badge
            className={cn(CATEGORY_BADGE_CLASS[category], "border-0 text-xs")}
          >
            {CATEGORY_LABELS[category]}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <Progress
            value={(currentIndex / questions.length) * 100}
            className="w-24 h-1.5"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Timer */}
        <Card className="shadow-card col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-sm font-semibold">
              Interview Question Timer
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6 gap-3">
            <div className="relative w-28 h-28" data-ocid="timer-ring">
              <svg
                className="w-full h-full -rotate-90"
                viewBox="0 0 112 112"
                role="img"
                aria-label={`Timer: ${displayTime} seconds remaining`}
              >
                <title>Timer: {displayTime} seconds remaining</title>
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-muted/40"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  fill="none"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="301.59"
                  strokeDashoffset={301.59 * (1 - timerPercent / 100)}
                  className={cn(
                    "transition-all duration-1000",
                    displayTime > 10 ? "stroke-primary" : "stroke-destructive",
                  )}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-2xl font-bold text-foreground tabular-nums">
                  {mins}:{secs}
                </span>
                <span className="text-xs text-muted-foreground">remaining</span>
              </div>
            </div>
            {displayTime <= 10 && displayTime > 0 && (
              <p className="text-xs text-destructive font-semibold animate-pulse">
                Time running out!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Question + Answer */}
        <Card className="shadow-card col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-sm font-semibold">
              Interview Question
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p
              className="font-display text-base font-semibold text-foreground leading-snug"
              data-ocid="question-text"
            >
              {currentQuestion?.text}
            </p>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                Answer Draft
              </p>
              <Textarea
                data-ocid="answer-input"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your response…"
                className="resize-none h-32 text-sm"
                disabled={isSubmitting}
              />
              <p className="text-right text-xs text-muted-foreground mt-1">
                {wordCount} / {MAX_WORDS} words max
              </p>
            </div>
            <Button
              type="button"
              data-ocid="btn-submit-answer"
              onClick={() => handleSubmit()}
              disabled={isSubmitting || answer.trim().length < 3}
              className="w-full font-display font-semibold transition-smooth"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                  Analyzing…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Submit Answer
                </span>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* NLP Feedback */}
        {lastNlp ? (
          <NlpFeedbackPanel
            keywordScore={lastNlp.keywordScore}
            grammarScore={lastNlp.grammarScore}
            confidenceScore={lastNlp.confidenceScore}
            sentiment={lastNlp.sentiment}
            betterAnswer={lastNlp.betterAnswer}
            keywords={currentQuestion?.expectedKeywords?.slice(0, 5) ?? []}
          />
        ) : (
          <Card className="shadow-card col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-sm font-semibold">
                Real-time NLP Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center gap-2">
              <p className="text-sm text-muted-foreground">
                Submit your first answer to see NLP analysis
              </p>
              <div className="flex flex-wrap gap-1.5 justify-center mt-2">
                {(currentQuestion?.expectedKeywords ?? [])
                  .slice(0, 5)
                  .map((kw) => (
                    <Badge key={kw} variant="secondary" className="text-xs">
                      {kw}
                    </Badge>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
