# Product Requirements Document (PRD): Pratham FLN Hub

## 1. Executive Summary & Vision
**FLN Hub** is a comprehensive pedagogical support system designed to accelerate Foundational Literacy and Numeracy (FLN) through daily interactive engagement. Moving beyond a simple "assessment tracker," the platform serves as a **Daily Interaction Engine** for teachers and students, implementing the Pratham/TaRL methodology at scale.

## 2. Core Value Propositions (USPs)
1. **Level-Based Customized Support**: Automatically providing pedagogical tools and games tailored to a student's exact current ASER/FLN level.
2. **Live Data Integration**: High-performance dashboarding that turns uploaded spreadsheet data into actionable real-time student insights.
3. **90-Minute Daily Flow**: A structured, independent sequence of activities (Activity → Game → Battle) for classroom implementation.
4. **Interactive AI Intelligence**: A natural-language data interface allowing users to "ask" their dashboard for deep insights (e.g., "Where is growth stalling?").

## 3. Target Audience
- **School Teachers**: Managing daily classroom flows and local competitions.
- **Students**: Engaging in high-energy, level-matched 2v2 battles.
- **Administrators & POs**: Monitoring regional growth via AI-powered longitudinal dashboards.

## 4. Functional Requirements

### 4.1 The 90-Minute Daily Flow
A structured daily curriculum for literacy and numeracy:
- **30m Exploration**: Individual interaction with level-wise digital manipulatives.
- **30m Group Activity**: Teacher-led interactive games (e.g., Fish Game, Number River).
- **30m Competition**: The school-level battle arena.

### 4.2 The 2v2 Battle Arena (Authenticated)
- **School Logins**: Every school has a dedicated account.
- **Class Context**: Teachers select the specific class (1-8) before starting.
- **Level-Matched Matchmaking**: After a group activity, the system **randomly selects 2 students of the same level** for a 2v2 versus game.
- **Database Closure**: Winning results are automatically updated to the student's longitudinal record to track engagement and performance.

### 4.3 AI-Powered Dashboards
- **Natural Language Query (NLQ)**: A search-bar interface where users can ask: 
    - *"Show me students with zero progress in the last 30 days."*
    - *"Which schools are most active in 2v2 battles?"*
    - *"Generate a summary of Grade 3 literacy trends in the North Division."*
- **Live Spreadsheet Syncing**: The dashboard remains dynamic, reflecting both live game results and periodic bulk uploads.

## 5. Technical Requirements & Architecture
- **Framework**: Next.js 15 (App Router).
- **Data Layer**: Prisma ORM (PostgreSQL) with specialized models for `BattleRecords` and `GrowthSnapshots`.
- **Authentication**: Role-based access (Admin, PO, School, Teacher).
- **UI Architecture**: High-speed, touch-optimized React components for low-latency field interactions on mobile/tablet devices.

## 6. Success Metrics
- **Engagement Depth**: Percentage of students participating in at least 3 "Battles" per week.
- **Growth Velocity**: Reduction in time taken for a student to move from "Letter" to "Word" via the customized support flow.
- **Data Actionability**: Percentage of Administrative questions successfully answered by the AI Dashboard interface.
