
import { Faculty, Exam, Classroom } from "@/lib/types";
import { getFaculty, getExams, getStudents } from "@/lib/db";

// Get day of the week from date
const getDayOfWeek = (date: Date): string => {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  return days[date.getDay()];
};

// Determine if a semester is odd or even
const isSemesterOdd = (semester: number): boolean => {
  return semester % 2 !== 0;
};

// Check if faculty is suitable for the exam based on semester preferences
const isFacultySuitableForSemester = (faculty: Faculty, exam: Exam): boolean => {
  // If faculty has no preference, they can supervise any semester
  if (faculty.preferredSemesters === "both") return true;
  
  // Get students for this exam
  const students = getStudents().filter(s => exam.studentIds.includes(s.id));
  
  // If no students assigned yet, faculty is considered suitable
  if (students.length === 0) return true;
  
  // Get the first student's semester as reference
  const semesterType = isSemesterOdd(students[0].semester) ? "odd" : "even";
  
  // Check if faculty preference matches semester type
  return faculty.preferredSemesters === semesterType;
};

// Get faculty members available on a specific day
const getAvailableFaculty = (date: Date, department?: string, examType?: string): Faculty[] => {
  const faculty = getFaculty();
  const dayOfWeek = getDayOfWeek(date);
  
  // Filter faculty by availability on the exam day
  return faculty.filter(f => {
    // Only include faculty from specific department if provided
    if (department && f.department !== department) return false;
    
    // Check if faculty is available on that day
    return f.availability[dayOfWeek as keyof typeof f.availability];
  });
};

// Count current supervisions for each faculty
const getFacultySupervisionCounts = (): Record<string, number> => {
  const exams = getExams();
  const supervisionCounts: Record<string, number> = {};
  
  // Initialize counts to 0 for all faculty
  getFaculty().forEach(f => {
    supervisionCounts[f.id] = 0;
  });
  
  // Count current supervisions
  exams.forEach(exam => {
    exam.facultyIds.forEach(facultyId => {
      if (supervisionCounts[facultyId] !== undefined) {
        supervisionCounts[facultyId]++;
      }
    });
  });
  
  return supervisionCounts;
};

// Calculate faculty workload score (lower is better for assignment)
const calculateFacultyWorkloadScore = (
  faculty: Faculty, 
  supervisionCounts: Record<string, number>,
  exam: Exam
): number => {
  // Base score on current supervisions relative to max capacity
  const currentSupervisions = supervisionCounts[faculty.id] || 0;
  const capacityUsedRatio = currentSupervisions / faculty.maxSupervisions;
  
  // Check if faculty is at or over their maximum supervisions
  if (capacityUsedRatio >= 1) {
    return Number.MAX_VALUE; // Effectively remove from consideration
  }
  
  // Adjust by seniority (higher seniority faculty should get priority when needed)
  // We convert to a ratio where 0 = most senior, 1 = least senior
  const seniorityFactor = (6 - faculty.seniority) / 5; // 5 is highest seniority
  
  // External exams require more senior faculty
  let examTypeFactor = 0;
  if (exam.examType === "external" && faculty.seniority < 4) {
    examTypeFactor = 0.5; // Penalize less senior faculty for external exams
  }
  
  // Semester suitability factor
  let semesterFactor = 0;
  if (!isFacultySuitableForSemester(faculty, exam)) {
    semesterFactor = 0.3; // Penalty for semester mismatch
  }
  
  // Combined score where lower is better for assignment
  // Weight the factors - capacity usage is more important than seniority
  return (capacityUsedRatio * 0.5) + (seniorityFactor * 0.2) + examTypeFactor + semesterFactor;
};

// Check if a faculty member is already busy with another exam at this time
const isFacultyBusyAtTime = (faculty: Faculty, exam: Exam): boolean => {
  const exams = getExams();
  const examDate = exam.date instanceof Date ? exam.date : new Date(exam.date);
  const examDateString = examDate.toISOString().split('T')[0];
  
  // Find exams on the same day
  const samedayExams = exams.filter(e => {
    const eDate = e.date instanceof Date ? e.date : new Date(e.date);
    return eDate.toISOString().split('T')[0] === examDateString;
  });
  
  // Check for time conflicts
  return samedayExams.some(e => {
    if (e.id === exam.id) return false; // Skip the current exam
    
    // Check if faculty is assigned to this exam
    if (!e.facultyIds.includes(faculty.id)) return false;
    
    // Check time overlap
    return (exam.startTime < e.endTime && exam.endTime > e.startTime);
  });
};

// Main function to automatically assign faculty to an exam
export const autoAssignFaculty = (
  exam: Exam, 
  classrooms: Classroom[], 
  subject?: string
): string[] => {
  // Get exam date as Date object
  const examDate = exam.date instanceof Date ? exam.date : new Date(exam.date);
  
  // Extract department from subject if provided
  const department = subject?.includes("Computer Science") ? "Computer Science" : 
                    subject?.includes("Mathematics") ? "Mathematics" : undefined;
  
  // Get available faculty for the exam day
  let availableFaculty = getAvailableFaculty(examDate, department);
  
  // Filter out faculty who are already busy at this exam time
  availableFaculty = availableFaculty.filter(faculty => !isFacultyBusyAtTime(faculty, exam));
  
  // Filter faculty by semester suitability
  availableFaculty = availableFaculty.filter(faculty => isFacultySuitableForSemester(faculty, exam));
  
  // For external exams, prioritize senior faculty
  if (exam.examType === "external") {
    availableFaculty = availableFaculty.filter(faculty => faculty.seniority >= 3);
  }
  
  // If not enough available faculty from the preferred criteria, include others
  if (availableFaculty.length < classrooms.length) {
    const allAvailableFaculty = getAvailableFaculty(examDate).filter(
      faculty => !isFacultyBusyAtTime(faculty, exam)
    );
    
    // Add non-filtered faculty to complement the specific ones
    const additionalFaculty = allAvailableFaculty.filter(
      f => !availableFaculty.some(af => af.id === f.id)
    );
    
    availableFaculty = [...availableFaculty, ...additionalFaculty];
  }
  
  // Get current supervision counts
  const supervisionCounts = getFacultySupervisionCounts();
  
  // Sort faculty by workload score (lower is better)
  availableFaculty.sort((a, b) => {
    return calculateFacultyWorkloadScore(a, supervisionCounts, exam) - 
           calculateFacultyWorkloadScore(b, supervisionCounts, exam);
  });
  
  // Calculate required supervisors based on classrooms and student capacity
  const totalClassroomCapacity = classrooms.reduce((sum, room) => sum + room.capacity, 0);
  
  // Base requirement: At least 1 supervisor per classroom
  let requiredSupervisors = classrooms.length;
  
  // Add more supervisors if needed based on student capacity (1 per 30 students)
  const additionalSupervisors = Math.floor(totalClassroomCapacity / 30);
  requiredSupervisors = Math.max(requiredSupervisors, additionalSupervisors);
  
  // For external exams, ensure at least one senior faculty (seniority >= 4) is assigned
  if (exam.examType === "external") {
    const hasSeniorFaculty = availableFaculty.slice(0, requiredSupervisors).some(f => f.seniority >= 4);
    if (!hasSeniorFaculty) {
      // Find the first available senior faculty
      const seniorFaculty = availableFaculty.find(f => f.seniority >= 4);
      if (seniorFaculty) {
        // Move this faculty to the front of the list
        availableFaculty = [
          seniorFaculty,
          ...availableFaculty.filter(f => f.id !== seniorFaculty.id)
        ];
      }
    }
  }
  
  // Ensure we don't try to assign more faculty than are available
  requiredSupervisors = Math.min(requiredSupervisors, availableFaculty.length);
  
  // Return the IDs of the best candidates
  return availableFaculty
    .slice(0, requiredSupervisors)
    .map(faculty => faculty.id);
};
