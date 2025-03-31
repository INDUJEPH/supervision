-- Insert sample students
INSERT INTO students (id, name, roll_number, department, semester, section, elective_subjects) VALUES
(UUID(), 'John Doe', 'CSE2023001', 'Computer Science', 3, 'A', '["Web Development", "Machine Learning"]'),
(UUID(), 'Jane Smith', 'CSE2023002', 'Computer Science', 3, 'B', '["Data Structures", "AI"]'),
(UUID(), 'Mike Johnson', 'ECE2023001', 'Electronics', 3, 'A', '["Digital Electronics", "Signal Processing"]'),
(UUID(), 'Sarah Williams', 'MECH2023001', 'Mechanical', 3, 'A', '["Thermodynamics", "Fluid Mechanics"]');

-- Insert sample faculty
INSERT INTO faculty (id, name, department, email, phone, max_supervisions, seniority, availability) VALUES
(UUID(), 'Dr. Robert Brown', 'Computer Science', 'robert.brown@example.com', '1234567890', 5, 5, '["Monday", "Wednesday", "Friday"]'),
(UUID(), 'Dr. Emily Davis', 'Electronics', 'emily.davis@example.com', '2345678901', 4, 4, '["Tuesday", "Thursday"]'),
(UUID(), 'Dr. James Wilson', 'Mechanical', 'james.wilson@example.com', '3456789012', 5, 3, '["Monday", "Wednesday", "Friday"]'),
(UUID(), 'Dr. Lisa Anderson', 'Computer Science', 'lisa.anderson@example.com', '4567890123', 4, 4, '["Tuesday", "Thursday"]');

-- Insert sample classrooms
INSERT INTO classrooms (id, name, building, floor, capacity, has_projector, is_computer_lab, is_active) VALUES
(UUID(), 'Room 101', 'Main Building', 1, 50, true, false, true),
(UUID(), 'Room 102', 'Main Building', 1, 60, true, true, true),
(UUID(), 'Room 201', 'Main Building', 2, 40, false, false, true),
(UUID(), 'Lab 301', 'Science Block', 3, 30, true, true, true);

-- Insert sample exams
INSERT INTO exams (id, name, subject, date, start_time, end_time) VALUES
(UUID(), 'Database Management', 'DBMS', '2024-04-15', '09:00:00', '11:00:00'),
(UUID(), 'Computer Networks', 'CN', '2024-04-16', '10:00:00', '12:00:00'),
(UUID(), 'Digital Electronics', 'DE', '2024-04-17', '09:00:00', '11:00:00'),
(UUID(), 'Thermodynamics', 'TD', '2024-04-18', '10:00:00', '12:00:00');

-- Insert exam-classroom mappings
INSERT INTO exam_classrooms (exam_id, classroom_id)
SELECT e.id, c.id
FROM exams e, classrooms c
WHERE e.name = 'Database Management' AND c.name = 'Room 101';

-- Insert exam-faculty mappings
INSERT INTO exam_faculty (exam_id, faculty_id)
SELECT e.id, f.id
FROM exams e, faculty f
WHERE e.name = 'Database Management' AND f.name = 'Dr. Robert Brown';

-- Insert exam-student mappings
INSERT INTO exam_students (exam_id, student_id)
SELECT e.id, s.id
FROM exams e, students s
WHERE e.name = 'Database Management' AND s.department = 'Computer Science';

-- Insert seating arrangements
INSERT INTO seating_arrangements (id, exam_id, classroom_id, student_id, seat_number, seat_row, seat_column)
SELECT 
    UUID(),
    e.id,
    c.id,
    s.id,
    1,
    1,
    1
FROM exams e, classrooms c, students s
WHERE e.name = 'Database Management' 
AND c.name = 'Room 101'
AND s.name = 'John Doe'; 