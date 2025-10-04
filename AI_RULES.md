# AI Development Rules for Meu Agente

This document provides guidelines for the AI assistant to follow when developing and modifying this application. The goal is to ensure code consistency, maintainability, and adherence to the established architecture.

## Tech Stack Overview

This project is a modern web application built with the following technologies:

-   **Framework**: React (using Vite for a fast development experience).
-   **Language**: TypeScript for type safety and improved developer experience.
-   **Backend & Database**: Supabase for the database, authentication, and serverless edge functions.
-   **Styling**: Tailwind CSS for utility-first styling, following the design system defined in `tailwind.config.ts` and `src/index.css`.
-   **UI Components**: A combination of custom components and `shadcn/ui`, which are built upon Radix UI for accessibility.
-   **Routing**: React Router (`react-router-dom`) for all client-side routing.
-   **Forms**: React Hook Form (`react-hook-form`) for performance and Zod for robust schema validation.
-   **Data Fetching & State**: TanStack React Query for server state management and React Context for global client state (e.g., auth, theme).
-   **Data Visualization**: Recharts for creating interactive charts and graphs.
-   **Icons**: Lucide React (`lucide-react`) for a consistent and clean icon set.

## Library Usage and Coding Rules

### 1. UI and Components

-   **Primary UI Library**: ALWAYS use `shadcn/ui` components from `src/components/ui` for all standard UI elements like buttons, cards, dialogs, inputs, etc.
-   **Custom Components**: Create new, reusable components in `src/components/` for any UI element not covered by `shadcn/ui`. Keep components small and focused on a single responsibility.
-   **Styling**: NEVER write custom CSS files. All styling MUST be done using Tailwind CSS utility classes. Use the predefined colors and variables from the design system (e.g., `bg-surface`, `text-text-muted`, `border-border`).

### 2. State Management

-   **Server State**: ALWAYS use custom hooks that fetch data from Supabase, like the existing `useFinancialData` hook. This pattern centralizes data fetching logic. For new data types, create similar hooks.
-   **Global Client State**: Use the existing React Context providers in `src/contexts/` (e.g., `AuthContext`, `ThemeContext`) for application-wide state that doesn't change often. Do NOT introduce new global state libraries like Redux or Zustand.
-   **Local Component State**: Use the `useState` hook for state that is confined to a single component.

### 3. Backend and Data

-   **Supabase Client**: All interactions with the Supabase database MUST go through the pre-configured client instance imported from `@/integrations/supabase/client`.
-   **Serverless Functions**: For secure operations like authentication or complex queries, use Supabase Edge Functions. Follow the pattern of the existing functions in `supabase/functions/`.

### 4. Forms

-   **Form Logic**: ALWAYS use `react-hook-form` for managing form state, submissions, and validation.
-   **Validation**: ALWAYS use `Zod` to define the validation schema for forms. Integrate it with `react-hook-form` using `@hookform/resolvers/zod`.

### 5. Routing

-   **Router**: Use `react-router-dom` for all navigation.
-   **Route Definitions**: All application routes MUST be defined in `src/App.tsx`.
-   **Navigation**: Use the `<Link>` or `<NavLink>` components for user-facing navigation. Use the `useNavigate` hook for programmatic navigation within your logic.

### 6. Icons and Notifications

-   **Icons**: ALWAYS use icons from the `lucide-react` library to maintain visual consistency.
-   **Notifications**: Use `sonner` for simple, non-blocking toast notifications (e.g., success or error messages). The `toast()` function from `sonner` is available globally.

### 7. File Structure

-   **Pages**: Place components that represent a full page or view inside `src/pages/`.
-   **Reusable Components**: Place general-purpose, reusable components inside `src/components/`.
-   **Layouts**: Application layouts (like `AppLayout` and `AuthLayout`) should be in `src/components/layout/`.
-   **Hooks**: Custom hooks should reside in `src/hooks/`.
-   **Contexts**: Global context providers should be in `src/contexts/`.