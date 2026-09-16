const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');

/**
 * POST /api/auth/login
 * Real database authentication for Admin & Employee accounts
 */
const login = async (req, res, next) => {
  try {
    const { employee_id, email, password, role } = req.body;

    // Basic Input Validation
    if ((!employee_id && !email) || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Employee ID / Email and Password.'
      });
    }

    const cleanId = employee_id ? employee_id.trim() : '';
    const cleanEmail = email ? email.trim().toLowerCase() : '';

    // Search Database for matching Employee / Admin record
    const query = `
      SELECT 
        e.id,
        e.employee_id,
        e.full_name,
        e.email,
        e.password_hash,
        e.role,
        e.phone,
        e.designation,
        e.department_id,
        d.department_name,
        e.joining_date,
        e.employment_type,
        e.salary,
        e.status,
        e.profile_photo
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE (LOWER(e.employee_id) = LOWER($1) OR LOWER(e.email) = LOWER($2));
    `;

    const { rows } = await db.query(query, [cleanId, cleanEmail]);

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Employee ID, Email, or Password.'
      });
    }

    const user = rows[0];

    // Verify account status
    if (user.status === 'Inactive' || user.status === 'Terminated') {
      return res.status(403).json({
        success: false,
        message: 'Account is inactive. Please contact your HR Administrator.'
      });
    }

    // Role Check
    if (role && user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `Account is not authorized for ${role === 'admin' ? 'Admin Portal' : 'Employee Portal'} access.`
      });
    }

    // Verify Password Hash with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Employee ID, Email, or Password.'
      });
    }

    // Generate JWT Token
    const payload = {
      id: user.id,
      employee_id: user.employee_id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      department_id: user.department_id,
      department_name: user.department_name
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    // Exclude password_hash from JSON response
    delete user.password_hash;

    return res.status(200).json({
      success: true,
      message: 'Authentication successful.',
      token,
      user: {
        ...user,
        fullName: user.full_name,
        employeeId: user.employee_id,
        department: user.department_name,
        profilePhoto: user.profile_photo
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Fetch authenticated user record from database using token
 */
const getMe = async (req, res, next) => {
  try {
    const query = `
      SELECT 
        e.id,
        e.employee_id,
        e.full_name,
        e.email,
        e.role,
        e.phone,
        e.date_of_birth,
        e.gender,
        e.designation,
        e.department_id,
        d.department_name,
        e.joining_date,
        e.employment_type,
        e.salary,
        e.status,
        e.address,
        e.profile_photo,
        e.created_at
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE e.id = $1;
    `;

    const { rows } = await db.query(query, [req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User record not found.' });
    }

    const user = rows[0];

    return res.status(200).json({
      success: true,
      user: {
        ...user,
        fullName: user.full_name,
        employeeId: user.employee_id,
        department: user.department_name,
        profilePhoto: user.profile_photo
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  getMe
};
