const { pool } = require('./src/config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function testAuth() {
  console.log('🧪 Testing Backend Authentication against PostgreSQL...');
  try {
    // 1. Check Admin Account
    const adminRes = await pool.query("SELECT * FROM employees WHERE role = 'admin' AND employee_id = 'ADM001';");
    console.log('Admin Query Result:', adminRes.rows.length, 'user found.');
    if (adminRes.rows.length > 0) {
      const admin = adminRes.rows[0];
      const passValid = await bcrypt.compare('admin123', admin.password_hash);
      console.log('✅ Admin password verify (admin123):', passValid);
    }

    // 2. Check Employee Account
    const empRes = await pool.query("SELECT * FROM employees WHERE role = 'employee' AND employee_id = 'EMP001';");
    console.log('Employee Query Result:', empRes.rows.length, 'user found.');
    if (empRes.rows.length > 0) {
      const emp = empRes.rows[0];
      const passValid = await bcrypt.compare('emp123', emp.password_hash);
      console.log('✅ Employee password verify (emp123):', passValid);
    }
  } catch (err) {
    console.error('❌ Test error:', err.message);
  } finally {
    await pool.end();
  }
}

testAuth();
