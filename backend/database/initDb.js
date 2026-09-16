const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { pool } = require('../src/config/db');

async function initDb() {
  console.log('🔄 Initializing HRMS PostgreSQL Database with Auth Support...');
  
  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

    console.log('📜 Executing schema.sql...');
    await pool.query(schemaSql);
    console.log('✅ Schema tables created successfully.');

    console.log('🌱 Seeding initial Departments & Employees with bcrypt hashed credentials...');
    
    // Clear existing data
    await pool.query('TRUNCATE TABLE employees, departments RESTART IDENTITY CASCADE;');

    // 1. Insert Departments
    await pool.query(`
      INSERT INTO departments (department_name, description, status) VALUES
      ('Information Technology', 'Software development, infrastructure, systems administration, and IT support.', 'Active'),
      ('Human Resources', 'Talent acquisition, employee relations, payroll administration, and workplace compliance.', 'Active'),
      ('Finance', 'Financial accounting, auditing, budgeting, and corporate expenditure management.', 'Active'),
      ('Marketing', 'Brand strategy, digital marketing, public relations, and content production.', 'Active'),
      ('Operations', 'Business operations, supply chain, facilities management, and administrative logistics.', 'Active');
    `);

    // Pre-generate hashed passwords
    const adminPassHash = bcrypt.hashSync('admin123', 10);
    const empPassHash = bcrypt.hashSync('emp123', 10);

    // 2. Insert Admin Account (ADM001)
    await pool.query(`
      INSERT INTO employees 
      (employee_id, full_name, email, password_hash, role, phone, date_of_birth, gender, designation, department_id, joining_date, employment_type, salary, status, address, profile_photo) 
      VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16);
    `, [
      'ADM001', 'Alexander Pierce', 'admin@hrms.com', adminPassHash, 'admin',
      '+1 555-0101', '1985-04-12', 'Male', 'HR Director', 2, '2020-01-01',
      'Full-time', 150000.00, 'Active', 'HQ Corporate Suite 100',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
    ]);

    // 3. Insert Employee Accounts (EMP001 - EMP010)
    const employees = [
      ['EMP001', 'Aarav Sharma', 'aarav.sharma@company.com', empPassHash, 'employee', '+91 98765 43210', '1992-05-14', 'Male', 'Senior Full Stack Engineer', 1, '2022-03-15', 'Full-time', 125000.00, 'Active', '402 Cyber Heights, Tech Park, Bangalore', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'],
      ['EMP002', 'Priya Patel', 'priya.patel@company.com', empPassHash, 'employee', '+91 98765 43211', '1990-11-20', 'Female', 'HR Operations Lead', 2, '2021-08-10', 'Full-time', 95000.00, 'Active', '12 Green Avenue, Bandra, Mumbai', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256'],
      ['EMP003', 'Rahul Verma', 'rahul.verma@company.com', empPassHash, 'employee', '+91 98765 43212', '1988-02-04', 'Male', 'Financial Controller', 3, '2020-01-05', 'Full-time', 110000.00, 'Active', '88 Corporate Plaza, Connaught Place, New Delhi', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256'],
      ['EMP004', 'Ananya Roy', 'ananya.roy@company.com', empPassHash, 'employee', '+91 98765 43213', '1995-09-18', 'Female', 'Marketing Specialist', 4, '2023-02-01', 'Full-time', 78000.00, 'Active', '15 Lake View Drive, Salt Lake, Kolkata', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256'],
      ['EMP005', 'Vikram Singh', 'vikram.singh@company.com', empPassHash, 'employee', '+91 98765 43214', '1989-07-29', 'Male', 'Operations Director', 5, '2019-11-12', 'Full-time', 140000.00, 'Active', '304 Industry Hub, MIDC, Pune', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256'],
      ['EMP006', 'Sneha Reddy', 'sneha.reddy@company.com', empPassHash, 'employee', '+91 98765 43215', '1994-12-03', 'Female', 'Backend Developer (Node.js)', 1, '2022-09-01', 'Full-time', 98000.00, 'Active', '77 HITECH City Main Rd, Hyderabad', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'],
      ['EMP007', 'Rohan Gupta', 'rohan.gupta@company.com', empPassHash, 'employee', '+91 98765 43216', '1996-04-25', 'Male', 'Technical Recruiter', 2, '2023-06-15', 'Full-time', 68000.00, 'Active', '501 MG Road, Gurgaon', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256'],
      ['EMP008', 'Kavya Nair', 'kavya.nair@company.com', empPassHash, 'employee', '+91 98765 43217', '1993-08-11', 'Female', 'Senior Accountant', 3, '2022-01-10', 'Full-time', 85000.00, 'Active', '23 Commercial St, Kochi', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256'],
      ['EMP009', 'Amit Joshi', 'amit.joshi@company.com', empPassHash, 'employee', '+91 98765 43218', '1997-01-30', 'Male', 'Digital Growth Strategist', 4, '2023-11-20', 'Full-time', 72000.00, 'Active', '102 FC Road, Pune', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256'],
      ['EMP010', 'Neha Kapoor', 'neha.kapoor@company.com', empPassHash, 'employee', '+91 98765 43219', '1991-06-08', 'Female', 'Logistics Manager', 5, '2021-04-18', 'Full-time', 90000.00, 'On Leave', '44 Ring Road, Ahmedabad', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256']
    ];

    for (const emp of employees) {
      await pool.query(`
        INSERT INTO employees 
        (employee_id, full_name, email, password_hash, role, phone, date_of_birth, gender, designation, department_id, joining_date, employment_type, salary, status, address, profile_photo) 
        VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16);
      `, emp);
    }

    console.log('✅ 1 Admin and 10 Employee accounts created with hashed passwords!');
    console.log('🎉 Database initialization complete!');
  } catch (err) {
    console.error('❌ Error initializing database:', err.message);
  } finally {
    await pool.end();
  }
}

initDb();
