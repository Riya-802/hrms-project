const db = require('../config/db');

/**
 * GET /api/dashboard/stats
 * Return overview statistics: total, active, inactive employees and department count
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const statsQuery = `
      SELECT 
        (SELECT COUNT(*)::INT FROM employees) AS "totalEmployees",
        (SELECT COUNT(*)::INT FROM employees WHERE status = 'Active') AS "activeEmployees",
        (SELECT COUNT(*)::INT FROM employees WHERE status != 'Active') AS "inactiveEmployees",
        (SELECT COUNT(*)::INT FROM departments) AS "totalDepartments";
    `;

    const { rows } = await db.query(statsQuery);

    res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/dashboard/department-summary
 * Return employee count for every department
 */
const getDepartmentSummary = async (req, res, next) => {
  try {
    const summaryQuery = `
      SELECT 
        d.department_name AS "department",
        COUNT(e.id)::INT AS "employeeCount"
      FROM departments d
      LEFT JOIN employees e ON d.id = e.department_id
      GROUP BY d.id, d.department_name
      ORDER BY d.id ASC;
    `;

    const { rows } = await db.query(summaryQuery);

    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/dashboard/recent-employees
 * Return the latest 5 onboarded employees
 */
const getRecentEmployees = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit || '5', 10);

    const recentQuery = `
      SELECT 
        e.id,
        e.employee_id,
        e.full_name,
        e.email,
        e.designation,
        e.department_id,
        d.department_name,
        e.joining_date,
        e.employment_type,
        e.salary,
        e.status,
        e.profile_photo,
        e.created_at
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      ORDER BY e.created_at DESC, e.joining_date DESC
      LIMIT $1;
    `;

    const { rows } = await db.query(recentQuery, [limit]);

    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getDepartmentSummary,
  getRecentEmployees
};
