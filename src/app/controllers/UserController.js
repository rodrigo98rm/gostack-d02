import Joi from '@hapi/joi';
import User from '../models/User';

class UserController {
  // CREATE
  async store(req, res) {
    // Validation
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email(),
      password_hash: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      // Return error message provided by Joi
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if user already exists on db
    const userExists = User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id, name, email } = await User.create(req.body);
    return res.json({ id, name, email });
  }
}

export default new UserController();
