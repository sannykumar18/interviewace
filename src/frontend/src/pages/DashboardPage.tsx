import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { BarChart2, BookOpen, PlayCircle, Trophy } from "lucide-react";
import { useGetUserProfile, useGetUserSessions } from "../hooks/use-backend";
import { CATEGORY_LABELS, DIFFICULTY_LABELS } from "../types";
import type { Category, Difficulty as DifficultyType } from "../types";

function StatCard({
  label,
  value,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
}) {
  return (
    <Card className="shadow-card">
      <CardContent className="pt-5 pb-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">
              {label}
            </p>
            <p className="font-display text-2xl font-bold text-foreground">
              {value}
            </p>
            {trend && (
              <p className="text-xs score-excellent mt-0.5 font-medium">
                {trend}
              </p>
            )}
          </div>
          <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
            <Icon className="w-4.5 h-4.5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: profile, isLoading: profileLoading } = useGetUserProfile();
  const { data: sessions, isLoading: sessionsLoading } = useGetUserSessions();

  const totalSessions = Number(profile?.totalSessions ?? 0);
  const totalQuestions =
    sessions?.reduce((acc, s) => acc + Number(s.questionsAttempted), 0) ?? 0;
  const avgScore =
    sessions && sessions.length > 0
      ? Math.round(
          sessions.reduce((acc, s) => acc + Number(s.totalScore), 0) /
            sessions.length,
        )
      : 0;
  const completedSessions = sessions?.filter((s) => s.isComplete).length ?? 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Performance Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Welcome back,{" "}
            <span className="font-semibold text-foreground">
              {profileLoading ? "…" : profile?.name || "Student"}
            </span>
          </p>
        </div>
        <Button asChild data-ocid="btn-new-session">
          <Link to="/interview">Start Practice</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {profileLoading ? (
          ["stat-a", "stat-b", "stat-c", "stat-d"].map((k) => (
            <Card key={k} className="shadow-card">
              <CardContent className="pt-5">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-7 w-16" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <StatCard
              label="Total Sessions"
              value={totalSessions}
              icon={PlayCircle}
              trend="+practice regularly"
            />
            <StatCard
              label="Questions Answered"
              value={totalQuestions}
              icon={BookOpen}
            />
            <StatCard
              label="Average Score"
              value={`${avgScore}%`}
              icon={BarChart2}
              trend={avgScore >= 70 ? "▲ Good performance" : "Keep practicing"}
            />
            <StatCard
              label="Completed"
              value={completedSessions}
              icon={Trophy}
            />
          </>
        )}
      </div>

      {/* Recent Sessions */}
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="font-display text-base font-semibold">
            Recent Session History
          </CardTitle>
          <Button
            asChild
            variant="secondary"
            size="sm"
            data-ocid="btn-new-practice"
          >
            <Link to="/interview">New practice</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {sessionsLoading ? (
            <div className="space-y-3">
              {["sk-1", "sk-2", "sk-3"].map((k) => (
                <Skeleton key={k} className="h-10 w-full" />
              ))}
            </div>
          ) : sessions && sessions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-2 font-semibold text-muted-foreground pr-4">
                      Date ↑
                    </th>
                    <th className="pb-2 font-semibold text-muted-foreground pr-4">
                      Category
                    </th>
                    <th className="pb-2 font-semibold text-muted-foreground pr-4">
                      Difficulty
                    </th>
                    <th className="pb-2 font-semibold text-muted-foreground pr-4 text-right">
                      Score
                    </th>
                    <th className="pb-2 font-semibold text-muted-foreground pr-4">
                      Status
                    </th>
                    <th className="pb-2 font-semibold text-muted-foreground">
                      Report
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.slice(0, 8).map((session) => (
                    <tr
                      key={session.id.toString()}
                      className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
                      data-ocid="session-row"
                    >
                      <td className="py-3 pr-4 text-muted-foreground">
                        {format(
                          new Date(Number(session.startTime) / 1_000_000),
                          "MMM d, yyyy",
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant="secondary" className="text-xs">
                          {CATEGORY_LABELS[session.category as Category] ??
                            String(session.category)}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        {DIFFICULTY_LABELS[
                          session.difficulty as DifficultyType
                        ] ?? String(session.difficulty)}
                      </td>
                      <td className="py-3 pr-4 text-right font-mono font-semibold">
                        {Number(session.totalScore)}/100
                      </td>
                      <td className="py-3 pr-4">
                        {session.isComplete ? (
                          <Badge className="text-xs score-excellent bg-green-100 dark:bg-green-950 border-0">
                            Complete
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            In Progress
                          </Badge>
                        )}
                      </td>
                      <td className="py-3">
                        {session.isComplete && (
                          <Link
                            to="/results/$sessionId"
                            params={{ sessionId: session.id.toString() }}
                            className="text-primary hover:underline text-xs font-medium"
                            data-ocid="link-session-report"
                          >
                            Detailed report →
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center py-12 text-center"
              data-ocid="empty-sessions"
            >
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-3">
                <PlayCircle className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="font-semibold text-foreground mb-1">
                No sessions yet
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Start your first practice interview to track your progress
              </p>
              <Button asChild size="sm" data-ocid="btn-start-first">
                <Link to="/interview">Start Practice</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
