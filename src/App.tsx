import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Signup from "./pages/Signup.tsx";

import { SmoothScroll } from "./components/landing/SmoothScroll";
import { CursorSpotlight } from "./components/landing/CursorSpotlight";

const queryClient = new QueryClient();

import { SidebarLayout } from "./components/layout/SidebarLayout.tsx";
import { DashboardPage } from "./pages/workspace/DashboardPage.tsx";
import { OverviewPage } from "./pages/workspace/OverviewPage.tsx";
import { AnalyticsPage } from "./pages/workspace/AnalyticsPage.tsx";
import { DependenciesPage } from "./pages/workspace/DependenciesPage.tsx";
import { ArchitecturePage } from "./pages/workspace/ArchitecturePage.tsx";
import { TechStackPage } from "./pages/workspace/TechStackPage.tsx";
import { ContributorsPage } from "./pages/workspace/ContributorsPage.tsx";
import { SettingsPage } from "./pages/workspace/SettingsPage.tsx";
import { Reports } from "./pages/Reports.tsx";
import { Insights } from "./pages/Insights.tsx";
import { Pricing } from "./pages/Pricing.tsx";
import { FeaturesPage } from "./pages/FeaturesPage.tsx";
import { HowItWorksPage } from "./pages/HowItWorksPage.tsx";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SmoothScroll />
        <CursorSpotlight />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />

          <Route path="/workspace" element={<SidebarLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="overview" element={<OverviewPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="dependencies" element={<DependenciesPage />} />
            <Route path="architecture" element={<ArchitecturePage />} />
            <Route path="tech-stack" element={<TechStackPage />} />
            <Route path="contributors" element={<ContributorsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
