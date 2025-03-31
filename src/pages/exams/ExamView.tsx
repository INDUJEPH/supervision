import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getExamById, updateExam, getClassrooms, getFaculty, getStudents } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Exam, Classroom, SeatArrangement } from "@/lib/types";
import { toast } from "sonner";
import { ArrowLeft, Calendar, Clock, School, Users, FileText } from "lucide-react";
import FacultyAssignment from "@/components/exams/FacultyAssignment";
import ClassroomAssignment from "@/components/exams/ClassroomsAssignment";
import SeatArrangementComponent from "@/components/exams/SeatArrangement";
import ExamReport from "@/components/exams/ExamReport";

const ExamView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [selectedClassrooms, setSelectedClassrooms] = useState<Classroom[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("general");
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    try {
      const examData = getExamById(id);
      if (examData) {
        setExam(examData);
        
        const allClassrooms = getClassrooms();
        const examClassrooms = allClassrooms.filter(c => 
          examData.classroomIds.includes(c.id)
        );
        setSelectedClassrooms(examClassrooms);
      }
    } catch (error) {
      toast.error("Failed to load exam data");
      navigate("/exams");
    }
  }, [id, navigate]);

  const handleFacultyChange = (facultyIds: string[]) => {
    if (!exam) return;
    
    try {
      const updatedExam = { ...exam, facultyIds };
      updateExam(exam.id, updatedExam);
      setExam(updatedExam);
      toast.success("Faculty assignments updated");
    } catch (error) {
      toast.error("Failed to update faculty assignments");
    }
  };

  const handleClassroomChange = (classroomIds: string[]) => {
    if (!exam) return;
    
    try {
      const updatedExam = { ...exam, classroomIds };
      updateExam(exam.id, updatedExam);
      setExam(updatedExam);
      
      const allClassrooms = getClassrooms();
      const updatedSelectedClassrooms = allClassrooms.filter(c => 
        classroomIds.includes(c.id)
      );
      setSelectedClassrooms(updatedSelectedClassrooms);
      
      toast.success("Classroom assignments updated");
    } catch (error) {
      toast.error("Failed to update classroom assignments");
    }
  };

  const handleSeatArrangementsChange = (seatArrangements: SeatArrangement[]) => {
    if (!exam) return;
    
    try {
      const updatedExam = { ...exam, seatArrangements };
      updateExam(exam.id, updatedExam);
      setExam(updatedExam);
      toast.success("Seating arrangement updated");
    } catch (error) {
      toast.error("Failed to update seating arrangement");
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = dateString instanceof Date ? dateString : new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const toggleReport = () => {
    setShowReport(!showReport);
  };

  if (!exam) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading exam data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/exams")}
            className="p-0 h-auto"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold">{exam.subject}</h1>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={toggleReport}
          >
            <FileText size={16} className="mr-2" />
            {showReport ? "Hide Report" : "Show Report"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "View Mode" : "Edit Mode"}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/exams/${id}/edit`)}
          >
            Edit All Details
          </Button>
        </div>
      </div>

      <Card className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Exam Details</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p>{formatDate(exam.date)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p>{exam.startTime} - {exam.endTime}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <School className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Subject</p>
                  <p>{exam.subject}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Users className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Students</p>
                  <p>{exam.studentIds.length > 0 ? exam.studentIds.length : "No students assigned"}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Assignment Summary</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Classrooms</p>
                <p className="font-medium">
                  {exam.classroomIds.length} classroom(s) assigned
                </p>
                <p className="text-sm">
                  Total capacity: {selectedClassrooms.reduce((sum, c) => sum + c.capacity, 0)} students
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Faculty</p>
                <p className="font-medium">
                  {exam.facultyIds.length} faculty member(s) assigned
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {showReport && (
        <ExamReport exam={exam} selectedClassrooms={selectedClassrooms} />
      )}

      {isEditing && (
        <>
          <FacultyAssignment 
            examId={exam.id}
            subject={exam.subject}
            date={exam.date}
            startTime={exam.startTime}
            endTime={exam.endTime}
            selectedClassrooms={selectedClassrooms}
            selectedFaculty={exam.facultyIds}
            onChange={handleFacultyChange}
          />
          
          <ClassroomAssignment
            selectedClassrooms={exam.classroomIds}
            onChange={handleClassroomChange}
          />
          
          <SeatArrangementComponent
            examId={exam.id}
            selectedClassrooms={selectedClassrooms}
            studentIds={exam.studentIds}
            seatArrangements={exam.seatArrangements}
            onSave={handleSeatArrangementsChange}
          />
        </>
      )}
    </div>
  );
};

export default ExamView;
