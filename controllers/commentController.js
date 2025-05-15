const Comment = require('../models/Comment');

exports.addComment = async (req, res) => {
  const comment = await Comment.create({
    content: req.body.content,
    blog: req.params.blogId,
    author: req.user._id
  });
  res.json(comment);
};

exports.getComments = async (req, res) => {
  const comments = await Comment.find({ blog: req.params.blogId }).populate('author', 'username');
  res.json(comments);
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
