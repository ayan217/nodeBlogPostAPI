const Blog = require('../models/Blog');

exports.createBlog = async (req, res) => {
  const blog = await Blog.create({ ...req.body, author: req.user._id });
  res.json(blog);
};

exports.getAllBlogs = async (req, res) => {
  const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
  const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;
  const skip = (page - 1) * limit;

  const blogs = await Blog.find()
    .populate('author', 'username')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Blog.countDocuments();

  res.json({
    total,
    page,
    pages: Math.ceil(total / limit),
    blogs
  });
};

exports.getBlogById = async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('author', 'username');
  if (!blog) return res.status(404).json({ message: 'Not found' });
  res.json(blog);
};

exports.updateBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog || blog.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  Object.assign(blog, req.body);
  await blog.save();
  res.json(blog);
};

exports.deleteBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog || blog.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  await blog.deleteOne();
  res.json({ message: 'Deleted' });
};
