# CLAUDE.md: Pratham FLN Hub Development Guide

This guide ensures that all future development on **FLN Hub** remains aligned with its core pedagogical USPs and technical standards.

## 1. Project Vision & USPs
- **USP 1: Level-Based Customized Support**: Every interaction must be scoped to the student's current ASER/FLN level.
- **USP 2: Live AI Dashboards**: Transforming raw data (Uploads/Battles) into natural-language business insights.
- **USP 3: 90-Minute Daily Flow**: Supporting a daily sequence of (Individual Activity → Group Game → 2v2 Battle).

## 2. Technical Architecture
- **Framework**: Next.js 15 (App Router).
- **ORM**: Prisma (PostgreSQL).
- **Authentication**: NextAuth.js (Integrated with School/Admin roles).
- **State Management**: React `useState`/`useEffect` for low-latency field simulations.

## 3. Core Component Patterns

### 3.1 Simulations & Games (`components/games` & `components/simulations`)
- **Single Player**: Use standard interactive state for pedagogical manipulatives (e.g., `BundleBuilder`).
- **Competitive**: Wrap game logic in the `CompetitiveArena` component to handle 2v2 matches, timers, and scoring.

### 3.2 2v2 Battle Logic
- **Matching Rule**: Students must be within the **same literacy/numeracy level** to compete.
- **Randomization**: Use a server-side randomizer to pick 2 students from the selected school/class pool.
- **Data Closure**: Every battle win MUST be recorded in the `BattleRecord` table to feed the longitudinal dashboard.

## 4. UI/UX Standards (Field-Ready)
- **Touch Targets**: Minimum 48x48px for all interactive buttons (Tablet-optimized).
- **Color Palette**: 
    - **Pedagogy**: Traffic Light Scheme (Red = Beginner, Orange = Progress, Green = Mastered).
    - **UI**: High-contrast Slate/Blue for visibility in high-glare field conditions.
- **Feedback**: Immediate visual/haptic-style animations for Every correct/incorrect answer.

## 5. Data & AI Strategy
- **Bulk Uploads**: Support high-speed Excel/CSV ingestion for historical student results.
- **AI Dashboarding**: Future features will use Natural Language Query (NLQ) to allow administrators to "Ask the Data" directly from the dashboard.

## 6. Commands & Workflows
- **Dev**: `npm run dev`
- **Build**: `npm run build`
- **Prisma**: `npx prisma generate` / `npx prisma db push`
