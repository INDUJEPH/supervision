import express from 'express';
import cors from 'cors';
import { pool } from './config/database';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Test database connection
app.get('/api/test', async (req, res) => {
  try {
    const [result] = await pool.query('SELECT 1');
    res.json({ message: 'Database connection successful', result });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Students endpoints
app.get('/api/students', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM students');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

app.get('/api/students/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [req.params.id]);
    if (Array.isArray(rows) && rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const { name, roll_number, department, semester, section, elective_subjects } = req.body;
    const [result] = await pool.query(
      'INSERT INTO students (id, name, roll_number, department, semester, section, elective_subjects) VALUES (UUID(), ?, ?, ?, ?, ?, ?)',
      [name, roll_number, department, semester, section, JSON.stringify(elective_subjects)]
    );
    res.status(201).json({ message: 'Student created successfully', result });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
});

app.put('/api/students/:id', async (req, res) => {
  try {
    const { name, roll_number, department, semester, section, elective_subjects } = req.body;
    await pool.query(
      'UPDATE students SET name = ?, roll_number = ?, department = ?, semester = ?, section = ?, elective_subjects = ? WHERE id = ?',
      [name, roll_number, department, semester, section, JSON.stringify(elective_subjects), req.params.id]
    );
    res.json({ message: 'Student updated successfully' });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM students WHERE id = ?', [req.params.id]);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// Faculty endpoints
app.get('/api/faculty', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM faculty');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching faculty:', error);
    res.status(500).json({ error: 'Failed to fetch faculty' });
  }
});

app.get('/api/faculty/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM faculty WHERE id = ?', [req.params.id]);
    if (Array.isArray(rows) && rows.length === 0) {
      return res.status(404).json({ error: 'Faculty member not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching faculty member:', error);
    res.status(500).json({ error: 'Failed to fetch faculty member' });
  }
});

app.post('/api/faculty', async (req, res) => {
  try {
    const { name, department, email, phone, max_supervisions, seniority, availability } = req.body;
    const [result] = await pool.query(
      'INSERT INTO faculty (id, name, department, email, phone, max_supervisions, seniority, availability) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?)',
      [name, department, email, phone, max_supervisions, seniority, JSON.stringify(availability)]
    );
    res.status(201).json({ message: 'Faculty member created successfully', result });
  } catch (error) {
    console.error('Error creating faculty member:', error);
    res.status(500).json({ error: 'Failed to create faculty member' });
  }
});

app.put('/api/faculty/:id', async (req, res) => {
  try {
    const { name, department, email, phone, max_supervisions, seniority, availability } = req.body;
    await pool.query(
      'UPDATE faculty SET name = ?, department = ?, email = ?, phone = ?, max_supervisions = ?, seniority = ?, availability = ? WHERE id = ?',
      [name, department, email, phone, max_supervisions, seniority, JSON.stringify(availability), req.params.id]
    );
    res.json({ message: 'Faculty member updated successfully' });
  } catch (error) {
    console.error('Error updating faculty member:', error);
    res.status(500).json({ error: 'Failed to update faculty member' });
  }
});

app.delete('/api/faculty/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM faculty WHERE id = ?', [req.params.id]);
    res.json({ message: 'Faculty member deleted successfully' });
  } catch (error) {
    console.error('Error deleting faculty member:', error);
    res.status(500).json({ error: 'Failed to delete faculty member' });
  }
});

// Classrooms endpoints
app.get('/api/classrooms', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM classrooms');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching classrooms:', error);
    res.status(500).json({ error: 'Failed to fetch classrooms' });
  }
});

app.get('/api/classrooms/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM classrooms WHERE id = ?', [req.params.id]);
    if (Array.isArray(rows) && rows.length === 0) {
      return res.status(404).json({ error: 'Classroom not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching classroom:', error);
    res.status(500).json({ error: 'Failed to fetch classroom' });
  }
});

app.post('/api/classrooms', async (req, res) => {
  try {
    const { name, building, floor, capacity, has_projector, is_computer_lab, is_active } = req.body;
    const [result] = await pool.query(
      'INSERT INTO classrooms (id, name, building, floor, capacity, has_projector, is_computer_lab, is_active) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?)',
      [name, building, floor, capacity, has_projector, is_computer_lab, is_active]
    );
    res.status(201).json({ message: 'Classroom created successfully', result });
  } catch (error) {
    console.error('Error creating classroom:', error);
    res.status(500).json({ error: 'Failed to create classroom' });
  }
});

app.put('/api/classrooms/:id', async (req, res) => {
  try {
    const { name, building, floor, capacity, has_projector, is_computer_lab, is_active } = req.body;
    await pool.query(
      'UPDATE classrooms SET name = ?, building = ?, floor = ?, capacity = ?, has_projector = ?, is_computer_lab = ?, is_active = ? WHERE id = ?',
      [name, building, floor, capacity, has_projector, is_computer_lab, is_active, req.params.id]
    );
    res.json({ message: 'Classroom updated successfully' });
  } catch (error) {
    console.error('Error updating classroom:', error);
    res.status(500).json({ error: 'Failed to update classroom' });
  }
});

app.delete('/api/classrooms/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM classrooms WHERE id = ?', [req.params.id]);
    res.json({ message: 'Classroom deleted successfully' });
  } catch (error) {
    console.error('Error deleting classroom:', error);
    res.status(500).json({ error: 'Failed to delete classroom' });
  }
});

// Exams endpoints
app.get('/api/exams', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM exams');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching exams:', error);
    res.status(500).json({ error: 'Failed to fetch exams' });
  }
});

app.get('/api/exams/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM exams WHERE id = ?', [req.params.id]);
    if (Array.isArray(rows) && rows.length === 0) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching exam:', error);
    res.status(500).json({ error: 'Failed to fetch exam' });
  }
});

app.post('/api/exams', async (req, res) => {
  try {
    const { name, subject, date, start_time, end_time } = req.body;
    const [result] = await pool.query(
      'INSERT INTO exams (id, name, subject, date, start_time, end_time) VALUES (UUID(), ?, ?, ?, ?, ?)',
      [name, subject, date, start_time, end_time]
    );
    res.status(201).json({ message: 'Exam created successfully', result });
  } catch (error) {
    console.error('Error creating exam:', error);
    res.status(500).json({ error: 'Failed to create exam' });
  }
});

app.put('/api/exams/:id', async (req, res) => {
  try {
    const { name, subject, date, start_time, end_time } = req.body;
    await pool.query(
      'UPDATE exams SET name = ?, subject = ?, date = ?, start_time = ?, end_time = ? WHERE id = ?',
      [name, subject, date, start_time, end_time, req.params.id]
    );
    res.json({ message: 'Exam updated successfully' });
  } catch (error) {
    console.error('Error updating exam:', error);
    res.status(500).json({ error: 'Failed to update exam' });
  }
});

app.delete('/api/exams/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM exams WHERE id = ?', [req.params.id]);
    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    console.error('Error deleting exam:', error);
    res.status(500).json({ error: 'Failed to delete exam' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 