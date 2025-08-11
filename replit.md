# Overview

This is a password generator web application built with React and Express. The application provides a client-side password generation tool with customizable options for creating secure passwords. It features a modern UI built with shadcn/ui components and Tailwind CSS, allowing users to generate single passwords or bulk passwords with various configuration options including length, character types, and security preferences.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: React hooks for local state, TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation resolvers

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Development**: tsx for TypeScript execution in development
- **Build**: esbuild for production bundling
- **Middleware**: Custom logging and error handling middleware

## Data Storage Solutions
- **Database**: PostgreSQL configured with Drizzle ORM
- **Connection**: Neon Database serverless PostgreSQL
- **Schema Management**: Drizzle migrations in `/migrations` directory
- **Session Storage**: PostgreSQL-backed session storage with connect-pg-simple
- **Development Storage**: In-memory storage implementation for development/testing

## Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL backing store
- **User Schema**: Basic user model with username/password fields
- **Storage Interface**: Abstracted storage layer supporting both memory and database implementations

## Development and Build Tools
- **Bundler**: Vite for frontend development and building
- **TypeScript**: Strict configuration with path mapping for clean imports
- **CSS Processing**: PostCSS with Tailwind CSS and Autoprefixer
- **Development Server**: Vite dev server with HMR and error overlay
- **Static Assets**: Served through Express in production

## Code Organization
- **Monorepo Structure**: Shared types and schemas in `/shared` directory
- **Path Aliases**: Configured for `@/` (client), `@shared/` (shared), and `@assets/` (assets)
- **Component Structure**: Modular UI components following shadcn/ui patterns
- **Type Safety**: End-to-end TypeScript with shared interfaces

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database queries and migrations
- **connect-pg-simple**: PostgreSQL session store for Express

## UI and Styling
- **Radix UI**: Headless UI component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **Lucide React**: Icon library

## Development Tools
- **Vite**: Build tool and development server
- **TanStack Query**: Server state management
- **React Hook Form**: Form handling and validation
- **Zod**: Schema validation
- **date-fns**: Date utility functions

## Runtime Environment
- **Replit Integration**: Development environment with runtime error modal and cartographer plugins
- **Google Fonts**: Inter font family for typography