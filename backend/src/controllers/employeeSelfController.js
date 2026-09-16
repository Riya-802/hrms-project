const db = require('../config/db');

/**
 * GET /api/employee/me/dashboard
 * Delivers real database record for the currently logged-in employee (req.user.id)
 */
const getSelfDashboard = async (req, res, next) => {
  try {
    const employeeId = req.user.id;

    const query = `
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
        e.created_at
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE e.id = $1;
    `;

    const { rows } = await db.query(query, [employeeId]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Employee record not found in database.'
      });
    }

    const emp = rows[0];

    // Compute dynamic breakdown for employee
    const grossAnnual = parseFloat(emp.salary || 0);
    const monthlyGross = Math.round(grossAnnual / 12);
    const taxDeductions = Math.round(monthlyGross * 0.10);
    const netPayable = monthlyGross - taxDeductions;

    return res.status(200).json({
      success: true,
      data: {
        id: emp.id,
        employeeId: emp.employee_id,
        fullName: emp.full_name,
        email: emp.email,
        phone: emp.phone || '+1 555-0199',
        dob: emp.date_of_birth,
        gender: emp.gender,
        designation: emp.designation,
        departmentId: emp.department_id,
        department: emp.department_name || 'General',
        joiningDate: emp.joining_date,
        employmentType: emp.employment_type,
        salary: String(emp.salary),
        status: emp.status,
        address: emp.address,
        profilePhoto: emp.profile_photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256',
        payroll: {
          grossAnnual,
          monthlyGross,
          taxDeductions,
          netPayable
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSelfDashboard
};
