import { c as createLucideIcon, j as jsxRuntimeExports, h as cn, k as useParams, a as useNavigate, l as useGetQuestions, m as useSubmitAnswer, r as reactExports, i as ue, b as Button } from "./index-DdLi52vZ.js";
import { B as Badge, C as CATEGORY_LABELS, a as CATEGORY_BADGE_CLASS } from "./types-r2GW6Lfp.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-YvvczYuH.js";
import { P as Progress } from "./progress-6gSLzvgY.js";
import { S as Skeleton } from "./skeleton-CqDuk1Ev.js";
import { C as Category, D as Difficulty } from "./backend.d-CI3do3Ir.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode);
function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "textarea",
    {
      "data-slot": "textarea",
      className: cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ...props
    }
  );
}
const TIMER_SECONDS = 30;
function NlpFeedbackPanel({
  keywordScore,
  grammarScore,
  confidenceScore,
  sentiment,
  betterAnswer,
  keywords
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-sm font-semibold", children: "Real-time NLP Feedback" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground mb-2", children: "Keywords" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: keywords.slice(0, 5).map((kw) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "badge-ml border-0 text-xs", children: kw }, kw)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border p-2.5 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground font-medium", children: "Grammar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-lg font-bold text-foreground", children: [
            grammarScore,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border p-2.5 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground font-medium", children: "Confidence" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-lg font-bold text-foreground", children: [
            confidenceScore,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border p-2.5 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground font-medium", children: "Sentiment" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: cn(
                "font-display text-sm font-bold",
                sentiment === "Positive" ? "score-excellent" : "text-muted-foreground"
              ),
              children: sentiment
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground mb-1", children: "Keyword Score" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: keywordScore, className: "h-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-right text-xs text-muted-foreground mt-0.5", children: [
          keywordScore,
          "%"
        ] })
      ] }),
      betterAnswer && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-secondary/40 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5", children: "Suggested Better Answer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground leading-relaxed", children: betterAnswer })
      ] })
    ] })
  ] });
}
function InterviewSessionPage() {
  var _a;
  const { sessionId } = useParams({ from: "/interview/$sessionId" });
  const navigate = useNavigate();
  const sessionBigInt = BigInt(sessionId);
  const storedMeta = (() => {
    try {
      return JSON.parse(
        localStorage.getItem(`session-${sessionId}`) ?? "{}"
      );
    } catch {
      return {};
    }
  })();
  const category = storedMeta.category ?? Category.MachineLearning;
  const difficulty = storedMeta.difficulty ?? Difficulty.Intermediate;
  const { data: questions, isLoading } = useGetQuestions(category, difficulty);
  const { mutate: submitAnswer, isPending: isSubmitting } = useSubmitAnswer();
  const [currentIndex, setCurrentIndex] = reactExports.useState(0);
  const [answer, setAnswer] = reactExports.useState("");
  const [timeLeft, setTimeLeft] = reactExports.useState(TIMER_SECONDS);
  const [lastNlp, setLastNlp] = reactExports.useState(null);
  const timerRef = reactExports.useRef(null);
  const MAX_WORDS = 300;
  const currentQuestion = questions == null ? void 0 : questions[currentIndex];
  const wordCount = answer.trim() === "" ? 0 : answer.trim().split(/\s+/).length;
  const timerPercent = Math.max(0, timeLeft / TIMER_SECONDS * 100);
  const startTimer = reactExports.useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(TIMER_SECONDS);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1e3);
  }, []);
  const stopTimer = reactExports.useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);
  reactExports.useEffect(() => {
    startTimer();
    return stopTimer;
  }, [startTimer, stopTimer]);
  const advanceOrFinish = reactExports.useCallback(() => {
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
  const handleSubmit = reactExports.useCallback(
    (auto = false) => {
      if (!currentQuestion || isSubmitting) return;
      if (!auto && answer.trim().length < 10) {
        ue.error("Please write at least 10 characters before submitting.");
        return;
      }
      stopTimer();
      submitAnswer(
        {
          sessionId: sessionBigInt,
          questionId: currentQuestion.id,
          answerText: answer || "—"
        },
        {
          onSuccess: (result) => {
            setLastNlp({
              keywordScore: Number(result.nlpResult.keywordScore),
              grammarScore: Number(result.nlpResult.grammarScore),
              confidenceScore: Number(result.nlpResult.confidenceScore),
              sentiment: result.nlpResult.sentiment,
              betterAnswer: result.nlpResult.betterAnswer
            });
            ue.success(`Score: ${Number(result.nlpResult.overallScore)}%`);
            setTimeout(advanceOrFinish, 1200);
          },
          onError: () => {
            ue.error("Failed to submit. Moving to next question.");
            advanceOrFinish();
          }
        }
      );
    },
    [
      currentQuestion,
      isSubmitting,
      answer,
      sessionBigInt,
      submitAnswer,
      stopTimer,
      advanceOrFinish
    ]
  );
  reactExports.useEffect(() => {
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
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48 mb-6" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 col-span-1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 col-span-1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 col-span-1" })
      ] })
    ] });
  }
  if (!questions || questions.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-10 h-10 text-destructive mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground mb-1", children: "No questions found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "No questions available for this category and difficulty level." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          variant: "secondary",
          onClick: () => navigate({ to: "/interview" }),
          children: "Back to Setup"
        }
      )
    ] });
  }
  const displayTime = Math.max(0, timeLeft);
  const mins = String(Math.floor(displayTime / 60)).padStart(2, "0");
  const secs = String(displayTime % 60).padStart(2, "0");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-6xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground", children: "Active Interview Practice" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            className: cn(CATEGORY_BADGE_CLASS[category], "border-0 text-xs"),
            children: CATEGORY_LABELS[category]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Question ",
          currentIndex + 1,
          " of ",
          questions.length
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Progress,
          {
            value: currentIndex / questions.length * 100,
            className: "w-24 h-1.5"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card col-span-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-sm font-semibold", children: "Interview Question Timer" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col items-center justify-center py-6 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-28 h-28", "data-ocid": "timer-ring", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "svg",
              {
                className: "w-full h-full -rotate-90",
                viewBox: "0 0 112 112",
                role: "img",
                "aria-label": `Timer: ${displayTime} seconds remaining`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("title", { children: [
                    "Timer: ",
                    displayTime,
                    " seconds remaining"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "circle",
                    {
                      cx: "56",
                      cy: "56",
                      r: "48",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "6",
                      className: "text-muted/40"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "circle",
                    {
                      cx: "56",
                      cy: "56",
                      r: "48",
                      fill: "none",
                      strokeWidth: "6",
                      strokeLinecap: "round",
                      strokeDasharray: "301.59",
                      strokeDashoffset: 301.59 * (1 - timerPercent / 100),
                      className: cn(
                        "transition-all duration-1000",
                        displayTime > 10 ? "stroke-primary" : "stroke-destructive"
                      )
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-2xl font-bold text-foreground tabular-nums", children: [
                mins,
                ":",
                secs
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "remaining" })
            ] })
          ] }),
          displayTime <= 10 && displayTime > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive font-semibold animate-pulse", children: "Time running out!" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card col-span-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-sm font-semibold", children: "Interview Question" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "font-display text-base font-semibold text-foreground leading-snug",
              "data-ocid": "question-text",
              children: currentQuestion == null ? void 0 : currentQuestion.text
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground mb-1.5", children: "Answer Draft" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                "data-ocid": "answer-input",
                value: answer,
                onChange: (e) => setAnswer(e.target.value),
                placeholder: "Type your response…",
                className: "resize-none h-32 text-sm",
                disabled: isSubmitting
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-right text-xs text-muted-foreground mt-1", children: [
              wordCount,
              " / ",
              MAX_WORDS,
              " words max"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              "data-ocid": "btn-submit-answer",
              onClick: () => handleSubmit(),
              disabled: isSubmitting || answer.trim().length < 3,
              className: "w-full font-display font-semibold transition-smooth",
              children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" }),
                "Analyzing…"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" }),
                "Submit Answer"
              ] })
            }
          )
        ] })
      ] }),
      lastNlp ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        NlpFeedbackPanel,
        {
          keywordScore: lastNlp.keywordScore,
          grammarScore: lastNlp.grammarScore,
          confidenceScore: lastNlp.confidenceScore,
          sentiment: lastNlp.sentiment,
          betterAnswer: lastNlp.betterAnswer,
          keywords: ((_a = currentQuestion == null ? void 0 : currentQuestion.expectedKeywords) == null ? void 0 : _a.slice(0, 5)) ?? []
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card col-span-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-sm font-semibold", children: "Real-time NLP Feedback" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col items-center justify-center py-8 text-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Submit your first answer to see NLP analysis" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5 justify-center mt-2", children: ((currentQuestion == null ? void 0 : currentQuestion.expectedKeywords) ?? []).slice(0, 5).map((kw) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: kw }, kw)) })
        ] })
      ] })
    ] })
  ] });
}
export {
  InterviewSessionPage as default
};
