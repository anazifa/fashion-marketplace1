# Fashion Marketplace Platform

A modern e-commerce platform built with Next.js, Express, and Prisma, featuring AI-powered marketing tools.

## Features

- User authentication and authorization
- Product management
- Shopping cart functionality
- Order processing
- AI-powered marketing tools
- Seller dashboard
- Analytics and reporting

## Tech Stack

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: Express, TypeScript, Prisma
- Database: SQLite (development)
- Authentication: JWT
- AI Tools: OpenAI API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fashion-marketplace.git
cd fashion-marketplace
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
```bash
# Backend (.env)
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
PORT=3000

# Frontend (.env)
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

4. Initialize the database:
```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

5. Start the development servers:
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server (in a new terminal)
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3000/api

## Project Structure

```
fashion-marketplace/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── index.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── styles/
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 