import express from 'express'
import { requireAuth } from '../middleware/auth.js'
import Goal from '../models/Goal.js'

const router = express.Router()

router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, target, deadline } = req.body

    if (!title || !target || Number(target) <= 0) {
      return res.status(400).json({ message: 'Please provide a goal name and a target amount above 0.' })
    }

    const goal = await Goal.create({
      user: req.userId,
      title: title.trim(),
      target: Number(target),
      deadline: deadline ? deadline.trim() : null,
    })

    res.status(201).json({ goal })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Could not create the goal. Please try again.' })
  }
})

router.get('/', requireAuth, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.userId }).sort({ createdAt: -1 })
    res.json({ goals })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Could not load goals.' })
  }
})

router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const { addAmount } = req.body

    if (!addAmount || Number(addAmount) <= 0) {
      return res.status(400).json({ message: 'Please provide a positive amount to add.' })
    }

    const goal = await Goal.findOne({ _id: req.params.id, user: req.userId })
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found.' })
    }

    goal.saved += Number(addAmount)
    await goal.save()

    res.json({ goal })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Could not update the goal.' })
  }
})

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.userId })

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found.' })
    }

    await Goal.deleteOne({ _id: req.params.id })

    res.json({ message: 'Goal deleted.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Could not delete the goal.' })
  }
})

export default router