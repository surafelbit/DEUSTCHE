import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen,  Stethoscope,  HeartPulse, School, Users, Globe } from "lucide-react";
import apiService from "@/components/api/apiService";
import endPoints from "@/components/api/endPoints";

interface Department {
  dptID: number;
  deptName: string;
  totalCrHr: number | null;
  departmentCode: string;
  icon: React.ReactNode;
  color: string;
  programType?: string;
  departmentHead?: string; 
}

// Program types
const programTypes = [
  {
    id: "regular",
    name: "Regular",
    description: "Full-time on-campus programs",
    icon: <School className="w-8 h-8" />,
    color: "from-blue-500 to-blue-700",
  },
  {
    id: "extension",
    name: "Extension",
    description: "Extended and continuing education programs",
    icon: <Users className="w-8 h-8" />,
    color: "from-green-500 to-green-700",
  },
  {
    id: "distance",
    name: "Distance",
    description: "Online and distance learning programs",
    icon: <Globe className="w-8 h-8" />,
    color: "from-purple-500 to-purple-700",
  },
];

const getDepartmentIcon = (deptName: string) => {
  const name = deptName.toLowerCase();
  if (name.includes('nursing')) return <HeartPulse className="w-10 h-10" />;
  if (name.includes('medicine')) return <Stethoscope className="w-10 h-10" />;
  if (name.includes('computer')) return <BookOpen className="w-10 h-10" />;
  if (name.includes('business')) return <Users className="w-10 h-10" />;
  return <BookOpen className="w-10 h-10" />;
};

const getDepartmentColor = (deptName: string, programType: string) => {
  const name = deptName.toLowerCase();
  if (name.includes('nursing')) return "from-green-500 to-emerald-600";
  if (name.includes('medicine')) return "from-red-500 to-pink-600";
  if (name.includes('computer')) return "from-indigo-500 to-purple-600";
  if (name.includes('business')) return "from-orange-500 to-orange-600";
  
  // Default colors based on program type
  if (programType === 'regular') return "from-blue-500 to-blue-600";
  if (programType === 'extension') return "from-green-500 to-green-600";
  if (programType === 'distance') return "from-purple-500 to-purple-600";
  
  return "from-gray-500 to-gray-600";
};

const getProgramType = (departmentCode: string, deptName: string) => {
  if (departmentCode.includes('EXT') || deptName.toLowerCase().includes('extension')) 
    return 'extension';
  if (departmentCode.includes('DIS') || deptName.toLowerCase().includes('distance')) 
    return 'distance';
  return 'regular';
};

export default function RegistrarDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [selectedProgramType, setSelectedProgramType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.get(endPoints.departments);
        
        // Transform API response to match our Department interface
        const transformedDepartments: Department[] = response.map((dept: any) => {
          const programType = getProgramType(dept.departmentCode, dept.deptName);
          return {
            dptID: dept.dptID,
            deptName: dept.deptName,
            totalCrHr: dept.totalCrHr,
            departmentCode: dept.departmentCode,
            icon: getDepartmentIcon(dept.deptName),
            color: getDepartmentColor(dept.deptName, programType),
            programType: programType,
            departmentHead: dept.departmentHead || "Not Assigned", // You might need to fetch this separately
          };
        });
        
        setDepartments(transformedDepartments);
        console.log("Fetched departments:", transformedDepartments);
      } catch (err) {
        console.error("Error fetching departments:", err);
        // Fallback to empty array if API fails
        setDepartments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedProgramType) {
      const filtered = departments.filter(
        dept => dept.programType === selectedProgramType
      );
      setFilteredDepartments(filtered);
    } else {
      setFilteredDepartments([]);
    }
  }, [selectedProgramType, departments]);

  const handleProgramTypeSelect = (programTypeId: string) => {
    setSelectedProgramType(programTypeId);
  };

  const handleBackToProgramTypes = () => {
    setSelectedProgramType(null);
    setFilteredDepartments([]);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12 px-8 py-8">
      {/* Hero Section */}
      <div className="relative w-full rounded-xl overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 p-10 shadow-xl">
        <h1 className="text-5xl font-bold text-white drop-shadow-lg">
          Department Management
        </h1>
        <p className="text-white mt-2 text-lg drop-shadow-md">
          Manage all academic departments and their courses
        </p>
      </div>

      {/* Program Type Selection or Back Button */}
      <div className="flex justify-between items-center">
        {selectedProgramType ? (
          <button
            onClick={handleBackToProgramTypes}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Program Types
          </button>
        ) : (
          <div className="w-full">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Select Program Type</h2>
          </div>
        )}
      </div>

      {/* Program Types Grid (shown when no program type is selected) */}
      {!selectedProgramType && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {programTypes.map((program) => (
            <div
              key={program.id}
              onClick={() => handleProgramTypeSelect(program.id)}
              className={`cursor-pointer rounded-2xl p-6 shadow-lg bg-gradient-to-r ${program.color} text-white flex flex-col justify-between transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300`}
            >
              <div className="flex items-center gap-4 mb-4">
                {program.icon}
                <h3 className="text-2xl font-bold">{program.name}</h3>
              </div>
              <p className="text-blue-100 text-sm">{program.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-blue-200 text-sm">
                  {departments.filter(dept => dept.programType === program.id).length} departments
                </span>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Departments Grid (shown when program type is selected) */}
      {selectedProgramType && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              {programTypes.find(p => p.id === selectedProgramType)?.name} Programs
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {filteredDepartments.length} departments available
            </p>
          </div>

          {filteredDepartments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🏫</div>
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400">
                No departments found for this program type
              </h3>
              <p className="text-gray-500 dark:text-gray-500 mt-2">
                There are currently no departments available for {programTypes.find(p => p.id === selectedProgramType)?.name} programs.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDepartments.map((dept) => (
                <div
                  key={dept.dptID}
                  onClick={() =>
                    navigate(`/registrar/departments/${dept.departmentCode}`, {
                      state: { programType: selectedProgramType }
                    })
                  }
                  className={`cursor-pointer rounded-2xl p-6 shadow-lg bg-gradient-to-r ${dept.color} text-white flex flex-col justify-between transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300`}
                >
                  <div className="flex items-center gap-4">
                    {dept.icon}
                    <div>
                      <h2 className="text-2xl font-bold">{dept.deptName}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
                          {programTypes.find(p => p.id === selectedProgramType)?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm opacity-90">ID: {dept.dptID}</span>
                      <span className="text-sm opacity-90">Code: {dept.departmentCode}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm opacity-90">
                        Credits: {dept.totalCrHr !== null ? dept.totalCrHr : "N/A"}
                      </span>
                      <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Add department head info for regular and extension programs - MOVED OUTSIDE the flex container */}
                  {(dept.programType === 'regular' || dept.programType === 'extension') && dept.departmentHead && (
                    <div className="flex items-center gap-2 pt-3 mt-3 border-t border-white/20">
                      <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-sm opacity-90">Head: {dept.departmentHead}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}