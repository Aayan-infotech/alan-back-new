const StaticContent = require('../models/StaticContentModel');

// Get content by section
exports.getContent = async (req, res) => {
  try {
    const { section } = req.params;
    const content = await StaticContent.findOne({ section });
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Create or update content
exports.upsertContent = async (req, res) => {
  try {
    const { section, content } = req.body;
    const updatedContent = await StaticContent.findOneAndUpdate(
      { section },
      { content, updatedAt: Date.now() },
      { new: true, upsert: true }
    );
    res.json(updatedContent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
