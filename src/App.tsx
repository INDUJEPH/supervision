import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import FacultyList from "./pages/faculty/FacultyList";
import FacultyForm from "./pages/faculty/FacultyForm";
import FacultyView from "./pages/faculty/FacultyView";
import StudentList from "./pages/students/StudentList";
import StudentForm from "./pages/students/StudentForm";
import StudentView from "./pages/students/StudentView";
import ClassroomList from "./pages/classrooms/ClassroomList";
import ClassroomForm from "./pages/classrooms/ClassForm";
import ExamList from "./pages/exams/ExamList";
import ExamForm from "./pages/exams/ExamForm";
import ExamView from "./pages/exams/ExamView";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="faculty" element={<FacultyList />} />
                <Route path="faculty/new" element={<FacultyForm />} />
                <Route path="faculty/:id" element={<FacultyView />} />
                <Route path="faculty/:id/edit" element={<FacultyForm />} />
                <Route path="students" element={<StudentList />} />
                <Route path="students/new" element={<StudentForm />} />
                <Route path="students/:id" element={<StudentView />} />
                <Route path="students/:id/edit" element={<StudentForm />} />
                <Route path="classrooms" element={<ClassroomList />} />
                <Route path="classrooms/new" element={<ClassroomForm />} />
                <Route path="classrooms/:id/edit" element={<ClassroomForm />} />
                <Route path="exams" element={<ExamList />} />
                <Route path="exams/new" element={<ExamForm />} />
                <Route path="exams/:id" element={<ExamView />} />
                <Route path="exams/:id/edit" element={<ExamForm />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
