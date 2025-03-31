
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { deleteStudent, getStudents } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Search, UserPlus2, Users2, School } from "lucide-react";

const StudentList = () => {
  const [search, setSearch] = useState("");
  const students = getStudents();
  
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(search.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
    student.department.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      deleteStudent(id);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
        <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-white/90 p-3 rounded-full shadow-md">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">Students</h1>
              <p className="text-gray-600">Manage students and their academic profiles</p>
            </div>
          </div>
        </div>
        
        <Link to="/students/new" className="hover-scale">
          <Button className="gap-2 px-5 py-6 bg-gradient-to-r from-primary to-primary/80 shadow-md hover:shadow-lg transition-all">
            <UserPlus2 className="mr-1" />
            Add Student
          </Button>
        </Link>
      </div>
      
      <Card className="border-primary/20 overflow-hidden shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 w-full max-w-md mb-6 bg-gray-50 rounded-lg overflow-hidden px-3 border border-gray-200 focus-within:ring-2 focus-within:ring-primary/30 transition-all">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, roll number, or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 bg-transparent focus-visible:ring-0 flex-1 py-3"
            />
          </div>
          
          {filteredStudents.length > 0 ? (
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary/5 hover:bg-primary/10">
                    <TableHead className="font-semibold text-primary">Name</TableHead>
                    <TableHead className="font-semibold text-primary">Roll Number</TableHead>
                    <TableHead className="font-semibold text-primary">Department</TableHead>
                    <TableHead className="font-semibold text-primary">Semester</TableHead>
                    <TableHead className="font-semibold text-primary">Section</TableHead>
                    <TableHead className="font-semibold text-primary">Elective Subjects</TableHead>
                    <TableHead className="text-right font-semibold text-primary">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id} className="hover-scale transition-all duration-300">
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.rollNumber}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <School className="h-3.5 w-3.5 text-primary/70" />
                          {student.department}
                        </div>
                      </TableCell>
                      <TableCell>{student.semester}</TableCell>
                      <TableCell>{student.section}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {student.electiveSubjects.map((subject, index) => (
                            <Badge 
                              key={index} 
                              variant="outline" 
                              className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 text-primary/90 font-medium px-2 py-1 hover-scale"
                            >
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                              <span className="sr-only">Open menu</span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="1"></circle>
                                <circle cx="12" cy="5" r="1"></circle>
                                <circle cx="12" cy="19" r="1"></circle>
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm border-primary/20 shadow-lg">
                            <DropdownMenuItem asChild>
                              <Link to={`/students/${student.id}`} className="flex items-center gap-2 cursor-pointer">
                                <Users2 className="h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/students/${student.id}/edit`} className="flex items-center gap-2 cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600 flex items-center gap-2 cursor-pointer"
                              onClick={() => handleDelete(student.id)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              </svg>
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Users2 className="h-8 w-8 text-primary/60" />
                </div>
                <p className="text-gray-500 font-medium">No students found</p>
                <p className="text-sm text-gray-400">Try adjusting your search or add a new student</p>
                <Link to="/students/new" className="mt-2">
                  <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
                    <UserPlus2 className="mr-2 h-4 w-4" />
                    Add Student
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentList;
