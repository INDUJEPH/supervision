
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { 
  addExam, 
  getExamById, 
  updateExam, 
  getClassrooms, 
  getFaculty,
  getStudents
} from "@/lib/db";
import { Exam } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { autoAssignFaculty } from "@/utils/facultyAssignment";
import { Wand2, Users } from "lucide-react";

const ExamForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const classrooms = getClassrooms();
  const faculty = getFaculty();
  const students = getStudents();

  const formatDateForInput = (date: string | Date): string => {
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    return typeof date === 'string' ? date : new Date().toISOString().split('T')[0];
  };

  const initialFormState: Exam = {
    id: "",
    name: "",
    subject: "",
    date: new Date().toISOString().split('T')[0],
    startTime: "09:00",
    endTime: "12:00",
    classroomIds: [],
    facultyIds: [],
    studentIds: []
  };

  const [formData, setFormData] = useState<Exam>(initialFormState);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");

  useEffect(() => {
    if (isEditing && id) {
      const exam = getExamById(id);
      if (exam) {
        setFormData({
          ...exam,
          date: formatDateForInput(exam.date)
        });
      } else {
        toast.error("Exam not found");
        navigate("/exams");
      }
    }
  }, [id, isEditing, navigate]);

  const updateMutation = useMutation({
    mutationFn: (exam: Exam) => {
      return Promise.resolve(updateExam(exam.id, exam));
    },
    onSuccess: () => {
      toast.success("Exam updated successfully");
      navigate("/exams");
    },
    onError: (error) => {
      toast.error(`Error updating exam: ${error}`);
    },
  });

  const createMutation = useMutation({
    mutationFn: (exam: Omit<Exam, "id">) => {
      return Promise.resolve(addExam(exam));
    },
    onSuccess: () => {
      toast.success("Exam scheduled successfully");
      navigate("/exams");
    },
    onError: (error) => {
      toast.error(`Error scheduling exam: ${error}`);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClassroomChange = (classroomId: string, checked: boolean) => {
    setFormData({
      ...formData,
      classroomIds: checked
        ? [...formData.classroomIds, classroomId]
        : formData.classroomIds.filter(id => id !== classroomId)
    });
  };

  const handleFacultyChange = (facultyId: string, checked: boolean) => {
    setFormData({
      ...formData,
      facultyIds: checked
        ? [...formData.facultyIds, facultyId]
        : formData.facultyIds.filter(id => id !== facultyId)
    });
  };

  const handleStudentChange = (studentId: string, checked: boolean) => {
    setFormData({
      ...formData,
      studentIds: checked
        ? [...formData.studentIds, studentId]
        : formData.studentIds.filter(id => id !== studentId)
    });
  };

  const handleBulkStudentAssignment = () => {
    // Filter students based on selected department, semester, section
    let filteredStudents = [...students];
    
    if (selectedDepartment) {
      filteredStudents = filteredStudents.filter(
        student => student.department === selectedDepartment
      );
    }
    
    if (selectedSemester) {
      filteredStudents = filteredStudents.filter(
        student => student.semester === parseInt(selectedSemester)
      );
    }
    
    if (selectedSection) {
      filteredStudents = filteredStudents.filter(
        student => student.section === selectedSection
      );
    }
    
    // Get IDs of filtered students
    const filteredStudentIds = filteredStudents.map(student => student.id);
    
    // Update form data with these student IDs
    setFormData({
      ...formData,
      studentIds: [...filteredStudentIds]
    });
    
    toast.success(`Assigned ${filteredStudentIds.length} students to the exam`);
  };

  const handleAutoAssignFaculty = () => {
    if (formData.classroomIds.length === 0) {
      toast.error("Please select at least one classroom first");
      return;
    }

    const selectedClassrooms = classrooms.filter(classroom => 
      formData.classroomIds.includes(classroom.id)
    );

    const assignedFacultyIds = autoAssignFaculty(
      formData, 
      selectedClassrooms,
      formData.subject
    );

    if (assignedFacultyIds.length === 0) {
      toast.error("No suitable faculty available for the selected date");
      return;
    }

    setFormData({
      ...formData,
      facultyIds: assignedFacultyIds
    });

    toast.success(`${assignedFacultyIds.length} faculty members automatically assigned`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.classroomIds.length === 0) {
      toast.error("Please select at least one classroom");
      return;
    }

    if (formData.facultyIds.length === 0) {
      toast.error("Please assign at least one faculty member");
      return;
    }
    
    if (isEditing) {
      updateMutation.mutate(formData);
    } else {
      const { id, ...newExam } = formData;
      createMutation.mutate(newExam as Omit<Exam, "id">);
    }
  };

  // Get unique departments, semesters, and sections for filters
  const departments = [...new Set(students.map(s => s.department))];
  const semesters = [...new Set(students.map(s => s.semester))].sort((a, b) => a - b);
  const sections = [...new Set(students.map(s => s.section))].sort();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? "Edit Exam Schedule" : "Schedule New Exam"}
      </h1>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Exam Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date as string}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input
                    id="startTime"
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time *</Label>
                  <Input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Classrooms *</Label>
              <div className="border rounded-md p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {classrooms.map((classroom) => (
                    <div key={classroom.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`classroom-${classroom.id}`}
                        checked={formData.classroomIds.includes(classroom.id)}
                        onCheckedChange={(checked) => 
                          handleClassroomChange(classroom.id, !!checked)
                        }
                      />
                      <Label htmlFor={`classroom-${classroom.id}`} className="cursor-pointer">
                        {classroom.name} ({classroom.capacity} seats)
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Faculty Supervisors *</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={handleAutoAssignFaculty}
                >
                  <Wand2 size={16} />
                  Auto-Assign
                </Button>
              </div>
              <div className="border rounded-md p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {faculty.map((facultyMember) => (
                    <div key={facultyMember.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`faculty-${facultyMember.id}`}
                        checked={formData.facultyIds.includes(facultyMember.id)}
                        onCheckedChange={(checked) => 
                          handleFacultyChange(facultyMember.id, !!checked)
                        }
                      />
                      <Label 
                        htmlFor={`faculty-${facultyMember.id}`} 
                        className="cursor-pointer"
                      >
                        {facultyMember.name} ({facultyMember.department})
                        <div className="text-xs text-gray-500">
                          Max: {facultyMember.maxSupervisions} | Seniority: {facultyMember.seniority}/5
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Students</Label>
                <div className="flex space-x-2">
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Departments</SelectItem>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Semesters</SelectItem>
                      {semesters.map(semester => (
                        <SelectItem key={semester} value={semester.toString()}>
                          Semester {semester}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedSection} onValueChange={setSelectedSection}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Sections</SelectItem>
                      {sections.map(section => (
                        <SelectItem key={section} value={section}>
                          Section {section}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    type="button"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={handleBulkStudentAssignment}
                  >
                    <Users size={16} />
                    Assign
                  </Button>
                </div>
              </div>
              <div className="border rounded-md p-4 space-y-4">
                <p className="text-sm text-gray-500 mb-2">
                  {formData.studentIds.length} students assigned to this exam
                </p>
                <div className="max-h-64 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`student-${student.id}`}
                        checked={formData.studentIds.includes(student.id)}
                        onCheckedChange={(checked) => 
                          handleStudentChange(student.id, !!checked)
                        }
                      />
                      <Label 
                        htmlFor={`student-${student.id}`} 
                        className="cursor-pointer"
                      >
                        {student.name}
                        <div className="text-xs text-gray-500">
                          {student.rollNumber} | {student.department} | Sem {student.semester}
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/exams")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateMutation.isPending || createMutation.isPending}
              >
                {updateMutation.isPending || createMutation.isPending
                  ? "Saving..."
                  : isEditing
                  ? "Update Exam"
                  : "Schedule Exam"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamForm;
