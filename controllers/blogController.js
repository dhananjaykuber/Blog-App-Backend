import Blog from '../models/blogModel.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const getBlog = async (req, res) => {
  const { _id } = req.params;

  try {
    const blog = await Blog.findOne({ _id });

    res.status(200).json(blog);
  } catch (error) {
    res.status(401).json({ error: 'Could not get blog.' });
  }
};

const getBlogs = async (req, res) => {
  const { page } = req.query | 0;

  const blogsPerPage = 5;

  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .skip(page * blogsPerPage)
      .limit(blogsPerPage);

    res.status(200).json(blogs);
  } catch (error) {
    res.status(401).json({ error: 'Could not get blogs.' });
  }
};

const getYourBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ authorId: req.user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json(blogs);
  } catch (error) {
    res.status(401).json({ error: 'Could not get blogs.' });
  }
};

const writeBlog = async (req, res) => {
  const { title, description, category } = req.body;

  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

  try {
    // Upload image on cloudinary
    const image = await cloudinary.uploader.upload(req.file.path, {
      folder: 'blogscloud/blogs',
    });

    // Delete image on server
    fs.unlinkSync(req.file.path);

    const blog = await Blog.create({
      image: image.url,
      title,
      description,
      authorId: req.user._id,
      authorName: req.user.username,
      profile: req.user.profile,
      category,
    });

    return res.status(200).json(blog);
  } catch (error) {
    fs.unlinkSync(req.file.path);
    res.status(500).json({ error: 'Could not add blog.' });
  }
};

const editBlog = async (req, res) => {
  const { _id } = req.params;

  const { title, description, category } = req.body;

  try {
    const blog = await Blog.updateOne(
      { _id },
      { title, description, category }
    );

    return res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Could not update blog.' });
  }
};

const deleteBlog = async (req, res) => {
  const { _id } = req.params;

  try {
    const blog = await Blog.deleteOne({ _id, authorId: req.user._id });

    return res.status(200).json(blog);
  } catch (error) {
    res.status(401).json({ error: 'Could not delete blog.' });
  }
};

export { getBlogs, getBlog, writeBlog, getYourBlogs, editBlog, deleteBlog };
