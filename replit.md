# replit.md

## Overview

This is a temporary email (temp mail) web application that allows users to generate disposable email addresses and receive emails without registration. The application provides a clean, Material Design-inspired interface for managing temporary inboxes with automatic expiration (15 minutes). It supports both Persian (Farsi) and English languages with RTL layout.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React useState for local state
- **Styling**: Tailwind CSS with custom CSS variables for theming (light/dark mode support)
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Build Tool**: Vite with React plugin

The frontend follows a component-based architecture with:
- Page components in `client/src/pages/`
- Reusable UI components in `client/src/components/ui/` (shadcn/ui)
- Feature-specific components in `client/src/components/`
- Custom hooks in `client/src/hooks/`

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (compiled with tsx in development, esbuild for production)
- **API Design**: RESTful JSON API with `/api` prefix
- **Storage**: In-memory storage with interface abstraction (IStorage) allowing future database integration

Key API endpoints:
- `POST /api/generate` - Create new temporary email inbox
- `GET /api/inbox?email=` - Fetch inbox contents for an email address

### Data Storage
- **Current**: In-memory Map-based storage (`MemStorage` class)
- **Schema Definition**: Zod schemas in `shared/schema.ts` for runtime validation
- **Database Ready**: Drizzle ORM configured with PostgreSQL dialect (schema prepared but not actively used)

The storage abstraction (`IStorage` interface) makes it easy to swap implementations between memory and database backends.

### Build System
- **Development**: Vite dev server with HMR for frontend, tsx for backend
- **Production**: Custom build script using esbuild for server bundling, Vite for client
- **Output**: `dist/` directory with `index.cjs` (server) and `public/` (client assets)

### Design Patterns
- **Shared Types**: Common TypeScript types and Zod schemas in `shared/` directory
- **Path Aliases**: `@/` for client source, `@shared/` for shared code
- **Component Composition**: Radix UI primitives wrapped with Tailwind styling

## External Dependencies

### UI Framework
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **shadcn/ui**: Pre-styled component wrappers using Tailwind CSS
- **Lucide React**: Icon library

### Data & Forms
- **TanStack Query**: Server state management and caching
- **Zod**: Runtime schema validation
- **React Hook Form**: Form handling (with @hookform/resolvers)
- **date-fns**: Date formatting and manipulation

### Database (Configured but Optional)
- **Drizzle ORM**: TypeScript ORM configured for PostgreSQL
- **PostgreSQL**: Database connection via `DATABASE_URL` environment variable
- **connect-pg-simple**: PostgreSQL session store for Express

### Development Tools
- **Vite**: Frontend build tool with React plugin
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler for production builds
- **Replit plugins**: Dev banner, cartographer, runtime error overlay (development only)

### Fonts
- Google Fonts: Inter, Vazirmatn (Persian), JetBrains Mono, Fira Code, Geist Mono