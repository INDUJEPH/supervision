import { toast } from "sonner";

// Mock database for demo purposes
// In a real implementation, this would connect to MySQL
export type Faculty = {
  id: string;
  name: string;
  department: string;
  email: string;
  phone: string;
  maxSupervisions: number;
  seniority: number; // 1-5, 5 being most senior
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
  };
};

export type Student = {
  id: string;
  name: string;
  rollNumber: string;
  department: string;
  semester: number;
  section: string;
  electiveSubjects: string[];
};

export type Classroom = {
  id: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  hasProjector: boolean;
  isComputerLab: boolean;
  isActive: boolean;
};

export type Exam = {
  id: string;
  name: string;
  subject: string;
  date: Date | string;
  startTime: string;
  endTime: string;
  classroomIds: string[];
  facultyIds: string[];
  studentIds: string[];
  seatArrangements?: {
    classroomId: string;
    seats: {
      studentId: string;
      seatNumber: number;
      row: number;
      column: number;
    }[];
  }[];
};

// Mock data
let facultyData: Faculty[] = [
  {
    id: "1",
    name: "Dr. Jane Smith",
    department: "Computer Science",
    email: "jane.smith@university.edu",
    phone: "555-123-4567",
    maxSupervisions: 5,
    seniority: 4,
    availability: {
      monday: true,
      tuesday: true,
      wednesday: false,
      thursday: true,
      friday: true,
      saturday: false,
    },
  },
  {
    id: "2",
    name: "Prof. John Doe",
    department: "Mathematics",
    email: "john.doe@university.edu",
    phone: "555-987-6543",
    maxSupervisions: 4,
    seniority: 3,
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: false,
      friday: true,
      saturday: true,
    },
  },
  {
    id: "3",
    name: "Dr. Robert Chen",
    department: "Computer Science",
    email: "robert.chen@university.edu",
    phone: "555-345-6789",
    maxSupervisions: 6,
    seniority: 5,
    availability: {
      monday: true,
      tuesday: false,
      wednesday: true,
      thursday: true,
      friday: false,
      saturday: true,
    },
  },
];

let studentData: Student[] = [
  {
    id: "1",
    name: "Alice Johnson",
    rollNumber: "CS2021001",
    department: "Computer Science",
    semester: 4,
    section: "A",
    electiveSubjects: ["Advanced Database Systems", "Machine Learning"],
  },
  {
    id: "2",
    name: "Bob Williams",
    rollNumber: "CS2021002",
    department: "Computer Science",
    semester: 4,
    section: "A",
    electiveSubjects: ["Advanced Database Systems", "Computer Graphics"],
  },
  {
    id: "3",
    name: "Charlie Brown",
    rollNumber: "MA2021001",
    department: "Mathematics",
    semester: 4,
    section: "B",
    electiveSubjects: ["Statistical Analysis", "Number Theory"],
  },
];

let classroomData: Classroom[] = [
  {
    id: "1",
    name: "CS-101",
    building: "Computer Science Building",
    floor: 1,
    capacity: 60,
    hasProjector: true,
    isComputerLab: false,
    isActive: true,
  },
  {
    id: "2",
    name: "MA-201",
    building: "Mathematics Building",
    floor: 2,
    capacity: 45,
    hasProjector: true,
    isComputerLab: false,
    isActive: true,
  },
  {
    id: "3",
    name: "LH-301",
    building: "Lecture Hall",
    floor: 3,
    capacity: 120,
    hasProjector: true,
    isComputerLab: false,
    isActive: true,
  },
];

let examData: Exam[] = [
  {
    id: "1",
    name: "CS Midterm",
    subject: "Data Structures",
    date: new Date("2023-12-15"),
    startTime: "09:00",
    endTime: "12:00",
    classroomIds: ["1", "3"],
    facultyIds: ["1", "2"],
    studentIds: ["1", "2"],
  },
  {
    id: "2",
    name: "Math Midterm",
    subject: "Linear Algebra",
    date: new Date("2023-12-16"),
    startTime: "13:00",
    endTime: "16:00",
    classroomIds: ["2"],
    facultyIds: ["2", "3"],
    studentIds: ["2", "3"],
  },
];

// Faculty CRUD operations
export const getFaculty = () => {
  return [...facultyData];
};

export const getFacultyById = (id: string) => {
  return facultyData.find((faculty) => faculty.id === id);
};

export const addFaculty = (faculty: Omit<Faculty, "id">) => {
  const newFaculty = {
    ...faculty,
    id: Math.random().toString(36).substring(2, 9),
  };
  facultyData.push(newFaculty);
  toast.success("Faculty added successfully");
  return newFaculty;
};

export const updateFaculty = (id: string, faculty: Partial<Faculty>) => {
  const index = facultyData.findIndex((f) => f.id === id);
  if (index !== -1) {
    facultyData[index] = { ...facultyData[index], ...faculty };
    toast.success("Faculty updated successfully");
    return facultyData[index];
  }
  toast.error("Faculty not found");
  return null;
};

export const deleteFaculty = (id: string) => {
  const index = facultyData.findIndex((f) => f.id === id);
  if (index !== -1) {
    facultyData = facultyData.filter((f) => f.id !== id);
    toast.success("Faculty deleted successfully");
    return true;
  }
  toast.error("Faculty not found");
  return false;
};

// Student CRUD operations
export const getStudents = () => {
  return [...studentData];
};

export const getStudentById = (id: string) => {
  return studentData.find((student) => student.id === id);
};

export const addStudent = (student: Omit<Student, "id">) => {
  const newStudent = {
    ...student,
    id: Math.random().toString(36).substring(2, 9),
  };
  studentData.push(newStudent);
  toast.success("Student added successfully");
  return newStudent;
};

export const updateStudent = (id: string, student: Partial<Student>) => {
  const index = studentData.findIndex((s) => s.id === id);
  if (index !== -1) {
    studentData[index] = { ...studentData[index], ...student };
    toast.success("Student updated successfully");
    return studentData[index];
  }
  toast.error("Student not found");
  return null;
};

export const deleteStudent = (id: string) => {
  const index = studentData.findIndex((s) => s.id === id);
  if (index !== -1) {
    studentData = studentData.filter((s) => s.id !== id);
    toast.success("Student deleted successfully");
    return true;
  }
  toast.error("Student not found");
  return false;
};

// Classroom CRUD operations
export const getClassrooms = () => {
  return [...classroomData];
};

export const getClassroomById = (id: string) => {
  return classroomData.find((classroom) => classroom.id === id);
};

export const addClassroom = (classroom: Omit<Classroom, "id">) => {
  const newClassroom = {
    ...classroom,
    id: Math.random().toString(36).substring(2, 9),
  };
  classroomData.push(newClassroom);
  toast.success("Classroom added successfully");
  return newClassroom;
};

export const updateClassroom = (id: string, classroom: Partial<Classroom>) => {
  const index = classroomData.findIndex((c) => c.id === id);
  if (index !== -1) {
    classroomData[index] = { ...classroomData[index], ...classroom };
    toast.success("Classroom updated successfully");
    return classroomData[index];
  }
  toast.error("Classroom not found");
  return null;
};

export const deleteClassroom = (id: string) => {
  const index = classroomData.findIndex((c) => c.id === id);
  if (index !== -1) {
    classroomData = classroomData.filter((c) => c.id !== id);
    toast.success("Classroom deleted successfully");
    return true;
  }
  toast.error("Classroom not found");
  return false;
};

// Exam CRUD operations
export const getExams = () => {
  return [...examData];
};

export const getExamById = (id: string) => {
  return examData.find((exam) => exam.id === id);
};

export const addExam = (exam: Omit<Exam, "id">) => {
  const newExam = {
    ...exam,
    id: Math.random().toString(36).substring(2, 9),
    date: new Date(exam.date),
  };
  examData.push(newExam);
  toast.success("Exam scheduled successfully");
  return newExam;
};

export const updateExam = (id: string, exam: Partial<Exam>) => {
  const index = examData.findIndex((e) => e.id === id);
  if (index !== -1) {
    // Make sure we convert the date string to a Date object
    const updatedExam = {
      ...examData[index],
      ...exam,
      date: exam.date instanceof Date ? exam.date : new Date(exam.date as string),
    };
    examData[index] = updatedExam;
    toast.success("Exam updated successfully");
    return examData[index];
  }
  toast.error("Exam not found");
  return null;
};

export const deleteExam = (id: string) => {
  const index = examData.findIndex((e) => e.id === id);
  if (index !== -1) {
    examData = examData.filter((e) => e.id !== id);
    toast.success("Exam deleted successfully");
    return true;
  }
  toast.error("Exam not found");
  return false;
};
