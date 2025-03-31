import { pool } from '../config/database';
import fs from 'fs';
import path from 'path';

async function insertSampleData() {
  try {
    // First, create the tables
    const createTablesSql = fs.readFileSync(path.join(__dirname, '../data/create_tables.sql'), 'utf8');
    const createStatements = createTablesSql.split(';').filter(statement => statement.trim());
    
    for (const statement of createStatements) {
      if (statement.trim()) {
        await pool.query(statement);
        console.log('Table created successfully');
      }
    }
    console.log('All tables created successfully');

    // Clear existing data (in correct order due to foreign key constraints)
    await pool.query('DELETE FROM seating_arrangements');
    await pool.query('DELETE FROM exam_students');
    await pool.query('DELETE FROM exam_faculty');
    await pool.query('DELETE FROM exam_classrooms');
    await pool.query('DELETE FROM exams');
    await pool.query('DELETE FROM students');
    await pool.query('DELETE FROM faculty');
    await pool.query('DELETE FROM classrooms');
    console.log('Existing data cleared successfully');

    // Then, insert the sample data
    const sampleDataSql = fs.readFileSync(path.join(__dirname, '../data/sample_data.sql'), 'utf8');
    const insertStatements = sampleDataSql.split(';').filter(statement => statement.trim());

    // Execute each statement
    for (const statement of insertStatements) {
      if (statement.trim()) {
        await pool.query(statement);
        console.log('Data inserted successfully');
      }
    }

    console.log('Sample data inserted successfully');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

insertSampleData(); 