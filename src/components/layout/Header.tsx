
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Calendar, Users2, GraduationCap, School } from "lucide-react";

const Header = () => {
  const location = useLocation();
  
  const navItems = [
    { name: "Dashboard", path: "/", icon: <Calendar className="h-4 w-4" /> },
    { name: "Faculty", path: "/faculty", icon: <Users2 className="h-4 w-4" /> },
    { name: "Students", path: "/students", icon: <GraduationCap className="h-4 w-4" /> },
    { name: "Classrooms", path: "/classrooms", icon: <School className="h-4 w-4" /> },
    { name: "Exams", path: "/exams", icon: <Calendar className="h-4 w-4" /> },
  ];
  
  return (
    <header className="bg-gradient-to-r from-primary to-primary/90 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-7 h-7"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">Exam Scheduler</h1>
              <p className="text-xs text-white/70">Manage exams efficiently</p>
            </div>
          </div>
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-md transition-colors",
                  location.pathname === item.path 
                    ? "bg-white/20 text-white font-medium" 
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                )}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
          <div className="md:hidden">
            <button className="bg-white/10 hover:bg-white/20 transition-colors p-2 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
