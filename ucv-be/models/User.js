const { pool } = require('../config/database');

class User {
    constructor(user) {
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.username = user.username;
        this.password = user.password;
        this.created_at = user.created_at;
    }

    static async findAll() {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query('SELECT * FROM users');
            return rows;
        } catch (err) {
            console.error('Error getting users: ', err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    static async findById(id) {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query('SELECT * FROM users WHERE id = ?', [id]);
            return rows[0];
        } catch (err) {
            console.error('Error getting user by id: ', err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    static async create(newUser) {
        let conn;
        try {
            conn = await pool.getConnection();
            const result = await conn.query(
                'INSERT INTO users (name, email, username, password) VALUES (?, ?, ?, ?)',
                [newUser.name, newUser.email, newUser.username, newUser.password]
            );
            return { id: result.insertId, ...newUser };
        } catch (err) {
            console.error('Error creating user: ', err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    static async update(id, user) {
        let conn;
        try {
            conn = await pool.getConnection();
            await conn.query(
                'UPDATE users SET name = ?, email = ?, username = ? WHERE id = ?',
                [user.name, user.email, user.username, id]
            );
            return { id, ...user };
        } catch (err) {
            console.error('Error updating user: ', err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    static async delete(id) {
        let conn;
        try {
            conn = await pool.getConnection();
            await conn.query('DELETE FROM users WHERE id = ?', [id]);
            return true;
        } catch (err) {
            console.error('Error deleting user: ', err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    static async findByUsername(username) {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query('SELECT * FROM users WHERE username = ?', [username]);
            return rows[0];
        } catch (err) {
            console.error('Error getting user by username: ', err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }
}

module.exports = User; 