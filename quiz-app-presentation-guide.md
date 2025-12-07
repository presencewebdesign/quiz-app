# Quiz Application - Interview Presentation Guide

## 1. Application Overview

**What it is**: A modern React TypeScript quiz application for identifying grammatical errors in written text.

**Live Demo**: https://quiz-app-98108.web.app

**Key Features**:

- Two distinct quiz flows (Sequential and Rounds-based)
- Real-time answer validation and feedback
- Intelligent answer generation system
- Comprehensive score calculation
- Responsive, modern UI with progress tracking

## 2. Technical Architecture

### Tech Stack

- **Frontend**: React 18 + TypeScript (type-safe development)
- **Build Tool**: Vite (fast HMR, lightning-fast builds)
- **State Management**: React Context API + useReducer pattern
- **Data Fetching**: TanStack Query v5 (caching, background refetching, suspense)
- **Routing**: React Router v6 (client-side navigation)
- **Styling**: SCSS + CSS Modules (component-scoped styling)
- **Deployment**: Firebase Hosting (global CDN, automatic HTTPS)

### Why These Choices?

- **Vite over CRA**: ~50ms cold start vs 1-3s, better DX
- **TanStack Query**: Automatic caching, optimistic updates, built-in loading states
- **Context + Reducer**: Sufficient for app size, no Redux overhead needed
- **SCSS**: Zero runtime cost, better browser caching vs CSS-in-JS

## 3. Application Structure

### Project Organization

```
src/
├── components/      # Reusable UI components
│   ├── common/     # Button, Loading, ProgressBar
│   └── quiz/       # QuestionCard, AnswerOptions, QuizResult
├── pages/          # Main screens (HomePage, Flow1Quiz, Flow2Quiz, ScorePage)
├── contexts/       # QuizContext (global state management)
├── services/       # quizApiService, quizEngine, queryClient
├── hooks/          # Custom React hooks (useQuiz, useAnswerOptions)
├── types/          # TypeScript type definitions
└── styles/         # Global SCSS variables, mixins
```

### Key Architecture Patterns

1. **Container-Presenter Pattern**: Logic separation from UI
2. **Custom Hooks**: Reusable business logic encapsulation
3. **Unidirectional Data Flow**: Props down, events up
4. **Error Boundaries + Suspense**: Declarative error and loading states

## 4. Data Flow & State Management

### Data Fetching (TanStack Query)

```typescript
// Automatic caching, retry logic, suspense mode
useQuery({
  queryKey: ["quiz-data"],
  queryFn: fetchQuizData,
  staleTime: 5 * 60 * 1000, // 5 minutes
  retry: 3,
  suspense: true,
});
```

### State Management (QuizContext)

```typescript
// Global state using Context + useReducer
interface QuizState {
  userAnswers: Map<string, string>; // Question answers
  currentQuestionIndex: number; // Current position
  currentRound: number; // For Flow 2
}

// Actions: SET_ANSWER, NEXT_QUESTION, NEXT_ROUND, RESET_QUIZ
```

### State Flow

1. User selects answer → `setAnswer(questionId, answer)`
2. Updates `userAnswers` Map → Triggers re-render
3. Navigation → Updates `currentQuestionIndex` or `currentRound`
4. Score calculation → Reads from `userAnswers` Map

## 5. The Two Quiz Flows

### Flow 1: Sequential Questions

**Path**: `/quiz/flow1` → `Flow1Quiz.tsx`

**Behavior**:

- Shows 5 questions sequentially (from `activities[0].questions`)
- Progress bar: "Question X of 5"
- User can navigate forward (not backward)
- After last question → Navigate to score page
- Answer storage key: `question.order.toString()` (e.g., "1", "2", "3")

**Implementation Highlights**:

```typescript
// Simple linear progression
const isLastQuestion = currentQuestionIndex === questions.length - 1;

handleNextQuestion() {
  if (isLastQuestion) {
    navigate("/score", { state: { score, flow: "flow1" } });
  } else {
    nextQuestion();  // Increment index
  }
}
```

### Flow 2: Rounds-based Questions

**Path**: `/quiz/flow2` → `Flow2Quiz.tsx`

**Behavior**:

- Multiple rounds (from `activities[1].questions[round].questions`)
- Each round has multiple questions
- Must complete ALL questions in a round to proceed
- Progress: "Round X of Y - Question X of Y"
- After all rounds → Navigate to score page
- Answer storage key: `${roundIndex}-${question.order}` (e.g., "0-1", "1-2")

**Implementation Highlights**:

```typescript
// Unique answer keys prevent collisions
const uniqueKey = `${currentRound}-${currentQuestion.order}`;

// Check if all questions answered before allowing round progression
const areAllQuestionsInRoundAnswered = () => {
  return currentRoundData.questions.every((q) => {
    const key = `${currentRound}-${q.order}`;
    return userAnswers.has(key);
  });
};
```

## 6. Answer Generation System

### How It Works

Each question in the API has:

- `stimulus`: Text with error (marked with `*asterisks*`)
- `feedback`: Corrected text (marked with `*asterisks*`)

**Example API Data**:

```json
{
  "stimulus": "I really enjoy *to play football* with friends.",
  "feedback": "I really enjoy *playing football* with friends."
}
```

### QuizEngine.generateAnswerOptions()

Creates 4 multiple-choice options:

1. **Correct answer** (from feedback, asterisks removed)
2. **Incorrect answer** (from stimulus, asterisks removed)
3. **2 intelligent alternatives** (pattern-based generation)
4. **Randomized order** (prevents pattern recognition)

**Pattern Recognition Examples**:

- "haven't finished" → generates "didn't finish", "hasn't finished", "won't finish"
- "more cheaper" → generates "cheaper", "more cheap", "most cheap"

### Why This Approach?

- Realistic alternatives (not random gibberish)
- Grammatically related to the error type
- Prevents easy guessing through position
- Educational value - forces understanding

## 7. Score Calculation System

### Centralized Logic (QuizEngine)

```typescript
QuizEngine.calculateScore(
  userAnswers: Map<string, string>,
  questions: Question[]
)
```

### Flow-Specific Handling

**Flow 1**: Simple mapping

- Uses `question.order.toString()` as key
- Direct lookup: `userAnswers.get("1")`, `userAnswers.get("2")`

**Flow 2**: Unique identifier generation

- Problem: Questions across rounds may have duplicate `order` values
- Solution: Generate unique keys `${roundIndex}-${question.order}`
- Prevents answer collisions between rounds

### Score Validation

```typescript
// Extract correct answer from feedback
const correctAnswer = question.feedback.replace(/\*([^*]+)\*/g, "$1");

// Compare with user's selection
if (userAnswer === correctAnswer) {
  correct++;
}

// Return: { correct, total, percentage }
```

## 8. UI/UX Features

### Progress Tracking

- Visual progress bars in both flows
- "Question X of Y" counters
- Round indicators for Flow 2

### Immediate Feedback

- Correct/incorrect indication after answer selection
- Displays correct answer with bold highlighting
- Uses `dangerouslySetInnerHTML` for asterisk-to-bold conversion

### Text Highlighting

```typescript
// Convert *text* to <strong>text</strong>
parseFeedback(feedback: string) {
  return feedback.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');
}
```

### Responsive Design

- Mobile-first approach
- SCSS breakpoints for different screen sizes
- CSS Modules for component-scoped styling

## 9. Code Quality & Best Practices

### TypeScript

- Strict mode enabled (`--strict`)
- Full type coverage (no `any` types)
- Type guards for API data validation
- Interfaces for all data structures

### React Best Practices

- Custom hooks for logic reusability
- Memoization (`useMemo`, `useCallback`) for performance
- Error boundaries for graceful error handling
- Suspense for declarative loading states
- Proper dependency arrays in `useEffect`

### Code Organization

- Separation of concerns (UI, logic, data)
- Component composition over inheritance
- Single Responsibility Principle
- DRY (Don't Repeat Yourself)

### Linting & Formatting

- ESLint with `--max-warnings 0` (zero tolerance)
- Prettier for consistent formatting
- Pre-commit hooks (would be with Husky if configured)

## 10. API Integration

### Data Source

```
https://s3.eu-west-2.amazonaws.com/interview.mock.data/payload.json
```

### Firebase Cloud Function (CORS Proxy)

```
https://us-central1-quiz-app-98108.cloudfunctions.net/getQuizData
```

### Data Normalization

- Type guards validate API responses
- Graceful fallbacks for missing/invalid data
- Runtime validation with `isRecord()`, `isArray()`

### Error Handling

- Automatic retry (3 attempts)
- User-friendly error messages
- Network failure recovery

## 11. Performance Optimizations

### Build Optimization

- Manual chunk splitting (vendor, router, query)
- Tree-shaking for unused code elimination
- Source map disabled in production
- Asset optimization

### Runtime Performance

- Component memoization (`React.memo`)
- Calculation memoization (`useMemo`)
- Callback memoization (`useCallback`)
- Lazy loading with `React.lazy()`

### Caching Strategy

- TanStack Query automatic caching (5 min stale time)
- Background refetching for fresh data
- Query invalidation for precise cache control

## 12. Deployment & DevOps

### Firebase Hosting

- Global CDN for fast content delivery
- Automatic HTTPS/SSL certificates
- Custom domain support
- Atomic deployments (rollback capability)

### Build Process

```bash
npm run build        # TypeScript compile + Vite build
firebase deploy      # Deploy to Firebase Hosting
```

### Environment Configuration

- Development: Local dev server (Vite HMR)
- Production: Optimized build (minified, chunked)

## 13. Interview Talking Points

### Technical Decisions

1. **Why Vite?** - 50x faster than Webpack, modern ESM approach
2. **Why TanStack Query?** - Best-in-class data fetching, caching, DX
3. **Why Context over Redux?** - Right-sizing - Context sufficient for app scale
4. **Why SCSS?** - Zero runtime cost, better caching, designer-friendly

### Problem Solving

1. **Flow 2 Answer Collisions**: Solved with unique key generation `${round}-${order}`
2. **Answer Randomization**: Prevents pattern-guessing, educational value
3. **Intelligent Alternatives**: Pattern-based generation, realistic options
4. **Type Safety**: Full TypeScript coverage, runtime validation

### Scalability Considerations

- Modular architecture (easy to add new question types)
- Extensible flow system (new flows = new components)
- Centralized logic (QuizEngine) for maintainability
- Component reusability across flows

### What You'd Improve

- Add unit/integration tests (Jest, React Testing Library)
- Implement analytics tracking (question difficulty, user patterns)
- Add accessibility features (ARIA labels, keyboard navigation)
- Progressive Web App features (offline support, installable)
- Backend for user authentication and score persistence
- A/B testing for different answer generation strategies

## 14. Demo Flow for Interview

### Suggested Walkthrough

1. **Show live app** - https://quiz-app-98108.web.app
2. **Navigate both flows** - Demonstrate differences
3. **Show code structure** - Explain organization
4. **Deep dive into one feature**:
   - QuizEngine answer generation OR
   - Score calculation with unique identifiers OR
   - TanStack Query caching strategy
5. **Discuss trade-offs** - Why these choices over alternatives
6. **Future enhancements** - What you'd add with more time

### Key Metrics to Mention

- Zero build warnings/errors
- Full TypeScript compliance
- ~50ms cold start (Vite)
- Sub-second page loads
- Mobile-responsive design

## 15. Potential Interview Questions

**Q: Why React over Vue/Angular?**
A: React has largest ecosystem, best job market, concurrent features, and I'm most proficient. For this project, component composition pattern fit well.

**Q: How does the answer generation work?**
A: Extracts correct answer from feedback, incorrect from stimulus, generates 2 intelligent pattern-based alternatives, randomizes order. Ensures realistic, educational options.

**Q: How do you prevent Flow 2 answer key collisions?**
A: Use unique identifiers combining round and question order: `${roundIndex}-${questionOrder}`. Questions in different rounds can have same order but different keys.

**Q: What's your state management strategy?**
A: Context + useReducer for global state (answers, progression), TanStack Query for server state (API data), local state for UI-only concerns. Right-sized - no Redux needed.

**Q: How would you test this?**
A: Unit tests for QuizEngine logic, React Testing Library for components, E2E with Playwright/Cypress for flows, snapshot tests for UI, mock TanStack Query for predictable tests.

**Q: Performance concerns with large datasets?**
A: Virtualization for long question lists, lazy loading flows, code splitting routes, memoization for calculations, pagination for rounds. Current scale is fine.

**Q: Security considerations?**
A: Input sanitization for user data, HTTPS enforcement, Content Security Policy headers, Firebase security rules (if added auth), XSS prevention via dangerouslySetInnerHTML only on controlled data.

---

**Remember**: Focus on demonstrating **understanding of trade-offs**, **problem-solving approach**, and **ability to scale** rather than just listing features.
