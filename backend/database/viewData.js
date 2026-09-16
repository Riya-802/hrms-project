const { pool } = require('../src/config/db');

async function viewRealData() {
  console.log('\n============== 🏢 HRMS DEPARTMENTS TABLE ==============');
  try {
    const depts = await pool.query('SELECT * FROM departments ORDER BY id ASC;');
    console.table(depts.rows);

    console.log('\n============== 👨‍💼 HRMS EMPLOYEES TABLE ==============');
    const emps = await pool.query(`
      SELECT 
        e.id, 
        e.employee_id, 
        e.full_name, 
        e.email, 
        e.designation, 
        d.department_name, 
        e.salary, 
        e.status 
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      ORDER BY e.id ASC;
    `);
    console.table(emps.rows);
  } catch (err) {
    console.error('❌ Error reading database:', err.message);
  } finally {
    await pool.end();
  }
}

viewRealData();
