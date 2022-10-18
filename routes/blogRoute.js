import express from 'express';
import {
  writeBlog,
  getBlogs,
  getBlog,
  getYourBlogs,
  editBlog,
  deleteBlog,
} from '../controllers/blogController.js';
import multer from 'multer';

import authMiddleware from '../middlewares/authMiddleware.js';

const upload = multer({ dest: './uploads' });

const router = express.Router();

// @desc   : Get a blog
// @route  : POST /api/blog/:_id
// @access : Public
router.get('/:_id', getBlog);

// @desc   : Get blogs
// @route  : POST /api/blog/
// @access : Public
router.get('/', getBlogs);

// @desc   : Get your blogs
// @route  : POST /api/blog/myblogs/getall
// @access : Private
router.get('/myblogs/getall', authMiddleware, getYourBlogs);

// @desc   : Add blog
// @route  : POST /api/blog/write
// @access : Private
router.post('/write', authMiddleware, upload.single('image'), writeBlog);

// @desc   : Edit a blog
// @route  : PATCH /api/blog/:_id
// @access : Private
router.patch('/:_id', authMiddleware, editBlog);

// @desc   : Delete a blog
// @route  : DELETE /api/blog/:_id
// @access : Private
router.delete('/:_id', authMiddleware, deleteBlog);

export default router;
