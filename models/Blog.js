const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
