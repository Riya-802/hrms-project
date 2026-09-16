const db = require('../config/db');
const bcrypt = require('bcryptjs');

/**
 * Helper to generate next unique Employee ID (e.g. EMP011)
 */
const generateNextEmployeeId = async () => {
  const query = `
    SELECT employee_id 
    FROM employees 
    WHERE employee_id ~ '^EMP[0-9]+$' 
    ORDER BY CAST(SUBSTRING(employee_id FROM 4) AS INT) DESC 
    LIMIT 1;
  `;
  const { rows } = await db.query(query);
  if (rows.length === 0) return 'EMP001';
  
  const lastNum = parseInt(rows[0].employee_id.replace('EMP', ''), 10);
  const nextNum = lastNum + 1;
  return `EMP${String(nextNum).padStart(3, '0')}`;
};

/**
 * GET /api/employees
 * Fetch paginated employees with search & filtering options
 */
const getEmployees = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const offset = (page - 1) * limit;

    const { search, department, status } = req.query;

    const whereConditions = [];
    const queryParams = [];
    let paramIndex = 1;

    // Search filter: full_name, email, or employee_id
    if (search && search.trim() !== '') {
      whereConditions.push(`(e.full_name ILIKE $${paramIndex} OR e.email ILIKE $${paramIndex} OR e.employee_id ILIKE $${paramIndex})`);
      queryParams.push(`%${search.trim()}%`);
      paramIndex++;
    }

    // Department filter: ID or Department Name
    if (department && department.trim() !== '') {
      if (!isNaN(parseInt(department, 10))) {
        whereConditions.push(`e.department_id = $${paramIndex}`);
        queryParams.push(parseInt(department, 10));
      } else {
        whereConditions.push(`d.department_name ILIKE $${paramIndex}`);
        queryParams.push(`%${department.trim()}%`);
      }
      paramIndex++;
    }

    // Status filter
    if (status && status.trim() !== '') {
      whereConditions.push(`e.status = $${paramIndex}`);
      queryParams.push(status.trim());
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Count Total Matching Records
    const countQuery = `
      SELECT COUNT(e.id)::INT AS total
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      ${whereClause};
    `;
    const { rows: countRows } = await db.query(countQuery, queryParams);
    const total = countRows[0].total;
    const totalPages = Math.ceil(total / limit) || 1;

    // Fetch Paginated Employees
    const dataQuery = `
      SELECT 
        e.id,
        e.employee_id,
        e.full_name,
        e.email,
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
        e.created_at,
        e.updated_at
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      ${whereClause}
      ORDER BY e.id ASC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1};
    `;

    const { rows: dataRows } = await db.query(dataQuery, [...queryParams, limit, offset]);

    res.status(200).json({
      success: true,
      data: dataRows,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/employees/:id
 * Fetch single employee details by primary ID or employee_id (e.g. EMP001)
 */
const getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let query;
    let queryParams;

    if (!isNaN(parseInt(id, 10)) && String(parseInt(id, 10)) === id) {
      query = `
        SELECT 
          e.*,
          d.department_name,
          d.description AS department_description
        FROM employees e
        LEFT JOIN departments d ON e.department_id = d.id
        WHERE e.id = $1;
      `;
      queryParams = [parseInt(id, 10)];
    } else {
      query = `
        SELECT 
          e.*,
          d.department_name,
          d.description AS department_description
        FROM employees e
        LEFT JOIN departments d ON e.department_id = d.id
        WHERE e.employee_id = $1;
      `;
      queryParams = [id.trim()];
    }

    const { rows } = await db.query(query, queryParams);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/employees
 * Create a new employee record
 */
const createEmployee = async (req, res, next) => {
  try {
    const {
      employee_id,
      full_name,
      email,
      password,
      role = 'employee',
      phone,
      date_of_birth,
      gender,
      designation,
      department_id,
      joining_date,
      employment_type = 'Full-time',
      salary,
      status = 'Active',
      address,
      profile_photo
    } = req.body;

    // Check if department exists
    const deptCheck = await db.query(`SELECT id, department_name FROM departments WHERE id = $1;`, [department_id]);
    if (deptCheck.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: `Department with ID ${department_id} does not exist.`
      });
    }

    // Generate or use provided employee_id
    const finalEmpId = employee_id ? employee_id.trim() : await generateNextEmployeeId();

    // Hash Password with bcryptjs (default password 'emp123' if omitted)
    const rawPassword = password && password.trim() ? password.trim() : 'emp123';
    const password_hash = await bcrypt.hash(rawPassword, 10);

    const insertQuery = `
      INSERT INTO employees (
        employee_id, full_name, email, password_hash, role, phone, date_of_birth, gender,
        designation, department_id, joining_date, employment_type,
        salary, status, address, profile_photo
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING id, employee_id, full_name, email, role, phone, date_of_birth, gender, designation, department_id, joining_date, employment_type, salary, status, address, profile_photo, created_at, updated_at;
    `;

    const values = [
      finalEmpId,
      full_name.trim(),
      email.trim().toLowerCase(),
      password_hash,
      role,
      phone ? phone.trim() : null,
      date_of_birth || null,
      gender || null,
      designation.trim(),
      department_id,
      joining_date,
      employment_type,
      salary,
      status,
      address ? address.trim() : null,
      profile_photo ? profile_photo.trim() : null
    ];

    const { rows } = await db.query(insertQuery, values);
    const newEmp = rows[0];

    res.status(201).json({
      success: true,
      message: 'Employee created successfully with secure hashed credentials',
      data: {
        ...newEmp,
        department_name: deptCheck.rows[0].department_name
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/employees/:id
 * Update an existing employee record
 */
const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if employee exists
    const existingEmp = await db.query(`SELECT * FROM employees WHERE id = $1;`, [id]);
    if (existingEmp.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    const {
      full_name,
      email,
      phone,
      date_of_birth,
      gender,
      designation,
      department_id,
      joining_date,
      employment_type,
      salary,
      status,
      address,
      profile_photo
    } = req.body;

    // If department_id provided, check existence
    if (department_id) {
      const deptCheck = await db.query(`SELECT id FROM departments WHERE id = $1;`, [department_id]);
      if (deptCheck.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: `Department with ID ${department_id} does not exist.`
        });
      }
    }

    const updateQuery = `
      UPDATE employees
      SET
        full_name = COALESCE($1, full_name),
        email = COALESCE($2, email),
        phone = COALESCE($3, phone),
        date_of_birth = COALESCE($4, date_of_birth),
        gender = COALESCE($5, gender),
        designation = COALESCE($6, designation),
        department_id = COALESCE($7, department_id),
        joining_date = COALESCE($8, joining_date),
        employment_type = COALESCE($9, employment_type),
        salary = COALESCE($10, salary),
        status = COALESCE($11, status),
        address = COALESCE($12, address),
        profile_photo = COALESCE($13, profile_photo),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $14
      RETURNING *;
    `;

    const values = [
      full_name ? full_name.trim() : null,
      email ? email.trim().toLowerCase() : null,
      phone !== undefined ? (phone ? phone.trim() : null) : null,
      date_of_birth || null,
      gender || null,
      designation ? designation.trim() : null,
      department_id || null,
      joining_date || null,
      employment_type || null,
      salary !== undefined ? salary : null,
      status || null,
      address !== undefined ? (address ? address.trim() : null) : null,
      profile_photo !== undefined ? (profile_photo ? profile_photo.trim() : null) : null,
      id
    ];

    const { rows } = await db.query(updateQuery, values);

    // Fetch joined department name
    const joinedQuery = `
      SELECT e.*, d.department_name 
      FROM employees e 
      LEFT JOIN departments d ON e.department_id = d.id 
      WHERE e.id = $1;
    `;
    const { rows: joinedRows } = await db.query(joinedQuery, [id]);

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: joinedRows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/employees/:id
 * Delete an employee record
 */
const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    const checkQuery = `SELECT * FROM employees WHERE id = $1;`;
    const { rows } = await db.query(checkQuery, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    await db.query(`DELETE FROM employees WHERE id = $1;`, [id]);

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
