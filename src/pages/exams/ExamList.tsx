
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getExams, deleteExam, getClassrooms, getFaculty } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Exam, Classroom } from "@/lib/types";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Eye } from "lucide-react";

const ExamList = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>(getExams());
  const classrooms = getClassrooms();
  const faculty = getFaculty();

  const handleDelete = (id: string) => {
    try {
      deleteExam(id);
      setExams(getExams());
      toast.success("Exam deleted successfully");
    } catch (error) {
      toast.error("Failed to delete exam");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getClassroomNames = (classroomIds: string[]) => {
    return classroomIds
      .map((id) => classrooms.find((c) => c.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };

  const getFacultyNames = (facultyIds: string[]) => {
    return facultyIds
      .map((id) => faculty.find((f) => f.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Exams</h1>
        <Button
          onClick={() => navigate("/exams/new")}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Schedule Exam
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Classrooms</TableHead>
                <TableHead>Supervisors</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    No exams scheduled. Click "Schedule Exam" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                exams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">{exam.subject}</TableCell>
                    <TableCell>{formatDate(exam.date.toString())}</TableCell>
                    <TableCell>{exam.startTime} - {exam.endTime}</TableCell>
                    <TableCell>{getClassroomNames(exam.classroomIds)}</TableCell>
                    <TableCell>{getFacultyNames(exam.facultyIds)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/exams/${exam.id}`)}
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/exams/${exam.id}/edit`)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(exam.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default ExamList;
