import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import apiService from "../../components/api/apiService";
import endPoints from "../../components/api/endPoints";

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
  teacher?: string;
}

interface DepartmentInfo {
  id: string;
  name: string;
  description: string;
  programType: string;
  courses: Course[];
  years?: {
    id: string;
    name: string;
    semesters: {
      id: string;
      name: string;
      courses: any[];
    }[];
  }[];
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
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set());
  const [expandedSemesters, setExpandedSemesters] = useState<Set<string>>(new Set());
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

        if (departmentCourses.length === 0) {
          setDepartment(null);
          return;
        }

        // Group courses by year and semester
        const groupedCourses = departmentCourses.reduce((acc: any, course: Course) => {
          const year = course.classYear?.classYear || "Unknown";
          const semester = course.semester?.academicPeriod || "Unknown Semester";
          
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
            prerequisites: course.prerequisites?.map((p: any) => p.ccode || p.prerequisiteCode) || [],
            teacher: course.teacher || "Not Assigned",
            theoryHrs: course.theoryHrs,
            labHrs: course.labHrs,
            category: course.category?.catName || "Unknown",
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
          years: Object.entries(groupedCourses).map(([year, semesters]: [string, any]) => ({
            id: `year${year}`,
            name: `${year} Year`,
            semesters: Object.entries(semesters).map(([semester, courses]: [string, any], index) => ({
              id: `sem${index + 1}`,
              name: semester,
              courses: courses,
            })),
          })),
        };

        setDepartment(departmentInfo);
        
        // Auto-expand first year
        if (departmentInfo.years && departmentInfo.years.length > 0) {
          setExpandedYears(new Set([departmentInfo.years[0].id]));
        }
      } catch (error) {
        console.error("Error fetching department courses:", error);
        setDepartment(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartmentCourses();
  }, [id, programType]);

  // Toggle year expansion
  const toggleYear = (yearId: string) => {
    const newExpandedYears = new Set(expandedYears);
    if (newExpandedYears.has(yearId)) {
      newExpandedYears.delete(yearId);
      // Also collapse all semesters in this year
      const newExpandedSemesters = new Set(expandedSemesters);
      department?.years
        ?.find(year => year.id === yearId)
        ?.semesters.forEach(sem => newExpandedSemesters.delete(sem.id));
      setExpandedSemesters(newExpandedSemesters);
    } else {
      newExpandedYears.add(yearId);
    }
    setExpandedYears(newExpandedYears);
  };

  // Toggle semester expansion
  const toggleSemester = (semesterId: string) => {
    const newExpandedSemesters = new Set(expandedSemesters);
    if (newExpandedSemesters.has(semesterId)) {
      newExpandedSemesters.delete(semesterId);
    } else {
      newExpandedSemesters.add(semesterId);
    }
    setExpandedSemesters(newExpandedSemesters);
  };

  // Get filtered courses for a semester based on search term
  const getFilteredCourses = (courses: any[]) => {
    return courses.filter(course =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

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
        window.location.reload();
      }
    } catch (error) {
      console.error("Error adding course:", error);
      alert("Failed to add course. Please try again.");
    }
  };

  // Handle start editing
  const handleEditCourse = (course: any) => {
    setEditingCourse({ id: course.id });
    setEditValues({
      code: course.code,
      name: course.name,
      creditHours: course.creditHours.toString(),
      prerequisites: course.prerequisites,
      teacher: course.teacher || "",
    });
  };

  // Handle update course
  const handleUpdateCourse = (courseId: string) => {
    if (!editValues.code || !editValues.name || !editValues.creditHours) {
      alert("Please fill in all required fields");
      return;
    }

    setDepartment((prev) => {
      if (!prev?.years) return prev;

      const updatedYears = prev.years.map(year => ({
        ...year,
        semesters: year.semesters.map(semester => ({
          ...semester,
          courses: semester.courses.map(course =>
            course.id === courseId
              ? {
                  ...course,
                  code: editValues.code,
                  name: editValues.name,
                  creditHours: parseInt(editValues.creditHours),
                  prerequisites: editValues.prerequisites,
                  teacher: editValues.teacher,
                }
              : course
          ),
        })),
      }));

      return {
        ...prev,
        years: updatedYears,
      };
    });

    setEditingCourse(null);
    setEditValues({ code: "", name: "", creditHours: "", prerequisites: [], teacher: "" });
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingCourse(null);
    setEditValues({ code: "", name: "", creditHours: "", prerequisites: [], teacher: "" });
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
      
      {/* Back Button */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30"
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
              {department.years?.map((year) => (
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
                  ?.find((y) => y.id === newCourse.yearId)
                  ?.semesters.map((sem) => (
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
                  <option key={course.cid} value={course.cid}>
                    {course.ccode} - {course.ctitle}
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

      {/* Years and Semesters Accordion */}
      {department.years && department.years.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Academic Structure
          </h2>
          {department.years.map((year) => (
            <div key={year.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Year Header */}
              <button
                onClick={() => toggleYear(year.id)}
                className="w-full p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  <svg
                    className={`w-5 h-5 transform transition-transform ${
                      expandedYears.has(year.id) ? "rotate-90" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {year.name}
                  </h3>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {year.semesters.length} semester{year.semesters.length !== 1 ? 's' : ''}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {year.semesters.reduce((total, sem) => total + sem.courses.length, 0)} courses
                  </span>
                </div>
              </button>

              {/* Year Content - Semesters */}
              {expandedYears.has(year.id) && (
                <div className="border-t border-gray-200 dark:border-gray-700">
                  {year.semesters.map((semester) => (
                    <div key={semester.id} className="border-b border-gray-100 dark:border-gray-600 last:border-b-0">
                      {/* Semester Header */}
                      <button
                        onClick={() => toggleSemester(semester.id)}
                        className="w-full p-4 pl-12 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex justify-between items-center"
                      >
                        <div className="flex items-center gap-4">
                          <svg
                            className={`w-4 h-4 transform transition-transform ${
                              expandedSemesters.has(semester.id) ? "rotate-90" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          <h4 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                            {semester.name}
                          </h4>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {semester.courses.length} course{semester.courses.length !== 1 ? 's' : ''}
                        </span>
                      </button>

                      {/* Semester Content - Courses */}
                      {expandedSemesters.has(semester.id) && (
                        <div className="bg-gray-50 dark:bg-gray-900 p-4">
                          {getFilteredCourses(semester.courses).length === 0 ? (
                            <div className="text-center py-8">
                              <div className="text-gray-400 dark:text-gray-500 text-4xl mb-2">📚</div>
                              <p className="text-gray-500 dark:text-gray-400">
                                {searchTerm ? 'No courses match your search criteria.' : 'No courses available for this semester.'}
                              </p>
                            </div>
                          ) : (
                            <div className="overflow-x-auto">
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
                                  {getFilteredCourses(semester.courses).map((course) => (
                                    <tr
                                      key={course.id}
                                      className={`transition-all duration-300 ease-in-out ${
                                        editingCourse && editingCourse.id === course.id
                                          ? "scale-105 bg-blue-50 dark:bg-blue-900/30 shadow-lg border border-blue-200 dark:border-blue-700 z-10 relative"
                                          : "hover:bg-white dark:hover:bg-gray-800 hover:shadow-md"
                                      }`}
                                    >
                                      {editingCourse && editingCourse.id === course.id ? (
                                        <>
                                          <td className="p-3 border">
                                            <input
                                              type="text"
                                              value={editValues.code}
                                              onChange={(e) =>
                                                setEditValues({
                                                  ...editValues,
                                                  code: e.target.value,
                                                })
                                              }
                                              className="w-full border px-2 py-1 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                                            />
                                          </td>
                                          <td className="p-3 border">
                                            <input
                                              type="text"
                                              value={editValues.name}
                                              onChange={(e) =>
                                                setEditValues({
                                                  ...editValues,
                                                  name: e.target.value,
                                                })
                                              }
                                              className="w-full border px-2 py-1 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                                            />
                                          </td>
                                          <td className="p-3 border">
                                            <input
                                              type="number"
                                              value={editValues.creditHours}
                                              onChange={(e) =>
                                                setEditValues({
                                                  ...editValues,
                                                  creditHours: e.target.value,
                                                })
                                              }
                                              className="w-full border px-2 py-1 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                                            />
                                          </td>
                                          <td className="p-3 border text-center">{course.labHrs}</td>
                                          <td className="p-3 border text-center">
                                            {parseInt(editValues.creditHours || '0') + course.labHrs}
                                          </td>
                                          <td className="p-3 border">{course.category}</td>
                                          <td className="p-3 border">
                                            <input
                                              type="text"
                                              value={editValues.teacher}
                                              onChange={(e) =>
                                                setEditValues({
                                                  ...editValues,
                                                  teacher: e.target.value,
                                                })
                                              }
                                              className="w-full border px-2 py-1 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                                              placeholder="Teacher name"
                                            />
                                          </td>
                                          <td className="p-3 border">
                                            {course.prerequisites.length > 0
                                              ? course.prerequisites.join(", ")
                                              : "None"}
                                          </td>
                                          <td className="p-3 border flex space-x-2">
                                            <button
                                              onClick={() => handleUpdateCourse(course.id)}
                                              className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition dark:bg-blue-500 dark:hover:bg-blue-600"
                                            >
                                              Save
                                            </button>
                                            <button
                                              onClick={handleCancelEdit}
                                              className="bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700 transition dark:bg-gray-500 dark:hover:bg-gray-600"
                                            >
                                              Cancel
                                            </button>
                                          </td>
                                        </>
                                      ) : (
                                        <>
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
                                              onClick={() => handleEditCourse(course)}
                                              className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition dark:bg-yellow-400 dark:hover:bg-yellow-500"
                                            >
                                              Edit
                                            </button>
                                          </td>
                                        </>
                                      )}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl border border-yellow-200 dark:border-yellow-800">
          <div className="text-center">
            <div className="text-yellow-500 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-yellow-800 dark:text-yellow-200">
              No Academic Structure Available
            </h3>
            <p className="text-yellow-600 dark:text-yellow-400 mt-2">
              There are no courses organized by year and semester for this department.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}