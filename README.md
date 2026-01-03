# GlobeTrotter

A full-stack travel planning application built for the Odoo Hackathon. GlobeTrotter helps users discover destinations, plan trips, and explore points of interest using integrated mapping and location services.

## Tech Stack

### Backend
- **Node.js** (v22+)
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Prisma** - ORM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Geoapify API** - Location services (via backend proxy)
- **Multer** - File uploads
- **LRU Cache** - In-memory caching
- **Express Rate Limit** - API rate limiting

### Frontend
- **React** (JSX only)
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Chart.js** - Data visualization
- **React Big Calendar** - Calendar component
- **Moment.js** - Date handling

## Features

### Authentication
- User registration with profile photo upload
- JWT-based login system
- Secure password hashing
- User profile management

### Location Services
- Forward and reverse geocoding
- Nearby places search (POIs)
- Place details and metadata
- Top regions discovery by country
- Route planning and preview

### Trip Planning
- Create and manage trips
- Budget tracking
- Itinerary management
- Activity scheduling
- Stop planning with activities

### Dashboard
- Location search with autocomplete
- Regional discovery
- Previous trips overview
- Interactive map integration

## Installation

### Prerequisites
- Node.js (v22+)
- PostgreSQL
- Git

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the backend directory with:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/globetrotter"
   JWT_SECRET="your-jwt-secret-key"
   GEOAPIFY_API_KEY="your-geoapify-api-key"
   PORT=3001
   ```

4. Set up the database:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:3001`.

## Usage

1. Register a new account or login with existing credentials
2. Use the dashboard to search for locations
3. Explore nearby places and top regions
4. Create trips and plan itineraries
5. View and manage your travel plans

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/user-by-email` - Get user profile

### External API Proxies
- `GET /api/external/geocode` - Forward geocoding
- `GET /api/external/reverse` - Reverse geocoding
- `GET /api/external/places` - Nearby places search
- `GET /api/external/place-details` - Place details
- `GET /api/external/top-regions` - Top regions by country
- `GET /api/external/route` - Route planning

### Trip Management
- `GET /api/trips` - Get user trips
- `POST /api/trips` - Create new trip
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip

## Project Structure

```
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── api/
│   ├── index.html
│   └── package.json
└── README.md
```

## Security

- API keys are stored server-side only
- Frontend communicates exclusively through backend proxies
- Rate limiting implemented (10 requests/second per IP)
- JWT tokens for authentication
- Passwords hashed with bcrypt

## Contributing

This is a hackathon project. For contributions:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Team
| Name | Role | Email |
|------|------|-------|
| SUKESH D | Developer | sukesh.official.2006@gmail.com |
| PRITHIVIRAAJ J N | Developer | prithivi.coder76@gmail.com |
| VERAADITHYA | Tester | veera.rockzz40@gmail.com |

## License

ISC License</content>
<parameter name="filePath">e:\FORGEGRID\ODOO-HACKATHON\README.md