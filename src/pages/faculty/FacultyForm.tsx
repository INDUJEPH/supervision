
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { addFaculty, getFacultyById, updateFaculty } from "@/lib/db";
import { Faculty } from "@/lib/types";

const FacultyForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  // Define the initial state with all required properties
  const initialFormState: Faculty = {
    id: "",
    name: "",
    department: "",
    email: "",
    phone: "",
    maxSupervisions: 0,
    seniority: 0,
    availability: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
    },
  };

  const [formData, setFormData] = useState<Faculty>(initialFormState);

  useEffect(() => {
    if (isEditing && id) {
      // Fetch faculty data for editing
      const faculty = getFacultyById(id);
      if (faculty) {
        setFormData(faculty);
      } else {
        toast.error("Faculty not found");
        navigate("/faculty");
      }
    }
  }, [id, isEditing, navigate]);

  const updateMutation = useMutation({
    mutationFn: (faculty: Faculty) => {
      return Promise.resolve(updateFaculty(faculty.id, faculty));
    },
    onSuccess: () => {
      toast.success("Faculty updated successfully");
      navigate("/faculty");
    },
    onError: (error) => {
      toast.error(`Error updating faculty: ${error}`);
    },
  });

  const createMutation = useMutation({
    mutationFn: (faculty: Omit<Faculty, "id">) => {
      return Promise.resolve(addFaculty(faculty));
    },
    onSuccess: () => {
      toast.success("Faculty created successfully");
      navigate("/faculty");
    },
    onError: (error) => {
      toast.error(`Error creating faculty: ${error}`);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      const day = name.split(".")[1]; // Extract day from name like "availability.monday"
      
      setFormData({
        ...formData,
        availability: {
          ...formData.availability,
          [day]: checkbox.checked,
        },
      });
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
    
    // Ensure all required fields are present
    if (isEditing) {
      updateMutation.mutate(formData);
    } else {
      // For creating, we omit the id as it will be generated
      const { id, ...newFaculty } = formData;
      createMutation.mutate(newFaculty as Omit<Faculty, "id">);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? "Edit Faculty" : "Add New Faculty"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Information */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Name *
            </label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="department" className="block text-sm font-medium">
              Department *
            </label>
            <input
              id="department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium">
              Phone *
            </label>
            <input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="maxSupervisions" className="block text-sm font-medium">
              Max Supervisions *
            </label>
            <input
              id="maxSupervisions"
              name="maxSupervisions"
              type="number"
              min="0"
              value={formData.maxSupervisions}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="seniority" className="block text-sm font-medium">
              Seniority (Years) *
            </label>
            <input
              id="seniority"
              name="seniority"
              type="number"
              min="0"
              value={formData.seniority}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
        </div>
        
        {/* Availability */}
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Availability</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="availability.monday"
                checked={formData.availability.monday}
                onChange={handleInputChange}
                className="rounded"
              />
              <span>Monday</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="availability.tuesday"
                checked={formData.availability.tuesday}
                onChange={handleInputChange}
                className="rounded"
              />
              <span>Tuesday</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="availability.wednesday"
                checked={formData.availability.wednesday}
                onChange={handleInputChange}
                className="rounded"
              />
              <span>Wednesday</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="availability.thursday"
                checked={formData.availability.thursday}
                onChange={handleInputChange}
                className="rounded"
              />
              <span>Thursday</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="availability.friday"
                checked={formData.availability.friday}
                onChange={handleInputChange}
                className="rounded"
              />
              <span>Friday</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="availability.saturday"
                checked={formData.availability.saturday}
                onChange={handleInputChange}
                className="rounded"
              />
              <span>Saturday</span>
            </label>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={() => navigate("/faculty")}
            className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700"
            disabled={updateMutation.isPending || createMutation.isPending}
          >
            {updateMutation.isPending || createMutation.isPending
              ? "Saving..."
              : isEditing
              ? "Update Faculty"
              : "Add Faculty"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FacultyForm;
