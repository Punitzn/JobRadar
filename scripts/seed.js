/**
 * JobRadar Seed Script
 * Run: node scripts/seed.js
 * Seeds the DB with companies shown in the UI (Zomato, Paytm, Swiggy, Razorpay + more)
 */

import 'dotenv/config'
import mongoose from 'mongoose'
import Company from '../src/models/Company.js'

const companies = [
  {
    name: 'Zomato',
    slug: 'zomato',
    sector: 'E-commerce',
    icon: 'restaurant',
    website: 'https://www.zomato.com',
    linkedinUrl: 'https://www.linkedin.com/company/zomato',
    reputationScore: 8.4,
    ghostRate: 12,
    avgResponseDays: 3,
    hiringStatus: 'actively_hiring',
    tags: ['Fast Feedback', 'Structured Process', 'Fair Rounds'],
    metrics: {
      overallScore: 8.4,
      ghostRateIndex: 9.2,
      responseLatency: 7.5,
      redFlagsInversed: 9.8,
    },
    requiredSkills: ['React', 'Node.js', 'Redux', 'TypeScript', 'AWS', 'Python'],
    reviews: [
      {
        text: 'The technical round was rigorous but fair. HR followed up within 48 hours as promised. Very streamlined process.',
        rating: 9,
        outcome: 'hired',
        isAnonymous: true,
      },
      {
        text: "Applied for Senior SDE. Standard coding round. Didn't move forward but received helpful feedback notes.",
        rating: 7,
        outcome: 'rejected',
        isAnonymous: true,
      },
    ],
    openRoles: [
      { title: 'Senior Frontend Engineer', url: 'https://www.zomato.com/careers', postedAt: new Date(), location: 'Gurugram', type: 'hybrid' },
      { title: 'Backend Engineer - Payments', url: 'https://www.zomato.com/careers', postedAt: new Date(), location: 'Gurugram', type: 'hybrid' },
      { title: 'Data Engineer', url: 'https://www.zomato.com/careers', postedAt: new Date(), location: 'Bangalore', type: 'onsite' },
    ],
    isVerified: true,
  },
  {
    name: 'Paytm',
    slug: 'paytm',
    sector: 'FinTech',
    icon: 'account_balance_wallet',
    website: 'https://www.paytm.com',
    linkedinUrl: 'https://www.linkedin.com/company/paytm',
    reputationScore: 7.1,
    ghostRate: 45,
    avgResponseDays: 14,
    hiringStatus: 'occasionally_hiring',
    tags: ['High Salary', 'Ghosted', 'Slow Process'],
    metrics: {
      overallScore: 7.1,
      ghostRateIndex: 5.5,
      responseLatency: 4.2,
      redFlagsInversed: 6.8,
    },
    requiredSkills: ['Java', 'Spring Boot', 'Kafka', 'MySQL', 'Redis', 'React'],
    reviews: [
      {
        text: 'Good pay but the hiring process is extremely slow. Waited 3 weeks with no update after the final round.',
        rating: 6,
        outcome: 'ghosted',
        isAnonymous: true,
      },
    ],
    openRoles: [
      { title: 'Full Stack Developer', url: 'https://paytm.com/careers', postedAt: new Date(), location: 'Noida', type: 'hybrid' },
      { title: 'DevOps Engineer', url: 'https://paytm.com/careers', postedAt: new Date(), location: 'Noida', type: 'onsite' },
    ],
    isVerified: true,
  },
  {
    name: 'Swiggy',
    slug: 'swiggy',
    sector: 'E-commerce',
    icon: 'delivery_dining',
    website: 'https://www.swiggy.com',
    linkedinUrl: 'https://www.linkedin.com/company/swiggy',
    reputationScore: 6.8,
    ghostRate: 22,
    avgResponseDays: 7,
    hiringStatus: 'actively_hiring',
    tags: ['Work Life', 'Moderate Response', 'Good Culture'],
    metrics: {
      overallScore: 6.8,
      ghostRateIndex: 7.8,
      responseLatency: 6.0,
      redFlagsInversed: 7.5,
    },
    requiredSkills: ['Python', 'Go', 'Kubernetes', 'PostgreSQL', 'React Native'],
    reviews: [
      {
        text: 'Decent work-life balance compared to other startups. Interview process was standard DSA + system design.',
        rating: 7,
        outcome: 'hired',
        isAnonymous: true,
      },
    ],
    openRoles: [
      { title: 'Android Engineer', url: 'https://swiggy.com/careers', postedAt: new Date(), location: 'Bangalore', type: 'hybrid' },
      { title: 'ML Engineer - Recommendations', url: 'https://swiggy.com/careers', postedAt: new Date(), location: 'Bangalore', type: 'onsite' },
    ],
    isVerified: true,
  },
  {
    name: 'Razorpay',
    slug: 'razorpay',
    sector: 'FinTech',
    icon: 'payments',
    website: 'https://www.razorpay.com',
    linkedinUrl: 'https://www.linkedin.com/company/razorpay',
    reputationScore: 9.1,
    ghostRate: 5,
    avgResponseDays: 2,
    hiringStatus: 'actively_hiring',
    tags: ['Top Employer', 'Fast Feedback', 'Transparent Process', 'Great Tech'],
    metrics: {
      overallScore: 9.1,
      ghostRateIndex: 9.5,
      responseLatency: 9.0,
      redFlagsInversed: 9.7,
    },
    requiredSkills: ['Go', 'Node.js', 'React', 'PostgreSQL', 'AWS', 'Microservices'],
    reviews: [
      {
        text: 'Best hiring experience I have had. Very respectful of candidates time. Got offer within a week.',
        rating: 10,
        outcome: 'hired',
        isAnonymous: true,
      },
      {
        text: 'Bar is high but they tell you exactly what they expect. Transparent at every step.',
        rating: 9,
        outcome: 'rejected',
        isAnonymous: true,
      },
    ],
    openRoles: [
      { title: 'SDE-2 Backend', url: 'https://razorpay.com/jobs', postedAt: new Date(), location: 'Bangalore', type: 'hybrid' },
      { title: 'Product Engineer - Payments', url: 'https://razorpay.com/jobs', postedAt: new Date(), location: 'Bangalore', type: 'hybrid' },
      { title: 'Site Reliability Engineer', url: 'https://razorpay.com/jobs', postedAt: new Date(), location: 'Remote', type: 'remote' },
    ],
    isVerified: true,
  },
  {
    name: 'CRED',
    slug: 'cred',
    sector: 'FinTech',
    icon: 'credit_card',
    website: 'https://www.cred.club',
    linkedinUrl: 'https://www.linkedin.com/company/cred-club',
    reputationScore: 8.7,
    ghostRate: 8,
    avgResponseDays: 4,
    hiringStatus: 'actively_hiring',
    tags: ['Premium Culture', 'Fast Feedback', 'High Standards'],
    metrics: {
      overallScore: 8.7,
      ghostRateIndex: 9.2,
      responseLatency: 8.5,
      redFlagsInversed: 9.0,
    },
    requiredSkills: ['Kotlin', 'Swift', 'React', 'Node.js', 'AWS', 'GraphQL'],
    reviews: [
      {
        text: 'Very design-forward company. The interview had a take-home assignment that was well-scoped. Heard back in 3 days.',
        rating: 9,
        outcome: 'hired',
        isAnonymous: true,
      },
    ],
    openRoles: [
      { title: 'iOS Engineer', url: 'https://cred.club/careers', postedAt: new Date(), location: 'Bangalore', type: 'hybrid' },
      { title: 'Frontend Engineer', url: 'https://cred.club/careers', postedAt: new Date(), location: 'Bangalore', type: 'hybrid' },
    ],
    isVerified: true,
  },
  {
    name: 'Meesho',
    slug: 'meesho',
    sector: 'E-commerce',
    icon: 'storefront',
    website: 'https://www.meesho.com',
    linkedinUrl: 'https://www.linkedin.com/company/meesho',
    reputationScore: 7.5,
    ghostRate: 30,
    avgResponseDays: 10,
    hiringStatus: 'occasionally_hiring',
    tags: ['Good Growth', 'Moderate Ghosting', 'Startup Pace'],
    metrics: {
      overallScore: 7.5,
      ghostRateIndex: 7.0,
      responseLatency: 5.5,
      redFlagsInversed: 8.0,
    },
    requiredSkills: ['Python', 'React', 'MySQL', 'Redis', 'Kafka', 'Docker'],
    reviews: [
      {
        text: 'Applied for SDE-2. First two rounds were great but then silence for 2 weeks. Not great communication.',
        rating: 6,
        outcome: 'ghosted',
        isAnonymous: true,
      },
    ],
    openRoles: [
      { title: 'SDE-2 Full Stack', url: 'https://meesho.com/careers', postedAt: new Date(), location: 'Bangalore', type: 'onsite' },
    ],
    isVerified: false,
  },
  {
    name: 'PhonePe',
    slug: 'phonepe',
    sector: 'FinTech',
    icon: 'phone_android',
    website: 'https://www.phonepe.com',
    linkedinUrl: 'https://www.linkedin.com/company/phonepe-internet',
    reputationScore: 8.2,
    ghostRate: 15,
    avgResponseDays: 5,
    hiringStatus: 'actively_hiring',
    tags: ['Strong Tech', 'Fast Feedback', 'Good Comp'],
    metrics: {
      overallScore: 8.2,
      ghostRateIndex: 8.5,
      responseLatency: 8.0,
      redFlagsInversed: 8.8,
    },
    requiredSkills: ['Java', 'Spring Boot', 'React', 'MySQL', 'Kafka', 'AWS'],
    reviews: [
      {
        text: 'Four rounds total — DSA, system design, machine coding, and HR. Everything was done in under 10 days. Loved the efficiency.',
        rating: 9,
        outcome: 'hired',
        isAnonymous: true,
      },
    ],
    openRoles: [
      { title: 'Backend Engineer - Payments', url: 'https://phonepe.com/careers', postedAt: new Date(), location: 'Bangalore', type: 'hybrid' },
      { title: 'Android Developer', url: 'https://phonepe.com/careers', postedAt: new Date(), location: 'Bangalore', type: 'onsite' },
    ],
    isVerified: true,
  },
]

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    await Company.deleteMany({})
    console.log('🗑️  Cleared existing companies')

    const inserted = await Company.insertMany(companies)
    console.log(`🌱 Seeded ${inserted.length} companies:`)
    inserted.forEach((c) => console.log(`   • ${c.name} (${c.sector}) — Rep: ${c.reputationScore}`))

    console.log('\n✅ Seed complete!')
    process.exit(0)
  } catch (err) {
    console.error('❌ Seed failed:', err.message)
    process.exit(1)
  }
}

seed()
