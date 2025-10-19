# Modern App with Dark Mode & Theme Support

A comprehensive React/Next.js project template with built-in dark mode, theme management, and a well-organized architecture.

## Features

- ✨ **Dark Mode Support** - Seamless light/dark/system theme switching
- 🎨 **Theme Management** - Centralized theme configuration and services
- 📦 **Well-Organized Structure** - Services, models, components, and pages
- 🎯 **TypeScript** - Full type safety throughout the project
- 🧩 **shadcn/ui** - Beautiful, accessible UI components
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 📱 **Responsive Design** - Mobile-first approach
- 🚀 **Next.js App Router** - Modern routing with server components

## Project Structure

\`\`\`
├── app/                    # Next.js pages and routes
│   ├── layout.tsx         # Root layout with theme provider
│   ├── page.tsx           # Home page
│   ├── dashboard/         # Dashboard page
│   ├── users/             # Users management page
│   ├── settings/          # Settings page
│   └── globals.css        # Global styles and theme tokens
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components
│   ├── header.tsx        # Header component
│   ├── sidebar.tsx       # Sidebar navigation
│   └── theme-toggle.tsx  # Theme switcher
├── hooks/                # Custom React hooks
│   └── use-theme.ts      # Theme hook
├── models/               # TypeScript interfaces and types
│   ├── user.ts          # User model
│   └── theme.ts         # Theme model
├── services/             # Business logic and API calls
│   ├── user-service.ts  # User service
│   └── theme-service.ts # Theme service
├── providers/            # React context providers
│   └── theme-provider.tsx # Theme context provider
└── lib/                  # Utility functions
    └── utils.ts         # Helper functions
\`\`\`

## Getting Started

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Using the Theme Hook

\`\`\`tsx
import { useTheme } from '@/hooks/use-theme'

export function MyComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  return (
    <button onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </button>
  )
}
\`\`\`

### Using Services

\`\`\`tsx
import { UserService } from '@/services/user-service'

const users = await UserService.getAllUsers()
const user = await UserService.getUser('1')
\`\`\`

### Adding New Pages

1. Create a new folder in `app/`
2. Add a `page.tsx` file
3. Use the Header and Sidebar components for consistency

## Customization

### Theme Colors

Edit `app/globals.css` to customize theme colors:

\`\`\`css
:root {
  --primary: oklch(0.45 0.15 264.4);
  --accent: oklch(0.55 0.2 200);
  /* ... more colors ... */
}
\`\`\`

### Adding New Services

1. Create a new file in `services/`
2. Define your service class with static methods
3. Import and use in your components

## Technologies

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - UI components
- **Lucide Icons** - Icon library

## License

MIT
