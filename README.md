# ScholarAI - AI-Powered Research Assistant

A powerful web-based research assistant that lets users ask scholarly questions and receive instant, cited answers from 200M+ academic papers. Built for the **Veritus AI Hackathon**.

## Features

- **Natural Language Search**: Ask any research question in plain English
- **AI-Powered Answers**: Get comprehensive answers synthesized from academic literature
- **Source Citations**: Every answer includes citations to peer-reviewed papers
- **Interactive Follow-ups**: Explore related questions suggested by the AI
- **PDF Document Q&A**: Upload research papers and ask questions about them
- **Save to Notes**: Bookmark interesting findings for later reference
- **Twitter Sharing**: One-click sharing to promote your discoveries
- **User Analytics**: Track unique visitors (goal: 69 users!)

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js (Twitter OAuth + Guest login)
- **API**: Veritus Search API (200M+ papers)
- **State Management**: Zustand
- **UI Components**: Lucide React icons, React Hot Toast

## Architecture

```
scholar-ai/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── search/        # Veritus search endpoint
│   │   │   ├── track/         # User tracking
│   │   │   ├── analytics/     # Stats endpoint
│   │   │   ├── notes/         # Notes CRUD
│   │   │   └── auth/          # NextAuth handlers
│   │   ├── auth/              # Auth pages
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── Header.tsx
│   │   ├── SearchBar.tsx
│   │   ├── SearchResult.tsx
│   │   ├── StatsCounter.tsx
│   │   ├── HistoryPanel.tsx
│   │   ├── NotesPanel.tsx
│   │   ├── PDFUpload.tsx
│   │   └── ...
│   ├── lib/                   # Core libraries
│   │   ├── prisma.ts          # Database client
│   │   ├── veritus.ts         # Veritus API client
│   │   ├── store.ts           # Zustand store
│   │   └── auth.ts            # NextAuth config
│   └── hooks/                 # Custom React hooks
│       └── useFingerprint.ts  # User tracking
├── prisma/
│   └── schema.prisma          # Database schema
└── public/                    # Static assets
```

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Veritus API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/scholar-ai.git
   cd scholar-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your API keys:
   ```env
   VERITUS_API_KEY=your-veritus-api-key
   NEXTAUTH_SECRET=your-secret-key
   # Optional:
   TWITTER_CLIENT_ID=your-twitter-client-id
   TWITTER_CLIENT_SECRET=your-twitter-client-secret
   OPENAI_API_KEY=your-openai-key
   ```

4. **Initialize the database**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Endpoints

### `POST /api/search`
Search for research answers using Veritus API.

**Request:**
```json
{
  "query": "What are recent advances in CRISPR?",
  "userId": "optional-user-id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "answer": "CRISPR gene editing has...",
    "sources": [
      {
        "title": "Precision base editing...",
        "authors": ["Liu, D.R."],
        "year": 2024,
        "url": "https://doi.org/..."
      }
    ],
    "relatedQuestions": ["..."]
  }
}
```

### `POST /api/track`
Track unique user visits.

### `GET /api/analytics`
Get current user and search statistics.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | SQLite database path |
| `VERITUS_API_URL` | Yes | Veritus API base URL |
| `VERITUS_API_KEY` | Yes | Your Veritus API key |
| `NEXTAUTH_URL` | Yes | Your app URL |
| `NEXTAUTH_SECRET` | Yes | Random secret for sessions |
| `TWITTER_CLIENT_ID` | No | Twitter OAuth client ID |
| `TWITTER_CLIENT_SECRET` | No | Twitter OAuth secret |
| `OPENAI_API_KEY` | No | For enhanced answer synthesis |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Add environment variables in project settings
4. Deploy!

### Other Platforms

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Hackathon Goals

- [x] Integrate Veritus Search API
- [x] Build beautiful, responsive UI
- [x] Implement source citations
- [x] Add Twitter sharing
- [x] Track 69 unique users
- [x] PDF document Q&A
- [x] User authentication
- [x] Save notes feature

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is built for the Veritus AI Hackathon.

## Acknowledgments

- [Veritus AI](https://veritus.ai) - For the powerful Search API
- [Next.js](https://nextjs.org) - The React framework
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- [Framer Motion](https://framer.com/motion) - Animation library

---

Built with love for the Veritus AI Hackathon 2024

**#VeritusAI #AcademicSearch #ResearchAI**
