# Amazing Scientists Throughout History Flashcard App UI

This application is a React Vite Bootstrap CSS frontend UI that serves as a study aid that presents accomplishments and life span years for a famous scientists through history and then present up to 5 scientists for the user to pick from. The scientist data is fetched from a REST API described in the file amazing-scientists-backend-api-spec.json.

## Features

- **Interactive Quiz Interface**: Beautiful, responsive UI built with React and Bootstrap CSS
- **Flashcard-style Questions**: Shows scientist accomplishments and lifespan, asks user to identify the scientist
- **Multiple Choice Answers**: Up to 5 scientist options per question
- **Score Tracking**: Real-time score display with progress bar
- **Game Completion**: 10 questions per game with final score summary
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Error Handling**: Graceful error handling with retry functionality

## Technology Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Bootstrap 5.3** for responsive styling
- **Axios** for API communication
- **Modern CSS** with custom animations and gradients

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- A running instance of the Amazing Scientists API (see API specification in `amazing-scientists-backend-api-spec.json`)

### Installation

1. Clone the repository or ensure you're in the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

The application is configured to connect to the API at `http://localhost:8000`. If your API is running on a different port or host, update the `API_BASE_URL` in `src/services/api.ts`.

### Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. Make sure your Amazing Scientists API is running and accessible

### Building for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # React components
│   ├── Quiz.tsx        # Main quiz component
│   ├── QuizCard.tsx    # Individual quiz question card
│   ├── ScoreBoard.tsx  # Score display and game controls
│   └── LoadingSpinner.tsx # Loading state component
├── services/           # API services
│   └── api.ts         # Axios API client and scientist service
├── types/             # TypeScript type definitions
│   └── scientist.ts   # Scientist-related types
├── App.tsx            # Main app component
├── main.tsx          # Application entry point
└── index.css         # Global styles and animations
```

## API Integration

The application integrates with the Amazing Scientists API using the following endpoints:

- `GET /scientists` - Fetch paginated list of scientists
- `GET /scientists/{id}` - Get specific scientist details
- `GET /scientists/search` - Search scientists by name or accomplishments

## How to Play

1. **Read the Clues**: Each question shows you a scientist's accomplishments and lifespan
2. **Choose Your Answer**: Select from up to 5 scientist names
3. **Get Immediate Feedback**: See if you're correct or incorrect right away
4. **Track Your Progress**: Watch your score and progress through 10 questions
5. **Play Again**: Start a new game anytime to improve your score

## Features in Detail

### Quiz Mechanics
- 10 questions per game
- 5 multiple choice options per question
- Immediate feedback on answers
- 2-second delay before next question
- Final score summary with performance ratings

### Responsive Design
- Mobile-first approach with Bootstrap grid system
- Custom CSS animations and hover effects
- Gradient backgrounds and modern UI elements
- Accessible design with proper ARIA labels

### Error Handling
- Network error detection and display
- Retry functionality for failed API calls
- Loading states for better user experience
- Graceful fallbacks for missing data
