const Comment = require('../models/Comment');

exports.addComment = async (req, res) => {
  const comment = await Comment.create({
    content: req.body.content,
    blog: req.params.blogId,
    author: req.user._id
  });
  res.json(comment);
};

exports.getPaginatedComments = async (req, res) => {
  try {
    const blogId = req.params.blogId;

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({ blog: blogId })
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments({ blog: blogId });

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      comments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};

exports.deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) return res.status(404).json({ message: 'Comment not found' });

  const blog = await Blog.findById(comment.blog);
  if (!blog) return res.status(404).json({ message: 'Blog not found' });

  const isCommentAuthor = comment.author.toString() === req.user._id.toString();
  const isBlogAuthor = blog.author.toString() === req.user._id.toString();

  if (!isCommentAuthor && !isBlogAuthor) {
    return res.status(403).json({ message: 'Not authorized to delete this comment' });
  }

  await comment.deleteOne();
  res.json({ message: 'Comment deleted successfully' });
};
