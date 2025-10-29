import React, { useState, useEffect } from "react";
import { useParams, useLocation , useNavigate} from "react-router-dom";
import apiService from "../../../src/components/api/apiService";
import endPoints from "../../../src/components/api/endPoints";

interface Course {
  cid: number;
  ccode: string;
  ctitle: string;
  theoryHrs: number;
  labHrs: number;
  category: {
    catID: number;
    catName: string;
  };
  department: {
    dptID: number;
    deptName: string;
    departmentCode: string;
  };
  prerequisites: any[];
  classYear: {
    id: number;
    classYear: string;
  };
  semester: {
    academicPeriodCode: string;
    academicPeriod: string;
  };
  teacher?: string; // You might need to add this field to your API
}

interface DepartmentInfo {
  id: string;
  name: string;
  description: string;
  programType: string;
  courses: Course[];
}

// Program type display names
const programTypeNames = {
  regular: "Regular",
  extension: "Extension",
  distance: "Distance",
};

export default function DepartmentDetail() {

 const { id } = useParams();
  const location = useLocation();
  const programType = location.state?.programType || "regular";
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [department, setDepartment] = useState<DepartmentInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [editValues, setEditValues] = useState({
    code: "",
    name: "",
    creditHours: "",
    prerequisites: [],
    teacher: "",
  });

  const [newCourse, setNewCourse] = useState({
    yearId: "",
    semesterId: "",
    cTitle: "",
    cCode: "",
    theoryHrs: "",
    labHrs: "",
    cCategoryID: "",
    departmentID: "",
    classYearID: "",
    semesterID: "",
    prerequisiteIds: [],
  });

    useEffect(() => {
      const fetchDepartmentCourses = async () => {
        if (!id) return;
        
        try {
          setIsLoading(true);
          const allCourses = await apiService.get(endPoints.allCourses);
          
          // Filter courses by department code
          const departmentCourses = allCourses.filter((course: Course) => 
            course.department.departmentCode === id
          );

          // Group courses by year and semester
          const groupedCourses = departmentCourses.reduce((acc: any, course: Course) => {
            const year = course.classYear.classYear;
            const semester = course.semester.academicPeriod;
            
            if (!acc[year]) {
              acc[year] = {};
            }
            if (!acc[year][semester]) {
              acc[year][semester] = [];
            }
            
            acc[year][semester].push({
              id: course.cid.toString(),
              name: course.ctitle,
              code: course.ccode,
              creditHours: course.theoryHrs + course.labHrs,
              prerequisites: course.prerequisites.map((p: any) => p.ccode || p.prerequisiteCode),
              teacher: course.teacher || "Not Assigned",
              theoryHrs: course.theoryHrs,
              labHrs: course.labHrs,
              category: course.category.catName,
            });
            
            return acc;
          }, {});
          
                  // Transform to the expected department structure
          const departmentInfo: DepartmentInfo = {
            id: id,
            name: departmentCourses[0]?.department.deptName || id,
            description: `All ${departmentCourses[0]?.department.deptName || id} courses for ${programType} programs.`,
            programType: programType,
            courses: departmentCourses,
            // Transform grouped data for display
            years: Object.entries(groupedCourses).map(([year, semesters]: [string, any]) => ({
              id: `year${year}`,
              name: `${year} Year`,
              semesters: Object.entries(semesters).map(([semester, courses]: [string, any]) => ({
                id: `sem${Object.keys(semesters).indexOf(semester) + 1}`,
                name: semester,
                courses: courses,
              })),
            })),
          };

          setDepartment(departmentInfo);
        } catch (error) {
          console.error("Error fetching department courses:", error);
          setDepartment(null);
        } finally {
          setIsLoading(false);
        }
      };

      fetchDepartmentCourses();
    }, [id, programType]);


  // Get all courses for prerequisite selection
    const allCourses = department?.courses || [];

  // Handle adding course
  const handleAddCourse = async () => {
    const {
      cTitle,
      cCode,
      theoryHrs,
      labHrs,
      cCategoryID,
      departmentID,
      classYearID,
      semesterID,
      prerequisiteIds,
    } = newCourse;

    if (
      !cTitle ||
      !cCode ||
      !theoryHrs ||
      !labHrs ||
      !cCategoryID ||
      !departmentID ||
      !classYearID ||
      !semesterID
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const response = await apiService.post(endPoints.courses, {
        ctitle: cTitle,
        ccode: cCode,
        theoryHrs: parseInt(theoryHrs),
        labHrs: parseInt(labHrs),
        cCategoryID: parseInt(cCategoryID),
        departmentID: parseInt(departmentID),
        classYearID: parseInt(classYearID),
        semesterID: parseInt(semesterID),
        prerequisiteIds: prerequisiteIds.map((id) => parseInt(id)),
      });

      if (response) {
        // Refresh the department data to show the new course
        window.location.reload();
      }
    } catch (error) {
      console.error("Error adding course:", error);
      alert("Failed to add course. Please try again.");
    }
  };

  // Handle start editing
  const handleEditCourse = (yearId, semesterId, course) => {
    setEditingCourse({ yearId, semesterId, id: course.id });
    setEditValues({
      code: course.code,
      name: course.name,
      creditHours: course.creditHours.toString(),
      prerequisites: course.prerequisites,
    });
  };

  // Handle update course
  const handleUpdateCourse = (yearId, semesterId, courseId) => {
    if (!editValues.code || !editValues.name || !editValues.creditHours) {
      alert("Please fill in all required fields");
      return;
    }

    setDepartment((prev) => ({
      ...prev,
      years: prev.years.map((year) =>
        year.id === yearId
          ? {
              ...year,
              semesters: year.semesters.map((sem) =>
                sem.id === semesterId
                  ? {
                      ...sem,
                      courses: sem.courses.map((course) =>
                        course.id === courseId
                          ? {
                              ...course,
                              code: editValues.code,
                              name: editValues.name,
                              creditHours: parseInt(editValues.creditHours),
                              prerequisites: editValues.prerequisites,
                            }
                          : course
                      ),
                    }
                  : sem
              ),
            }
          : year
      ),
    }));

    setEditingCourse(null);
    setEditValues({ code: "", name: "", creditHours: "", prerequisites: [] });
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingCourse(null);
    setEditValues({ code: "", name: "", creditHours: "", prerequisites: [] });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-3xl font-bold text-red-600">
          Department Not Found
        </h1>
        <p className="text-gray-600 mt-2">The requested department does not exist or has no courses.</p>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-10">
      {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-8 rounded-2xl shadow-lg text-white">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">{department.name}</h1>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                  {programTypeNames[programType as keyof typeof programTypeNames]}
                </span>
              </div>
              <p className="mt-2 text-lg opacity-90">{department.description}</p>
              <p className="mt-1 text-blue-100">Total Courses: {department.courses.length}</p>
            </div>
            <div className="text-right">
              <p className="text-blue-100">Department Code: {department.id}</p>
              <p className="text-blue-100">Program Type: {programTypeNames[programType as keyof typeof programTypeNames]}</p>
            </div>
          </div>
        </div>
      
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)} // Go back to previous page
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors  rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Programs
          </button>
        </div>


      {/* Search Input */}
      <div className="max-w-md">
        <input
          type="text"
          placeholder="Search by course name or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
        />
      </div>

      {/* Add Course Button */}
      <div className="max-w-2xl">
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {isFormOpen ? "Cancel" : "Create or Add a Course"}
        </button>
      </div>

      {/* Add Course Form (Collapsible) */}
      {isFormOpen && (
        <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-xl shadow space-y-4 max-w-2xl">
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200">
            Add New Course
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <select
              value={newCourse.yearId}
              onChange={(e) =>
                setNewCourse({
                  ...newCourse,
                  yearId: e.target.value,
                  semesterId: "",
                  classYearID: e.target.value,
                })
              }
              className="border px-3 py-2 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
            >
              <option value="">Select Year</option>
              {department.years.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.name}
                </option>
              ))}
            </select>
            <select
              value={newCourse.semesterId}
              onChange={(e) =>
                setNewCourse({
                  ...newCourse,
                  semesterId: e.target.value,
                  semesterID: e.target.value,
                })
              }
              className="border px-3 py-2 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
              disabled={!newCourse.yearId}
            >
              <option value="">Select Semester</option>
              {newCourse.yearId &&
                department.years
                  .find((y) => y.id === newCourse.yearId)
                  .semesters.map((sem) => (
                    <option key={sem.id} value={sem.id}>
                      {sem.name}
                    </option>
                  ))}
            </select>
            <input
              type="text"
              placeholder="Course Title"
              value={newCourse.cTitle}
              onChange={(e) =>
                setNewCourse({ ...newCourse, cTitle: e.target.value })
              }
              className="border px-3 py-2 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
            />
            <input
              type="text"
              placeholder="Course Code"
              value={newCourse.cCode}
              onChange={(e) =>
                setNewCourse({ ...newCourse, cCode: e.target.value })
              }
              className="border px-3 py-2 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
            />
            <input
              type="number"
              placeholder="Theory Hours"
              value={newCourse.theoryHrs}
              onChange={(e) =>
                setNewCourse({ ...newCourse, theoryHrs: e.target.value })
              }
              className="border px-3 py-2 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
            />
            <input
              type="number"
              placeholder="Lab Hours"
              value={newCourse.labHrs}
              onChange={(e) =>
                setNewCourse({ ...newCourse, labHrs: e.target.value })
              }
              className="border px-3 py-2 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
            />
            <input
              type="number"
              placeholder="Category ID"
              value={newCourse.cCategoryID}
              onChange={(e) =>
                setNewCourse({ ...newCourse, cCategoryID: e.target.value })
              }
              className="border px-3 py-2 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
            />
            <input
              type="number"
              placeholder="Department ID"
              value={newCourse.departmentID}
              onChange={(e) =>
                setNewCourse({ ...newCourse, departmentID: e.target.value })
              }
              className="border px-3 py-2 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
            />
            <div className="relative col-span-2">
              <select
                multiple
                value={newCourse.prerequisiteIds}
                onChange={(e) =>
                  setNewCourse({
                    ...newCourse,
                    prerequisiteIds: Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    ).filter((val) => val !== ""),
                  })
                }
                className="border px-3 py-2 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Hold Ctrl/Cmd to select multiple prerequisites
                </option>
                <option value="">No Prerequisites</option>
                {allCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.code} - {course.name}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Hold Ctrl (Windows) or Cmd (Mac) to select multiple courses
              </p>
            </div>
          </div>
          <button
            onClick={handleAddCourse}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Add Course
          </button>
        </div>
      )}

      {/* Years & Semesters */}
      {department.years && department.years.map((year) => (
        <div key={year.id} className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            {year.name}
          </h2>

          {year.semesters.map((sem) => {
            const filteredCourses = sem.courses.filter(
              (c) =>
                c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.code.toLowerCase().includes(searchTerm.toLowerCase())
            );
            if (filteredCourses.length === 0) return null;

            return (
              <div
                key={sem.id}
                className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 space-y-4"
              >
                <h3 className="text-2xl font-semibold text-blue-700 dark:text-blue-400">
                  {sem.name}
                </h3>

                <table className="w-full border-collapse text-gray-800 dark:text-gray-200">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800 text-left">
                      <th className="p-3 border">Course Code</th>
                      <th className="p-3 border">Course Name</th>
                      <th className="p-3 border">Theory Hrs</th>
                      <th className="p-3 border">Lab Hrs</th>
                      <th className="p-3 border">Total Credits</th>
                      <th className="p-3 border">Category</th>
                      <th className="p-3 border">Teacher</th>
                      <th className="p-3 border">Prerequisites</th>
                      <th className="p-3 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.map((course) => (
                      <tr
                        key={course.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="p-3 border font-mono">{course.code}</td>
                        <td className="p-3 border">{course.name}</td>
                        <td className="p-3 border text-center">{course.theoryHrs}</td>
                        <td className="p-3 border text-center">{course.labHrs}</td>
                        <td className="p-3 border text-center">{course.creditHours}</td>
                        <td className="p-3 border">{course.category}</td>
                        <td className="p-3 border">{course.teacher}</td>
                        <td className="p-3 border">
                          {course.prerequisites.length > 0
                            ? course.prerequisites.join(", ")
                            : "None"}
                        </td>
                        <td className="p-3 border">
                          <button
                            onClick={() => {
                              // You can implement edit functionality here
                              setEditingCourse(course);
                              setEditValues({
                                code: course.code,
                                name: course.name,
                                creditHours: course.creditHours.toString(),
                                prerequisites: course.prerequisites,
                                teacher: course.teacher,
                              });
                            }}
                            className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}