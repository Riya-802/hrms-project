const db = require('../config/db');

/**
 * GET /api/departments
 * Fetch all departments with associated employee count
 */
const getDepartments = async (req, res, next) => {
  try {
    const query = `
      SELECT 
        d.id,
        d.department_name,
        d.description,
        d.status,
        d.created_at,
        d.updated_at,
        COUNT(e.id)::INT AS employee_count
      FROM departments d
      LEFT JOIN employees e ON d.id = e.department_id
      GROUP BY d.id
      ORDER BY d.id ASC;
    `;
    const { rows } = await db.query(query);

    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/departments/:id
 * Fetch department details and list of assigned employees
 */
const getDepartmentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deptQuery = `
      SELECT 
        d.id,
        d.department_name,
        d.description,
        d.status,
        d.created_at,
        d.updated_at,
        COUNT(e.id)::INT AS employee_count
      FROM departments d
      LEFT JOIN employees e ON d.id = e.department_id
      WHERE d.id = $1
      GROUP BY d.id;
    `;
    const { rows: deptRows } = await db.query(deptQuery, [id]);

    if (deptRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    const empQuery = `
      SELECT 
        id,
        employee_id,
        full_name,
        email,
        phone,
        designation,
        joining_date,
        employment_type,
        salary,
        status,
        profile_photo
      FROM employees
      WHERE department_id = $1
      ORDER BY id ASC;
    `;
    const { rows: empRows } = await db.query(empQuery, [id]);

    const departmentData = {
      ...deptRows[0],
      employees: empRows
    };

    res.status(200).json({
      success: true,
      data: departmentData
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/departments
 * Create a new department
 */
const createDepartment = async (req, res, next) => {
  try {
    const { department_name, description, status = 'Active' } = req.body;

    const insertQuery = `
      INSERT INTO departments (department_name, description, status)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const { rows } = await db.query(insertQuery, [
      department_name.trim(),
      description ? description.trim() : null,
      status
    ]);

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: {
        ...rows[0],
        employee_count: 0
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/departments/:id
 * Update an existing department
 */
const updateDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { department_name, description, status } = req.body;

    // Check existence
    const checkQuery = `SELECT * FROM departments WHERE id = $1;`;
    const { rows: existing } = await db.query(checkQuery, [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    const updateQuery = `
      UPDATE departments
      SET 
        department_name = COALESCE($1, department_name),
        description = COALESCE($2, description),
        status = COALESCE($3, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *;
    `;
    const { rows: updatedRows } = await db.query(updateQuery, [
      department_name ? department_name.trim() : null,
      description !== undefined ? (description ? description.trim() : null) : null,
      status || null,
      id
    ]);

    // Fetch updated count
    const countQuery = `SELECT COUNT(*)::INT AS employee_count FROM employees WHERE department_id = $1;`;
    const { rows: countRows } = await db.query(countQuery, [id]);

    res.status(200).json({
      success: true,
      message: 'Department updated successfully',
      data: {
        ...updatedRows[0],
        employee_count: countRows[0].employee_count
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/departments/:id
 * Delete a department (ON DELETE RESTRICT - fails if employees are assigned)
 */
const deleteDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check existence
    const checkQuery = `SELECT * FROM departments WHERE id = $1;`;
    const { rows: existing } = await db.query(checkQuery, [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    // Check assigned employees count
    const empCountQuery = `SELECT COUNT(*)::INT AS count FROM employees WHERE department_id = $1;`;
    const { rows: countRows } = await db.query(empCountQuery, [id]);

    if (countRows[0].count > 0) {
      return res.status(409).json({
        success: false,
        message: `Cannot delete department "${existing[0].department_name}" because ${countRows[0].count} employee(s) are assigned to it. Please reassign or remove employees first.`
      });
    }

    await db.query(`DELETE FROM departments WHERE id = $1;`, [id]);

    res.status(200).json({
      success: true,
      message: 'Department deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
};
