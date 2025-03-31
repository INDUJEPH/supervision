
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getClassrooms, deleteClassroom } from "@/lib/db";
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
import { Classroom } from "@/lib/types";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";

const ClassroomList = () => {
  const navigate = useNavigate();
  const [classrooms, setClassrooms] = useState<Classroom[]>(getClassrooms());

  const handleDelete = (id: string) => {
    try {
      deleteClassroom(id);
      setClassrooms(getClassrooms());
      toast.success("Classroom deleted successfully");
    } catch (error) {
      toast.error("Failed to delete classroom");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Classrooms</h1>
        <Button
          onClick={() => navigate("/classrooms/new")}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Add Classroom
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Building</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Has Projector</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classrooms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No classrooms found. Add your first classroom.
                  </TableCell>
                </TableRow>
              ) : (
                classrooms.map((classroom) => (
                  <TableRow key={classroom.id}>
                    <TableCell className="font-medium">{classroom.name}</TableCell>
                    <TableCell>{classroom.building}</TableCell>
                    <TableCell>{classroom.floor}</TableCell>
                    <TableCell>{classroom.capacity}</TableCell>
                    <TableCell>{classroom.hasProjector ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          classroom.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {classroom.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/classrooms/${classroom.id}/edit`)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(classroom.id)}
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

export default ClassroomList;
