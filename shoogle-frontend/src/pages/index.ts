import { lazy } from "react";

const LandingPage = lazy(() => import("./LandingPage"));
const Discover = lazy(() => import("./Discover"));
const Dashboard = lazy(() => import("./Dashboard"));
const NotFound = lazy(() => import("./NotFound"));
const DashboardCreateListing = lazy(() => import("./DashboardCreateListing"));
const ListingDetail = lazy(() => import("./ListingDetail"));
const SellerProfile = lazy(() => import("./SellerProfile"));
const DashboardProfile = lazy(() => import("./DashboardProfile"));
const DashboardSubscriptions = lazy(() => import("./DashboardSubscriptions"));
const DashboardListings = lazy(() => import("./DashboardListings"));
const Community = lazy(() => import("./Community"));

export {
  LandingPage,
  Discover,
  Community,
  Dashboard,
  DashboardCreateListing,
  DashboardProfile,
  DashboardSubscriptions,
  DashboardListings,
  ListingDetail,
  NotFound,
  SellerProfile,
};
