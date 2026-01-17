import "./index.css";
import * as Lazy from "./pages";
import Layout from "./Layout";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router";
import { AuthProvider } from "@/contexts/AuthContext";
import { LocationProvider } from "@/contexts/LocationContext";

const queryClient = new QueryClient();
const root = createRoot(document.getElementById("root")!);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      <Route path="/" element={<Lazy.LandingPage />} />
      <Route path="/discover" element={<Lazy.Discover />} />
      <Route path="/dashboard" element={<Lazy.Dashboard />} />
      <Route path="/dashboard/create-listing" element={<Lazy.DashboardCreateListing />} />
      <Route path="/dashboard/listings" element={<Lazy.DashboardListings />} />
      <Route path="/dashboard/profile" element={<Lazy.DashboardProfile />} />
      <Route path="/dashboard/subscriptions" element={<Lazy.DashboardSubscriptions />} />
      <Route path="/listing/:id" element={<Lazy.ListingDetail />} />
      <Route path="/seller/:seller_id" element={<Lazy.SellerProfile />} />
      <Route path="/community" element={<Lazy.Community />} />
      <Route path="*" element={<Lazy.NotFound />} />
    </Route>,
  ),
);

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster />
        <LocationProvider>
          <TooltipProvider>
            <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
              <RouterProvider router={router}></RouterProvider>
            </Suspense>
          </TooltipProvider>
        </LocationProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
