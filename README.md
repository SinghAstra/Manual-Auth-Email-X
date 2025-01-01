# Platform

A centralized platform built with Next.js 14, Prisma, and shadcn/ui to track and analyze campus placement data across technical institutes and universities nationwide.

## 🎯 Problem Statement

Currently, there is no centralized database for tracking campus placements across technical institutions and universities in the country. This lack of consolidated data makes it difficult for:

- Policy makers to understand and address unemployment trends
- Educational institutions to benchmark their performance
- Corporations to efficiently access and recruit talent
- Students to make informed career decisions

## 💡 Solution

Platform provides a unified platform where:

1. Universities can upload and manage their placement data
2. Corporations can access verified student talent pools
3. Government bodies can analyze employment trends
4. Students can track opportunities and placement statistics

## 🚀 MVP Features

### For Educational Institutions

- Institution profile management
- Batch-wise student data management
- Placement drive tracking
- Placement statistics dashboard
- Data export capabilities

### For Corporations

- Company profile creation
- Access to verified student database
- Job posting functionality
- Application tracking system
- Analytics dashboard

### For Government/Policy Makers

- Real-time placement statistics
- Field-wise employment trends
- Geographic distribution analysis
- Custom report generation
- Data visualization tools

## 📊 Data Models (Core)

```prisma
model Institution {
  id            String    @id @default(cuid())
  name          String
  type          String    // University/College/Institute
  location      String
  students      Student[]
  placements    Placement[]
  verified      Boolean   @default(false)
}

model Student {
  id            String    @id @default(cuid())
  institutionId String
  name          String
  course        String
  graduationYear Int
  placementStatus String  // Placed/Unplaced/In-Process
  institution   Institution @relation(fields: [institutionId], references: [id])
}

model Company {
  id            String    @id @default(cuid())
  name          String
  industry      String
  placements    Placement[]
  jobPostings   JobPosting[]
}

model Placement {
  id            String    @id @default(cuid())
  studentId     String
  companyId     String
  package       Float
  role          String
  dateOffered   DateTime
  student       Student   @relation(fields: [studentId], references: [id])
  company       Company   @relation(fields: [companyId], references: [id])
}
```

## 🛣️ Roadmap

Phase 1:

- Basic institution and company registration
- Student data management
- Simple placement tracking
- Basic analytics dashboard

Phase 2:

- Advanced analytics
- API integration
- Mobile responsiveness
- Batch data import/export

Phase 3:

- Real-time reporting
- Predictive analytics
- Integration with government APIs
- Advanced visualization tools
