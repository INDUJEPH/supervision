
/**
 * Database Configuration
 * This file manages the connection to the SQL database.
 * 
 * To set up:
 * 1. Create a MySQL/MariaDB database
 * 2. Update the connection details below
 * 3. Run the application
 */

export const DB_CONFIG = {
    // Database connection settings
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "exam_management",
  };
  
  export const API_CONFIG = {
    baseUrl: process.env.API_URL || "http://localhost:3000/api",
    endpoints: {
      students: "/students",
      faculty: "/faculty",
      classrooms: "/classrooms",
      exams: "/exams",
      seatingArrangements: "/seating-arrangements"
    }
  };
  
  /**
   * Initialize database connection (for server-side)
   * This would be used in a Node.js backend
   */
  export const initializeDatabase = async () => {
    // This function would contain the actual DB connection code
    // when implemented with a backend
    console.log("Database initialization would happen here");
    
    // Example database schema creation SQL:
    
    /*
    -- Students table
    CREATE TABLE IF NOT EXISTS students (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      roll_number VARCHAR(20) UNIQUE NOT NULL,
      department VARCHAR(50) NOT NULL,
      semester INT NOT NULL,
      section VARCHAR(5) NOT NULL,
      elective_subjects JSON
    );
  
    -- Faculty table
    CREATE TABLE IF NOT EXISTS faculty (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      department VARCHAR(50) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      phone VARCHAR(20),
      max_supervisions INT DEFAULT 5,
      seniority INT DEFAULT 3,
      availability JSON
    );
  
    -- Classrooms table
    CREATE TABLE IF NOT EXISTS classrooms (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      building VARCHAR(100) NOT NULL,
      floor INT NOT NULL,
      capacity INT NOT NULL,
      has_projector BOOLEAN DEFAULT FALSE,
      is_computer_lab BOOLEAN DEFAULT FALSE,
      is_active BOOLEAN DEFAULT TRUE
    );
  
    -- Exams table
    CREATE TABLE IF NOT EXISTS exams (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      subject VARCHAR(100) NOT NULL,
      date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  
    -- Exam-Classroom mapping (many-to-many)
    CREATE TABLE IF NOT EXISTS exam_classrooms (
      exam_id VARCHAR(36),
      classroom_id VARCHAR(36),
      PRIMARY KEY (exam_id, classroom_id),
      FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
      FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE
    );
  
    -- Exam-Faculty mapping (many-to-many)
    CREATE TABLE IF NOT EXISTS exam_faculty (
      exam_id VARCHAR(36),
      faculty_id VARCHAR(36),
      PRIMARY KEY (exam_id, faculty_id),
      FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
      FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE CASCADE
    );
  
    -- Exam-Student mapping (many-to-many)
    CREATE TABLE IF NOT EXISTS exam_students (
      exam_id VARCHAR(36),
      student_id VARCHAR(36),
      PRIMARY KEY (exam_id, student_id),
      FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    );
  
    -- Seating arrangements table
    CREATE TABLE IF NOT EXISTS seating_arrangements (
      id VARCHAR(36) PRIMARY KEY,
      exam_id VARCHAR(36) NOT NULL,
      classroom_id VARCHAR(36) NOT NULL,
      student_id VARCHAR(36) NOT NULL,
      seat_number INT NOT NULL,
      row_number INT NOT NULL,
      column_number INT NOT NULL,
      UNIQUE KEY unique_seat (exam_id, classroom_id, seat_number),
      UNIQUE KEY unique_student_exam (exam_id, student_id),
      FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
      FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    );
    */
  };
  