# Shoogle Backend

This repository contains the backend API for Shoogle - a local marketplace platform connecting buyers and sellers in communities.

## 🚀 Tech Stack

- **Node.js**: JavaScript runtime environment
- **TypeScript**: Type-safe JavaScript for better development experience
- **Fastify**: Fast and low overhead web framework
- **Prisma**: Modern database toolkit and ORM
- **PostgreSQL**: Primary database with Prisma adapter
- **Redis**: In-memory data store for caching and sessions
- **JWT**: JSON Web Tokens for authentication
- **Zod**: Schema validation library
- **AWS SDK**: Cloud services integration
- **bcrypt**: Password hashing
- **Google APIs**: OAuth integration

## 🏗️ Architecture

The backend follows a modular architecture with:
- **RESTful API**: Clean REST endpoints
- **Microservice-ready**: Modular structure for easy scaling
- **Database-first**: Prisma schema-driven development
- **Type-safe**: Full TypeScript coverage
- **Caching**: Redis for performance optimization

### Key Features
- **Authentication**: JWT-based auth with Google OAuth
- **User Management**: Profiles, seller accounts, permissions
- **Listing System**: CRUD operations for marketplace listings
- **Review System**: Dual review system (listings + sellers)
- **File Upload**: AWS S3 integration for media
- **Real-time**: Server-sent events support
- **Caching**: Redis-based caching layer

## 🛠️ Local Development

Follow these steps to set up the backend for local development:

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- Redis server
- AWS account (for file uploads)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shoogle-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   FRONTEND_URI=http://localhost:5173
   
   # Database Configuration
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name?schema=public
   
   # Redis Configuration
   REDIS_URI=redis://localhost:6379
   
   # JWT Configuration
   JWT_PRIVATE_SECRET="your_jwt_private_key"
   JWT_PUBLIC_SECRET="your_jwt_public_key"
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback
   
   # AWS Configuration
   AWS_IAM_ACCESS_KEY=your_aws_access_key
   AWS_IAM_SECRET_ACCESS_KEY=your_aws_secret_key
   ```

   > **Note**: Contact the development team to get the required environment variables and keys.

4. **Setup the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   
   # (Optional) Seed the database
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3000`

## 📁 Project Structure

```
shoogle-backend/
├── src/
│   ├── modules/                # Feature modules
│   │   ├── auth/              # Authentication module
│   │   ├── user/              # User management module
│   │   ├── listing/           # Listing management module
│   │   ├── review/            # Review system module
│   │   ├── seller-review/     # Seller review module
│   │   └── reaction/          # Listing reactions module
│   ├── shared/                # Shared utilities
│   │   ├── config/           # Configuration files
│   │   ├── controllers/      # Base controllers
│   │   ├── routes/           # Base routes
│   │   ├── utils/            # Utility functions
│   │   └── validations/      # Shared validations
│   └── server.ts             # Application entry point
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migrations
├── .env                      # Environment variables
├── package.json              # Dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Run database migrations
- `npx prisma generate` - Generate Prisma client

## 🗄️ Database Schema

The application uses PostgreSQL with Prisma ORM. Key entities:

### Core Tables
- **users** - User accounts and basic information
- **seller** - Seller profiles and business information
- **listings** - Marketplace listings
- **reviews** - Listing reviews
- **seller_reviews** - Seller reviews
- **listing_reactions** - Like/dislike reactions

### Authentication
- **identities** - OAuth provider information
- **user_devices** - Device tokens for notifications

### Additional Features
- **communities** - Community management
- **events** - Event system
- **promotional_campaigns** - Marketing campaigns

## 🔌 API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /signup` - Email signup
- `POST /login` - Email login
- `GET /google` - Google OAuth
- `GET /status` - Check auth status
- `POST /logout` - Logout user

### User Management (`/api/v1/user`)
- `GET /seller-profile` - Get seller profile
- `POST /create-seller-profile` - Create seller profile
- `PUT /seller-profile` - Update seller profile
- `DELETE /seller-profile` - Delete seller profile

### Listings (`/api/v1/listing`)
- `GET /` - Get listings with filters
- `POST /` - Create listing
- `GET /:id` - Get listing by ID
- `PUT /:id` - Update listing
- `DELETE /:id` - Delete listing
- `POST /generate-upload-url` - Generate S3 upload URL

### Reviews (`/api/v1/review`)
- `POST /` - Create review
- `PUT /:id` - Update review
- `DELETE /:id` - Delete review
- `GET /listing/:listing_id` - Get reviews for listing
- `POST /reply` - Reply to review
- `PUT /reply/:id` - Update reply
- `DELETE /reply/:id` - Delete reply

### Seller Reviews (`/api/v1/seller-review`)
- `POST /` - Create seller review
- `PUT /:id` - Update seller review
- `DELETE /:id` - Delete seller review
- `GET /seller/:seller_id` - Get seller reviews

### Reactions (`/api/v1/reaction`)
- `POST /` - Add/update reaction
- `DELETE /` - Remove reaction

## 🔐 Authentication & Security

### JWT Authentication
- **Access Tokens**: Short-lived tokens for API access
- **Refresh Tokens**: Long-lived tokens for token renewal
- **HTTP-Only Cookies**: Secure token storage
- **CORS**: Configured for frontend domains

### Security Features
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Zod schemas for all endpoints
- **Rate Limiting**: Protection against abuse
- **HTTPS**: SSL/TLS encryption in production
- **Environment Variables**: Sensitive data protection

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=<production-database-url>
REDIS_URI=<production-redis-url>
FRONTEND_URI=<production-frontend-url>
# ... other production variables
```

### Deployment Platforms
- **AWS EC2**: Recommended for production
- **AWS ECS**: Container-based deployment
- **Railway**: Alternative deployment option
- **Heroku**: Another deployment option

### Database Migration
```bash
npx prisma migrate deploy
```

## 📊 Monitoring & Logging

- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Logging**: Structured logging for debugging and monitoring
- **Health Checks**: API health endpoints
- **Performance**: Redis caching for improved response times

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Prisma for all database operations
- Implement proper error handling
- Add input validation with Zod
- Write meaningful commit messages
- Update documentation for new features

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

For support and questions:
- Contact the development team
- Create an issue in the repository

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   ```bash
   # Check if PostgreSQL is running
   pg_ctl status
   
   # Reset database
   npx prisma migrate reset
   ```

2. **Redis Connection Issues**
   ```bash
   # Check if Redis is running
   redis-cli ping
   
   # Start Redis server
   redis-server
   ```

3. **Build Issues**
   ```bash
   # Clean install
   rm -rf node_modules package-lock.json
   npm install
   
   # Regenerate Prisma client
   npx prisma generate
   ```

---

Built with ❤️ by the Shoogle team