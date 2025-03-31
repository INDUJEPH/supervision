
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getExams, getFaculty, getStudents, getClassrooms } from "@/lib/db";
import { CalendarDays, Users, GraduationCap, School, LayoutDashboard, BookOpen } from "lucide-react";

const Index = () => {
  // Get summary data for the dashboard
  const exams = getExams();
  const faculty = getFaculty();
  const students = getStudents();
  const classrooms = getClassrooms();

  // Get upcoming exams (next 7 days)
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  
  const upcomingExams = exams
    .filter(exam => {
      const examDate = new Date(exam.date);
      return examDate >= today && examDate <= nextWeek;
    })
    .sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    })
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Exam Management System</h1>
        <p className="text-gray-500">
          Welcome to the comprehensive exam management portal
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            <CalendarDays className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exams.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              Scheduled exams in system
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Faculty Members</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{faculty.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              Available for supervision
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              Registered in the system
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Classrooms</CardTitle>
            <School className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classrooms.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              Available for exams
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and operations</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link to="/exams/new">
            <Button className="w-full">
              <CalendarDays className="mr-2 h-4 w-4" />
              Schedule New Exam
            </Button>
          </Link>
          <Link to="/exams">
            <Button className="w-full" variant="outline">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              View All Exams
            </Button>
          </Link>
          <Link to="/faculty">
            <Button className="w-full" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Manage Faculty
            </Button>
          </Link>
          <Link to="/students">
            <Button className="w-full" variant="outline">
              <GraduationCap className="mr-2 h-4 w-4" />
              Manage Students
            </Button>
          </Link>
          <Link to="/classrooms">
            <Button className="w-full" variant="outline">
              <School className="mr-2 h-4 w-4" />
              Manage Classrooms
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Upcoming Exams */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Exams</CardTitle>
          <CardDescription>Exams scheduled in the next 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingExams.length > 0 ? (
            <div className="space-y-4">
              {upcomingExams.map((exam) => {
                const examDate = new Date(exam.date);
                return (
                  <div key={exam.id} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary/10 p-2 rounded-md">
                        <BookOpen className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{exam.subject}</h4>
                        <p className="text-sm text-gray-500">{examDate.toLocaleDateString()}, {exam.startTime} - {exam.endTime}</p>
                        <div className="flex items-center mt-1 space-x-2">
                          <Badge variant="outline">{exam.studentIds.length} students</Badge>
                          <Badge variant="outline">{exam.classroomIds.length} classrooms</Badge>
                        </div>
                      </div>
                    </div>
                    <Link to={`/exams/${exam.id}`}>
                      <Button size="sm" variant="ghost">View Details</Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No upcoming exams in the next 7 days</p>
              <Link to="/exams/new" className="mt-2 inline-block">
                <Button variant="outline" size="sm">
                  Schedule an Exam
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
