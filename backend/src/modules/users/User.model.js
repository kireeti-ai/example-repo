/**
 * @fileoverview User model schema
 * Defines the User entity with authentication and profile fields.
 * 
 * @module models/User
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * @typedef {Object} User
 * @property {string} email - User's email address (unique)
 * @property {string} password - Hashed password
 * @property {string} firstName - User's first name
 * @property {string} lastName - User's last name
 * @property {string} role - User role (admin|member|viewer)
 * @property {string} avatar - Avatar URL
 * @property {boolean} isActive - Whether user account is active
 * @property {Date} lastLoginAt - Last login timestamp
 * @property {string} refreshToken - Current refresh token hash
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
            index: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
            select: false, // Don't include password in queries by default
        },
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
            maxlength: [50, 'First name cannot exceed 50 characters'],
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
            maxlength: [50, 'Last name cannot exceed 50 characters'],
        },
        role: {
            type: String,
            enum: {
                values: ['admin', 'member', 'viewer'],
                message: 'Role must be admin, member, or viewer',
            },
            default: 'member',
            index: true,
        },
        avatar: {
            type: String,
            default: null,
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
        lastLoginAt: {
            type: Date,
            default: null,
        },
        refreshToken: {
            type: String,
            select: false,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: function (doc, ret) {
                delete ret.password;
                delete ret.refreshToken;
                delete ret.__v;
                return ret;
            },
        },
        toObject: { virtuals: true },
    }
);

/**
 * Virtual for full name
 */
userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

/**
 * Pre-save hook to hash password
 */
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

/**
 * Compare password method
 * @param {string} candidatePassword - Password to compare
 * @returns {Promise<boolean>} True if passwords match
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Update last login timestamp
 * @returns {Promise<User>}
 */
userSchema.methods.updateLastLogin = function () {
    this.lastLoginAt = new Date();
    return this.save();
};

// Compound indexes for common queries
userSchema.index({ email: 1, isActive: 1 });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ createdAt: -1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
