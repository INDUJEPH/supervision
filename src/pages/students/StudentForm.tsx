
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { addStudent, getStudentById, updateStudent } from "@/lib/db";
import { Student } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Save, 
  User, 
  Hash, 
  School, 
  Layers, 
  Users, 
  BookOpen,
  XCircle 
} from "lucide-react";

const StudentForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  // Initial state with required fields
  const initialFormState: Student = {
    id: "",
    name: "",
    rollNumber: "",
    department: "",
    semester: 1,
    section: "",
    electiveSubjects: [],
  };

  const [formData, setFormData] = useState<Student>(initialFormState);
  const [electivesInput, setElectivesInput] = useState<string>("");

  useEffect(() => {
    if (isEditing && id) {
      const student = getStudentById(id);
      if (student) {
        setFormData(student);
        // Convert array to comma-separated string for the input field
        setElectivesInput(student.electiveSubjects.join(", "));
      } else {
        toast.error("Student not found");
        navigate("/students");
      }
    }
  }, [id, isEditing, navigate]);

  const updateMutation = useMutation({
    mutationFn: (student: Student) => {
      return Promise.resolve(updateStudent(student.id, student));
    },
    onSuccess: () => {
      toast.success("Student updated successfully");
      navigate("/students");
    },
    onError: (error) => {
      toast.error(`Error updating student: ${error}`);
    },
  });

  const createMutation = useMutation({
    mutationFn: (student: Omit<Student, "id">) => {
      return Promise.resolve(addStudent(student));
    },
    onSuccess: () => {
      toast.success("Student created successfully");
      navigate("/students");
    },
    onError: (error) => {
      toast.error(`Error creating student: ${error}`);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (name === "electivesInput") {
      setElectivesInput(value);
    } else if (type === "number") {
      setFormData({
        ...formData,
        [name]: parseInt(value, 10),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse electives from the comma-separated string
    const electiveSubjects = electivesInput
      ? electivesInput.split(",").map(item => item.trim()).filter(Boolean)
      : [];
    
    const updatedFormData = {
      ...formData,
      electiveSubjects,
    };
    
    if (isEditing) {
      updateMutation.mutate(updatedFormData);
    } else {
      // For creating, we omit the id as it will be generated
      const { id, ...newStudent } = updatedFormData;
      createMutation.mutate(newStudent as Omit<Student, "id">);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/students")}
          className="p-2 h-auto rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
        >
          <ArrowLeft size={16} className="text-gray-600" />
        </Button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
          {isEditing ? "Edit Student" : "Add New Student"}
        </h1>
      </div>

      <Card className="border-primary/20 shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/20 to-primary/5 p-6 border-b border-primary/10">
          <div className="flex items-center gap-3">
            <div className="bg-white/80 p-2 rounded-full shadow-sm">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Student Information</h2>
              <p className="text-sm text-gray-500">Enter the student's personal and academic details</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-1 text-sm font-medium">
                  <User className="h-3.5 w-3.5" />
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                  placeholder="Enter student's full name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rollNumber" className="flex items-center gap-1 text-sm font-medium">
                  <Hash className="h-3.5 w-3.5" />
                  Roll Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="rollNumber"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                  placeholder="Enter unique roll number"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department" className="flex items-center gap-1 text-sm font-medium">
                  <School className="h-3.5 w-3.5" />
                  Department <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                  placeholder="e.g. Computer Science"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="semester" className="flex items-center gap-1 text-sm font-medium">
                  <Layers className="h-3.5 w-3.5" />
                  Semester <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="semester"
                  name="semester"
                  type="number"
                  min="1"
                  max="8"
                  value={formData.semester}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="section" className="flex items-center gap-1 text-sm font-medium">
                  <Users className="h-3.5 w-3.5" />
                  Section <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="section"
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                  placeholder="e.g. A, B, C"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="electivesInput" className="flex items-center gap-1 text-sm font-medium">
                  <BookOpen className="h-3.5 w-3.5" />
                  Elective Subjects
                </Label>
                <Input
                  id="electivesInput"
                  name="electivesInput"
                  value={electivesInput}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                  placeholder="e.g. Machine Learning, Cloud Computing"
                />
                <p className="text-xs text-gray-500 italic">Separate multiple subjects with commas</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mt-6">
              <h3 className="font-medium flex items-center gap-2 mb-3">
                <BookOpen className="h-4 w-4 text-primary" />
                Elective Subjects Preview
              </h3>
              
              {electivesInput ? (
                <div className="flex flex-wrap gap-2">
                  {electivesInput.split(',').map((subject, index) => {
                    const trimmedSubject = subject.trim();
                    if (!trimmedSubject) return null;
                    
                    return (
                      <Badge 
                        key={index} 
                        className="bg-primary/10 text-primary border-primary/20 px-2.5 py-1 flex items-center gap-1"
                      >
                        <BookOpen className="h-3 w-3" />
                        {trimmedSubject}
                      </Badge>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic">No elective subjects added</p>
              )}
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <Button
                type="button"
                onClick={() => navigate("/students")}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <XCircle className="h-4 w-4" />
                Cancel
              </Button>
              
              <Button
                type="submit"
                className="bg-gradient-to-r from-primary to-primary/80 text-white shadow-md hover:shadow-lg transition-all gap-2"
                disabled={updateMutation.isPending || createMutation.isPending}
              >
                <Save className="h-4 w-4" />
                {updateMutation.isPending || createMutation.isPending
                  ? "Saving..."
                  : isEditing
                  ? "Update Student"
                  : "Add Student"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentForm;
