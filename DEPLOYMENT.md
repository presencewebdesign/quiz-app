# Firebase Deployment Guide

## Prerequisites

1. **Firebase CLI**: Install Firebase CLI globally

   ```bash
   npm install -g firebase-tools
   ```

2. **Firebase Project**: Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)

## Setup Steps

### 1. Configure Firebase Project

1. Update `.firebaserc` with your actual project ID:

   ```json
   {
     "projects": {
       "default": "your-actual-project-id"
     }
   }
   ```

2. Update `src/config/firebase.ts` with your Firebase configuration:
   ```typescript
   const firebaseConfig = {
     apiKey: "your-actual-api-key",
     authDomain: "your-project-id.firebaseapp.com",
     projectId: "your-actual-project-id",
     storageBucket: "your-project-id.appspot.com",
     messagingSenderId: "your-actual-sender-id",
     appId: "your-actual-app-id",
     measurementId: "your-actual-measurement-id",
   };
   ```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Initialize Firebase (if not already done)

```bash
firebase init hosting
```

Select your project and configure:

- Public directory: `build`
- Single-page app: `Yes`
- Overwrite index.html: `No`

### 4. Build and Deploy

```bash
# Build the project
npm run build

# Deploy to Firebase
npm run deploy

# Or deploy only hosting
npm run deploy:hosting
```

## Configuration Files

- `firebase.json`: Firebase hosting configuration
- `.firebaserc`: Project configuration
- `src/config/firebase.ts`: Firebase SDK configuration

## Deployment Commands

- `npm run deploy`: Build and deploy everything
- `npm run deploy:hosting`: Build and deploy only hosting
- `firebase deploy`: Deploy without building
- `firebase deploy --only hosting`: Deploy only hosting

## Troubleshooting

1. **Build errors**: Run `npm run build` first to check for build issues
2. **Firebase CLI not found**: Install globally with `npm install -g firebase-tools`
3. **Authentication issues**: Run `firebase login` again
4. **Project not found**: Verify project ID in `.firebaserc`

## Environment Variables

If you need environment variables, create a `.env` file:

```
VITE_API_URL=your-api-url
VITE_FIREBASE_API_KEY=your-api-key
```

Then use them in your code with `import.meta.env.VITE_API_URL`
