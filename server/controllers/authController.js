import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role, bio: user.bio }
}

function createToken(user) {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured')
  return jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

export async function register(req, res) {
  try {
    const { name, email, password, role } = req.body
    if (!name || !email || !password || !['student', 'teacher'].includes(role)) {
      return res.status(400).json({ message: 'Name, email, password, and a valid role are required' })
    }
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' })
    const normalizedEmail = email.trim().toLowerCase()
    if (await User.exists({ email: normalizedEmail })) return res.status(409).json({ message: 'An account with this email already exists' })

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password: hashedPassword, role })
    return res.status(201).json({ token: createToken(user), user: publicUser(user) })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to register account' })
  }
}

export async function login(req, res) {
  try {
    const { email, password, role } = req.body
    const user = await User.findOne({ email: email?.trim().toLowerCase(), ...(role ? { role } : {}) }).select('+password')
    if (!user || !(await user.comparePassword(password || ''))) return res.status(401).json({ message: 'Invalid email, password, or role' })
    return res.json({ token: createToken(user), user: publicUser(user) })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to log in' })
  }
}

export async function me(req, res) {
  return res.json({ user: publicUser(req.user) })
}

export async function updateProfile(req, res) {
  try {
    const updates = {}
    if (typeof req.body.name === 'string' && req.body.name.trim()) updates.name = req.body.name.trim()
    if (typeof req.body.bio === 'string') updates.bio = req.body.bio.trim()
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true })
    return res.json({ user: publicUser(user) })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to update profile' })
  }
}
