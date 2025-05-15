const Blog = require('../models/Blog');

exports.createBlog = async (req, res) => {
  const blog = await Blog.create({ ...req.body, author: req.user._id });
  res.json(blog);
};

exports.getAllBlogs = async (req, res) => {
  const blogs = await Blog.find().populate('author', 'username');
  res.json(blogs);
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
