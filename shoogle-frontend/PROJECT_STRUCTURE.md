# Shoogle Frontend - Project Structure

## Overview
This document describes the production-ready file structure and organization of the Shoogle frontend application.

## Directory Structure

```
src/
├── api/                    # API client configuration
├── assets/                 # Static assets (images, etc.)
├── components/             # Reusable React components
│   ├── animations/         # Animation components (GSAP, etc.)
│   ├── common/             # Shared/common components (Navbar, Footer, Loader, etc.)
│   ├── Community/          # Community feature components
│   ├── CreateListing/      # Listing creation components
│   ├── Dashboard/          # Dashboard feature components
│   ├── Discover/           # Discovery/search feature components
│   ├── LandingPage/        # Landing page components
│   ├── listings/           # Listing-related components (reviews, etc.)
│   ├── modals/             # Modal components
│   ├── seller-profile/     # Seller profile feature components
│   ├── shared/             # Shared utilities (PhotoUploader, DarkMode, etc.)
│   └── ui/                 # shadcn/ui component library
├── contexts/               # React context providers
├── features/               # Feature-specific modules
│   └── seller-profile/     # Seller profile feature implementation
├── hooks/                  # Custom React hooks
├── integrations/           # Third-party integrations (Supabase, etc.)
├── lib/                    # Utility libraries
├── pages/                  # Page components (routes)
├── types/                  # TypeScript type definitions
└── utils/                  # Utility functions
```

## Component Organization Principles

### 1. Feature-Based Organization
Components are organized by feature when they belong to a specific feature:
- `components/Dashboard/` - All dashboard-related components
- `components/Discover/` - All discovery/search components
- `components/LandingPage/` - Landing page sections
- `components/seller-profile/` - Seller profile components

### 2. Shared Components
Commonly used components are in dedicated folders:
- `components/common/` - Navigation, footer, loaders, CTA buttons
- `components/shared/` - Reusable utilities (photo uploader, dark mode switcher)
- `components/ui/` - Design system components (shadcn/ui)

### 3. Index Files (Barrel Exports)
All component folders have `index.ts` files for clean imports:
```typescript
// ✅ Good - Clean import
import { Loader, Navbar, Footer } from "@/components/common";
import { SellerProfileHeader } from "@/components/seller-profile";



## Import Conventions

### ✅ Use Absolute Imports (`@/`)
Always use the `@/` alias for absolute imports:
```typescript
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Loader } from "@/components/common";
```

### ✅ Relative Imports Within Same Folder
Relative imports are acceptable within the same component folder:
```typescript
// Within components/Discover/
import ListingCard from "./ListingCard";
import { Listing } from "./ListingsGrid";
```

### ❌ Avoid Cross-Folder Relative Imports
Don't use `../` to import from parent folders:
```typescript

import { Button } from "@/components/ui/button";
```



## Component Folders

### `/components/common/`
Shared application components:
- `AuthCheck.tsx` - Authentication wrapper
- `Navbar.tsx`, `NavbarMobile.tsx`, `DesktopNavbar.tsx` - Navigation
- `Footer.tsx` - Footer component
- `Loader.tsx` - Loading spinner
- `ContactCTAButton.tsx`, `WhatsAppCTAButton.tsx` - Call-to-action buttons

**Export via:** `@/components/common`





### `/components/shared/`
Reusable utility components:
- `ProfilePhotoUploader.tsx` - Photo upload component
- `DarkModeSwitcher.tsx` - Theme switcher

**Export via:** `@/components/shared`




### `/components/seller-profile/`
Seller profile feature components:
- `SellerProfileHeader.tsx` - Profile header section
- `SellerProfileEditForm.tsx` - Profile editing form
- `SellerReviewForm.tsx` - Review submission form
- `SellerReviewsSection.tsx` - Reviews display section

**Export via:** `@/components/seller-profile`




### `/components/Dashboard/`
Dashboard feature components:
- `WelcomeSection.tsx` - Dashboard welcome
- `QuickActionsSection.tsx` - Quick action buttons
- `SellerListings.tsx` - User's listings
- `AnalyticsDashboard.tsx` - Analytics view
- `ListingReviewsDrawer.tsx` - Reviews drawer
- And more...

**Export via:** `@/components/Dashboard`




### `/components/Discover/`
Discovery/search components:
- `ListingsGrid.tsx` - Grid of listings
- `ListingCard.tsx` - Individual listing card
- `FeatureCarousel.tsx` - Category carousel
- `WelcomeTransition.tsx` - Welcome animation
- `ListingReactionButtons.tsx` - Like/dislike buttons

**Export via:** `@/components/Discover`




### `/components/listings/`
Listing-related components:
- `ListingReviewsSection.tsx` - Listing reviews

**Export via:** `@/components/listings`




### `/components/modals/`
Modal components:
- `AuthModal.tsx` - Authentication modal

**Export via:** `@/components/modals`




### `/components/animations/`
Animation components:
- `SplitText.tsx` - GSAP text animation component

**Export via:** `@/components/animations`




## Pages Structure

All page components are in `/pages/`:
- `LandingPage.tsx` - Homepage
- `Discover.tsx` - Discovery/search page
- `Dashboard.tsx` - Main dashboard
- `DashboardCreateListing.tsx` - Create listing page
- `DashboardProfile.tsx` - Profile settings
- `DashboardSubscriptions.tsx` - Subscription management
- `ListingDetail.tsx` - Listing detail view
- `SellerProfile.tsx` - Seller profile page
- `Community.tsx` - Community page
- `NotFound.tsx` - 404 page

**Routes are lazy-loaded via:** `pages/index.ts`

## Features Structure

Feature modules contain complex feature logic:
- `/features/seller-profile/` - Seller profile feature implementation



4. **Import Order**
   ```typescript
   // 1. External libraries
   import React from "react";
   import { useAuth } from "@/contexts/AuthContext";
   
   // 2. Internal components (absolute imports)
   import { Button } from "@/components/ui/button";
   import { Loader } from "@/components/common";
   
   // 3. Relative imports (same folder only)
   import ListingCard from "./ListingCard";
   
   // 4. Types
   import type { Listing } from "@/types/review";
   ```


## Developer Onboarding

When onboarding a new developer:

1. Review this structure document
2. Check `pages/index.ts` for all routes
3. Use barrel exports from component folders
4. Follow import conventions strictly
5. Add new components to appropriate feature folders
6. Create index.ts for new component folders



