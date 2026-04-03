# Product Requirements Document (PRD): Pratham FLN Tracker

## 1. Executive Summary
**FLN Tracker** is a high-performance digital assessment platform designed to track and accelerate Foundational Literacy and Numeracy (FLN) outcomes in primary schools. Aligned with the Pratham/TaRL methodology, it enables longitudinal growth tracking across Baseline, Midline, and Endline assessments with real-time administrative control and field-ready performance.

## 2. Target Audience
- **Field Assessors**: Front-line teachers and volunteers conducting child-wise evaluations on tablets/mobiles in low-connectivity areas.
- **Project Administrators**: Decision-makers monitoring school-wise and project-wise progress and configuring testing assets.
- **Reporting Officers (POs)**: Monitoring regional trends and isolation data points (Division/Project Office).

## 3. Core Features & Functional Requirements

### 3.1 Advanced Assessment Engine
- **Sequential Math Flow**: Re-engineered logic that presents Addition, Subtraction, Multiplication, and Division operations one-by-one to reduce cognitive load and improve assessment precision.
- **Literacy Levels**: 5-tier evaluation tracking (Beginner, Letter, Word, Paragraph, Story).
- **On-the-Fly Student Creation**: Ability to register new students (Name, Gender, Class) directly within the testing wizard to handle un-rostered children without administrative bottlenecks.

### 3.2 Longitudinal Dashboard
- **Term-Based Isolation**: Global filters to toggle dashboard data between Baseline, Midline, and Endline windows.
- **Growth Comparison**: Automated ordering of testing terms (`Baseline → Midline → Endline`) to visualize learning trajectories.
- **Cascading Hierarchy Filters**: High-performance "narrowing" filters (Division → Project Office → School) to manage thousands of data points efficiently.

### 3.3 Administrative CMS
- **Asset Management Portal**: Real-time editor for testing assets (Words, Paragraphs, Math Problems) without requiring code redeployments.
- **Production Bulk Uploader**: Specialized High-Speed Ingestion engine capable of processing thousands of student records and historical Excel results in under 2 seconds.

## 4. Technical Architecture
- **Framework**: Next.js 15 (App Router / Turbopack).
- **Database**: PostgreSQL (Prisma ORM) for production-grade reliability and complex hierarchy queries.
- **Hosting**: Vercel (Frontend/API) + Supabase (Database).
- **Hardening**: Singleton Pattern for database connections to ensure stability in serverless/cloud environments.

## 5. Design & User Experience (UX)
- **Official Palette**: Government-official "Traffic Light" scheme (Red/Orange/Green) for performance visualization.
- **Field-First UI**: Minimalist, button-heavy interface optimized for tablet touch targets and high-glare field conditions.
- **Cascading Selectors**: Replaced heavy drop-downs with hierarchal logic to ensure the interface remains light on low-end hardware.

## 6. Success Metrics
- **Assessor Speed**: Reduce time-per-assessment to under 3 minutes.
- **Data Integrity**: Zero loss of data during "on-the-fly" student registration.
- **System Stability**: 100% build success rate on Vercel and sub-2s processing for large Excel uploads.
