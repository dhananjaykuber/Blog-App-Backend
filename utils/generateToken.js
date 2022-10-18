import jwt from 'jsonwebtoken';

const generateToken = async (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: '3d',
  });
};

export default generateToken;
