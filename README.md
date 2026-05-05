<div align="center">
<h1>DevQuiz</h1>
<h3>AI-Powered Web Development Quiz App</h3>

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Groq](https://img.shields.io/badge/Groq-AI-ff69b4.svg)](https://groq.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ecf8e.svg)](https://supabase.io/)

</div>

An interactive web development quiz application powered by **Groq AI** (Llama 3.1). Test your knowledge across multiple programming languages and web technologies with dynamically generated questions, track your scores on the leaderboard, and access curated study resources.

<img width="1366" height="640" alt="image" src="https://github.com/user-attachments/assets/205f4d7c-c95a-49e9-b828-5d5641261013" />

## 🚀 Features
- **AI-Generated Questions**: Each quiz is uniquely generated using Groq's Llama 3.1 model.
- **Multiple Topics**: HTML, CSS, JavaScript, React, TypeScript, Vue.js, Node.js, Python, Java, PHP, Ruby, Go, SQL, MongoDB, PostgreSQL, MySQL, Firebase.
- **Difficulty Levels**: Easy, Medium, and Hard questions.
- **Adjustable Timer**: Choose between 30, 60, or 90 seconds per question.
- **Study Resources**: Curated learning materials (tutorials, docs, examples) from W3Schools, MDN, and official docs.
- **Leaderboard**: Track top scores across all topics (only highest score per user/topic).
- **Detailed Explanations**: AI-generated explanations for each answer.
- **Perfect Score Celebration**: Confetti animation when you get 5/5 correct.
- **Responsive Design**: Works seamlessly on desktop and mobile.

## 🛠️ Tech Stack
- **Frontend**: JavaScript, React 19, React Router DOM 7.
- **Styling**: Custom CSS with modern animations.
- **AI Integration**: Groq Cloud (Llama 3.1 8B Instant).
- **Database**: Supabase (PostgreSQL).
- **Icons**: Emoji-based (no external dependencies).
- **Build Tool**: Create React App.

## 📋 Prerequisites
- Node.js (v18 or higher).
- npm or yarn.
- Groq API key (free tier available at [console.groq.com](https://console.groq.com)).
- Supabase account (free tier) for leaderboard functionality.

## 🔧 Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/siseko-D/DevQuiz.git
   cd DevQuiz
   ```
   
2. **Install dependencies**
   ```bash
   npm install
   ```
   
3. **Get a Groq API key**
   ```bash
   Visit console.groq.com
   Sign up or log in
   Navigate to API Keys
   Click "Create API Key"
   Copy your key
   ```
   
4. **Set up Supabase**
- Create a project at supabase.com
- Create a quiz_history table with the following schema:
   ```bash
   CREATE TABLE quiz_history (
   id SERIAL PRIMARY KEY,
   username TEXT NOT NULL,
   topic TEXT NOT NULL,
   difficulty TEXT NOT NULL,
   score INTEGER NOT NULL,
   total_questions INTEGER NOT NULL,
   percentage FLOAT NOT NULL,
   created_at TIMESTAMP DEFAULT NOW()
   );
   ```
   
5. **Create a `.env` file**
   - In the project root add:
     ```bash
     REACT_APP_GROQ_API_KEY=your_groq_api_key_here
     REACT_APP_SUPABASE_URL=your_supabase_project_url
     REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

6. **Start the development server**
   ```bash
   npm start
   ```

7. **Open http://localhost:3000 in your browser** to begin using the app.

## 🏗️ Project Structure
```bash
DevQuiz/
├── public/                                # Static files
├── src/                                    
│   ├── components/                        
│   │   ├── About.jsx                      # About page with project info
│   │   ├── Footer.jsx                     # App footer
│   │   ├── Leaderboard.jsx                # Leaderboard with topic filters
│   │   ├── Navbar.jsx                     # Navigation bar
│   │   ├── Study.jsx                      # Study resources landing page
│   │   ├── StudyTopic.jsx                 # Topic-specific resource links
│   │   └── QuizApp/                       # Quiz feature (modular)
│   │       ├── QuizApp.jsx                # Main quiz orchestrator
│   │       ├── useQuizLogic.js            # Core quiz state & AI logic
│   │       ├── useSaveScore.js            # Supabase integration
│   │       ├── StartScreen.jsx            # Welcome screen
│   │       ├── TopicSelection.jsx         # Topic picker by category
│   │       ├── DifficultySelection.jsx    # Difficulty picker
│   │       ├── QuizQuestion.jsx           # Question display with timer
│   │       ├── QuizResults.jsx            # Score & explanations
│   │       ├── LoadingSkeleton.jsx        # Question-shaped skeleton loader
│   │       ├── UsernameModal.jsx          # Username input popup
│   │       ├── ExplanationModal.jsx       # Detailed answer popup
│   │       ├── ConfirmModal.jsx           # Confirmation dialogs
│   │       └── TimerSettingsModal.jsx     # Timer customization
│   ├── styles/                            # All CSS files
│   │   ├── index.css                      # Global styles & resets
│   │   ├── App.css                        # App-wide styles
│   │   ├── navbar.css                     # Navigation styles
│   │   ├── footer.css                     # Footer styles
│   │   ├── quiz.css                       # Quiz-specific styles
│   │   ├── study.css                      # Study page styles
│   │   ├── about.css                      # About page styles
│   │   ├── modal.css                      # Modal popup styles
│   │   └── leaderboard.css                # Leaderboard styles
│   ├── App.jsx                            # Main app with routing
│   ├── index.js                           # Entry point
│   ├── reportWebVitals.js                 # Performance monitoring
│   └── supabaseClient.js                  # Supabase configuration
├── .env                                   # Environment variables (not committed)
├── .gitignore                             # Git ignore file
└── package.json                           # Dependencies
```

### 📦 Key components
- **Navbar.js** & **Footer.js** – navigation bar and footer, memoized with `React.memo`.
- **QuizApp.js** – quiz logic (AI/fallback questions, timer, scoring, results, PDF export).
- **Study.js** – study overview page directing users to specific topics.
- **StudyTopic.js** – topic‑specific resource links and descriptions.
- **About.js** – project information, acknowledgments and links.

## 🎯 Usage
**Taking a Quiz**
1. Click **Start Quiz** on the home page.
2. **Adjust timer (optional)** - choose 30, 60, or 90 seconds per question.
3. **Select a topic** - organized by Frontend, Backend, and Databases.
4. **Choose difficulty**- Easy, Medium, or Hard.
5. **Answer 5 AI-generated questions** before the timer runs out.
6. **View detailed results** with explanations for each answer.
7. **Save your score** to the leaderboard with a username.
8. **Get explanations** by clicking the "Explain This Answer" button.

**Study Resources**
- Navigate to the Study page.
- Browse topics by category (Frontend, Backend, Databases).
- Click any topic for curated learning resources:
   - Tutorials (W3Schools, official guides).
   - Documentation (MDN, official docs).
   - Code examples and practice materials.

**Leaderboard**
- Automatically tracks highest scores per username per topic.
- Filter by topic or view all.
- Only your best score for each topic is saved.
- Top scores displayed with medals (🥇🥈🥉).

## 🎨 Features in Detail
**Adjustable Timer**
- Choose your pace: 30s (fast), 60s (standard), or 90s (relaxed).
- Visual circular countdown changes color as time runs out.
- Settings persist across quiz sessions.

**AI Question Generation**
- Uses Groq's Llama 3.1 8B model for contextual questions.
- Questions adapt to selected topic and difficulty.
- Randomized with seed for variety each time.
- Automatic fallback if API fails.

**Perfect Score Celebration**
- Confetti burst animation when you score 5/5.
- Special "PERFECT SCORE" banner.

**Smart Leaderboard**
- Stores only highest score per username/topic combination.
- Prevents score spam by checking against existing records.
- Shows medal emojis for top 3 positions.

## ⚡ Performance Optimizations
- React.memo on Navbar and Footer to prevent unnecessary re-renders.
- Custom hooks (useQuizLogic, useSaveScore) for clean code separation.
- Lazy loading for modals and heavy components.
- CSS animations with GPU acceleration.
- Skeleton loading for better perceived performance.

## 🚀 Deployment
Build for production
```bash
npm run build
```

## Deploy to Netlify
- Push to GitHub.
- Import project to Netlify.
- Build command: npm run build
- Publish directory: build
- Add environment variables in Netlify dashboard.

## 🤝 Contributing
- Contributions are welcome! Please feel free to submit a Pull Request.
- Fork the repository.
- Create your feature branch (git checkout -b feature/AmazingFeature).
- Commit your changes (git commit -m 'Add some AmazingFeature').
- Push to the branch (git push origin feature/AmazingFeature).
- Open a Pull Request.

## 📝 License
- This project is licensed under the ISC License.

## 🙏 Acknowledgments
- Groq for providing ultra-fast AI inference.
- Supabase for the open-source Firebase alternative.
- Llama 3.1 by Meta for powering question generation.
- Create React App for the build tooling.

## ⚠️ Troubleshooting
**Q: App won't start**
- Run `npm install` to ensure all dependencies are installed
- Delete `node_modules` and `package-lock.json`, then reinstall
- Check Node.js version (requires v18+)

**Q: AI questions aren't generating**
- Verify `REACT_APP_GROQ_API_KEY` is set correctly in `.env`
- Check your Groq API key has quota remaining.
- Ensure the Groq API is accessible from your region.

**Q: Leaderboard not showing scores**
- Verify Supabase environment variables are set.
- Check Supabase table quiz_history exists with correct schema.
- Ensure row-level security (RLS) is configured properly.
