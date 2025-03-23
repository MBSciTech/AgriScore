# AgriScore - Alternative Credit Evaluation Tool for Farmers

AgriScore is a modern web application designed to provide alternative credit evaluation solutions for farmers. It uses comprehensive data analysis including soil health, weather patterns, and market trends to assess farmers' creditworthiness.

## 🌟 Features

### For Farmers
- **Alternative Credit Evaluation**: Get credit scores based on multiple data points beyond traditional financial metrics
- **Real-time Weather Integration**: Access weather forecasts and climate risk assessments
- **Soil Health Analysis**: Track and analyze soil quality metrics
- **Historical Performance Tracking**: Monitor credit score trends over time
- **Personalized Recommendations**: Receive actionable insights to improve creditworthiness

### For Lenders
- **Data-Driven Risk Assessment**: Make informed lending decisions using comprehensive data
- **Automated Evaluation Process**: Streamline credit assessment workflows
- **Portfolio Management**: Better manage agricultural loan portfolios
- **Risk Mitigation**: Reduce default rates through predictive analytics

## 🛠️ Technology Stack

- **Frontend Framework**: Next.js 14 with App Router
- **UI Components**: 
  - Shadcn/ui for modern, accessible components
  - Tailwind CSS for styling
  - Framer Motion for animations
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Charts**: Recharts and Chart.js
- **Weather API**: OpenWeather API
- **State Management**: React Context API

## 📋 Prerequisites

- Node.js 18.x or later
- npm or yarn
- Supabase account
- OpenWeather API key

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/agriscore.git
   cd agriscore
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## 📁 Project Structure

```
agriscore/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── dashboard/         # Dashboard pages
│   ├── credit-analysis/   # Credit analysis pages
│   └── credit-evaluation/ # Credit evaluation pages
├── components/            # React components
│   ├── ui/               # UI components
│   └── shared/           # Shared components
├── lib/                   # Utility functions and configurations
├── public/               # Static assets
└── styles/              # Global styles
```

## 🔑 Key Components

### Authentication
- Email/password authentication
- Protected routes
- Session management
- Password reset functionality

### Credit Analysis
- Credit score visualization
- Historical performance tracking
- Weather risk assessment
- Soil health metrics
- Market trend analysis

### Credit Evaluation
- Multi-step evaluation form
- Real-time data validation
- Progress tracking
- Form state management

## 🎨 UI/UX Features

- Responsive design for all devices
- Dark/light mode support
- Smooth animations and transitions
- Accessible components
- Loading states and error handling
- Toast notifications for user feedback

## 🔒 Security Features

- Secure authentication flow
- Protected API routes
- Environment variable protection
- Input validation and sanitization
- Rate limiting
- CSRF protection

## 📊 Database Schema

### Tables
- `users`: User profiles and authentication
- `farmers`: Farmer-specific information
- `credit_evaluations`: Credit evaluation records
- `historical_data`: Historical performance data
- `weather_data`: Weather and climate information

## 👥 Contributors

### Core Team
- [Rahul Sharma](https://github.com/rahulsharma) - Frontend Developer & UI/UX Designer
- [Priya Patel](https://github.com/priyapatel) - Backend Developer & Database Architect
- [Amit Kumar](https://github.com/amitkumar) - Full Stack Developer & API Integration
- [Neha Gupta](https://github.com/nehagupta) - Data Scientist & Analytics Expert
- [Arun Singh](https://github.com/arunsingh) - DevOps Engineer & Security Specialist

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Supabase](https://supabase.com/) for backend services
- [Shadcn/ui](https://ui.shadcn.com/) for UI components
- [OpenWeather](https://openweathermap.org/) for weather data
