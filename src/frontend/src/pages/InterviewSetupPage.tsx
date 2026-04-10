import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { Brain, Code2, Database, Layers, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useStartSession } from "../hooks/use-backend";
import {
  CATEGORY_LABELS,
  Category,
  DIFFICULTY_LABELS,
  Difficulty,
} from "../types";

const CATEGORY_OPTIONS = [
  {
    value: Category.PythonBasics,
    icon: Code2,
    color: "badge-python",
    desc: "Variables, loops, functions, OOP",
  },
  {
    value: Category.MachineLearning,
    icon: Sparkles,
    color: "badge-ml",
    desc: "Algorithms, models, evaluation",
  },
  {
    value: Category.DataStructures,
    icon: Layers,
    color: "badge-ds",
    desc: "Arrays, trees, graphs, complexity",
  },
  {
    value: Category.AIConcepts,
    icon: Brain,
    color: "badge-ai",
    desc: "Neural nets, NLP, computer vision",
  },
  {
    value: Category.Database,
    icon: Database,
    color: "badge-db",
    desc: "SQL, normalization, indexing",
  },
];

const DIFFICULTY_OPTIONS = [
  {
    value: Difficulty.Beginner,
    label: "Beginner",
    desc: "Foundational concepts, simple questions",
  },
  {
    value: Difficulty.Intermediate,
    label: "Intermediate",
    desc: "Applied knowledge, real scenarios",
  },
  {
    value: Difficulty.Advanced,
    label: "Advanced",
    desc: "Complex problems, deep understanding",
  },
];

export default function InterviewSetupPage() {
  const [category, setCategory] = useState<Category>(Category.MachineLearning);
  const [difficulty, setDifficulty] = useState<Difficulty>(
    Difficulty.Intermediate,
  );
  const navigate = useNavigate();
  const { mutate: startSession, isPending } = useStartSession();

  function handleStart() {
    startSession(
      { category, difficulty },
      {
        onSuccess: (session) => {
          // Store session metadata for the interview page to use
          localStorage.setItem(
            `session-${session.id.toString()}`,
            JSON.stringify({ category, difficulty }),
          );
          navigate({
            to: "/interview/$sessionId",
            params: { sessionId: session.id.toString() },
          });
        },
        onError: () => {
          toast.error("Failed to start session. Please try again.");
        },
      },
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Practice Sessions
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Configure your interview session and start practicing
        </p>
      </div>

      {/* Category selection */}
      <Card className="shadow-card mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base font-semibold">
            Select Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CATEGORY_OPTIONS.map(({ value, icon: Icon, color, desc }) => (
              <button
                key={value}
                type="button"
                data-ocid={`category-${value.toLowerCase()}`}
                onClick={() => setCategory(value)}
                className={cn(
                  "flex items-start gap-3 p-3.5 rounded-lg border text-left transition-smooth focus-ring",
                  category === value
                    ? "border-primary bg-secondary shadow-xs"
                    : "border-border hover:border-muted-foreground/30 hover:bg-muted/40",
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                    color,
                  )}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-foreground leading-tight">
                    {CATEGORY_LABELS[value]}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
                    {desc}
                  </p>
                </div>
                {category === value && (
                  <div className="ml-auto flex-shrink-0 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Difficulty selection */}
      <Card className="shadow-card mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base font-semibold">
            Select Difficulty
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {DIFFICULTY_OPTIONS.map(({ value, label, desc }) => (
              <button
                key={value}
                type="button"
                data-ocid={`difficulty-${value.toLowerCase()}`}
                onClick={() => setDifficulty(value)}
                className={cn(
                  "flex flex-col gap-1 p-3.5 rounded-lg border text-left transition-smooth focus-ring",
                  difficulty === value
                    ? "border-primary bg-secondary shadow-xs"
                    : "border-border hover:border-muted-foreground/30 hover:bg-muted/40",
                )}
              >
                <p className="font-semibold text-sm text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground leading-tight">
                  {desc}
                </p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary + Start */}
      <Card className="shadow-card">
        <CardContent className="pt-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Badge className="badge-ml border-0 text-xs">
              {CATEGORY_LABELS[category]}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {DIFFICULTY_LABELS[difficulty]}
            </Badge>
            <span className="text-sm text-muted-foreground">
              · 5 questions · 30s timer
            </span>
          </div>
          <Button
            data-ocid="btn-start-session"
            onClick={handleStart}
            disabled={isPending}
            className="min-w-[140px] font-display font-semibold transition-smooth"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                Starting…
              </span>
            ) : (
              "Start Interview"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
