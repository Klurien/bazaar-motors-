import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/db.js';

export const register = async (req, res) => {
    let { username, password, role } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Force Hailey to be an admin upon registration
    if (username.toLowerCase() === 'hailey') {
        role = 'admin';
    }

    try {
        const [existing] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.execute(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            [username, hashedPassword, role || 'user']
        );

        const userId = result.insertId;
        const userRole = role || 'user';
        const secret = process.env.JWT_SECRET || 'fallback_secret_key_12345';
        const token = jwt.sign({ id: userId, username, role: userRole }, secret, { expiresIn: '1d' });

        res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.status(201).json({
            token,
            user: { id: userId, username, role: userRole }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        const user = users[0];

        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const secret = process.env.JWT_SECRET || 'fallback_secret_key_12345';
        const token = jwt.sign({ id: user.id, username, role: user.role }, secret, { expiresIn: '1d' });

        res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.json({
            token,
            user: { id: user.id, username, role: user.role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

export const logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
};

export const getMe = async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, username, role FROM users WHERE id = ?', [req.user.id]);
        res.json(users[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data' });
    }
};
