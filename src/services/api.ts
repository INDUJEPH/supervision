import { DB_CONFIG, API_CONFIG } from '@/config/database';
import { Student, Faculty, Classroom, Exam, SeatArrangement } from '@/lib/types';
import { getStudents, getFaculty, getClassrooms, getExams, addExam, updateExam, deleteExam } from '@/lib/db';

/**
 * This service layer acts as an abstraction between the UI and data source
 * Currently using mock data from lib/db.ts
 * When SQL integration is ready, these functions will connect to the real database
 */

// Flag to determine if we're using mock data or real API
const USE_MOCK_DATA = true;

// Generic fetch function for API calls when real API is ready
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// Student services
export const studentService = {
  getAll: async (): Promise<Student[]> => {
    if (USE_MOCK_DATA) {
      return getStudents();
    } else {
      return fetchApi<Student[]>(API_CONFIG.endpoints.students);
    }
  },

  getById: async (id: string): Promise<Student | undefined> => {
    if (USE_MOCK_DATA) {
      return getStudents().find(student => student.id === id);
    } else {
      return fetchApi<Student>(`${API_CONFIG.endpoints.students}/${id}`);
    }
  },

  // Other student CRUD operations would go here
};

// Faculty services
export const facultyService = {
  getAll: async (): Promise<Faculty[]> => {
    if (USE_MOCK_DATA) {
      return getFaculty();
    } else {
      return fetchApi<Faculty[]>(API_CONFIG.endpoints.faculty);
    }
  },

  // Other faculty CRUD operations would go here
};

// Classroom services
export const classroomService = {
  getAll: async (): Promise<Classroom[]> => {
    if (USE_MOCK_DATA) {
      return getClassrooms();
    } else {
      return fetchApi<Classroom[]>(API_CONFIG.endpoints.classrooms);
    }
  },

  // Other classroom CRUD operations would go here
};

// Exam services
export const examService = {
  getAll: async (): Promise<Exam[]> => {
    if (USE_MOCK_DATA) {
      return getExams();
    } else {
      return fetchApi<Exam[]>(API_CONFIG.endpoints.exams);
    }
  },

  getById: async (id: string): Promise<Exam | undefined> => {
    if (USE_MOCK_DATA) {
      return getExams().find(exam => exam.id === id);
    } else {
      return fetchApi<Exam>(`${API_CONFIG.endpoints.exams}/${id}`);
    }
  },

  create: async (exam: Omit<Exam, "id">): Promise<Exam> => {
    if (USE_MOCK_DATA) {
      return addExam(exam);
    } else {
      return fetchApi<Exam>(API_CONFIG.endpoints.exams, {
        method: 'POST',
        body: JSON.stringify(exam),
      });
    }
  },

  update: async (id: string, exam: Partial<Exam>): Promise<Exam | null> => {
    if (USE_MOCK_DATA) {
      return updateExam(id, exam);
    } else {
      return fetchApi<Exam>(`${API_CONFIG.endpoints.exams}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(exam),
      });
    }
  },

  delete: async (id: string): Promise<boolean> => {
    if (USE_MOCK_DATA) {
      return deleteExam(id);
    } else {
      await fetchApi(`${API_CONFIG.endpoints.exams}/${id}`, {
        method: 'DELETE',
      });
      return true;
    }
  },

  updateSeatArrangements: async (examId: string, arrangements: SeatArrangement[]): Promise<boolean> => {
    if (USE_MOCK_DATA) {
      const exam = getExams().find(e => e.id === examId);
      if (exam) {
        updateExam(examId, { ...exam, seatArrangements: arrangements });
        return true;
      }
      return false;
    } else {
      await fetchApi(`${API_CONFIG.endpoints.seatingArrangements}/${examId}`, {
        method: 'PUT',
        body: JSON.stringify(arrangements),
      });
      return true;
    }
  }
};

/**
 * Setup instructions for SQL database integration:
 * 
 * 1. Create a MySQL/MariaDB database named 'exam_management'
 * 2. Configure connection in the DB_CONFIG object (src/config/database.ts)
 * 3. Create schema using SQL statements provided in the initializeDatabase function
 * 4. Set USE_MOCK_DATA to false in this file
 * 5. Implement a simple Node.js API backend using the SQL statements
 */
