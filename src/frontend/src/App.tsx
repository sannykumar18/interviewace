import { Toaster } from "@/components/ui/sonner";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Lazy-load pages for code splitting
const LoginPage = lazy(() => import("./pages/LoginPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const InterviewSetupPage = lazy(() => import("./pages/InterviewSetupPage"));
const InterviewSessionPage = lazy(() => import("./pages/InterviewSessionPage"));
const ResultsPage = lazy(() => import("./pages/ResultsPage"));

// Fallback used while lazy chunks load
function PageSuspense({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

// ── Routes ────────────────────────────────────────────────────────────────────

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/login" });
  },
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => (
    <PageSuspense>
      <LoginPage />
    </PageSuspense>
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => (
    <ProtectedRoute>
      <Layout>
        <PageSuspense>
          <DashboardPage />
        </PageSuspense>
      </Layout>
    </ProtectedRoute>
  ),
});

const interviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/interview",
  component: () => (
    <ProtectedRoute>
      <Layout>
        <PageSuspense>
          <InterviewSetupPage />
        </PageSuspense>
      </Layout>
    </ProtectedRoute>
  ),
});

const interviewSessionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/interview/$sessionId",
  component: () => (
    <ProtectedRoute>
      <Layout>
        <PageSuspense>
          <InterviewSessionPage />
        </PageSuspense>
      </Layout>
    </ProtectedRoute>
  ),
});

const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/results/$sessionId",
  component: () => (
    <ProtectedRoute>
      <Layout>
        <PageSuspense>
          <ResultsPage />
        </PageSuspense>
      </Layout>
    </ProtectedRoute>
  ),
});

// Placeholder routes referenced in Layout nav
const questionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/questions",
  component: () => (
    <ProtectedRoute>
      <Layout>
        <PageSuspense>
          <DashboardPage />
        </PageSuspense>
      </Layout>
    </ProtectedRoute>
  ),
});

const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analytics",
  component: () => (
    <ProtectedRoute>
      <Layout>
        <PageSuspense>
          <DashboardPage />
        </PageSuspense>
      </Layout>
    </ProtectedRoute>
  ),
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: () => (
    <ProtectedRoute>
      <Layout>
        <PageSuspense>
          <DashboardPage />
        </PageSuspense>
      </Layout>
    </ProtectedRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  dashboardRoute,
  interviewRoute,
  interviewSessionRoute,
  resultsRoute,
  questionsRoute,
  analyticsRoute,
  settingsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors position="bottom-right" />
    </>
  );
}
