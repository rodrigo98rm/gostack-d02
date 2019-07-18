import Joi from '@hapi/joi';
import User from '../models/User';

class UserController {
  // CREATE
  async store(req, res) {
    // Validation
    const schema = Joi.object({
      name: Joi.string().required(),
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

    // Check if user already exists on db
    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id, name, email } = await User.create(req.body);
    return res.json({ id, name, email });
  }

  // UPDATE
  async update(req, res) {
    // Request body validation
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email(),
      password: Joi.string().min(6),
      confirmPassword: Joi.string().when('password', {
        is: Joi.string().required(),
        then: Joi.string()
          .required()
          .valid(Joi.ref('password')),
      }),
      oldPassword: Joi.string().when('password', {
        is: Joi.string().required(),
        then: Joi.string().required(),
      }),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      // Return error message provided by Joi
      return res.status(400).json({ error: error.details[0].message });
    }

    // Get user by id
    const user = await User.findByPk(req.userId);

    const { password, oldPassword } = req.body;
    const newEmail = req.body.email;

    // If email is being changed, it has to be unique
    if (newEmail) {
      if (newEmail !== user.email) {
        const emailExists = await User.findOne({ where: { email: newEmail } });
        if (emailExists) {
          return res.status(400).json({ error: 'This email is unavailable' });
        }
      }
    }

    // If password id being changed, check if oldPassword is correct
    if (password && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    // Update user
    const { id, name, email } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }
}

export default new UserController();
