import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    image: {
      type: String,
      default:
        'https://preview.colorlib.com/theme/webmag/img/xpost-5.jpg.pagespeed.ic.jXTrIrIxiM.webp',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    authorId: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
