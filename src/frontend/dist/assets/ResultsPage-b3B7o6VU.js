import { c as createLucideIcon, k as useParams, a as useNavigate, n as useGetSessionResults, e as useGetUserSessions, j as jsxRuntimeExports, h as cn, b as Button, L as Link } from "./index-DdLi52vZ.js";
import { B as Badge, C as CATEGORY_LABELS, a as CATEGORY_BADGE_CLASS, D as DIFFICULTY_LABELS } from "./types-r2GW6Lfp.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-YvvczYuH.js";
import { P as Progress } from "./progress-6gSLzvgY.js";
import { S as Skeleton } from "./skeleton-CqDuk1Ev.js";
import { T as Trophy } from "./trophy-Ci0B2UmI.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
];
const RotateCcw = createLucideIcon("rotate-ccw", __iconNode);
function ScoreGauge({ score }) {
  const color = score >= 80 ? "score-excellent" : score >= 60 ? "text-primary" : score >= 40 ? "text-accent" : "text-destructive";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: cn("font-display text-5xl font-bold tabular-nums", color),
        children: [
          score,
          "%"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Overall Score" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: score, className: "w-32 h-2" })
  ] });
}
function ResultsPage() {
  const { sessionId } = useParams({ from: "/results/$sessionId" });
  const sessionBigInt = BigInt(sessionId);
  const navigate = useNavigate();
  const { data: results, isLoading } = useGetSessionResults(sessionBigInt);
  const { data: sessions } = useGetUserSessions();
  const session = sessions == null ? void 0 : sessions.find((s) => s.id === sessionBigInt);
  const totalScore = results && results.length > 0 ? Math.round(
    results.reduce((a, r) => a + Number(r.totalScore), 0) / results.length
  ) : 0;
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-4xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48 mb-6" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-4 mb-6", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24" }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Session Results" }),
        session && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              className: cn(
                CATEGORY_BADGE_CLASS[session.category] ?? "",
                "border-0 text-xs"
              ),
              children: CATEGORY_LABELS[session.category] ?? String(session.category)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: DIFFICULTY_LABELS[session.difficulty] ?? String(session.difficulty) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            asChild: true,
            "data-ocid": "btn-back-dashboard",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-3.5 h-3.5 mr-1" }),
              "Dashboard"
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            onClick: () => navigate({ to: "/interview" }),
            "data-ocid": "btn-practice-again",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-3.5 h-3.5 mr-1" }),
              "Practice Again"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card col-span-1 flex flex-col items-center justify-center py-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-8 h-8 text-accent mb-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreGauge, { score: totalScore })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-sm font-semibold", children: "Score Breakdown" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-3", children: results && results.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: [
          {
            label: "Keyword Match",
            value: Math.round(
              results.reduce((a, r) => a + Number(r.keywordScore), 0) / results.length
            )
          },
          {
            label: "Grammar",
            value: Math.round(
              results.reduce((a, r) => a + Number(r.grammarScore), 0) / results.length
            )
          },
          {
            label: "Confidence",
            value: Math.round(
              results.reduce(
                (a, r) => a + Number(r.confidenceScore),
                0
              ) / results.length
            )
          },
          {
            label: "Sentiment",
            value: Math.round(
              results.reduce(
                (a, r) => a + Number(r.sentimentScore),
                0
              ) / results.length
            )
          }
        ].map(({ label, value }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "w-28 text-xs font-medium text-muted-foreground flex-shrink-0", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value, className: "flex-1 h-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "w-10 text-right text-xs font-semibold text-foreground tabular-nums", children: [
            value,
            "%"
          ] })
        ] }, label)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No answer data available." }) })
      ] })
    ] }),
    results && results.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-sm font-semibold", children: "Question-by-Question Feedback" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: results.map((record, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "result-row",
          className: "border border-border rounded-lg p-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground", children: [
                "Question ",
                i + 1
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Badge,
                {
                  className: cn(
                    "text-xs border-0",
                    Number(record.totalScore) >= 70 ? "score-excellent bg-green-100 dark:bg-green-950" : "bg-secondary text-muted-foreground"
                  ),
                  children: [
                    "Score: ",
                    Number(record.totalScore),
                    "%"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-2 line-clamp-2 italic", children: [
              '"',
              record.answerText,
              '"'
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground leading-relaxed", children: record.feedback }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 mt-2 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Keywords:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { className: "text-foreground", children: [
                  Number(record.keywordScore),
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Grammar:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { className: "text-foreground", children: [
                  Number(record.grammarScore),
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Confidence:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { className: "text-foreground", children: [
                  Number(record.confidenceScore),
                  "%"
                ] })
              ] })
            ] })
          ]
        },
        record.questionId.toString()
      )) }) })
    ] }),
    (!results || results.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "py-12 flex flex-col items-center text-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "No results yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Results will appear after you complete the session." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/interview/$sessionId", params: { sessionId }, children: "Continue Session" }) })
    ] }) })
  ] });
}
export {
  ResultsPage as default
};
