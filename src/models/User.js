import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [60, 'Name must be under 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // never returned in queries by default
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    // Resume skills for match analysis
    skills: {
      type: [String],
      default: [],
    },
    // Saved / bookmarked companies
    savedCompanies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
      },
    ],
    // Job applications tracked
    applications: [
      {
        company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
        role: String,
        status: {
          type: String,
          enum: ['applied', 'interviewing', 'offered', 'rejected', 'ghosted'],
          default: 'applied',
        },
        appliedAt: { type: Date, default: Date.now },
        notes: String,
      },
    ],
    refreshToken: { type: String, select: false },
  },
  { timestamps: true }
)

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Compare password
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password)
}

export default mongoose.model('User', userSchema)
