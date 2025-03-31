-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  roll_number VARCHAR(20) UNIQUE NOT NULL,
  department VARCHAR(50) NOT NULL,
  semester INT NOT NULL,
  section VARCHAR(5) NOT NULL,
  elective_subjects JSON
);

-- Create faculty table
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

-- Create classrooms table
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

-- Create exams table
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

-- Create exam-classroom mapping table
CREATE TABLE IF NOT EXISTS exam_classrooms (
  exam_id VARCHAR(36),
  classroom_id VARCHAR(36),
  PRIMARY KEY (exam_id, classroom_id),
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
  FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE
);

-- Create exam-faculty mapping table
CREATE TABLE IF NOT EXISTS exam_faculty (
  exam_id VARCHAR(36),
  faculty_id VARCHAR(36),
  PRIMARY KEY (exam_id, faculty_id),
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
  FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE CASCADE
);

-- Create exam-student mapping table
CREATE TABLE IF NOT EXISTS exam_students (
  exam_id VARCHAR(36),
  student_id VARCHAR(36),
  PRIMARY KEY (exam_id, student_id),
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Create seating arrangements table with correct column names
CREATE TABLE IF NOT EXISTS seating_arrangements (
  id VARCHAR(36) PRIMARY KEY,
  exam_id VARCHAR(36) NOT NULL,
  classroom_id VARCHAR(36) NOT NULL,
  student_id VARCHAR(36) NOT NULL,
  seat_number INT NOT NULL,
  seat_row INT NOT NULL,
  seat_column INT NOT NULL,
  UNIQUE KEY unique_seat (exam_id, classroom_id, seat_number),
  UNIQUE KEY unique_student_exam (exam_id, student_id),
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
  FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
); 