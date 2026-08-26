# career.AI 🚀

An AI-powered career development platform that helps professionals craft compelling cover letters and stay ahead with real-time industry insights — all personalized to your field.

---

## ✨ Features

- **Cover Letter Generator** — Create tailored cover letters for specific companies and job titles with one click.
- **Industry Insights Dashboard** — Access weekly-updated salary ranges, market outlook, growth rates, top skills, and key trends for your industry.
- **Personalized Onboarding** — Set your industry, experience level, and skills so every feature adapts to your professional profile.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | JavaScript |
| Styling | Tailwind CSS + shadcn/ui |
| Auth | Clerk |
| AI | Google Gemini API |
| Database | PostgreSQL via Prisma ORM |
| Background Jobs | Inngest (weekly industry insight updates) |
| Charts | Recharts |

---


## 🗃️ Database Models

| Model | Description |
|---|---|
| `User` | Stores profile, industry, skills, and experience |
| `CoverLetter` | Generated cover letters tied to company and job title |
| `IndustryInsight` | Weekly-refreshed salary, trends, and market data per industry |

---

## ⚙️ Background Jobs

Industry insights are automatically refreshed **every week** using Inngest. The job fetches all tracked industries, calls the Gemini API for up-to-date analysis, and stores structured data including salary ranges, top skills, growth rates, and market outlook.

---

## 📦 Key Dependencies

- [`@clerk/nextjs`](https://clerk.com/docs/nextjs) — Authentication
- [`@google/generative-ai`](https://ai.google.dev/) — Gemini AI integration
- [`@prisma/client`](https://www.prisma.io/) — Database ORM
- [`inngest`](https://www.inngest.com/) — Background job scheduling
- [`recharts`](https://recharts.org/) — Performance analytics charts
- [`@uiw/react-md-editor`](https://uiwjs.github.io/react-md-editor/) — Markdown cover letter editor
- [`shadcn/ui`](https://ui.shadcn.com/) — UI components


> Built with ❤️ by [codeby-riya](https://github.com/codeby-riya)
