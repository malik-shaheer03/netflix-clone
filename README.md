# 🎬 Netflix Clone – Production-Ready UI with Real-Time Data & Auth Integration

<div align="center">
  <img src="https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js Badge"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Badge"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS Badge"/>
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase Badge"/>
  <img src="https://img.shields.io/badge/TMDB_API-01B4E4?style=for-the-badge&logo=themoviedatabase&logoColor=white" alt="TMDB API Badge"/>
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel Badge"/>
  
  **A pixel-perfect Netflix clone with real-time data integration and secure authentication** 🍿
  
  [🌐 Live Demo](https://netflix-clone-5bu7.vercel.app/) • [Features](#-key-highlights) • [Tech Stack](#️-tech-stack) • [Installation](#-installation)
</div>

## 🚀 About

I wanted to push my front-end development skills by building something real, polished, and engaging — so I built a **pixel-perfect Netflix clone** using a modern tech stack.

This project replicates the user experience of Netflix with real-time data from TMDB and secure Firebase authentication — a perfect demonstration of UI/UX precision, API integration, and performance optimization.

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with server-side rendering and routing for SEO and speed |
| **TypeScript** | Type-safe development for maintainable and scalable code |
| **Tailwind CSS** | Utility-first styling for responsive and clean UI design |
| **Firebase Auth** | Secure user registration, login, and session persistence |
| **TMDB API** | Real-time integration of trending movies and TV shows |
| **Vercel** | Lightning-fast deployment with built-in CI/CD and edge caching |

## ✨ Key Highlights

### 🎨 User Interface & Experience
- ✅ **Authentic Netflix UI** with smooth transitions and hover animations
- ✅ **Multi-page routing**: Home, Movies, TV Shows, New & Popular, My List
- ✅ **Search functionality** with real-time results
- ✅ **Movie/show modals** featuring trailers, episodes, and recommendations
- ✅ **Kids profile** interface with a playful design
- ✅ **Responsive layout** for desktop, tablet, and mobile

### 🔥 Functionality & Features
- ✅ **Watchlist feature** with local storage persistence
- ✅ **Real-time data** from TMDB API for trending content
- ✅ **Secure authentication** with Firebase Auth
- ✅ **Performance optimizations**: Lazy loading, image compression, and efficient data fetching

### 🌐 SEO & Performance
- Server-side rendering for improved indexing and load times
- Semantic HTML and optimized meta tags for better visibility
- Mobile-first responsive design with high accessibility
- Fast global performance through Vercel's CDN and edge network

## 🚀 Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- Firebase project for authentication
- TMDB API key

### Quick Start
```bash
# Clone the repository
git clone https://github.com/yourusername/netflix-clone.git
cd netflix-clone

# Install dependencies
npm install
# or
yarn install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id

# TMDB API
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
```

### Run the Application
```bash
# Development server
npm run dev
# or
yarn dev

# Production build
npm run build
npm start
```

Visit `http://localhost:3000` to see the application.

## 📱 Features Overview

### 🏠 Home Page
- Hero section with featured content
- Multiple content rows (Trending, Popular, etc.)
- Smooth carousel navigation
- Responsive grid layout

### 🔍 Search & Discovery
- Real-time search with debounced API calls
- Filter by movies, TV shows, and genres
- Infinite scroll pagination
- Search history persistence

### 👤 User Authentication
- Sign up/Sign in with email and password
- Password reset functionality
- Protected routes and session management
- User profile customization

### 🎭 Content Details
- Modal-based detail views
- Trailer integration with YouTube API
- Cast and crew information
- Similar content recommendations
- Add to watchlist functionality

## 🎯 Why I Built This

To master front-end architecture, third-party API integration, user authentication, and responsive design — all while recreating a real-world platform that millions of users interact with daily.

## 📊 Performance Metrics

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Mobile Responsiveness**: 100%

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing the movie data API
- [Netflix](https://www.netflix.com/) for the original design inspiration
- [Firebase](https://firebase.google.com/) for authentication services
- [Vercel](https://vercel.com/) for seamless deployment

## 📧 Contact

**Muhammad Shaheer Malik**

- 🌐 [Portfolio](https://shaheer-portfolio-omega.vercel.app/)
- 💼 [LinkedIn](https://linkedin.com/in/malik-shaheer03)
- 🐙 [GitHub](https://github.com/malik-shaheer03)
- 📧 [Email](mailto:shaheermalik03@gmail.com)

---

<div align="center">
  <strong>Made with ❤️ and lots of ☕</strong>
  <br><br>
  ⭐ If you found this project useful, please consider giving it a star!
  <br><br>
  <strong>🔗 Live Demo:</strong> <a href="https://netflix-clone-5bu7.vercel.app/">https://netflix-clone-5bu7.vercel.app/</a>
</div>

## 📌 Tags
`#NetflixClone` `#NextJS` `#TypeScript` `#TailwindCSS` `#Firebase` `#TMDB` `#WebDevelopment` `#FrontendDevelopment` `#ReactJS` `#ModernWebDev` `#ResponsiveDesign` `#UIDesign` `#PersonalProject` `#DeveloperPortfolio`
