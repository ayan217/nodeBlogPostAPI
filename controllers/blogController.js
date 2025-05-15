const Blog = require('../models/Blog');
const Tag = require('../models/Tag');

const slugify = (text) =>
  text.toString().toLowerCase().trim().replace(/\s+/g, '-');

exports.createBlog = async (req, res) => {
  try {
    const { title, content, tags = [] } = req.body;

    const tagIds = [];

    for (const tagName of tags) {
      const slug = slugify(tagName);
      let tag = await Tag.findOne({ slug });

      if (!tag) {
        tag = await Tag.create({ name: tagName, slug });
      }

      tagIds.push(tag._id);
    }

    const blog = await Blog.create({
      title,
      content,
      tags: tagIds,
      author: req.user._id,
    });

    const populatedBlog = await Blog.findById(blog._id)
      .populate('author', 'username')
      .populate('tags',);

    res.status(201).json(populatedBlog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create blog' });
  }
};

exports.getAllBlogs = async (req, res) => {
  const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
  const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;
  const skip = (page - 1) * limit;
  const { search, tag } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

     if (tag) {
      const tagSlugs = tag.split(',').map((t) => t.trim());
      const tagDocs = await Tag.find({ slug: { $in: tagSlugs } });

      const tagIds = tagDocs.map((t) => t._id);

      if (tagIds.length) {
        query.tags = { $in: tagIds };
      } else {
        return res.json({ total: 0, page, pages: 0, blogs: [] });
      }
    }

  const blogs = await Blog.find(query)
    .populate('author', 'username')
    .populate('tags',)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Blog.countDocuments(query);

  res.json({
    total,
    page,
    pages: Math.ceil(total / limit),
    blogs
  });
};

exports.getBlogById = async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('author', 'username').populate('tags',);
  if (!blog) return res.status(404).json({ message: 'Not found' });
  res.json(blog);
};

exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog || blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { title, content, tags = [] } = req.body;

    const tagIds = [];
    for (const tagName of tags) {
      const slug = slugify(tagName);
      let tag = await Tag.findOne({ slug });

      if (!tag) {
        tag = await Tag.create({ name: tagName, slug });
      }

      tagIds.push(tag._id);
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.tags = tagIds;

    await blog.save();

    const updatedBlog = await Blog.findById(blog._id)
      .populate('author', 'username')
      .populate('tags');

    res.json(updatedBlog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update blog' });
  }
};

exports.deleteBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog || blog.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  await blog.deleteOne();
  res.json({ message: 'Deleted' });
};
