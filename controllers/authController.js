import User from '../models/UserModel.js';
import bcryptjs from 'bcryptjs';
import generateToken from '../utils/generateToken.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('profile')
      .select('username')
      .select('email');

    if (user) {
      return res.status(200).json(user);
    }

    req.status(404).json({ error: 'Could not find user' });
  } catch (error) {
    req.status(404).json({ error: 'Could not find user' });
  }
};

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

  try {
    const usernameExist = await User.findOne({ username });
    if (usernameExist) {
      return res.status(403).json({ error: 'Username already in use.' });
    }

    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.status(403).json({ error: 'Email already in use.' });
    }

    // Upload image on cloudinary
    const image = await cloudinary.uploader.upload(req.file.path, {
      folder: 'blogscloud/profiles',
    });

    // Delete image on server
    fs.unlinkSync(req.file.path);

    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(password, salt);

    const user = await User.create({
      profile:
        image.url ||
        'https://res.cloudinary.com/dhananjaykuber-cloud/image/upload/v1665562127/Group_4_crvmbt.png',
      username,
      email,
      password: hash,
    });

    const token = await generateToken(user._id);

    return res.status(200).json({ token, email });
  } catch (error) {
    res.status(500).json({ error: 'Could not register.' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ error: 'Please provide correct email.' });
  }

  const hashToPassword = await bcryptjs.compare(password, user.password);

  if (!hashToPassword) {
    return res.status(401).json({ error: 'Please provide correct password.' });
  }

  const token = await generateToken(user._id);

  res.status(200).json({ token, email });
};

export { signup, login, getUser };
