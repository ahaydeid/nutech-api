import { query } from '../config/db';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

export async function register(req, res) {
  const { name, email, password } = req.body;
  const hashed = await hash(password, 10);
  try {
    await query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
      [name, email, hashed]
    );
    res.json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ message: err.detail || 'Error registering user' });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login error' });
  }
}
