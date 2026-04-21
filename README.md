# ByaHero

Production-oriented full-stack scaffold for a Filipino commute expense tracker and route planner.

## Stack
- Client: React 18 + Vite + TypeScript + Tailwind + Zustand + Recharts
- Server: Node.js + Express + Prisma + PostgreSQL + Passport OAuth + JWT cookies
- Uploads: Cloudinary
- Exports: jsPDF + Papa Parse

## Project Structure
- `client/` React app
- `server/` Express API + Prisma schema

## Setup
1. Install dependencies:
   - `npm install`
   - `npm install -w client`
   - `npm install -w server`
2. Configure environments:
   - Copy `server/.env.example` to `server/.env`
   - Copy `client/.env.example` to `client/.env`
3. Prepare database:
   - `npm run prisma:generate -w server`
   - `npm run prisma:migrate -w server`
4. Run both apps:
   - `npm run dev`

## Auth
- Email/password with bcrypt hash + JWT access/refresh token rotation
- Google OAuth and Apple Sign-In via Passport strategies
- Remember me cookie session support
- Forgot/reset password flow with 1-hour token
- CSRF + rate limiting + input validation

## Security
- Helmet headers
- CORS allowlist (`CLIENT_URL`)
- httpOnly secure cookies in production
- Zod validation and centralized error handling

## Notes
- Keep all secrets in `.env`
- OAuth/SMTP/Cloudinary behavior depends on valid credentials
- Service worker + offline banner included
