import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { Brain, Code2, Database, Layers, Sparkles, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { useAuth } from "../hooks/use-auth";

const categories = [
  {
    icon: Code2,
    label: "Python Basics",
    color: "badge-python",
  },
  {
    icon: Sparkles,
    label: "Machine Learning",
    color: "badge-ml",
  },
  {
    icon: Layers,
    label: "Data Structures",
    color: "badge-ds",
  },
  {
    icon: Brain,
    label: "AI Concepts",
    color: "badge-ai",
  },
  {
    icon: Database,
    label: "Database",
    color: "badge-db",
  },
];

export default function LoginPage() {
  const { login, isAuthenticated, isInitializing } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8 shadow-elevated border-border">
            {/* Logo + title */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-card">
                <Brain className="w-7 h-7 text-primary-foreground" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-1">
                InterviewAce
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                AI-Powered Interview Practice for BCA AI/ML Students
              </p>
            </div>

            {/* Category icons */}
            <div className="grid grid-cols-5 gap-2 mb-8">
              {categories.map(({ icon: Icon, label, color }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="flex flex-col items-center gap-1.5"
                  title={label}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-medium text-muted-foreground text-center leading-tight">
                    {label.split(" ")[0]}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Features */}
            <div className="space-y-2.5 mb-8">
              {[
                "NLP-powered keyword & grammar analysis",
                "30-second timer with auto-advance",
                "Confidence & sentiment scoring",
                "Personalized feedback & better answers",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2.5">
                  <Zap className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Login CTA */}
            <Button
              data-ocid="btn-login-ii"
              onClick={login}
              disabled={isInitializing}
              className="w-full h-11 font-display font-semibold text-base transition-smooth"
            >
              {isInitializing ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                  Loading…
                </span>
              ) : (
                "Sign in with Internet Identity"
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground mt-4">
              Secure, passwordless login powered by ICP
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
