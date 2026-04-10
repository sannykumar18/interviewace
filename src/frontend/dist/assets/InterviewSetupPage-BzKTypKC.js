import { r as reactExports, a as useNavigate, g as useStartSession, j as jsxRuntimeExports, B as Brain, h as cn, b as Button, i as ue } from "./index-DdLi52vZ.js";
import { C as CATEGORY_LABELS, B as Badge, D as DIFFICULTY_LABELS } from "./types-r2GW6Lfp.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-YvvczYuH.js";
import { C as Category, D as Difficulty } from "./backend.d-CI3do3Ir.js";
import { C as CodeXml, S as Sparkles, L as Layers, D as Database } from "./sparkles-D97ufW5C.js";
const CATEGORY_OPTIONS = [
  {
    value: Category.PythonBasics,
    icon: CodeXml,
    color: "badge-python",
    desc: "Variables, loops, functions, OOP"
  },
  {
    value: Category.MachineLearning,
    icon: Sparkles,
    color: "badge-ml",
    desc: "Algorithms, models, evaluation"
  },
  {
    value: Category.DataStructures,
    icon: Layers,
    color: "badge-ds",
    desc: "Arrays, trees, graphs, complexity"
  },
  {
    value: Category.AIConcepts,
    icon: Brain,
    color: "badge-ai",
    desc: "Neural nets, NLP, computer vision"
  },
  {
    value: Category.Database,
    icon: Database,
    color: "badge-db",
    desc: "SQL, normalization, indexing"
  }
];
const DIFFICULTY_OPTIONS = [
  {
    value: Difficulty.Beginner,
    label: "Beginner",
    desc: "Foundational concepts, simple questions"
  },
  {
    value: Difficulty.Intermediate,
    label: "Intermediate",
    desc: "Applied knowledge, real scenarios"
  },
  {
    value: Difficulty.Advanced,
    label: "Advanced",
    desc: "Complex problems, deep understanding"
  }
];
function InterviewSetupPage() {
  const [category, setCategory] = reactExports.useState(Category.MachineLearning);
  const [difficulty, setDifficulty] = reactExports.useState(
    Difficulty.Intermediate
  );
  const navigate = useNavigate();
  const { mutate: startSession, isPending } = useStartSession();
  function handleStart() {
    startSession(
      { category, difficulty },
      {
        onSuccess: (session) => {
          localStorage.setItem(
            `session-${session.id.toString()}`,
            JSON.stringify({ category, difficulty })
          );
          navigate({
            to: "/interview/$sessionId",
            params: { sessionId: session.id.toString() }
          });
        },
        onError: () => {
          ue.error("Failed to start session. Please try again.");
        }
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-3xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Practice Sessions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Configure your interview session and start practicing" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-base font-semibold", children: "Select Category" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: CATEGORY_OPTIONS.map(({ value, icon: Icon, color, desc }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": `category-${value.toLowerCase()}`,
          onClick: () => setCategory(value),
          className: cn(
            "flex items-start gap-3 p-3.5 rounded-lg border text-left transition-smooth focus-ring",
            category === value ? "border-primary bg-secondary shadow-xs" : "border-border hover:border-muted-foreground/30 hover:bg-muted/40"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                  color
                ),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4.5 h-4.5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground leading-tight", children: CATEGORY_LABELS[value] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 leading-tight", children: desc })
            ] }),
            category === value && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto flex-shrink-0 w-4 h-4 rounded-full bg-primary flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-primary-foreground" }) })
          ]
        },
        value
      )) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-base font-semibold", children: "Select Difficulty" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: DIFFICULTY_OPTIONS.map(({ value, label, desc }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": `difficulty-${value.toLowerCase()}`,
          onClick: () => setDifficulty(value),
          className: cn(
            "flex flex-col gap-1 p-3.5 rounded-lg border text-left transition-smooth focus-ring",
            difficulty === value ? "border-primary bg-secondary shadow-xs" : "border-border hover:border-muted-foreground/30 hover:bg-muted/40"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-tight", children: desc })
          ]
        },
        value
      )) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-5 flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "badge-ml border-0 text-xs", children: CATEGORY_LABELS[category] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: DIFFICULTY_LABELS[difficulty] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "· 5 questions · 30s timer" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          "data-ocid": "btn-start-session",
          onClick: handleStart,
          disabled: isPending,
          className: "min-w-[140px] font-display font-semibold transition-smooth",
          children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" }),
            "Starting…"
          ] }) : "Start Interview"
        }
      )
    ] }) })
  ] });
}
export {
  InterviewSetupPage as default
};
