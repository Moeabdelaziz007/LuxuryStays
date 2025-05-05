# StayX - Luxury Booking Platform

StayX is a modern luxury property booking platform, built for summer rentals and digital services.

## 🌴 Summer 2025 Goal
Launch a stable platform for:
- Public homepage
- Featured properties & service booking
- Firebase Auth + Firestore
- Role-based dashboards:
  - Customer
  - Property Admin
  - Super Admin
- Arabic/English (RTL) support
- Neon green + black branding

## 🛠️ Tech Stack
- React + TypeScript + Tailwind CSS
- Firebase (Auth, Firestore, Storage)
- PostgreSQL (optional)
- React Query + Role-based Routing
- Feature-based folder structure

## 🧪 Getting Started

```bash
npm install
npm run dev
```

## 📁 Structure Highlights
- `features/home/` - Home page with hero, properties, and services
- `features/auth/` - Login, Register, role redirection
- `dashboard/` - Dashboards by user role
- `lib/firebase.ts` - Firebase config
- `contexts/auth-context.tsx` - Auth state + role detection
- `lib/RoleGuard.tsx` - Route protection
- `routes.tsx` - Application routing with wouter
- `shared/schema.ts` - Database schema definitions
- `server/` - Express API endpoints and database connection