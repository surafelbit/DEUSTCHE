import React, { useState, useEffect } from "react";
import { useParams, useLocation , useNavigate} from "react-router-dom";
import apiService from "../../../src/components/api/apiService";
import endPoints from "../../../src/components/api/endPoints";

// ⚡ Example data (later you can fetch from backend)
const departmentData = {
  "NUR": {
    id: "NUR",
    name: "Nursing",
    description: "All Nursing courses for undergraduates.",
    programType: "regular",
    years: [
      {
        id: "year1",
        name: "1st Year",
        semesters: [
          {
            id: "sem1",
            name: "Semester 1",
            courses: [
              {
                id: "c1",
                name: "Anatomy & Physiology I",
                code: "NUR101",
                creditHours: 4,
                prerequisites: [],
                teacher: "Dr. Sarah Johnson",
              },
              {
                id: "c2",
                name: "Fundamentals of Nursing",
                code: "NUR102",
                creditHours: 3,
                prerequisites: [],
                teacher: "Dr. Sarah Johnson",
              },
            ],
          },
          {
            id: "sem2",
            name: "Semester 2",
            courses: [
              {
                id: "c3",
                name: "Anatomy & Physiology II",
                code: "NUR201",
                creditHours: 4,
                prerequisites: ["NUR101"],
              },
              {
                id: "c4",
                name: "Medical-Surgical Nursing I",
                code: "NUR202",
                creditHours: 3,
                prerequisites: ["NUR102"],
              },
            ],
          },
        ],
      },
    ],
  },
  "NUR-EXT": {
    id: "NUR-EXT",
    name: "Nursing (Extension)",
    description: "Nursing courses for extension programs.",
    programType: "extension",
    years: [
      {
        id: "year1",
        name: "1st Year",
        semesters: [
          {
            id: "sem1",
            name: "Semester 1",
            courses: [
              {
                id: "c1",
                name: "Extension Nursing Fundamentals",
                code: "NUREXT101",
                creditHours: 4,
                prerequisites: [],
                teacher: "Dr. Sarah Johnson",
              },
            ],
          },
        ],
      },
    ],
  },
  "CS-DIS": {
    id: "CS-DIS",
    name: "Computer Science (Distance)",
    description: "Computer Science courses for distance learning.",
    programType: "distance",
    years: [
      {
        id: "year1",
        name: "1st Year",
        semesters: [
          {
            id: "sem1",
            name: "Semester 1",
            courses: [
              {
                id: "c1",
                name: "Online Programming Fundamentals",
                code: "CSDIS101",
                creditHours: 3,
                prerequisites: [],
                teacher: "Dr. Sarah Johnson",
              },
            ],
          },
        ],
      },
    ],
  },
  // Add other departments as needed...
};

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
  
  const dept = id ? departmentData[id] : null;
  const [searchTerm, setSearchTerm] = useState("");
  const [department, setDepartment] = useState(dept);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editValues, setEditValues] = useState({
    code: "",
    name: "",
    creditHours: "",
    prerequisites: [],
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

  // Get all courses for prerequisite selection
  const allCourses = department?.years?.flatMap((year) =>
    year.semesters.flatMap((sem) => sem.courses)
  ) || [];

  // Handle adding course
  const handleAddCourse = async () => {
    const {
      yearId,
      semesterId,
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
      !yearId ||
      !semesterId ||
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
        cTitle,
        cCode,
        theoryHrs: parseInt(theoryHrs),
        labHrs: parseInt(labHrs),
        cCategoryID: parseInt(cCategoryID),
        departmentID: parseInt(departmentID),
        classYearID: parseInt(classYearID),
        semesterID: parseInt(semesterID),
        prerequisiteIds: prerequisiteIds.map((id) => parseInt(id)),
      });

      if (response.data) {
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
                          courses: [
                            ...sem.courses,
                            {
                              id: response.data.id || Date.now().toString(),
                              code: cCode,
                              name: cTitle,
                              creditHours:
                                parseInt(theoryHrs) + parseInt(labHrs),
                              prerequisites: prerequisiteIds,
                            },
                          ],
                        }
                      : sem
                  ),
                }
              : year
          ),
        }));

        setNewCourse({
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
        setIsFormOpen(false);
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

  if (!department) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-3xl font-bold text-red-600">
          Department Not Found
        </h1>
        <p className="text-gray-600 mt-2">The requested department does not exist.</p>
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
                {programTypeNames[programType]}
              </span>
            </div>
            <p className="mt-2 text-lg opacity-90">{department.description}</p>
          </div>
          <div className="text-right">
            <p className="text-blue-100">Department Code: {department.id}</p>
            <p className="text-blue-100">Program Type: {programTypeNames[programType]}</p>
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
      {department.years.map((year) => (
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
                      <th className="p-3 border">Credit Hours</th>
                      <th className="p-3 border">Prerequisites</th>
                      <th className="p-3 border">Teacher</th>
                      <th className="p-3 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.map((course) => (
                      <tr
                        key={course.id}
                        className={`transition-all duration-300 ease-in-out ${
                          editingCourse && editingCourse.id === course.id
                            ? "scale-105 bg-blue-50 dark:bg-blue-900/30 shadow-lg border border-blue-200 dark:border-blue-700 z-10 relative"
                            : "hover:scale-102 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md hover:z-10"
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
                            <td className="p-3 border">
                              <div className="relative">
                                <select
                                  multiple
                                  value={editValues.prerequisites}
                                  onChange={(e) => {
                                    const selected = Array.from(
                                      e.target.selectedOptions,
                                      (option) => option.value
                                    );
                                    setEditValues({
                                      ...editValues,
                                      prerequisites: selected.includes("")
                                        ? []
                                        : selected.filter((val) => val !== ""),
                                    });
                                  }}
                                  className="w-full border px-2 py-1 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="" disabled>
                                    Hold Ctrl/Cmd to select multiple
                                    prerequisites
                                  </option>
                                  <option value="">No Prerequisites</option>
                                  {allCourses
                                    .filter((c) => c.id !== course.id)
                                    .map((c) => (
                                      <option key={c.id} value={c.code}>
                                        {c.code} - {c.name}
                                      </option>
                                    ))}
                                </select>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  Hold Ctrl (Windows) or Cmd (Mac) to select
                                  multiple courses
                                </p>
                              </div>
                            </td>
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
                          ) : (
                            <td className="p-3 border">{course.teacher || "Not Assigned"}</td>
                            <td className="p-3 border flex space-x-2">
                              <button
                                onClick={() =>
                                  handleUpdateCourse(year.id, sem.id, course.id)
                                }
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
                            <td className="p-3 border font-mono">
                              {course.code}
                            </td>
                            <td className="p-3 border">{course.name}</td>
                            <td className="p-3 border text-center">
                              {course.creditHours}
                            </td>
                            <td className="p-3 border">
                              {course.prerequisites.length > 0
                                ? course.prerequisites.join(", ")
                                : "None"}
                            </td>
                            <td className="p-3 border">{course.teacher || "Not Assigned"}</td>
                            <td className="p-3 border">
                              <button
                                onClick={() =>
                                  handleEditCourse(year.id, sem.id, course)
                                }
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
            );
          })}
        </div>
      ))}
    </div>
  );
}