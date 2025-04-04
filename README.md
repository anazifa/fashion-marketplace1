# Fashion Marketplace

A full-stack e-commerce application for fashion products, built with:
- Frontend: Next.js (React)
- Backend: Node.js (Express)
- Database: PostgreSQL
- Authentication: JWT
- Payment Processing: Stripe
- Image Storage: AWS S3

## Deployment Instructions

### Backend Deployment (Heroku)

1. Create a Heroku account at [heroku.com](https://heroku.com)
2. Install the Heroku CLI
3. Create a new Heroku app:
   ```
   heroku create your-app-name
   ```
4. Add PostgreSQL addon:
   ```
   heroku addons:create heroku-postgresql:hobby-dev
   ```
5. Set environment variables:
   ```
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set STRIPE_SECRET_KEY=your_stripe_secret_key
   heroku config:set AWS_ACCESS_KEY=your_aws_access_key
   heroku config:set AWS_SECRET_KEY=your_aws_secret_key
   heroku config:set S3_BUCKET_NAME=your_s3_bucket_name
   heroku config:set CLIENT_URL=https://your-frontend-url.vercel.app
   heroku config:set FRONTEND_URL=https://your-frontend-url.vercel.app
   ```
6. Deploy to Heroku:
   ```
   git push heroku main
   ```

### Frontend Deployment (Vercel)

1. Create a Vercel account at [vercel.com](https://vercel.com)
2. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```
3. Navigate to the frontend directory:
   ```
   cd frontend
   ```
4. Deploy to Vercel:
   ```
   vercel
   ```
5. Set environment variables in the Vercel dashboard:
   - NEXT_PUBLIC_API_URL=https://your-backend-url.herokuapp.com
   - NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key

## Local Development

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   cd frontend && npm install
   ```
3. Set up environment variables in .env and frontend/.env.local
4. Start the backend server:
   ```
   node server.js
   ```
5. Start the frontend development server:
   ```
   cd frontend && npm run dev
   ```
6. Visit http://localhost:3000 in your browser 