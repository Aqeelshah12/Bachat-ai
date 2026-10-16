import express from 'express'
import { requireAuth } from '../middleware/auth.js'
import { parseFinancialText } from '../utils/qwen.js'
import Entry from '../models/Entry.js'

const router = express.Router()

router.post('/', requireAuth, async (req, res) => {
  try {
   const { text, language } = req.body
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Please type something first.' })
    }

    let parsed
    try {
      parsed = await parseFinancialText(text,language)
    } catch (err) {
      console.error('Qwen parsing error:', err.message)
      return res.status(502).json({
        message: "Couldn't understand that clearly — try rephrasing it a bit.",
      })
    }

    const entry = await Entry.create({
      user: req.userId,
      rawText: text,
      income: parsed.income || [],
      expenses: parsed.expenses || [],
    })

    res.status(201).json({
      entry,
      summary: parsed.summary || '',
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong. Please try again.' })
  }
})

router.get('/', requireAuth, async (req, res) => {
  try {
    const entries = await Entry.find({ user: req.userId }).sort({ createdAt: -1 })
    res.json({ entries })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Could not load entries.' })
  }
})

router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const { income, expenses } = req.body

    const entry = await Entry.findOne({ _id: req.params.id, user: req.userId })
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found.' })
    }

    if (income) entry.income = income
    if (expenses) entry.expenses = expenses

    await entry.save()

    res.json({ entry })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Could not save your changes.' })
  }
})

export default router