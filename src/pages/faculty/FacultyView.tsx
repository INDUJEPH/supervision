
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFacultyById } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Mail, Phone, CalendarCheck, School, Award } from "lucide-react";

const FacultyView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    
    try {
      const facultyData = getFacultyById(id);
      if (facultyData) {
        setFaculty(facultyData);
      } else {
        toast.error("Faculty member not found");
        navigate("/faculty");
      }
    } catch (error) {
      toast.error("Failed to load faculty data");
      navigate("/faculty");
    }
  }, [id, navigate]);

  if (!faculty) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading faculty data...</p>
      </div>
    );
  }

  const availabilityDays = Object.entries(faculty.availability)
    .filter(([_, value]) => value)
    .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/faculty")}
            className="p-0 h-auto"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold">{faculty.name}</h1>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate(`/faculty/${id}/edit`)}
        >
          Edit Details
        </Button>
      </div>

      <Card className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Faculty Details</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <School className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p>{faculty.department}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{faculty.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p>{faculty.phone}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Award className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Seniority Level</p>
                  <p>{faculty.seniority}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Supervision Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Maximum Supervisions</p>
                <p className="font-medium">{faculty.maxSupervisions}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Availability</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {availabilityDays.length > 0 ? (
                    availabilityDays.map((day) => (
                      <div key={day} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center">
                        <CalendarCheck className="mr-1" size={12} />
                        {day}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No availability set</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FacultyView;
