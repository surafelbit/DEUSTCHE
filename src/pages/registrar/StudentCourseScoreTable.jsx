import React, { useState } from "react";
import { Table, Input, Button, Select, Switch } from "antd";
const { Option } = Select;
const initialData = [
  {
    key: "1",
    studentId: { id: "std001" },
    course: { name: "Mathematics" },
    batchClassYearSemester: { batch: "CS", year: "2025", semester: "1" },
    courseSource: { name: "Normal" },
    score: 85,
    isReleased: true,
  },
  {
    key: "2",
    studentId: { id: "std002" },
    course: { name: "Physics" },
    batchClassYearSemester: { batch: "CS", year: "2025", semester: "1" },
    courseSource: { name: "Exchange" },
    score: 92,
    isReleased: false,
  },
  {
    key: "3",
    studentId: { id: "std003" },
    course: { name: "Chemistry" },
    batchClassYearSemester: { batch: "IT", year: "2025", semester: "2" },
    courseSource: { name: "Normal" },
    score: 76,
    isReleased: true,
  },
  {
    key: "4",
    studentId: { id: "std004" },
    course: { name: "Biology" },
    batchClassYearSemester: { batch: "IT", year: "2024", semester: "2" },
    courseSource: { name: "Transfer" },
    score: 88,
    isReleased: false,
  },
  {
    key: "5",
    studentId: { id: "std005" },
    course: { name: "English" },
    batchClassYearSemester: { batch: "CS", year: "2024", semester: "1" },
    courseSource: { name: "Normal" },
    score: 95,
    isReleased: true,
  },
  {
    key: "6",
    studentId: { id: "std006" },
    course: { name: "History" },
    batchClassYearSemester: { batch: "EE", year: "2025", semester: "1" },
    courseSource: { name: "Exchange" },
    score: 67,
    isReleased: false,
  },
];

export default function StudentCourseScoreTable() {
  const [data, setData] = useState(initialData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [batchValues, setBatchValues] = useState({
    batch: "",
    year: "",
    semester: "",
    score: "",
    courseSource: "",
    isReleased: null,
  });

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  };

  const applyBatchUpdate = () => {
    const updatedData = data.map((row) =>
      selectedRowKeys.includes(row.key)
        ? {
            ...row,
            batchClassYearSemester: {
              batch: batchValues.batch || row.batchClassYearSemester.batch,
              year: batchValues.year || row.batchClassYearSemester.year,
              semester:
                batchValues.semester || row.batchClassYearSemester.semester,
            },
            score: batchValues.score || row.score,
            courseSource: {
              name: batchValues.courseSource || row.courseSource.name,
            },
            isReleased:
              batchValues.isReleased !== null
                ? batchValues.isReleased
                : row.isReleased,
          }
        : row
    );
    setData(updatedData);
    setSelectedRowKeys([]);
    setBatchValues({
      batch: "",
      year: "",
      semester: "",
      score: "",
      courseSource: "",
      isReleased: null,
    });
  };

  const columns = [
    { title: "Student Id", dataIndex: ["studentId", "id"], key: "studentId" },
    { title: "Course", dataIndex: ["course", "name"], key: "course" },
    {
      title: "Batch / Year / Semester",
      key: "batchYearSemester",
      render: (_, record) =>
        `${record.batchClassYearSemester.batch} / ${record.batchClassYearSemester.year} / ${record.batchClassYearSemester.semester}`,
    },
    {
      title: "Course Source",
      dataIndex: ["courseSource", "name"],
      key: "courseSource",
    },
    { title: "Score", dataIndex: "score", key: "score" },
    {
      title: "Released",
      dataIndex: "isReleased",
      key: "isReleased",
      render: (val) => (val ? "Yes" : "No"),
    },
  ];
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ["5", "10", "20", "50"],
  });
  const [searchText, setSearchText] = useState("");
  console.log(initialData);
  const filteredData = data.filter((element) => {
    return (
      element?.studentId?.id.toLowerCase().includes(searchText) ||
      element.course?.name?.toLowerCase().includes(searchText)
    );
  });
  console.log(initialData);
  console.log(filteredData);
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl dark:shadow-gray-900 max-w-full mx-auto">
      <div className="flex flex-wrap items-center space-x-3 mb-6">
        <input
          placeholder="Batch"
          value={batchValues.batch}
          onChange={(e) =>
            setBatchValues({ ...batchValues, batch: e.target.value })
          }
          className="w-20 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:border-blue-400 dark:focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 shadow-sm"
        />
        <input
          placeholder="Year"
          value={batchValues.year}
          onChange={(e) =>
            setBatchValues({ ...batchValues, year: e.target.value })
          }
          className="w-20 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:border-blue-400 dark:focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 shadow-sm"
        />
        <input
          placeholder="Semester"
          value={batchValues.semester}
          onChange={(e) =>
            setBatchValues({ ...batchValues, semester: e.target.value })
          }
          className="w-20 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:border-blue-400 dark:focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 shadow-sm"
        />
        <input
          placeholder="Score"
          value={batchValues.score}
          onChange={(e) =>
            setBatchValues({ ...batchValues, score: e.target.value })
          }
          className="w-20 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:border-blue-400 dark:focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 shadow-sm"
        />
        <select
          value={batchValues.courseSource}
          onChange={(e) =>
            setBatchValues({ ...batchValues, courseSource: e.target.value })
          }
          className="w-32 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:border-blue-400 dark:focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm transition-all duration-200 shadow-sm"
        >
          <option value="">Course Source</option>
          <option value="Normal">Normal</option>
          <option value="Transfer">Transfer</option>
          <option value="Exchange">Exchange</option>
        </select>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
            Release Result to Student
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={batchValues.isReleased || false}
              onChange={(e) =>
                setBatchValues({ ...batchValues, isReleased: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 dark:peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-gray-200 after:border-gray-300 dark:after:border-gray-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 dark:peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <button
          type="button"
          disabled={selectedRowKeys.length === 0}
          onClick={applyBatchUpdate}
          className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
        >
          Apply to Selected
        </button>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center mb-6">
        {["department", "status", "batch", "semester", "year"].map((filter) => (
          <select
            key={filter}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                [filter]: e.target.value,
              }))
            }
            className="w-full sm:w-40 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:border-blue-400 dark:focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm transition-all duration-200 shadow-sm"
          >
            {filter === "department" && (
              <>
                <option value="">All Departments</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Medicine">Medicine</option>
                <option value="Nurse">Nurse</option>
              </>
            )}
            {filter === "status" && (
              <>
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Graduated">Graduated</option>
                <option value="Suspended">Suspended</option>
                <option value="Inactive">Inactive</option>
              </>
            )}
            {filter === "batch" && (
              <>
                <option value="">All Batches</option>
                <option value="1">Batch 1</option>
                <option value="2">Batch 2</option>
                <option value="3">Batch 3</option>
                <option value="4">Batch 4</option>
              </>
            )}
            {filter === "semester" && (
              <>
                <option value="">All Semesters</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
              </>
            )}
            {filter === "year" && (
              <>
                <option value="">All Years</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </>
            )}
          </select>
        ))}

        <input
          onChange={(e) => setSearchText(e.target.value)}
          type="text"
          placeholder="🔍 Search students..."
          className="w-full sm:w-80 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:border-blue-400 dark:focus:border-blue-500 transition-all duration-200 shadow-sm"
        />
      </div>

      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm dark:shadow-gray-900 overflow-hidden">
        {/* <Table
          rowSelection={rowSelection}
          pagination={{
            ...pagination,
            onChange: (page, pageSize) => {
              setPagination({ ...pagination, current: page, pageSize });
            },
            onShowSizeChange: (current, size) => {
              setPagination({ ...pagination, current, pageSize: size });
            },
          }}
          className="min-w-full bg-gray-100 dark:bg-gray-800"
          rowClassName={() =>
            "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 hover:bg-blue-200 dark:hover:bg-gray-900  dark:hover:text-black"
          }
          dataSource={filteredData}
          columns={columns}
        /> */}
        <Table
          rowSelection={rowSelection}
          pagination={{
            ...pagination,
            onChange: (page, pageSize) => {
              setPagination({ ...pagination, current: page, pageSize });
            },
            onShowSizeChange: (current, size) => {
              setPagination({ ...pagination, current, pageSize: size });
            },
          }}
          className="custom-table min-w-full bg-white dark:bg-gray-800 transition-colors duration-200"
          rowClassName={(record, index) =>
            index % 2 === 0
              ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 hover:bg-blue-100 dark:hover:bg-blue-900 dark:hover:text-black"
              : "bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-blue-100 dark:hover:bg-blue-900 dark:hover:text-black"
          }
          dataSource={filteredData}
          columns={columns}
        />
      </div>
    </div>
  );
}
