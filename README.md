[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=react-router&logoColor=white)](https://reactrouter.com/)

# Web Dev Quiz App
An interactive web development quiz application powered by Google's Gemini AI. Test your knowledge across multiple programming languages and web technologies with dynamically generated questions.

<img width="1887" height="898" alt="image" src="https://github.com/user-attachments/assets/d0995414-713f-4aa3-b2d9-97d9c4a4f3fa" />

## 🚀 Features

- **AI-Generated Questions**: Each quiz is uniquely generated using Google's Gemini AI (falls back to built-in topic‑aware samples if generation fails)
- **Multiple Topics**: HTML, CSS, JavaScript, React, Python, Java, and more
- **Difficulty Levels**: Easy, Medium, and Hard questions
- **Timed Challenges**: 60-second timer per question
- **Study Resources**: Curated learning materials for each topic
- **Performance Tracking**: Detailed quiz results and explanations
- **PDF Export**: Download a styled PDF of your quiz report from the results screen

## 🛠️ Tech Stack

- **Frontend**: React 19, React Router DOM 7
- **Styling**: Custom CSS
- **AI Integration**: Google Generative AI (Gemini)
- **Icons**: Lucide React
- **Build Tool**: Create React App

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API key (free)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/web-dev-quiz.git
   cd web-dev-quiz
   ```
   
2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Get a Google Gemini API key**
   - Visit Google AI Studio.
   - Sign in with your Google account.
   - Click "Create API Key".
   - Copy the key.

4. **Create a `.env` file**
   - In the project root add:
     ```bash
      REACT_APP_GOOGLE_API_KEY=your_api_key_here
     ```
   - The `.env` file is ignored by Git (see `.gitignore`), so your key stays private.
   - Restart the dev server if it’s already running so the new variable is picked up.

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Open http://localhost:3000 in your browser** to begin using the app.

## 🏗️ Project Structure

*(navigation bar and footer live under `src/components` and are
memoized with `React.memo` so they don’t re-render on every state change.)*

**Study resources** now point directly to the selected topic’s tutorial,
reference and example pages on W3Schools/MDN instead of generic homepages.

```bash
web-dev-quiz/
├── public/                  # Static files
│   ├── index.html           # Main HTML file
│   ├── favicon.ico          # Browser icon
│   ├── manifest.json        # PWA manifest
│   └── logo*.png            # App icons
├── src/                      # Source code
│   ├── components/           # Reusable components (navbar, footer, etc.)
│   ├── styles/               # CSS styles
│   │   ├── App.css           # Main app styles
│   │   └── index.css         # Global styles
│   ├── App.js                # Main application
│   ├── index.js              # Entry point
│   └── reportWebVitals.js    # Performance monitoring
├── .env                      # Environment variables
├── .gitignore                # Git ignore file
├── package.json              # Dependencies
├── README.md                 # This file
├── check-models.js           # Utility to check available models
└── test-ai.js                # Test script for AI
```

### 📦 Key components
- **Navbar.js** & **Footer.js** – navigation bar and footer, memoized with `React.memo`.
- **QuizApp.js** – quiz logic (AI/fallback questions, timer, scoring, results, PDF export).
- **Study.js** – study overview page directing users to specific topics.
- **StudyTopic.js** – topic‑specific resource links and descriptions.
- **About.js** – project information, acknowledgments and links.

## 🎯 Usage
- **Start a Quiz**: Click "Start Quiz" on the home page
- **Select Topic**: Choose from HTML, CSS, JavaScript, React, Python, or Java
- **Choose Difficulty**: Pick Easy, Medium, or Hard
- **Answer Questions**: You have 60 seconds per question
- **View Results**: See your score and correct answers with explanations
- **Download PDF**: On the results screen hit "Download PDF" to print or save a styled report (this uses the browser print dialog with a special print stylesheet).

## 🧪 Testing AI Models
- You can test which Gemini models are available with:
```bash
node check-models.js YOUR_API_KEY
```

## Test a simple AI generation with:
```bash
node test-ai.js
```
## 🚀 Deployment
- Build for production
```bash
npm run build
```
## Deploy to Netlify
- Push to GitHub
- Import project to Netlify
- Build command: npm run build
- Publish directory: build
- Add environment variable

## 🤝 Contributing
- Contributions are welcome! Please feel free to submit a Pull Request.
- Fork the repository
- Create your feature branch (git checkout -b feature/AmazingFeature)
- Commit your changes (git commit -m 'Add some AmazingFeature')
- Push to the branch (git push origin feature/AmazingFeature)
- Open a Pull Request

## 📝 License
- This project is licensed under the ISC License.

## 🙏 Acknowledgments
- Google Gemini AI for providing the AI capabilities
- Lucide for the beautiful icons
- Create React App for the build setup

## ⚠️ Troubleshooting
**Q: AI questions aren't generating**
- A: Verify that `REACT_APP_GOOGLE_API_KEY` is set in your `.env`, that it’s valid, and that the Generative Language API is enabled for that key

**Q: 404 or 503 errors with Gemini models**
- A: The app automatically retries several current models (`gemini-2.5-flash`, `gemini-2.5-pro`, `gemini-2.0-flash`, etc.). Run `node check-models.js YOUR_API_KEY` to list models your key can access. Temporary service outages are normal – either wait and try again or use the built-in fallback questions.

**Q: App won't start**
- A: Run npm install to ensure all dependencies are installed
