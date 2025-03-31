
export interface Faculty {
    id: string;
    name: string;
    department: string;
    email: string;
    phone: string;
    maxSupervisions: number;
    seniority: number;
    availability: {
      monday: boolean;
      tuesday: boolean;
      wednesday: boolean;
      thursday: boolean;
      friday: boolean;
      saturday: boolean;
    };
    // Adding preferred semester supervision
    preferredSemesters: "even" | "odd" | "both";
  }
  
  export interface Student {
    id: string;
    name: string;
    rollNumber: string;
    department: string;
    semester: number;
    section: string;
    electiveSubjects: string[];
  }
  
  export interface Classroom {
    id: string;
    name: string;
    building: string;
    floor: number;
    capacity: number;
    hasProjector: boolean;
    isComputerLab: boolean;
    isActive: boolean;
  }
  
  export interface Exam {
    id: string;
    name: string;
    subject: string;
    date: string | Date;
    startTime: string;
    endTime: string;
    classroomIds: string[];
    facultyIds: string[];
    studentIds: string[];
    seatArrangements?: SeatArrangement[];
    // Adding exam type
    examType: "internal1" | "internal2" | "external";
  }
  
  export interface SeatArrangement {
    classroomId: string;
    seats: StudentSeat[];
  }
  
  export interface StudentSeat {
    studentId: string;
    seatNumber: number;
    row: number;
    column: number;
  }
  
  export interface SupervisionAssignment {
    examId: string;
    facultyId: string;
    classroomId: string;
  }
  