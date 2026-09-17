const db = require('../config/db');

/**
 * Helper to generate next unique Task ID (e.g. TSK007)
 */
const generateNextTaskId = async () => {
  const query = `
    SELECT task_id 
    FROM tasks 
    WHERE task_id ~ '^TSK[0-9]+$' 
    ORDER BY CAST(SUBSTRING(task_id FROM 4) AS INT) DESC 
    LIMIT 1;
  `;
  const { rows } = await db.query(query);
  if (rows.length === 0) return 'TSK001';
  
  const lastNum = parseInt(rows[0].task_id.replace('TSK', ''), 10);
  const nextNum = lastNum + 1;
  return `TSK${String(nextNum).padStart(3, '0')}`;
};

/**
 * GET /api/tasks
 * Retrieve tasks with filtering by status, priority, assigned_to, or search keyword
 */
const getTasks = async (req, res, next) => {
  try {
    const { status, assigned_to, priority, search } = req.query;

    const whereConditions = [];
    const queryParams = [];
    let paramIndex = 1;

    // Filter by status ('Pending', 'In Progress', 'Completed')
    if (status && status.trim() !== '') {
      whereConditions.push(`t.status ILIKE $${paramIndex}`);
      queryParams.push(status.trim());
      paramIndex++;
    }

    // Filter by priority ('Low', 'Medium', 'High', 'Urgent')
    if (priority && priority.trim() !== '') {
      whereConditions.push(`t.priority ILIKE $${paramIndex}`);
      queryParams.push(priority.trim());
      paramIndex++;
    }

    // Filter by assigned_to (employee database ID or employee_id string like EMP001)
    if (assigned_to && String(assigned_to).trim() !== '') {
      const val = String(assigned_to).trim();
      if (!isNaN(parseInt(val, 10)) && String(parseInt(val, 10)) === val) {
        whereConditions.push(`t.assigned_to = $${paramIndex}`);
        queryParams.push(parseInt(val, 10));
      } else {
        whereConditions.push(`e.employee_id = $${paramIndex}`);
        queryParams.push(val);
      }
      paramIndex++;
    }

    // Keyword search in title, description, or assigned employee name
    if (search && search.trim() !== '') {
      whereConditions.push(`(t.title ILIKE $${paramIndex} OR t.description ILIKE $${paramIndex} OR t.task_id ILIKE $${paramIndex} OR e.full_name ILIKE $${paramIndex})`);
      queryParams.push(`%${search.trim()}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const query = `
      SELECT 
        t.id,
        t.task_id,
        t.title,
        t.description,
        t.assigned_to,
        e.full_name AS assigned_to_name,
        e.employee_id AS assigned_to_emp_id,
        e.designation AS assigned_to_designation,
        e.profile_photo AS assigned_to_photo,
        t.created_by,
        cb.full_name AS created_by_name,
        t.priority,
        t.status,
        t.due_date,
        t.created_at,
        t.updated_at
      FROM tasks t
      LEFT JOIN employees e ON t.assigned_to = e.id
      LEFT JOIN employees cb ON t.created_by = cb.id
      ${whereClause}
      ORDER BY t.id DESC;
    `;

    const { rows } = await db.query(query, queryParams);

    res.status(200).json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/tasks/:id
 * Retrieve a single task by ID or task_id
 */
const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let query;
    let queryParams;

    if (!isNaN(parseInt(id, 10)) && String(parseInt(id, 10)) === id) {
      query = `
        SELECT 
          t.*,
          e.full_name AS assigned_to_name,
          e.employee_id AS assigned_to_emp_id,
          e.designation AS assigned_to_designation,
          e.profile_photo AS assigned_to_photo,
          cb.full_name AS created_by_name
        FROM tasks t
        LEFT JOIN employees e ON t.assigned_to = e.id
        LEFT JOIN employees cb ON t.created_by = cb.id
        WHERE t.id = $1;
      `;
      queryParams = [parseInt(id, 10)];
    } else {
      query = `
        SELECT 
          t.*,
          e.full_name AS assigned_to_name,
          e.employee_id AS assigned_to_emp_id,
          e.designation AS assigned_to_designation,
          e.profile_photo AS assigned_to_photo,
          cb.full_name AS created_by_name
        FROM tasks t
        LEFT JOIN employees e ON t.assigned_to = e.id
        LEFT JOIN employees cb ON t.created_by = cb.id
        WHERE t.task_id = $1;
      `;
      queryParams = [id.trim()];
    }

    const { rows } = await db.query(query, queryParams);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
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
 * POST /api/tasks
 * Create a new task assigned to an employee from PostgreSQL
 */
const createTask = async (req, res, next) => {
  try {
    const {
      title,
      description,
      assigned_to,
      priority = 'Medium',
      status = 'Pending',
      due_date
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }

    // Resolve assigned_to integer ID
    let realAssignedId = null;
    if (assigned_to) {
      const val = String(assigned_to).trim();
      let empCheck;
      if (!isNaN(parseInt(val, 10)) && String(parseInt(val, 10)) === val) {
        empCheck = await db.query(`SELECT id FROM employees WHERE id = $1;`, [parseInt(val, 10)]);
      } else {
        empCheck = await db.query(`SELECT id FROM employees WHERE employee_id = $1;`, [val]);
      }
      if (empCheck.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: `Assigned employee ID '${assigned_to}' does not exist in database.`
        });
      }
      realAssignedId = empCheck.rows[0].id;
    }

    // Optional created_by (from authenticated user req.user.id if available)
    const creatorId = req.user ? req.user.id : 1; // Default to Admin ID 1

    const taskId = await generateNextTaskId();

    const insertQuery = `
      INSERT INTO tasks (task_id, title, description, assigned_to, created_by, priority, status, due_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const values = [
      taskId,
      title.trim(),
      description ? description.trim() : null,
      realAssignedId,
      creatorId,
      priority,
      status,
      due_date || null
    ];

    const { rows } = await db.query(insertQuery, values);
    const newTask = rows[0];

    // Fetch joined details
    const joinedQuery = `
      SELECT 
        t.id,
        t.task_id,
        t.title,
        t.description,
        t.assigned_to,
        e.full_name AS assigned_to_name,
        e.employee_id AS assigned_to_emp_id,
        e.designation AS assigned_to_designation,
        e.profile_photo AS assigned_to_photo,
        t.created_by,
        cb.full_name AS created_by_name,
        t.priority,
        t.status,
        t.due_date,
        t.created_at,
        t.updated_at
      FROM tasks t
      LEFT JOIN employees e ON t.assigned_to = e.id
      LEFT JOIN employees cb ON t.created_by = cb.id
      WHERE t.id = $1;
    `;
    const joinedResult = await db.query(joinedQuery, [newTask.id]);

    res.status(201).json({
      success: true,
      message: 'Task created successfully in database',
      data: joinedResult.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/tasks/:id
 * Update task status or details
 */
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    let isNumeric = !isNaN(parseInt(id, 10)) && String(parseInt(id, 10)) === String(id);
    let checkQuery = isNumeric
      ? `SELECT * FROM tasks WHERE id = $1;`
      : `SELECT * FROM tasks WHERE task_id = $1;`;

    const existingTask = await db.query(checkQuery, [id]);
    if (existingTask.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const realTaskId = existingTask.rows[0].id;
    const { title, description, assigned_to, priority, status, due_date } = req.body;

    // Resolve assigned_to if provided
    let realAssignedId = existingTask.rows[0].assigned_to;
    if (assigned_to !== undefined && assigned_to !== null) {
      const val = String(assigned_to).trim();
      let empCheck;
      if (!isNaN(parseInt(val, 10)) && String(parseInt(val, 10)) === val) {
        empCheck = await db.query(`SELECT id FROM employees WHERE id = $1;`, [parseInt(val, 10)]);
      } else {
        empCheck = await db.query(`SELECT id FROM employees WHERE employee_id = $1;`, [val]);
      }
      if (empCheck.rows.length > 0) {
        realAssignedId = empCheck.rows[0].id;
      }
    }

    const updateQuery = `
      UPDATE tasks
      SET
        title = COALESCE($1, title),
        description = CASE WHEN $2::text IS NOT NULL THEN $2 ELSE description END,
        assigned_to = COALESCE($3, assigned_to),
        priority = COALESCE($4, priority),
        status = COALESCE($5, status),
        due_date = CASE WHEN $6::date IS NOT NULL THEN $6 ELSE due_date END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *;
    `;

    const values = [
      title && title.trim() ? title.trim() : null,
      description !== undefined ? (description ? description.trim() : null) : null,
      realAssignedId,
      priority || null,
      status || null,
      due_date || null,
      realTaskId
    ];

    await db.query(updateQuery, values);

    // Fetch updated details with employee join
    const joinedQuery = `
      SELECT 
        t.id,
        t.task_id,
        t.title,
        t.description,
        t.assigned_to,
        e.full_name AS assigned_to_name,
        e.employee_id AS assigned_to_emp_id,
        e.designation AS assigned_to_designation,
        e.profile_photo AS assigned_to_photo,
        t.created_by,
        cb.full_name AS created_by_name,
        t.priority,
        t.status,
        t.due_date,
        t.created_at,
        t.updated_at
      FROM tasks t
      LEFT JOIN employees e ON t.assigned_to = e.id
      LEFT JOIN employees cb ON t.created_by = cb.id
      WHERE t.id = $1;
    `;
    const { rows } = await db.query(joinedQuery, [realTaskId]);

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/tasks/:id
 * Delete a task
 */
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    let isNumeric = !isNaN(parseInt(id, 10)) && String(parseInt(id, 10)) === String(id);
    let checkQuery = isNumeric
      ? `SELECT * FROM tasks WHERE id = $1;`
      : `SELECT * FROM tasks WHERE task_id = $1;`;

    const { rows } = await db.query(checkQuery, [id]);
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const realTaskId = rows[0].id;
    await db.query(`DELETE FROM tasks WHERE id = $1;`, [realTaskId]);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/tasks/reports
 * Aggregate metrics and analytics for task reports page
 */
const getTaskReports = async (req, res, next) => {
  try {
    const totalQuery = `SELECT COUNT(*)::INT AS total FROM tasks;`;
    const pendingQuery = `SELECT COUNT(*)::INT AS count FROM tasks WHERE status = 'Pending';`;
    const inProgressQuery = `SELECT COUNT(*)::INT AS count FROM tasks WHERE status = 'In Progress';`;
    const completedQuery = `SELECT COUNT(*)::INT AS count FROM tasks WHERE status = 'Completed';`;

    const priorityQuery = `
      SELECT priority, COUNT(*)::INT AS count
      FROM tasks
      GROUP BY priority;
    `;

    const employeeDistributionQuery = `
      SELECT 
        e.id AS employee_id_num,
        e.employee_id,
        e.full_name,
        e.designation,
        COUNT(t.id)::INT AS total_tasks,
        COUNT(CASE WHEN t.status = 'Completed' THEN 1 END)::INT AS completed_tasks,
        COUNT(CASE WHEN t.status = 'In Progress' THEN 1 END)::INT AS in_progress_tasks,
        COUNT(CASE WHEN t.status = 'Pending' THEN 1 END)::INT AS pending_tasks
      FROM employees e
      LEFT JOIN tasks t ON e.id = t.assigned_to
      WHERE e.role = 'employee'
      GROUP BY e.id, e.employee_id, e.full_name, e.designation
      ORDER BY total_tasks DESC;
    `;

    const [totalRes, pendingRes, inProgressRes, completedRes, priorityRes, empDistRes] = await Promise.all([
      db.query(totalQuery),
      db.query(pendingQuery),
      db.query(inProgressQuery),
      db.query(completedQuery),
      db.query(priorityQuery),
      db.query(employeeDistributionQuery)
    ]);

    const total = totalRes.rows[0].total || 0;
    const pending = pendingRes.rows[0].count || 0;
    const inProgress = inProgressRes.rows[0].count || 0;
    const completed = completedRes.rows[0].count || 0;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        total,
        pending,
        inProgress,
        completed,
        completionRate,
        priorityBreakdown: priorityRes.rows,
        employeeDistribution: empDistRes.rows
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskReports
};
