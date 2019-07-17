import Joi from '@hapi/joi';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    // Validate request body
    const schema = Joi.object({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .required()
        .min(6),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      // Return error message provided by Joi
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Check password
    if (!(await user.checkPassword(password))) {
      res.status(401).json({ error: 'Password does not match' });
    }

    // Return user data and generated token
    const { id, name } = user;
    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
