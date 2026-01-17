# Shoogle Frontend

This repository contains the frontend code for Shoogle - a local marketplace platform connecting buyers and sellers in communities.

## 🚀 Tech Stack

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe JavaScript for better development experience
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing for Single Page Application
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Radix UI**: Accessible component primitives
- **Axios**: HTTP client for API communication
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation
- **Framer Motion**: Animation library
- **Lucide React**: Icon library

## 🏗️ Architecture

The frontend is built as a Single Page Application (SPA) that communicates with a custom Node.js + TypeScript backend API.

### Key Features
- **Authentication**: Google OAuth and email/password login
- **Marketplace**: Browse and search listings by category
- **Seller Dashboard**: Manage listings, profile, and business information
- **Review System**: Rate and review sellers and listings
- **Real-time Updates**: Live notifications and updates
- **Responsive Design**: Mobile-first responsive UI

## 🛠️ Local Development

Follow these steps to set up the frontend for local development:

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shoogle-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # API Configuration
   VITE_BASE_URL=http://localhost:3000/api/v1
   
   # Supabase Configuration (for file uploads)
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_SUPABASE_URL=your_supabase_url
   ```

   > **Note**: Contact the development team to get the required environment variables.

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
shoogle-frontend/
├── src/
│   ├── api/                 # API configuration and client
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Shared components (Navbar, Footer, etc.)
│   │   ├── ui/             # Base UI components (Button, Input, etc.)
│   │   ├── Dashboard/      # Dashboard-specific components
│   │   ├── listings/       # Listing-related components
│   │   └── seller-profile/ # Seller profile components
│   ├── contexts/           # React contexts (Auth, Location, etc.)
│   ├── features/           # Feature-specific components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and configurations
│   ├── pages/              # Page components
│   ├── types/              # TypeScript type definitions
│   └── main.tsx           # Application entry point
├── public/                 # Static assets
├── .env                   # Environment variables
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development environment
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🌐 API Integration

The frontend communicates with the backend API through:
- **Base URL**: Configured via `VITE_BASE_URL` environment variable
- **Authentication**: JWT tokens stored in HTTP-only cookies
- **Error Handling**: Centralized error handling with user-friendly messages
- **Loading States**: Proper loading indicators for better UX

### Key API Endpoints
- `/auth/*` - Authentication endpoints
- `/user/*` - User profile management
- `/listing/*` - Listing CRUD operations
- `/review/*` - Review system
- `/seller-review/*` - Seller reviews
- `/reaction/*` - Listing reactions (like/dislike)

## 🎨 Styling

The project uses Tailwind CSS for styling with:
- **Design System**: Consistent color palette and typography
- **Component Library**: Radix UI for accessible components
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Theme switching capability
- **Animations**: Framer Motion for smooth transitions

## 🔐 Authentication

Authentication is handled through:
- **Google OAuth**: Social login integration
- **Email/Password**: Traditional authentication
- **JWT Tokens**: Secure token-based authentication
- **Protected Routes**: Route-level authentication guards
- **Auto-refresh**: Automatic token refresh

## 📱 Features

### For Buyers
- Browse listings by category and location
- Search and filter functionality
- View detailed listing information
- Contact sellers via WhatsApp
- Rate and review sellers and listings
- Manage profile and preferences

### For Sellers
- Create and manage listings
- Business profile management
- View analytics and insights
- Respond to reviews
- Subscription management
- Upload media and photos

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables for Production
```env
VITE_BASE_URL=<production-api-url>
VITE_SUPABASE_ANON_KEY=<production-supabase-key>
VITE_SUPABASE_URL=<production-supabase-url>
```

### Deployment Platforms
- **AWS S3 + CloudFront**: Recommended for production
- **Vercel**: Alternative deployment option
- **Netlify**: Another deployment option

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

For support and questions:
- Contact the development team
- Create an issue in the repository

---

Built with ❤️ by the Shoogle team