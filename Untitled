Multi-Tenant Issue Tracker — SaaS Platform
A production-ready SaaS issue tracker built for a Senior Full Stack Developer technical assessment. Demonstrates multi-tenant architecture, JWT security, and full-stack deployment.
Live URLs

Frontend (Vercel): https://issue-tracker-chi-black.vercel.app
Backend API (Railway): https://brilliant-growth-production-97f4.up.railway.app
Health Check: https://brilliant-growth-production-97f4.up.railway.app/api/health

Test Credentials
CompanyEmailPasswordAcme Corpjohn@acme.compassword123Globex Incjane@globex.compassword123

Login as both users to verify tenant isolation — each sees only their company's issues.


Tech Stack
LayerTechnologyReasonBackendNode.js + Express + TypeScriptType-safe, scalable REST APIORMPrisma v5Type-safe DB queries, easy migrationsDatabasePostgreSQL (Prisma Cloud)Relational, reliable, supports foreign keysAuthJWT (jsonwebtoken + bcrypt)Stateless, secure, scalableFrontendNext.js 16 + TypeScriptSSR, App Router, production-readyStylingTailwind CSSRapid, consistent UI developmentBackend DeployRailwaySimple Node.js hosting, Singapore regionFrontend DeployVercelOptimized for Next.js, global CDN

Architecture
Multi-Tenancy Strategy
Row-level isolation is used — every Issue and User record contains a tenantId foreign key. All database queries filter strictly by tenantId extracted from the verified JWT token, never from the request body. This prevents cross-tenant data leakage even if a malicious user crafts custom requests.
Database Schema
Tenant
  id        String  (primary key, UUID)
  name      String  (e.g. "Acme Corp")
  slug      String  (unique, e.g. "acme")
  users     User[]
  issues    Issue[]

User
  id        String  (primary key, UUID)
  email     String  (unique)
  password  String  (bcrypt hashed)
  tenantId  String  → Tenant
  issues    Issue[]

Issue
  id          String   (primary key, UUID)
  title       String
  description String?
  status      Enum     (OPEN, IN_PROGRESS, RESOLVED, CLOSED)
  priority    Enum     (LOW, MEDIUM, HIGH, CRITICAL)
  tenantId    String   → Tenant
  userId      String   → User
  createdAt   DateTime
  updatedAt   DateTime
API Routes
POST /api/auth/register   — Register user to a tenant (by slug)
POST /api/auth/login      — Login, returns JWT token

GET    /api/issues        — Get all issues for logged-in tenant
POST   /api/issues        — Create issue for logged-in tenant
PATCH  /api/issues/:id    — Update issue (tenant-scoped)
DELETE /api/issues/:id    — Delete issue (tenant-scoped)
Security Design

Passwords hashed with bcrypt (10 salt rounds)
JWT contains userId, tenantId, email — signed with secret key
Every protected route uses authenticate middleware that verifies JWT and attaches req.user
All issue queries use WHERE tenantId = req.user.tenantId — server enforced, not client
CORS restricted to known frontend origins only

Deployment Architecture
Browser → Vercel (Next.js Frontend)
              ↓
         Railway (Express REST API)
              ↓
         Prisma Cloud (PostgreSQL — Singapore)

Project Structure
issue-tracker/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── migrations/
│   ├── src/
│   │   ├── index.ts
│   │   ├── lib/prisma.ts
│   │   ├── middleware/auth.ts
│   │   └── routes/
│   │       ├── auth.ts
│   │       └── issues.ts
│   └── tsconfig.json
├── frontend/
│   └── app/
│       ├── login/page.tsx
│       ├── register/page.tsx
│       └── dashboard/page.tsx
└── README.md

Key Technical Decisions
Why Prisma over raw SQL?
Type-safe queries catch errors at compile time, and migrations are version-controlled making schema changes safe and reproducible.
Why JWT over sessions?
Stateless auth scales horizontally without shared session storage. The tenantId embedded in the token means every request is self-contained.
Why Railway + Vercel over a single platform?
Separation of concerns — frontend on Vercel gets global CDN and Next.js optimizations, backend on Railway gets persistent Node.js runtime. Both platforms auto-deploy on git push.
Why row-level isolation over separate databases?
Simpler to manage at this scale — one database, one connection pool, queries scoped by tenantId. For enterprise scale, separate schemas or databases per tenant would be considered.