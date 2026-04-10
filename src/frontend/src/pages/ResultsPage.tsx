import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, RotateCcw, Trophy } from "lucide-react";
import { useGetSessionResults, useGetUserSessions } from "../hooks/use-backend";
import {
  CATEGORY_BADGE_CLASS,
  CATEGORY_LABELS,
  DIFFICULTY_LABELS,
} from "../types";
import type { Category, Difficulty } from "../types";

function ScoreGauge({ score }: { score: number }) {
  const color =
    score >= 80
      ? "score-excellent"
      : score >= 60
        ? "text-primary"
        : score >= 40
          ? "text-accent"
          : "text-destructive";

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn("font-display text-5xl font-bold tabular-nums", color)}
      >
        {score}%
      </div>
      <p className="text-sm text-muted-foreground">Overall Score</p>
      <Progress value={score} className="w-32 h-2" />
    </div>
  );
}

export default function ResultsPage() {
  const { sessionId } = useParams({ from: "/results/$sessionId" });
  const sessionBigInt = BigInt(sessionId);
  const navigate = useNavigate();

  const { data: results, isLoading } = useGetSessionResults(sessionBigInt);
  const { data: sessions } = useGetUserSessions();
  const session = sessions?.find((s) => s.id === sessionBigInt);

  const totalScore =
    results && results.length > 0
      ? Math.round(
          results.reduce((a, r) => a + Number(r.totalScore), 0) /
            results.length,
        )
      : 0;

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Session Results
          </h1>
          {session && (
            <div className="flex items-center gap-2 mt-1">
              <Badge
                className={cn(
                  CATEGORY_BADGE_CLASS[session.category as Category] ?? "",
                  "border-0 text-xs",
                )}
              >
                {CATEGORY_LABELS[session.category as Category] ??
                  String(session.category)}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {DIFFICULTY_LABELS[session.difficulty as Difficulty] ??
                  String(session.difficulty)}
              </Badge>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            data-ocid="btn-back-dashboard"
          >
            <Link to="/dashboard">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Dashboard
            </Link>
          </Button>
          <Button
            size="sm"
            onClick={() => navigate({ to: "/interview" })}
            data-ocid="btn-practice-again"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Practice Again
          </Button>
        </div>
      </div>

      {/* Score overview */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="shadow-card col-span-1 flex flex-col items-center justify-center py-6">
          <Trophy className="w-8 h-8 text-accent mb-2" />
          <ScoreGauge score={totalScore} />
        </Card>
        <Card className="shadow-card col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-sm font-semibold">
              Score Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {results && results.length > 0 ? (
              <>
                {[
                  {
                    label: "Keyword Match",
                    value: Math.round(
                      results.reduce((a, r) => a + Number(r.keywordScore), 0) /
                        results.length,
                    ),
                  },
                  {
                    label: "Grammar",
                    value: Math.round(
                      results.reduce((a, r) => a + Number(r.grammarScore), 0) /
                        results.length,
                    ),
                  },
                  {
                    label: "Confidence",
                    value: Math.round(
                      results.reduce(
                        (a, r) => a + Number(r.confidenceScore),
                        0,
                      ) / results.length,
                    ),
                  },
                  {
                    label: "Sentiment",
                    value: Math.round(
                      results.reduce(
                        (a, r) => a + Number(r.sentimentScore),
                        0,
                      ) / results.length,
                    ),
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <p className="w-28 text-xs font-medium text-muted-foreground flex-shrink-0">
                      {label}
                    </p>
                    <Progress value={value} className="flex-1 h-2" />
                    <p className="w-10 text-right text-xs font-semibold text-foreground tabular-nums">
                      {value}%
                    </p>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No answer data available.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Per-question breakdown */}
      {results && results.length > 0 && (
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-sm font-semibold">
              Question-by-Question Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((record, i) => (
                <div
                  key={record.questionId.toString()}
                  data-ocid="result-row"
                  className="border border-border rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-semibold text-foreground">
                      Question {i + 1}
                    </p>
                    <Badge
                      className={cn(
                        "text-xs border-0",
                        Number(record.totalScore) >= 70
                          ? "score-excellent bg-green-100 dark:bg-green-950"
                          : "bg-secondary text-muted-foreground",
                      )}
                    >
                      Score: {Number(record.totalScore)}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2 italic">
                    "{record.answerText}"
                  </p>
                  <p className="text-xs text-foreground leading-relaxed">
                    {record.feedback}
                  </p>
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                    <span>
                      Keywords:{" "}
                      <b className="text-foreground">
                        {Number(record.keywordScore)}%
                      </b>
                    </span>
                    <span>
                      Grammar:{" "}
                      <b className="text-foreground">
                        {Number(record.grammarScore)}%
                      </b>
                    </span>
                    <span>
                      Confidence:{" "}
                      <b className="text-foreground">
                        {Number(record.confidenceScore)}%
                      </b>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {(!results || results.length === 0) && (
        <Card className="shadow-card">
          <CardContent className="py-12 flex flex-col items-center text-center gap-3">
            <p className="font-semibold text-foreground">No results yet</p>
            <p className="text-sm text-muted-foreground">
              Results will appear after you complete the session.
            </p>
            <Button asChild size="sm">
              <Link to="/interview/$sessionId" params={{ sessionId }}>
                Continue Session
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
