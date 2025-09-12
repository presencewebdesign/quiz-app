# Error Find Quiz Application

A modern React TypeScript application demonstrating error detection in written text through an interactive quiz interface.

## 🎯 Overview

This application implements two distinct quiz flows for identifying grammatical errors in text:

- **Flow 1**: Sequential questions (5 total) with progress tracking and score screen
- **Flow 2**: Rounds-based questions where users must pass each round to proceed

## 🚀 Features

- **Modern React Architecture**: Built with React 18, TypeScript, and modern patterns
- **TanStack Query**: Advanced data fetching with caching and background updates
- **Suspense Integration**: Declarative loading states with error boundaries
- **Responsive Design**: Mobile-first approach with clean, accessible UI
- **Firebase Hosting**: Deployed with global CDN and automatic HTTPS
- **Error Detection**: Interactive text analysis with immediate feedback (no hints provided)
- **Progress Tracking**: Visual progress bars for both quiz flows
- **Score Calculation**: Comprehensive scoring system with percentage results
- **Smart Answer Generation**: Contextually relevant incorrect options
- **Unique Answer Keys**: Prevents answer collision between rounds

## 🛠 Tech Stack

### Core Technologies

- **React 18+** - Modern React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **TanStack Query v5** - Server state management
- **React Router v6** - Client-side routing
- **Firebase Hosting** - Deployment and hosting

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **React Error Boundary** - Error handling
- **SCSS** - Enhanced CSS with variables and mixins
- **CSS Modules** - Scoped styling

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Shared components (Button, Loading, etc.)
│   ├── quiz/            # Quiz-specific components
│   └── layout/          # Layout components
├── hooks/               # Custom React hooks
├── services/            # API and external services
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── contexts/            # React contexts for state management
├── pages/               # Main application screens
└── styles/              # CSS/styling files
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase CLI (for deployment)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd quiz-press-and-assessment

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
npm run test         # Run tests

# Deployment
npm run deploy       # Build and deploy to Firebase
```

## 🎮 Usage

### Flow 1: Sequential Questions

1. Click "Start Flow 1" on the home page
2. Answer all 5 questions in sequence (progress tracked with visual bar)
3. Get immediate feedback on each answer
4. View comprehensive score screen with percentage results
5. Navigate back to home or restart

### Flow 2: Rounds-based Questions

1. Click "Start Flow 2" on the home page
2. Answer the question in Round 1 correctly to proceed
3. Complete each round sequentially (must pass to unlock next round)
4. View round progress with "Round X of Y" indicator
5. Navigate to score screen after completing all rounds

### Question Format

- Read the text and identify grammatical errors yourself
- Choose the correct version from multiple choice options
- Submit your answer to see immediate feedback
- View the correct answer and explanation

## 🔧 API Integration

The application fetches quiz data from:

```
https://s3.eu-west-2.amazonaws.com/interview.mock.data/payload.json
```

### Data Structure

- **Flow 1**: `activities[0].questions` - Sequential questions
- **Flow 2**: `activities[1].questions[round].questions` - Rounds-based questions

### Error Handling

- Automatic retry logic for failed requests
- Graceful fallback UI for network errors
- Loading states with skeleton screens

## 🎨 Styling

### CSS Architecture

- **SCSS**: Enhanced CSS with variables, mixins, and nesting
- **CSS Modules**: Scoped component styles
- **Design System**: Consistent theming and spacing
- **Mobile-first**: Responsive design approach
- **Accessibility**: WCAG compliance considerations

### Design System

```scss
// SCSS Variables
$primary-color: #007bff;
$success-color: #28a745;
$danger-color: #dc3545;
$font-family-base:
  -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
$spacing-md: 1rem;
$border-radius: 4px;

// Responsive Breakpoints
$breakpoint-sm: 576px;
$breakpoint-md: 768px;
$breakpoint-lg: 992px;
```

## 🧪 Testing

### Test Structure

- **Unit Tests**: Component behavior and utility functions
- **Integration Tests**: User flows and API integration
- **E2E Tests**: Complete user journeys

### Running Tests

```bash
npm test                 # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

## 🚀 Deployment

### Firebase Hosting Setup

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase project
firebase init hosting

# Deploy
npm run deploy
```

### Environment Configuration

- **Development**: Local development with hot reload
- **Production**: Optimized build with Firebase hosting
- **Preview**: Branch-based preview deployments

## 📊 Performance

### Optimization Features

- **Code Splitting**: Route-based lazy loading
- **Bundle Optimization**: Manual chunk splitting
- **Caching**: TanStack Query automatic caching
- **CDN**: Firebase global content delivery

### Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🔒 Security

### Security Features

- **HTTPS Enforcement**: Automatic SSL certificates
- **Content Security Policy**: XSS protection
- **Input Sanitization**: Safe user input handling
- **Security Headers**: Comprehensive security headers

## 📚 Documentation

### Architecture Documentation

- [Architecture Overview](docs/architecture.mdc)
- [Tech Stack Details](docs/tech-stack.mdc)
- [API Integration](docs/api-integration.mdc)
- [Component Documentation](docs/components.mdc)
- [Deployment Guide](docs/deployment.mdc)

### Key Architectural Decisions

1. **TanStack Query**: Chosen for robust data fetching and caching
2. **Suspense**: Declarative loading states for better UX
3. **Context API**: Sufficient for application state management
4. **Firebase Hosting**: Reliable deployment with global CDN
5. **TypeScript**: Type safety and better developer experience

## 🤝 Contributing

### Development Guidelines

1. Follow TypeScript best practices
2. Use meaningful component and variable names
3. Write comprehensive tests
4. Document complex logic
5. Follow the established project structure

### Code Style

- ESLint configuration for code quality
- Prettier for consistent formatting
- TypeScript strict mode enabled
- Conventional commit messages

## 📄 License

This project is created as a technical demonstration of modern React development practices.

## 🆘 Support

For questions or issues:

1. Check the documentation in the `docs/` folder
2. Review the component examples
3. Check the API integration guide
4. Contact the development team

---

**Built with modern React patterns and best practices**
# quiz-app
