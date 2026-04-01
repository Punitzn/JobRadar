import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true, maxlength: 1000 },
    rating: { type: Number, min: 1, max: 10 },
    outcome: {
      type: String,
      enum: ['hired', 'rejected', 'ghosted', 'withdrew', 'pending'],
    },
    isAnonymous: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    sector: {
      type: String,
      enum: ['E-commerce', 'FinTech', 'EdTech', 'HealthTech', 'SaaS', 'Gaming', 'Other'],
      required: true,
    },
    icon: { type: String, default: 'business' }, // material symbol name
    website: String,
    linkedinUrl: String,

    // Reputation score (computed or manually set)
    reputationScore: { type: Number, min: 0, max: 10, default: 0 },

    // Hiring signals
    ghostRate: { type: Number, min: 0, max: 100, default: 0 }, // % of applicants ghosted
    avgResponseDays: { type: Number, default: null },           // average response time in days
    hiringStatus: {
      type: String,
      enum: ['actively_hiring', 'occasionally_hiring', 'freeze'],
      default: 'occasionally_hiring',
    },

    // Tags like "Fast Feedback", "High Salary", "Work Life"
    tags: [String],

    // Detailed metrics (0-10)
    metrics: {
      overallScore: { type: Number, default: 0 },
      ghostRateIndex: { type: Number, default: 0 },
      responseLatency: { type: Number, default: 0 },
      redFlagsInversed: { type: Number, default: 0 },
    },

    // Required skills at this company (for resume matching)
    requiredSkills: [String],

    // User reviews
    reviews: [reviewSchema],

    // Open job listings (scraped or manually added)
    openRoles: [
      {
        title: String,
        url: String,
        postedAt: Date,
        location: String,
        type: { type: String, enum: ['remote', 'hybrid', 'onsite'] },
      },
    ],

    // Metadata
    isVerified: { type: Boolean, default: false },
    lastScrapedAt: { type: Date },
  },
  { timestamps: true }
)

// Compute reputation score from reviews before saving
companySchema.pre('save', function (next) {
  if (this.reviews.length > 0) {
    const avg =
      this.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / this.reviews.length
    this.reputationScore = Math.round(avg * 10) / 10
  }
  next()
})

// Virtual: match % against user skills (used in controller)
companySchema.methods.getSkillMatch = function (userSkills = []) {
  if (!this.requiredSkills.length) return 0
  const matched = userSkills.filter((s) =>
    this.requiredSkills.map((r) => r.toLowerCase()).includes(s.toLowerCase())
  )
  return Math.round((matched.length / this.requiredSkills.length) * 100)
}

export default mongoose.model('Company', companySchema)
