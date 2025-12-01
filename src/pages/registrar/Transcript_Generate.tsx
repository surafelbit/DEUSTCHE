"use client";

import { useState } from "react";
import {
  Search,
  ScrollText,
  FileText,
  ArrowLeft,
  Download,
} from "lucide-react";

export default function Transcript_Generate() {
  const [searchType, setSearchType] = useState<"transcript" | "report">(
    "report"
  );
  const [userId, setUserId] = useState("");
  const [view, setView] = useState<"search" | "result">("search");

  // === REPORT CARD DATA (Your beautiful version) ===
  const reportData = {
    id: "DHMC/MRT-1821-16",
    name: "Aisha Mohammed Ali",
    gender: "Female",
    dateOfBirth: "15 March 2000",
    admissionDate: "September 2016",
    program: "Medical Radiology Technology",
    academicYear: "2024/2025",
    semester: "Second Semester",
    classYear: "Level 400",
    enrollmentStatus: "Regular",
    cgpa: 3.91,
    earnedCredits: 142.0,
    courses: [
      {
        code: "ANAT 421",
        title: "Anatomy IV",
        credit: 4.0,
        grade: "A",
        point: 4.0,
        gp: 16.0,
      },
      {
        code: "PHYS 423",
        title: "Physics IV",
        credit: 3.0,
        grade: "A-",
        point: 3.7,
        gp: 11.1,
      },
      {
        code: "BIO 424",
        title: "Biochemistry",
        credit: 3.0,
        grade: "B+",
        point: 3.3,
        gp: 9.9,
      },
      {
        code: "MICR 425",
        title: "Microbiology",
        credit: 3.0,
        grade: "A",
        point: 4.0,
        gp: 12.0,
      },
      {
        code: "PHRM 426",
        title: "Pharmacology",
        credit: 3.0,
        grade: "B+",
        point: 3.3,
        gp: 9.9,
      },
      {
        code: "PATH 427",
        title: "Pathology",
        credit: 4.0,
        grade: "A",
        point: 4.0,
        gp: 16.0,
      },
      {
        code: "ETHC 428",
        title: "Ethics & Research",
        credit: 2.0,
        grade: "A",
        point: 4.0,
        gp: 8.0,
      },
    ],
  };

  // === FULL TRANSCRIPT DATA (From your photo - Nursing student) ===
  const transcriptData = {
    student: {
      id: "DHMC.NUR-75-14",
      name: "Mabeyna Habila Makenson",
      gender: "Female",
      dob: "01 Jan 1995",
      program: "Nursing",
      faculty: "Faculty of Nursing",
      admissionDate: "11-Oct-2021",
    },
    semesters: [
      {
        year: "2021/2022",
        semester: "Semester I",
        courses: [
          {
            code: "ENG 1011",
            title: "Communicative English Skills I",
            ch: 3.0,
            grade: "A",
            point: 12.0,
          },
          {
            code: "Psyc 1012",
            title: "General Psychology",
            ch: 3.0,
            grade: "B+",
            point: 9.9,
          },
          {
            code: "MATH 1014",
            title: "Mathematics",
            ch: 3.0,
            grade: "A",
            point: 12.0,
          },
          {
            code: "ICT 1012",
            title: "Critical Thinking",
            ch: 3.0,
            grade: "A",
            point: 12.0,
          },
          {
            code: "GEES 1011",
            title: "Geography of Ethiopia and the Horn",
            ch: 3.0,
            grade: "A",
            point: 12.0,
          },
          {
            code: "SPRT 1012",
            title: "Physical Fitness",
            ch: 0.0,
            grade: "PASS",
            point: 0.0,
          },
          {
            code: "SNS 1014",
            title: "Inclusiveness",
            ch: 2.0,
            grade: "B+",
            point: 7.0,
          },
          {
            code: "GJT 1014",
            title: "Global Trend",
            ch: 2.0,
            grade: "B",
            point: 6.0,
          },
        ],
        totalCH: 22.0,
        totalPoint: 76.75,
        gpa: 3.49,
      },
      {
        year: "2021/2022",
        semester: "Semester II",
        courses: [
          {
            code: "ENG 1012",
            title: "Communicative English Skill-II",
            ch: 3.0,
            grade: "A",
            point: 12.0,
          },
          {
            code: "Chem 1023",
            title: "General Chemistry",
            ch: 3.0,
            grade: "A",
            point: 12.0,
          },
          {
            code: "Anat 1013",
            title: "Anatomy & Physiology",
            ch: 4.0,
            grade: "A",
            point: 16.0,
          },
          {
            code: "ICT 1012",
            title: "Introduction to Emerging Technology",
            ch: 3.0,
            grade: "A",
            point: 12.0,
          },
          {
            code: "MCIE 1013",
            title: "Moral & Civic Education",
            ch: 2.0,
            grade: "A",
            point: 8.0,
          },
          {
            code: "Hist 1012",
            title: "History of Ethiopia",
            ch: 3.0,
            grade: "B+",
            point: 9.9,
          },
          {
            code: "Eco 1014",
            title: "Economics",
            ch: 3.0,
            grade: "A",
            point: 12.0,
          },
        ],
        totalCH: 21.0,
        totalPoint: 93.9,
        gpa: 4.47,
      },
    ],
  };

  const handleSearch = () => {
    if (!userId.trim()) return alert("Please enter Student ID");
    setView("result");
  };

  const totalCredits = reportData.courses.reduce((a, c) => a + c.credit, 0);
  const totalGP = reportData.courses.reduce((a, c) => a + c.gp, 0);
  const semesterGPA = Number((totalGP / totalCredits).toFixed(2));

  // EXPORT TO EXCEL (Works for both)
  const exportToExcel = async () => {
    const { utils, writeFile } = await import(
      "https://cdn.sheetjs.com/xlsx-0.20.2/xlsx-0.20.2.min.js"
    );
    const data =
      searchType === "report"
        ? [
            [reportData.id, reportData.name, "", "Semester GPA", semesterGPA],
            ...reportData.courses.map((c) => [
              c.code,
              c.title,
              c.credit,
              c.grade,
              c.point,
              c.gp,
            ]),
          ]
        : [
            [
              "TRANSCRIPT",
              transcriptData.student.id,
              transcriptData.student.name,
            ],
            ...transcriptData.semesters.flatMap((s) => [
              s.year + " " + s.semester,
              ...s.courses.map((c) => [
                c.code,
                c.title,
                c.ch,
                c.grade,
                c.point,
              ]),
            ]),
          ];
    const ws = utils.aoa_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Result");
    writeFile(
      wb,
      `${searchType === "report" ? "ReportCard" : "Transcript"}.xlsx`
    );
  };

  // === RESULT VIEW ===
  if (view === "result") {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setView("search")}
              className="flex items-center gap-2 text-blue-700 font-bold text-lg"
            >
              <ArrowLeft className="w-5 h-5" /> Back to Search
            </button>
            <button
              onClick={exportToExcel}
              className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg"
            >
              <Download className="w-5 h-5" /> Export to Excel
            </button>
          </div>

          {/* === STUDENT REPORT CARD VIEW === */}
          {searchType === "report" && (
            <div className="bg-white rounded-2xl shadow-2xl border overflow-hidden">
              <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-6 text-center">
                <h1 className="text-3xl font-bold">
                  DEUTSCHE HÖHERE MEDIZINISCHE HOCHSCHULE
                </h1>
                <p className="text-lg opacity-90">
                  Student Academic Record - Student Copy
                </p>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-400 m-8 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-yellow-300">
                      <td className="px-6 py-3 font-bold bg-yellow-200">
                        ID Number
                      </td>
                      <td className="px-6 py-3">{reportData.id}</td>
                      <td className="px-6 py-3 font-bold bg-yellow-200">
                        Date of Birth
                      </td>
                      <td className="px-6 py-3">{reportData.dateOfBirth}</td>
                    </tr>
                    <tr className="border-b border-yellow-300">
                      <td className="px-6 py-3 font-bold bg-yellow-200">
                        Name
                      </td>
                      <td className="px-6 py-3">{reportData.name}</td>
                      <td className="px-6 py-3 font-bold bg-yellow-200">
                        Program
                      </td>
                      <td className="px-6 py-3">{reportData.program}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 font-bold bg-yellow-200">
                        Academic Year
                      </td>
                      <td className="px-6 py-3">{reportData.academicYear}</td>
                      <td className="px-6 py-3 font-bold bg-yellow-200">
                        Semester
                      </td>
                      <td className="px-6 py-3">{reportData.semester}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="px-8 pb-8">
                <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">
                  {reportData.academicYear} - {reportData.semester}
                </h2>
                <div className="overflow-x-auto rounded-lg border">
                  <table className="w-full">
                    <thead className="bg-blue-700 text-white">
                      <tr>
                        <th className="px-4 py-3">Code</th>
                        <th className="px-4 py-3">Title</th>
                        <th className="px-4 py-3 text-center">Credit</th>
                        <th className="px-4 py-3 text-center">Grade</th>
                        <th className="px-4 py-3 text-center">Point</th>
                        <th className="px-4 py-3 text-center">GP×CH</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.courses.map((c, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-mono">{c.code}</td>
                          <td className="px-4 py-3">{c.title}</td>
                          <td className="px-4 py-3 text-center">{c.credit}</td>
                          <td className="px-4 py-3 text-center font-bold text-blue-700">
                            {c.grade}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {c.point.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {c.gp.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-100 font-bold">
                      <tr>
                        <td colSpan={2} className="px-4 py-4 text-right">
                          Total
                        </td>
                        <td className="px-4 py-4 text-center">
                          {totalCredits}
                        </td>
                        <td className="px-4 py-4 text-center">-</td>
                        <td className="px-4 py-4 text-center">-</td>
                        <td className="px-4 py-4 text-center">
                          {totalGP.toFixed(2)}
                        </td>
                      </tr>
                      <tr className="bg-blue-50">
                        <td
                          colSpan={4}
                          className="px-4 py-4 text-right text-lg"
                        >
                          Semester GPA
                        </td>
                        <td
                          colSpan={2}
                          className="px-4 py-4 text-center text-3xl font-bold text-blue-700"
                        >
                          {semesterGPA}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                  <div className="bg-green-50 border-2 border-green-400 rounded-lg p-6">
                    <p className="text-lg">Cumulative GPA</p>
                    <p className="text-4xl font-bold text-green-700">
                      {reportData.cgpa}
                    </p>
                  </div>
                  <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-6">
                    <p className="text-lg">Credits Earned</p>
                    <p className="text-4xl font-bold text-blue-700">
                      {reportData.earnedCredits}
                    </p>
                  </div>
                  <div className="bg-purple-50 border-2 border-purple-400 rounded-lg p-6">
                    <p className="text-lg">Status</p>
                    <p className="text-2xl font-bold text-purple-700">
                      Good Standing
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* === ACADEMIC TRANSCRIPT VIEW (Exact photo replica) === */}
          {searchType === "transcript" && (
            <div className="bg-white shadow-2xl border-4 border-black font-mono text-xs">
              <div className="text-center py-4 bg-cyan-100 border-b-4 border-black">
                <h1 className="text-2xl font-bold">
                  DEUTSCHE HOCHSCHULE FÜR MEDIZIN
                </h1>
                <h2 className="text-xl font-bold">
                  STUDENT ACADEMIC TRANSCRIPT
                </h2>
                <p className="font-bold">OFFICE OF REGISTRAR</p>
              </div>

              <table className="w-full border-collapse">
                <tbody>
                  <tr className="bg-cyan-100 border-2 border-black">
                    <td className="px-3 py-1 font-bold">ID Number</td>
                    <td className="px-3 py-1">{transcriptData.student.id}</td>
                    <td className="px-3 py-1 font-bold">Full Name</td>
                    <td colSpan={5} className="px-3 py-1">
                      {transcriptData.student.name}
                    </td>
                  </tr>
                  <tr className="bg-cyan-100 border-2 border-black">
                    <td className="px-3 py-1 font-bold">Sex</td>
                    <td className="px-3 py-1">
                      {transcriptData.student.gender}
                    </td>
                    <td className="px-3 py-1 font-bold">Date of Birth</td>
                    <td className="px-3 py-1">{transcriptData.student.dob}</td>
                    <td className="px-3 py-1 font-bold">Program</td>
                    <td className="px-3 py-1">
                      {transcriptData.student.program}
                    </td>
                    <td className="px-3 py-1 font-bold">Faculty</td>
                    <td className="px-3 py-1">
                      {transcriptData.student.faculty}
                    </td>
                  </tr>
                  <tr className="bg-cyan-100 border-2 border-black">
                    <td className="px-3 py-1 font-bold">Date of Admission</td>
                    <td colSpan={7} className="px-3 py-1">
                      {transcriptData.student.admissionDate}
                    </td>
                  </tr>
                </tbody>
              </table>

              <table className="w-full mt-4">
                <tbody>
                  {transcriptData.semesters.map((sem, i) => (
                    <tr key={i}>
                      <td className="border-4 border-black align-top w-1/2 p-2">
                        <div className="bg-orange-500 text-white font-bold px-3 py-1 text-center">
                          Academic Year: {sem.year} G.C • {sem.semester} • Class
                          Year I
                        </div>
                        <table className="w-full border border-gray-600">
                          <thead className="bg-gray-300">
                            <tr>
                              <th className="border border-gray-600 px-2 py-1">
                                Course Code
                              </th>
                              <th className="border border-gray-600 px-2 py-1">
                                Course Title
                              </th>
                              <th className="border border-gray-600 px-2 py-1">
                                CH
                              </th>
                              <th className="border border-gray-600 px-2 py-1">
                                Grade
                              </th>
                              <th className="border border-gray-600 px-2 py-1">
                                Point
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {sem.courses.map((c, j) => (
                              <tr key={j}>
                                <td className="border border-gray-400 px-2 py-1">
                                  {c.code}
                                </td>
                                <td className="border border-gray-400 px-2 py-1">
                                  {c.title}
                                </td>
                                <td className="border border-gray-400 px-2 py-1 text-center">
                                  {c.ch}
                                </td>
                                <td className="border border-gray-400 px-2 py-1 text-center font-bold">
                                  {c.grade}
                                </td>
                                <td className="border border-gray-400 px-2 py-1 text-center">
                                  {c.point}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="bg-orange-500 text-white font-bold px-3 py-1 text-right">
                          TOTAL {sem.totalCH} CH → {sem.totalPoint} Points →
                          GPA: {sem.gpa}
                        </div>
                      </td>
                      {i === 0 && (
                        <td className="border-4 border-black align-top w-1/2 p-2">
                          {/* Second semester next to first */}
                          <div className="bg-orange-500 text-white font-bold px-3 py-1 text-center">
                            Academic Year: {transcriptData.semesters[1].year}{" "}
                            G.C • {transcriptData.semesters[1].semester}
                          </div>
                          <table className="w-full border border-gray-600">
                            <thead className="bg-gray-300">
                              <tr>
                                <th className="border border-gray-600 px-2 py-1">
                                  Course Code
                                </th>
                                <th className="border border-gray-600 px-2 py-1">
                                  Course Title
                                </th>
                                <th className="border border-gray-600 px-2 py-1">
                                  CH
                                </th>
                                <th className="border border-gray-600 px-2 py-1">
                                  Grade
                                </th>
                                <th className="border border-gray-600 px-2 py-1">
                                  Point
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {transcriptData.semesters[1].courses.map(
                                (c, j) => (
                                  <tr key={j}>
                                    <td className="border border-gray-400 px-2 py-1">
                                      {c.code}
                                    </td>
                                    <td className="border border-gray-400 px-2 py-1">
                                      {c.title}
                                    </td>
                                    <td className="border border-gray-400 px-2 py-1 text-center">
                                      {c.ch}
                                    </td>
                                    <td className="border border-gray-400 px-2 py-1 text-center font-bold">
                                      {c.grade}
                                    </td>
                                    <td className="border border-gray-400 px-2 py-1 text-center">
                                      {c.point}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                          <div className="bg-orange-500 text-white font-bold px-3 py-1 text-right">
                            TOTAL {transcriptData.semesters[1].totalCH} CH →{" "}
                            {transcriptData.semesters[1].totalPoint} Points →
                            GPA: {transcriptData.semesters[1].gpa}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="grid grid-cols-2 gap-10 p-10 border-t-4 border-black">
                <div className="text-center">
                  <div className="h-32 border-4 border-dashed rounded-xl mb-4 bg-gray-50"></div>
                  <p className="font-bold text-lg">REGISTRAR OFFICE</p>
                </div>
                <div className="text-center">
                  <div className="h-32 border-4 border-dashed rounded-xl mb-4 bg-gray-50"></div>
                  <p className="font-bold text-lg">DEAN OFFICE</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // === SEARCH SCREEN ===
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-cyan-800 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-2xl w-full">
        <h1 className="text-5xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
          Student Records Portal
        </h1>

        <div className="grid grid-cols-2 gap-6 mb-10">
          {[
            {
              type: "report" as const,
              label: "Student Report Card",
              icon: FileText,
            },
            {
              type: "transcript" as const,
              label: "Academic Transcript",
              icon: ScrollText,
            },
          ].map((item) => {
            const Icon = item.icon;
            const active = searchType === item.type;
            return (
              <button
                key={item.type}
                onClick={() => setSearchType(item.type)}
                className={`p-10 rounded-2xl border-4 transition-all ${
                  active
                    ? "border-blue-600 bg-blue-50 shadow-2xl scale-105"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <Icon className="w-20 h-20 mx-auto mb-4 text-blue-600" />
                <p className="text-2xl font-bold">{item.label}</p>
              </button>
            );
          })}
        </div>

        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Enter Student ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full px-16 py-6 text-xl rounded-2xl border-4 border-gray-300 focus:border-blue-600 outline-none"
          />
          <Search className="absolute left-6 top-7 w-8 h-8 text-gray-500" />
        </div>

        <button
          onClick={handleSearch}
          className="w-full py-6 bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-800 hover:to-cyan-700 text-white text-2xl font-bold rounded-2xl shadow-2xl transition"
        >
          View {searchType === "report" ? "Report Card" : "Academic Transcript"}
        </button>
      </div>
    </div>
  );
}
