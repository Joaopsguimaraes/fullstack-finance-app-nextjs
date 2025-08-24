# Finance App

A modern, secure, and intuitive finance management application built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Functionality

- **Dashboard Overview**: Real-time financial metrics and insights
- **Transaction Management**: Track income and expenses with categorization
- **Account Management**: Manage multiple bank accounts and credit cards
- **Budget Tracking**: Set and monitor spending limits by category
- **Financial Goals**: Set, track, and visualize progress toward financial objectives
- **Investment Portfolio**: Track stocks and investment performance
- **Data Visualization**: Interactive charts and graphs for financial insights

### Technical Features

- **Modern Stack**: Next.js 15 with App Router, TypeScript, Tailwind CSS v4
- **State Management**: Zustand with persistence and devtools
- **Form Validation**: React Hook Form with Zod schema validation
- **UI Components**: Custom component library with Radix UI primitives
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Data Visualization**: Recharts for interactive financial charts
- **Type Safety**: Full TypeScript coverage with strict typing

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **UI Components**: Radix UI + Custom components
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Development**: ESLint, Turbopack

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd finance_app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Authentication

The app includes a demo authentication system:

- **Email**: `demo@example.com`
- **Password**: `password123`

## 📱 Usage

### Dashboard

- View financial overview with key metrics
- Monitor spending patterns with interactive charts
- Quick access to recent transactions
- Navigate to different sections via sidebar

### Transactions

- Add new income or expense entries
- Categorize transactions for better tracking
- View transaction history with filtering options

### Accounts

- Manage multiple bank accounts
- Track balances across different account types
- Monitor credit card balances

### Budgets

- Set monthly spending limits by category
- Track budget utilization
- Receive alerts when approaching limits

### Goals

- Set financial goals with target amounts and dates
- Track progress toward objectives
- Visualize goal completion percentages

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── dashboard/         # Dashboard-specific components
│   ├── providers/         # Context providers
│   └── ui/               # Reusable UI components
├── lib/                  # Utility functions and configurations
│   ├── schemas.ts        # Zod validation schemas
│   ├── store.ts          # Zustand store
│   ├── utils.ts          # Utility functions
│   └── sample-data.ts    # Sample data for demonstration
```

## 🎨 Design System

The application uses a comprehensive design system with:

- **Color Palette**: HSL-based color system with dark mode support
- **Typography**: Geist font family for optimal readability
- **Spacing**: Consistent spacing scale using Tailwind CSS
- **Components**: Reusable UI components with variants
- **Responsive**: Mobile-first responsive design

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- **TypeScript**: Strict typing with proper interfaces
- **Components**: Functional components with hooks
- **Naming**: Descriptive names with auxiliary verbs
- **Structure**: Modular architecture with clear separation of concerns

### Best Practices

- **Performance**: Server Components where possible, client components when needed
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Security**: Input validation, secure data handling
- **Error Handling**: Comprehensive error boundaries and user feedback

## 📊 Data Management

The application uses Zustand for state management with:

- **Persistence**: Local storage for data persistence
- **DevTools**: Redux DevTools integration for debugging
- **Type Safety**: Full TypeScript support for state
- **Actions**: Immutable state updates with proper typing

## 🚀 Deployment

The application is optimized for deployment on Vercel:

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
