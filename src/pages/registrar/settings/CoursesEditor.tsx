import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaList,
  FaTh,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";

// Fake Data
const fakeCourses: Course[] = [
  {
    id: 1,
    cTitle: "Introduction to Computer Science",
    cCode: "CS101",
    theoryHrs: 3,
    labHrs: 1,
    courseCategory: { id: 1, name: "Core" },
    department: { id: 1, name: "Computer Science" },
    classYear: { id: 1, year: "First Year" },
    semester: { id: 1, name: "Fall" },
    prerequisites: [],
  },
  {
    id: 2,
    cTitle: "Data Structures and Algorithms",
    cCode: "CS201",
    theoryHrs: 3,
    labHrs: 1,
    courseCategory: { id: 1, name: "Core" },
    department: { id: 1, name: "Computer Science" },
    classYear: { id: 2, year: "Second Year" },
    semester: { id: 2, name: "Spring" },
    prerequisites: [{ id: 1, cCode: "CS101" }],
  },
  {
    id: 3,
    cTitle: "Database Systems",
    cCode: "CS305",
    theoryHrs: 3,
    labHrs: 1,
    courseCategory: { id: 1, name: "Core" },
    department: { id: 1, name: "Computer Science" },
    classYear: { id: 3, year: "Third Year" },
    semester: { id: 1, name: "Fall" },
    prerequisites: [{ id: 2, cCode: "CS201" }],
  },
  {
    id: 4,
    cTitle: "Web Development",
    cCode: "CS310",
    theoryHrs: 2,
    labHrs: 2,
    courseCategory: { id: 2, name: "Elective" },
    department: { id: 1, name: "Computer Science" },
    classYear: { id: 3, year: "Third Year" },
    semester: { id: 2, name: "Spring" },
    prerequisites: [{ id: 2, cCode: "CS201" }],
  },
  {
    id: 5,
    cTitle: "Linear Algebra",
    cCode: "MATH201",
    theoryHrs: 4,
    labHrs: 0,
    courseCategory: { id: 4, name: "Foundation" },
    department: { id: 2, name: "Mathematics" },
    classYear: { id: 2, year: "Second Year" },
    semester: { id: 1, name: "Fall" },
    prerequisites: [],
  },
];

type Course = {
  id: number;
  cTitle: string;
  cCode: string;
  theoryHrs: number;
  labHrs: number;
  courseCategory: { id: number; name: string };
  department: { id: number; name: string };
  classYear: { id: number; year: string };
  semester: { id: number; name: string };
  prerequisites: Array<{ id: number; cCode: string }>;
};

const CoursesEditor = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API delay
    setTimeout(() => {
      setCourses(fakeCourses);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <FaSpinner className="animate-spin text-5xl text-blue-600 mr-4" />
        <span className="text-2xl font-medium">Loading Courses...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
          DHFM Courses Editor
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Manage all courses • {courses.length} total
        </p>
      </header>

      <main className="max-w-7xl mx-auto">
        <CrudSection
          title="Courses"
          data={courses}
          setData={setCourses}
          allCourses={courses}
        />
      </main>
    </div>
  );
};

const CrudSection = ({
  title,
  data,
  setData,
  allCourses,
}: {
  title: string;
  data: Course[];
  setData: React.Dispatch<React.SetStateAction<Course[]>>;
  allCourses: Course[];
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Course | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const [formData, setFormData] = useState({
    cTitle: "",
    cCode: "",
    theoryHrs: 3,
    labHrs: 0,
    courseCategoryId: 1,
    departmentId: 1,
    classYearId: 1,
    semesterId: 1,
    prerequisiteIds: [] as number[],
  });

  const itemsPerPage = showAll ? data.length : 10;

  const filteredData = data.filter((item) =>
    `${item.id} ${item.cCode} ${item.cTitle}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, showAll]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const openModal = (item: Course | null = null) => {
    setEditingItem(item);
    setFormData({
      cTitle: item?.cTitle || "",
      cCode: item?.cCode || "",
      theoryHrs: item?.theoryHrs || 3,
      labHrs: item?.labHrs || 0,
      courseCategoryId: item?.courseCategory.id || 1,
      departmentId: item?.department.id || 1,
      classYearId: item?.classYear.id || 1,
      semesterId: item?.semester.id || 1,
      prerequisiteIds: item?.prerequisites.map((p) => p.id) || [],
    });
    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormError("");
  };

  const handleSubmit = async () => {
    if (!formData.cTitle.trim() || !formData.cCode.trim()) {
      setFormError("Course title and code are required.");
      return;
    }

    setSaving(true);

    setTimeout(() => {
      if (editingItem) {
        setData((prev) =>
          prev.map((c) =>
            c.id === editingItem.id
              ? {
                  ...c,
                  cTitle: formData.cTitle,
                  cCode: formData.cCode,
                  theoryHrs: formData.theoryHrs,
                  labHrs: formData.labHrs,
                  courseCategory: {
                    id: formData.courseCategoryId,
                    name: ["", "Core", "Elective", "Specialized", "Foundation"][
                      formData.courseCategoryId
                    ],
                  },
                  department: {
                    id: formData.departmentId,
                    name: ["", "Computer Science", "Mathematics", "Physics"][
                      formData.departmentId
                    ],
                  },
                  classYear: {
                    id: formData.classYearId,
                    year: [
                      "",
                      "First Year",
                      "Second Year",
                      "Third Year",
                      "Fourth Year",
                    ][formData.classYearId],
                  },
                  semester: {
                    id: formData.semesterId,
                    name: formData.semesterId === 1 ? "Fall" : "Spring",
                  },
                  prerequisites: allCourses
                    .filter((c) => formData.prerequisiteIds.includes(c.id))
                    .map((c) => ({ id: c.id, cCode: c.cCode })),
                }
              : c
          )
        );
      } else {
        const newCourse: Course = {
          id: Math.max(...data.map((c) => c.id)) + 1,
          cTitle: formData.cTitle,
          cCode: formData.cCode,
          theoryHrs: formData.theoryHrs,
          labHrs: formData.labHrs,
          courseCategory: {
            id: formData.courseCategoryId,
            name: ["", "Core", "Elective", "Specialized", "Foundation"][
              formData.courseCategoryId
            ],
          },
          department: {
            id: formData.departmentId,
            name: ["", "Computer Science", "Mathematics", "Physics"][
              formData.departmentId
            ],
          },
          classYear: {
            id: formData.classYearId,
            year: [
              "",
              "First Year",
              "Second Year",
              "Third Year",
              "Fourth Year",
            ][formData.classYearId],
          },
          semester: {
            id: formData.semesterId,
            name: formData.semesterId === 1 ? "Fall" : "Spring",
          },
          prerequisites: allCourses
            .filter((c) => formData.prerequisiteIds.includes(c.id))
            .map((c) => ({ id: c.id, cCode: c.cCode })),
        };
        setData((prev) => [...prev, newCourse]);
      }

      closeModal();
      setSaving(false);
    }, 600);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setData((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {title} ({data.length})
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg transition"
            >
              <FaPlus /> Add Course
            </button>
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition"
            >
              {showAll ? "Show Pages" : "Show All"}
            </button>
            <button
              onClick={() =>
                setViewMode(viewMode === "table" ? "grid" : "table")
              }
              className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition"
            >
              {viewMode === "table" ? <FaTh /> : <FaList />}{" "}
              {viewMode === "table" ? "Grid" : "Table"}
            </button>
          </div>
        </div>

        <input
          type="text"
          placeholder="Search by ID, code, or title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-4 mb-6 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {/* Table View */}
        {viewMode === "table" ? (
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="p-4 text-left">ID</th>
                  <th className="p-4 text-left">Code</th>
                  <th className="p-4 text-left">Title</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Dept</th>
                  <th className="p-4 text-left">Year/Sem</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="p-4 font-mono text-sm">{item.id}</td>
                    <td className="p-4 font-bold text-blue-600">
                      {item.cCode}
                    </td>
                    <td className="p-4">{item.cTitle}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {item.courseCategory.name}
                      </span>
                    </td>
                    <td className="p-4 text-sm">{item.department.name}</td>
                    <td className="p-4 text-sm">
                      {item.classYear.year} • {item.semester.name}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => openModal(item)}
                        className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg ml-2"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedData.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-700 rounded-xl shadow-md hover:shadow-xl transition p-6"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-2xl font-bold text-blue-600">
                    {item.cCode}
                  </span>
                  <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                    #{item.id}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-3 line-clamp-2">
                  {item.cTitle}
                </h3>
                <div className="space-y-2 text-sm">
                  <span className="block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {item.courseCategory.name}
                  </span>
                  <span className="block text-gray-600 dark:text-gray-400">
                    {item.department.name}
                  </span>
                  <span className="block text-gray-500 text-xs">
                    {item.classYear.year} • {item.semester.name}
                  </span>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => openModal(item)}
                    className="p-2 text-yellow-600 hover:bg-yellow-100 rounded"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!showAll && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-xl disabled:opacity-50"
            >
              Previous
            </button>
            <span className="font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-xl disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {editingItem ? "Edit Course" : "Add New Course"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-red-600"
              >
                <FaTimes className="text-2xl" />
              </button>
            </div>

            {formError && (
              <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-xl text-red-700 dark:text-red-300 mb-6">
                {formError}
              </div>
            )}

            {editingItem && (
              <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
                <strong>ID:</strong>{" "}
                <code className="ml-2 font-mono bg-gray-300 dark:bg-gray-600 px-3 py-1 rounded">
                  {editingItem.id}
                </code>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Course Title"
                value={formData.cTitle}
                onChange={(e) =>
                  setFormData({ ...formData, cTitle: e.target.value })
                }
                className="p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="Course Code (e.g. CS201)"
                value={formData.cCode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cCode: e.target.value.toUpperCase(),
                  })
                }
                className="p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="number"
                placeholder="Theory Hours"
                value={formData.theoryHrs}
                onChange={(e) =>
                  setFormData({ ...formData, theoryHrs: +e.target.value })
                }
                min="0"
                className="p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
              />
              <input
                type="number"
                placeholder="Lab Hours"
                value={formData.labHrs}
                onChange={(e) =>
                  setFormData({ ...formData, labHrs: +e.target.value })
                }
                min="0"
                className="p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
              />

              <select
                value={formData.courseCategoryId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    courseCategoryId: +e.target.value,
                  })
                }
                className="p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
              >
                <option value={1}>Core</option>
                <option value={2}>Elective</option>
                <option value={3}>Specialized</option>
                <option value={4}>Foundation</option>
              </select>

              <select
                value={formData.departmentId}
                onChange={(e) =>
                  setFormData({ ...formData, departmentId: +e.target.value })
                }
                className="p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
              >
                <option value={1}>Computer Science</option>
                <option value={2}>Mathematics</option>
                <option value={3}>Physics</option>
              </select>

              <select
                value={formData.classYearId}
                onChange={(e) =>
                  setFormData({ ...formData, classYearId: +e.target.value })
                }
                className="p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
              >
                <option value={1}>First Year</option>
                <option value={2}>Second Year</option>
                <option value={3}>Third Year</option>
                <option value={4}>Fourth Year</option>
              </select>

              <select
                value={formData.semesterId}
                onChange={(e) =>
                  setFormData({ ...formData, semesterId: +e.target.value })
                }
                className="p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
              >
                <option value={1}>Fall</option>
                <option value={2}>Spring</option>
              </select>
            </div>

            {/* Prerequisites */}
            <div className="mt-6">
              <label className="block text-sm font-medium mb-3">
                Prerequisites (Optional)
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-xl p-4 bg-gray-50 dark:bg-gray-700">
                {allCourses
                  .filter((c) => c.id !== editingItem?.id)
                  .map((course) => (
                    <label
                      key={course.id}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.prerequisiteIds.includes(course.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              prerequisiteIds: [
                                ...formData.prerequisiteIds,
                                course.id,
                              ],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              prerequisiteIds: formData.prerequisiteIds.filter(
                                (id) => id !== course.id
                              ),
                            });
                          }
                        }}
                        className="w-5 h-5 text-blue-600 rounded"
                      />
                      <span className="font-medium">{course.cCode}</span> -{" "}
                      {course.cTitle}
                    </label>
                  ))}
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={closeModal}
                disabled={saving}
                className="flex-1 py-4 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 rounded-xl font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <FaSpinner className="animate-spin" /> Saving...
                  </>
                ) : editingItem ? (
                  "Update Course"
                ) : (
                  "Add Course"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CoursesEditor;
