You are an expert senior product designer, UI/UX designer, and senior Next.js engineer.

Build a production-quality, single-page Goal Tracking web app with an exceptional interactive UI/UX.

## Core Product Vision
Create a one-page goal tracking dashboard inspired by:
- Notion-style clarity and information density
- GitHub-style progress visibility and contribution feel
- Minimal, premium, dark-mode productivity aesthetic
- Sharp square design language (NO rounded corners)
- Clean spacing system, strong typography, subtle depth
- Feels like a focused workspace for execution, not a playful app

This app is for personal goal management across:
- Yearly goals
- Quarterly goals
- Monthly goals
- Weekly goals

The whole experience should live inside a SINGLE PAGE APPLICATION with a highly structured overview, smooth interactions, and strong visual hierarchy.

---

## Tech Stack Requirements
Use:
- Next.js latest App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- NeonDB via DATABASE_URL already available in environment
- Server Actions or clean API routes where appropriate
- Prefer a clean scalable folder structure
- Use excellent TypeScript types
- Use reusable components
- Use dark theme by default

---

## Design System / UI Direction
The UI must feel premium and intentional.

### Design rules
- Dark mode only
- No border radius anywhere, or extremely close to square
- Sharp edges, structured layout
- Spacious but dense like Notion + Linear + GitHub
- Strong grid alignment
- Subtle shadows and contrast, not flashy gradients everywhere
- Use neutral dark palette
- High readability
- Minimal but polished microinteractions
- Smooth hover, focus, expand/collapse, and progress transitions
- Responsive for desktop first, but also works on tablet/mobile

### Visual style
- Workspace aesthetic
- Monospace or semi-editorial touch for metadata/counts if useful
- Cards can be flat or slightly elevated, but square
- Use progress visualization heavily
- Make completion stats instantly understandable
- Avoid cartoonish UI
- Avoid oversized rounded buttons/chips
- Avoid excessive color noise

---

## Main UX Goal
I want to open the app and instantly understand:
- My yearly direction
- Which quarter I am in
- What goals are active right now
- How much progress I have completed
- What is blocked / delayed / done
- What needs attention this week

Everything important should be visible in one-page overview without navigating around.

---

## Required Features

### 1. Goal hierarchy
Support nested structure:
- Yearly goal
  - Quarterly goals
    - Monthly goals
      - Weekly goals

Each goal should support:
- id
- title
- description
- level (yearly, quarterly, monthly, weekly)
- parentId
- status (not_started, in_progress, completed, blocked, archived)
- progress percentage
- target value (optional)
- current value (optional)
- due date
- start date
- priority
- tags
- notes
- createdAt
- updatedAt

---

### 2. Single-page dashboard layout
Design a beautiful one-page dashboard with sections such as:

#### A. Top summary bar
Show:
- current year
- active quarter
- total goals
- completed goals
- in progress goals
- blocked goals
- completion rate

#### B. Goal progress overview
A strong visual section showing:
- yearly progress
- quarter-by-quarter progress
- month progress
- weekly execution status

#### C. GitHub-style progress visualization
Create a GitHub-inspired progress component for goals:
- A contribution-style grid or heatmap
- Show how consistently goals/tasks were completed over time
- Could represent weekly completions, daily activity, or streak-based execution
- Make it feel motivating and data-rich

#### D. Quarterly tracker
Show all 4 quarters clearly:
- Q1, Q2, Q3, Q4
- Each quarter card should show:
  - total goals
  - completed goals
  - progress bar
  - linked monthly goals
- Example: “Quarter 2: 2 of 4 goals completed”

#### E. Active focus panel
Display:
- this week’s goals
- overdue items
- blocked items
- most important priorities

#### F. Hierarchical goals panel
Display expandable/collapsible goal tree:
- Yearly > Quarterly > Monthly > Weekly
- Easy to scan
- Elegant nesting
- Clear status indicators
- Inline progress

#### G. Quick add / edit experience
Allow adding:
- yearly goals
- quarterly goals
- monthly goals
- weekly goals

Do this with a polished inline panel, drawer, or modal that still fits the one-page experience.

---

## Interaction Requirements
The app should feel alive and well designed.

Include:
- Smooth expand/collapse for nested goals
- Inline editing where useful
- Keyboard-friendly interactions
- Fast add goal flow
- Filters by status / timeframe / priority
- Search goals
- Progress updates without full page refresh
- Excellent empty states
- Elegant loading states / skeletons
- Confirm destructive actions carefully

---

## Data / Prisma Requirements
Use Prisma with NeonDB.

Create a Prisma schema for goal tracking with a clean relational model.

Suggested structure:
- Goal table with self-relation using parentId
- Optional enums for goal level and status

Include:
- Prisma schema
- migration-ready models
- seed data for demo overview
- server-side DB access utilities

Make sure the schema is production sensible.

---

## Functional Requirements
Implement:
- Create goal
- Update goal
- Delete goal
- Mark goal complete
- Update progress
- Filter by yearly/quarterly/monthly/weekly
- Expand/collapse hierarchy
- Show completion metrics
- Show quarter completion stats
- Persist all data in database

---

## Product Thinking
Do not build just a CRUD app.
Build a serious execution dashboard.

It should feel like:
- a strategy command center
- a personal operating system
- a founder / high-performer dashboard

The page should help the user connect high-level yearly vision to weekly execution.

---

## Code Quality Requirements
- Clean architecture mindset
- Strong separation of concerns
- Reusable components
- Server/client boundaries handled correctly in Next.js
- No messy monolithic file
- Good naming
- Strict TypeScript
- Production-ready code
- No placeholder-quality UI
- No low-quality default styles

---

## Suggested Component Ideas
Possible components:
- AppShell
- DashboardHeader
- SummaryStats
- QuarterProgressGrid
- GoalHeatmap
- GoalHierarchyTree
- GoalCard
- GoalProgressBar
- WeeklyFocusPanel
- GoalFilters
- GoalSearch
- AddGoalPanel
- EditGoalDrawer
- EmptyState
- LoadingSkeleton

---

## UX Details to Nail
- Make the quarterly progress section visually powerful
- Make the hierarchy easy to understand at a glance
- Make progress states feel rewarding
- Use spacing and typography to create premium structure
- Keep everything on one page but avoid clutter
- Balance overview and detail elegantly

---

## Deliverables
Generate:
1. Full Next.js app structure
2. Prisma schema
3. Tailwind-based UI
4. Seed/demo data
5. Main page implementation
6. Reusable components
7. CRUD flow
8. Clean dark theme
9. Responsive layout
10. Instructions to run locally

---

## Important Constraints
- Single page application experience
- Dark theme only
- Square design language
- Notion-like overview
- GitHub-like progress visibility
- Use Prisma with NeonDB
- High-end interactive UI/UX
- Must feel premium and practical
- Do not produce generic dashboard design

Build this as if it were a polished SaaS MVP ready for real use.

You are an expert senior product designer, UI/UX designer, and senior Next.js engineer.

Build a production-quality, single-page Goal Tracking web app with an exceptional interactive UI/UX.

## Core Product Vision
Create a one-page goal tracking dashboard inspired by:
- Notion-style clarity and information density
- GitHub-style progress visibility and contribution feel
- Minimal, premium, dark-mode productivity aesthetic
- Sharp square design language (NO rounded corners)
- Clean spacing system, strong typography, subtle depth
- Feels like a focused workspace for execution, not a playful app

This app is for personal goal management across:
- Yearly goals
- Quarterly goals
- Monthly goals
- Weekly goals

The whole experience should live inside a SINGLE PAGE APPLICATION with a highly structured overview, smooth interactions, and strong visual hierarchy.

---

## Tech Stack Requirements
Use:
- Next.js latest App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- NeonDB via DATABASE_URL already available in environment
- Server Actions or clean API routes where appropriate
- Prefer a clean scalable folder structure
- Use excellent TypeScript types
- Use reusable components
- Use dark theme by default

---

## Design System / UI Direction
The UI must feel premium and intentional.

### Design rules
- Dark mode only
- No border radius anywhere, or extremely close to square
- Sharp edges, structured layout
- Spacious but dense like Notion + Linear + GitHub
- Strong grid alignment
- Subtle shadows and contrast, not flashy gradients everywhere
- Use neutral dark palette
- High readability
- Minimal but polished microinteractions
- Smooth hover, focus, expand/collapse, and progress transitions
- Responsive for desktop first, but also works on tablet/mobile

### Visual style
- Workspace aesthetic
- Monospace or semi-editorial touch for metadata/counts if useful
- Cards can be flat or slightly elevated, but square
- Use progress visualization heavily
- Make completion stats instantly understandable
- Avoid cartoonish UI
- Avoid oversized rounded buttons/chips
- Avoid excessive color noise

---

## Main UX Goal
I want to open the app and instantly understand:
- My yearly direction
- Which quarter I am in
- What goals are active right now
- How much progress I have completed
- What is blocked / delayed / done
- What needs attention this week

Everything important should be visible in one-page overview without navigating around.

---

## Required Features

### 1. Goal hierarchy
Support nested structure:
- Yearly goal
  - Quarterly goals
    - Monthly goals
      - Weekly goals

Each goal should support:
- id
- title
- description
- level (yearly, quarterly, monthly, weekly)
- parentId
- status (not_started, in_progress, completed, blocked, archived)
- progress percentage
- target value (optional)
- current value (optional)
- due date
- start date
- priority
- tags
- notes
- createdAt
- updatedAt

---

### 2. Single-page dashboard layout
Design a beautiful one-page dashboard with sections such as:

#### A. Top summary bar
Show:
- current year
- active quarter
- total goals
- completed goals
- in progress goals
- blocked goals
- completion rate

#### B. Goal progress overview
A strong visual section showing:
- yearly progress
- quarter-by-quarter progress
- month progress
- weekly execution status

#### C. GitHub-style progress visualization
Create a GitHub-inspired progress component for goals:
- A contribution-style grid or heatmap
- Show how consistently goals/tasks were completed over time
- Could represent weekly completions, daily activity, or streak-based execution
- Make it feel motivating and data-rich

#### D. Quarterly tracker
Show all 4 quarters clearly:
- Q1, Q2, Q3, Q4
- Each quarter card should show:
  - total goals
  - completed goals
  - progress bar
  - linked monthly goals
- Example: “Quarter 2: 2 of 4 goals completed”

#### E. Active focus panel
Display:
- this week’s goals
- overdue items
- blocked items
- most important priorities

#### F. Hierarchical goals panel
Display expandable/collapsible goal tree:
- Yearly > Quarterly > Monthly > Weekly
- Easy to scan
- Elegant nesting
- Clear status indicators
- Inline progress

#### G. Quick add / edit experience
Allow adding:
- yearly goals
- quarterly goals
- monthly goals
- weekly goals

Do this with a polished inline panel, drawer, or modal that still fits the one-page experience.

---

## Interaction Requirements
The app should feel alive and well designed.

Include:
- Smooth expand/collapse for nested goals
- Inline editing where useful
- Keyboard-friendly interactions
- Fast add goal flow
- Filters by status / timeframe / priority
- Search goals
- Progress updates without full page refresh
- Excellent empty states
- Elegant loading states / skeletons
- Confirm destructive actions carefully

---

## Data / Prisma Requirements
Use Prisma with NeonDB.

Create a Prisma schema for goal tracking with a clean relational model.

Suggested structure:
- Goal table with self-relation using parentId
- Optional enums for goal level and status

Include:
- Prisma schema
- migration-ready models
- seed data for demo overview
- server-side DB access utilities

Make sure the schema is production sensible.

---

## Functional Requirements
Implement:
- Create goal
- Update goal
- Delete goal
- Mark goal complete
- Update progress
- Filter by yearly/quarterly/monthly/weekly
- Expand/collapse hierarchy
- Show completion metrics
- Show quarter completion stats
- Persist all data in database

---

## Product Thinking
Do not build just a CRUD app.
Build a serious execution dashboard.

It should feel like:
- a strategy command center
- a personal operating system
- a founder / high-performer dashboard

The page should help the user connect high-level yearly vision to weekly execution.

---

## Code Quality Requirements
- Clean architecture mindset
- Strong separation of concerns
- Reusable components
- Server/client boundaries handled correctly in Next.js
- No messy monolithic file
- Good naming
- Strict TypeScript
- Production-ready code
- No placeholder-quality UI
- No low-quality default styles

---

## Suggested Component Ideas
Possible components:
- AppShell
- DashboardHeader
- SummaryStats
- QuarterProgressGrid
- GoalHeatmap
- GoalHierarchyTree
- GoalCard
- GoalProgressBar
- WeeklyFocusPanel
- GoalFilters
- GoalSearch
- AddGoalPanel
- EditGoalDrawer
- EmptyState
- LoadingSkeleton

---

## UX Details to Nail
- Make the quarterly progress section visually powerful
- Make the hierarchy easy to understand at a glance
- Make progress states feel rewarding
- Use spacing and typography to create premium structure
- Keep everything on one page but avoid clutter
- Balance overview and detail elegantly

---

## Deliverables
Generate:
1. Full Next.js app structure
2. Prisma schema
3. Tailwind-based UI
4. Seed/demo data
5. Main page implementation
6. Reusable components
7. CRUD flow
8. Clean dark theme
9. Responsive layout
10. Instructions to run locally

---

## Important Constraints
- Single page application experience
- Dark theme only
- Square design language
- Notion-like overview
- GitHub-like progress visibility
- Use Prisma with NeonDB
- High-end interactive UI/UX
- Must feel premium and practical
- Do not produce generic dashboard design

Build this as if it were a polished SaaS MVP ready for real use.

You are an expert senior product designer, UI/UX designer, and senior Next.js engineer.

Build a production-quality, single-page Goal Tracking web app with an exceptional interactive UI/UX.

## Core Product Vision
Create a one-page goal tracking dashboard inspired by:
- Notion-style clarity and information density
- GitHub-style progress visibility and contribution feel
- Minimal, premium, dark-mode productivity aesthetic
- Sharp square design language (NO rounded corners)
- Clean spacing system, strong typography, subtle depth
- Feels like a focused workspace for execution, not a playful app

This app is for personal goal management across:
- Yearly goals
- Quarterly goals
- Monthly goals
- Weekly goals

The whole experience should live inside a SINGLE PAGE APPLICATION with a highly structured overview, smooth interactions, and strong visual hierarchy.

---

## Tech Stack Requirements
Use:
- Next.js latest App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- NeonDB via DATABASE_URL already available in environment
- Server Actions or clean API routes where appropriate
- Prefer a clean scalable folder structure
- Use excellent TypeScript types
- Use reusable components
- Use dark theme by default

---

## Design System / UI Direction
The UI must feel premium and intentional.

### Design rules
- Dark mode only
- No border radius anywhere, or extremely close to square
- Sharp edges, structured layout
- Spacious but dense like Notion + Linear + GitHub
- Strong grid alignment
- Subtle shadows and contrast, not flashy gradients everywhere
- Use neutral dark palette
- High readability
- Minimal but polished microinteractions
- Smooth hover, focus, expand/collapse, and progress transitions
- Responsive for desktop first, but also works on tablet/mobile

### Visual style
- Workspace aesthetic
- Monospace or semi-editorial touch for metadata/counts if useful
- Cards can be flat or slightly elevated, but square
- Use progress visualization heavily
- Make completion stats instantly understandable
- Avoid cartoonish UI
- Avoid oversized rounded buttons/chips
- Avoid excessive color noise

---

## Main UX Goal
I want to open the app and instantly understand:
- My yearly direction
- Which quarter I am in
- What goals are active right now
- How much progress I have completed
- What is blocked / delayed / done
- What needs attention this week

Everything important should be visible in one-page overview without navigating around.

---

## Required Features

### 1. Goal hierarchy
Support nested structure:
- Yearly goal
  - Quarterly goals
    - Monthly goals
      - Weekly goals

Each goal should support:
- id
- title
- description
- level (yearly, quarterly, monthly, weekly)
- parentId
- status (not_started, in_progress, completed, blocked, archived)
- progress percentage
- target value (optional)
- current value (optional)
- due date
- start date
- priority
- tags
- notes
- createdAt
- updatedAt

---

### 2. Single-page dashboard layout
Design a beautiful one-page dashboard with sections such as:

#### A. Top summary bar
Show:
- current year
- active quarter
- total goals
- completed goals
- in progress goals
- blocked goals
- completion rate

#### B. Goal progress overview
A strong visual section showing:
- yearly progress
- quarter-by-quarter progress
- month progress
- weekly execution status

#### C. GitHub-style progress visualization
Create a GitHub-inspired progress component for goals:
- A contribution-style grid or heatmap
- Show how consistently goals/tasks were completed over time
- Could represent weekly completions, daily activity, or streak-based execution
- Make it feel motivating and data-rich

#### D. Quarterly tracker
Show all 4 quarters clearly:
- Q1, Q2, Q3, Q4
- Each quarter card should show:
  - total goals
  - completed goals
  - progress bar
  - linked monthly goals
- Example: “Quarter 2: 2 of 4 goals completed”

#### E. Active focus panel
Display:
- this week’s goals
- overdue items
- blocked items
- most important priorities

#### F. Hierarchical goals panel
Display expandable/collapsible goal tree:
- Yearly > Quarterly > Monthly > Weekly
- Easy to scan
- Elegant nesting
- Clear status indicators
- Inline progress

#### G. Quick add / edit experience
Allow adding:
- yearly goals
- quarterly goals
- monthly goals
- weekly goals

Do this with a polished inline panel, drawer, or modal that still fits the one-page experience.

---

## Interaction Requirements
The app should feel alive and well designed.

Include:
- Smooth expand/collapse for nested goals
- Inline editing where useful
- Keyboard-friendly interactions
- Fast add goal flow
- Filters by status / timeframe / priority
- Search goals
- Progress updates without full page refresh
- Excellent empty states
- Elegant loading states / skeletons
- Confirm destructive actions carefully

---

## Data / Prisma Requirements
Use Prisma with NeonDB.

Create a Prisma schema for goal tracking with a clean relational model.

Suggested structure:
- Goal table with self-relation using parentId
- Optional enums for goal level and status

Include:
- Prisma schema
- migration-ready models
- seed data for demo overview
- server-side DB access utilities

Make sure the schema is production sensible.

---

## Functional Requirements
Implement:
- Create goal
- Update goal
- Delete goal
- Mark goal complete
- Update progress
- Filter by yearly/quarterly/monthly/weekly
- Expand/collapse hierarchy
- Show completion metrics
- Show quarter completion stats
- Persist all data in database

---

## Product Thinking
Do not build just a CRUD app.
Build a serious execution dashboard.

It should feel like:
- a strategy command center
- a personal operating system
- a founder / high-performer dashboard

The page should help the user connect high-level yearly vision to weekly execution.

---

## Code Quality Requirements
- Clean architecture mindset
- Strong separation of concerns
- Reusable components
- Server/client boundaries handled correctly in Next.js
- No messy monolithic file
- Good naming
- Strict TypeScript
- Production-ready code
- No placeholder-quality UI
- No low-quality default styles

---

## Suggested Component Ideas
Possible components:
- AppShell
- DashboardHeader
- SummaryStats
- QuarterProgressGrid
- GoalHeatmap
- GoalHierarchyTree
- GoalCard
- GoalProgressBar
- WeeklyFocusPanel
- GoalFilters
- GoalSearch
- AddGoalPanel
- EditGoalDrawer
- EmptyState
- LoadingSkeleton

---

## UX Details to Nail
- Make the quarterly progress section visually powerful
- Make the hierarchy easy to understand at a glance
- Make progress states feel rewarding
- Use spacing and typography to create premium structure
- Keep everything on one page but avoid clutter
- Balance overview and detail elegantly

---

## Deliverables
Generate:
1. Full Next.js app structure
2. Prisma schema
3. Tailwind-based UI
4. Seed/demo data
5. Main page implementation
6. Reusable components
7. CRUD flow
8. Clean dark theme
9. Responsive layout
10. Instructions to run locally

---

## Important Constraints
- Single page application experience
- Dark theme only
- Square design language
- Notion-like overview
- GitHub-like progress visibility
- Use Prisma with NeonDB
- High-end interactive UI/UX
- Must feel premium and practical
- Do not produce generic dashboard design

Build this as if it were a polished SaaS MVP ready for real use.