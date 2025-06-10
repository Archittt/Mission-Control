const express = require('express');
const router = express.Router();
const Mission = require('../models/Mission');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const missions = await Mission.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(missions);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.post('/', auth, async (req, res) => {
  const { title, description } = req.body;
  try {
    const mission = new Mission({ user: req.user.id, title, description });
    await mission.save();
    res.json(mission);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);
    if (!mission) return res.status(404).json({ message: 'Mission not found' });
    if (mission.user.toString() !== req.user.id)
      return res.status(401).json({ message: 'Not authorized' });

    await mission.remove();
    res.json({ message: 'Mission removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.put('/:id', auth, async (req, res) => {
  const { title, description, status } = req.body;
  try {
    const mission = await Mission.findById(req.params.id);
    if (!mission) return res.status(404).json({ message: 'Mission not found' });
    if (mission.user.toString() !== req.user.id)
      return res.status(401).json({ message: 'Not authorized' });

    if (title !== undefined) mission.title = title;
    if (description !== undefined) mission.description = description;
    if (status !== undefined && ['active', 'completed'].includes(status)) mission.status = status;

    await mission.save();
    res.json(mission);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
