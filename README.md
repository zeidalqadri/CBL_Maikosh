# CBL_maikosh - Basketball Coaching Level I Web Application

A comprehensive web application for the MABA/NSC Basketball Coaching Level I curriculum with 12 interactive learning modules.

## Overview

CBL_maikosh is a modern, interactive learning platform designed to deliver the MABA/NSC Basketball Coaching Level I curriculum. The application features 12 comprehensive modules covering all aspects of basketball coaching fundamentals, from coaching philosophy and communication to technical skills and strategy.

### Key Features

- **Comprehensive Content**: 12 in-depth modules covering all aspects of basketball coaching fundamentals
- **Interactive Learning**: Quizzes, diagrams, and practical exercises to reinforce knowledge
- **Progress Tracking**: Monitor advancement through modules with detailed progress analytics
- **File Upload**: Submit coaching philosophy statements and practical assignments
- **Module-Specific Themes**: Unique visual identity for each module
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Accessibility**: WCAG 2.1 AA compliant for inclusive access

## Technology Stack

- **Frontend**: React.js with Next.js
- **Styling**: Tailwind CSS
- **Authentication**: Auth0
- **Database**: Firebase Firestore
- **File Storage**: Google Cloud Storage
- **Deployment**: Google Cloud Run
- **CI/CD**: Google Cloud Build

## Modules

1. **Introduction to Coaching**: Learn the fundamental roles, styles, and philosophies of effective basketball coaching
2. **Rules & Player Positions**: Master the official rules and understand the roles of each position on the court
3. **Violations**: Understand basketball violations and how to teach players to avoid them
4. **Fouls & Official Signals**: Learn about different types of fouls and the official signals used by referees
5. **Equipment & Court**: Learn about basketball equipment, court dimensions, and optimal training environments
6. **Basic Skills — Movement & Ball Handling**: Master the fundamental movement patterns and ball handling skills
7. **Dribbling Skills**: Develop effective dribbling techniques and learn how to teach ball control to players
8. **Shooting & Rebounding**: Master shooting mechanics and rebounding techniques to improve scoring efficiency
9. **Strategy & Tactics**: Learn offensive and defensive strategies to improve team performance on the court
10. **Coaching Communication & Ethics**: Develop effective communication skills and understand ethical coaching practices
11. **Planning Training Schedules**: Create effective practice plans and training schedules for basketball teams
12. **Introduction to Sports Science**: Understand the scientific principles behind athletic performance and injury prevention

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Google Cloud account (for deployment)
- Firebase account
- Auth0 account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-organization/CBL_maikosh.git
   cd CBL_maikosh
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your credentials
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

### Google Cloud Run Deployment

1. Install Google Cloud SDK and authenticate:
   ```bash
   gcloud auth login
   gcloud config set project cbl-maikosh
   ```

2. Build and deploy to Cloud Run:
   ```bash
   # Build the container
   gcloud builds submit --tag gcr.io/cbl-maikosh/cbl-maikosh-app

   # Deploy to Cloud Run
   gcloud run deploy cbl-maikosh-app \
     --image gcr.io/cbl-maikosh/cbl-maikosh-app \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

### Continuous Deployment

The project includes a `cloudbuild.yaml` file for setting up continuous deployment with Google Cloud Build. Connect your GitHub repository to Cloud Build to enable automatic deployments on code changes.

## Project Structure

```
CBL_maikosh/
├── public/                     # Static assets
├── src/
│   ├── components/             # Reusable UI components
│   ├── contexts/               # React contexts
│   ├── config/                 # Configuration files
│   ├── hooks/                  # Custom React hooks
│   ├── layouts/                # Page layout components
│   ├── pages/                  # Application pages
│   │   ├── modules/            # Module pages
│   │   └── api/                # API routes
│   ├── styles/                 # Global styles
│   └── utils/                  # Utility functions
├── .env.local                  # Environment variables
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── package.json                # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Acknowledgments

- MABA/NSC for the basketball coaching curriculum
- All contributors who have helped enhance this learning platform