"use client";

import { useMemo, useState } from "react";
import {
  Search,
  ScrollText,
  FileText,
  ArrowLeft,
  Download,
} from "lucide-react";

type ReportCourse = {
  code: string;
  title: string;
  credit: number;
  grade: string;
  point: number;
  gp: number;
};

type ReportRecord = {
  id: string;
  name: string;
  gender: string;
  dateOfBirth: string;
  admissionDate: string;
  program: string;
  academicYear: string;
  semester: string;
  classYear: string;
  enrollmentStatus: string;
  cgpa: number;
  earnedCredits: number;
  courses: ReportCourse[];
};

type TranscriptCourse = {
  code: string;
  title: string;
  ch: number;
  grade: string;
  point: number;
};

type TranscriptSemester = {
  year: string;
  semester: string;
  courses: TranscriptCourse[];
  totalCH: number;
  totalPoint: number;
  gpa: number;
};

type TranscriptRecord = {
  student: {
    id: string;
    name: string;
    gender: string;
    dob: string;
    program: string;
    faculty: string;
    admissionDate: string;
  };
  semesters: TranscriptSemester[];
};

type SearchType = "report" | "transcript";

export default function Transcript_Generate() {
  const [searchType, setSearchType] = useState<SearchType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // === DEMO BATCH DATA (replace with real data later) ===

  const baseReport: ReportRecord = {
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

  // Example list of report records (batch)
  const reportBatch: ReportRecord[] = [
    baseReport,
    {
      ...baseReport,
      id: "DHMC/MRT-1821-17",
      name: "Second Student Demo",
      cgpa: 3.55,
    },
    {
      ...baseReport,
      id: "DHMC/MRT-1821-18",
      name: "Third Student Demo",
      cgpa: 3.2,
    },
  ];

  const baseTranscript: TranscriptRecord = {
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

  // Example list of transcript records (batch)
  const transcriptBatch: TranscriptRecord[] = [
    baseTranscript,
    {
      ...baseTranscript,
      student: {
        ...baseTranscript.student,
        id: "DHMC.NUR-75-15",
        name: "Second Transcript Demo",
      },
    },
    {
      ...baseTranscript,
      student: {
        ...baseTranscript.student,
        id: "DHMC.NUR-75-16",
        name: "Third Transcript Demo",
      },
    },
  ];

  // === FILTERED LISTS ===

  const filteredReports = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return reportBatch;
    return reportBatch.filter(
      (r) =>
        r.id.toLowerCase().includes(term) ||
        r.name.toLowerCase().includes(term) ||
        r.program.toLowerCase().includes(term)
    );
  }, [searchTerm, reportBatch]);

  const filteredTranscripts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return transcriptBatch;
    return transcriptBatch.filter(
      (t) =>
        t.student.id.toLowerCase().includes(term) ||
        t.student.name.toLowerCase().includes(term) ||
        t.student.program.toLowerCase().includes(term)
    );
  }, [searchTerm, transcriptBatch]);

  const handleBackToChoice = () => {
    setSearchType(null);
    setSearchTerm("");
  };

  const exportToExcel = async () => {
    const { utils, writeFile } = await import(
      "https://cdn.sheetjs.com/xlsx-0.20.2/xlsx-0.20.2.min.js"
    );

    if (!searchType) return;

    const isReport = searchType === "report";

    const data = isReport
      ? [
          ["Report Cards"],
          ...filteredReports.flatMap((r) => {
            const totalCredits = r.courses.reduce((a, c) => a + c.credit, 0);
            const totalGP = r.courses.reduce((a, c) => a + c.gp, 0);
            const semesterGPA = Number((totalGP / totalCredits).toFixed(2));
            return [
              [
                r.id,
                r.name,
                r.program,
                "CGPA",
                r.cgpa,
                "Semester GPA",
                semesterGPA,
              ],
              ["Code", "Title", "Credit", "Grade", "Point", "GP×CH"],
              ...r.courses.map((c) => [
                c.code,
                c.title,
                c.credit,
                c.grade,
                c.point,
                c.gp,
              ]),
              [""],
            ];
          }),
        ]
      : [
          ["Transcripts"],
          ...filteredTranscripts.flatMap((t) => [
            ["Student", t.student.id, t.student.name, t.student.program],
            ...t.semesters.flatMap((s) => [
              [s.year + " " + s.semester],
              ["Code", "Title", "CH", "Grade", "Point"],
              ...s.courses.map((c) => [
                c.code,
                c.title,
                c.ch,
                c.grade,
                c.point,
              ]),
            ]),
            [""],
          ]),
        ];

    const ws = utils.aoa_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Result");
    writeFile(
      wb,
      `${searchType === "report" ? "ReportCards" : "Transcripts"}-Filtered.xlsx`
    );
  };

  // === INITIAL TYPE SELECTION SCREEN ===
  if (!searchType) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-10 w-full max-w-md">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400">
            Student Records
          </h1>

          <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
            Choose what you want to view.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8">
            {[
              {
                type: "report" as const,
                label: "Report Cards",
                icon: FileText,
              },
              {
                type: "transcript" as const,
                label: "Transcripts",
                icon: ScrollText,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.type}
                  onClick={() => setSearchType(item.type)}
                  className="flex items-center justify-center gap-2.5 px-5 py-3 rounded-lg border-2 font-medium text-sm transition-all bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // === LIST VIEW WITH SEARCH / FILTER ===
  const isReport = searchType === "report";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <button
            onClick={handleBackToChoice}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-lg hover:underline"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Type
          </button>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full sm:w-auto">
            <div className="relative flex-1 min-w-[220px]">
              <input
                type="text"
                placeholder={`Search by ID, name or program (${
                  isReport ? "Report" : "Transcript"
                })`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm sm:text-base focus:border-blue-600 dark:focus:border-blue-500 outline-none transition"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>

            <button
              onClick={exportToExcel}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-semibold px-4 py-2.5 rounded-xl shadow transition text-sm sm:text-base"
            >
              <Download className="w-5 h-5" /> Export Filtered
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          {isReport ? "Report Cards" : "Transcripts"} (
          {isReport ? filteredReports.length : filteredTranscripts.length}{" "}
          students)
        </h2>

        {isReport ? (
          <div className="space-y-8">
            {filteredReports.map((r) => (
              <ReportCardView key={r.id} reportData={r} />
            ))}
            {filteredReports.length === 0 && (
              <p className="text-center text-gray-600 dark:text-gray-300 mt-8">
                No students found for the current filter.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {filteredTranscripts.map((t) => (
              <TranscriptView key={t.student.id} transcript={t} />
            ))}
            {filteredTranscripts.length === 0 && (
              <p className="text-center text-gray-600 dark:text-gray-300 mt-8">
                No students found for the current filter.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// === PRESENTATION COMPONENTS ===

function ReportCardView({ reportData }: { reportData: ReportRecord }) {
  const totalCredits = reportData.courses.reduce((a, c) => a + c.credit, 0);
  const totalGP = reportData.courses.reduce((a, c) => a + c.gp, 0);
  const semesterGPA = Number((totalGP / totalCredits).toFixed(2));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 dark:from-blue-800 dark:to-blue-950 text-white p-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold">
          DEUTSCHE HÖHERE MEDIZINISCHE HOCHSCHULE
        </h1>
        <p className="text-lg opacity-90">
          Student Academic Record - Student Copy
        </p>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/30 border-2 border-yellow-400 dark:border-yellow-600 m-4 sm:m-8 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-yellow-300 dark:border-yellow-700">
              <td className="px-4 py-3 font-bold bg-yellow-200 dark:bg-yellow-800">
                ID Number
              </td>
              <td className="px-4 py-3">{reportData.id}</td>
              <td className="px-4 py-3 font-bold bg-yellow-200 dark:bg-yellow-800">
                Date of Birth
              </td>
              <td className="px-4 py-3">{reportData.dateOfBirth}</td>
            </tr>
            <tr className="border-b border-yellow-300 dark:border-yellow-700">
              <td className="px-4 py-3 font-bold bg-yellow-200 dark:bg-yellow-800">
                Name
              </td>
              <td className="px-4 py-3">{reportData.name}</td>
              <td className="px-4 py-3 font-bold bg-yellow-200 dark:bg-yellow-800">
                Program
              </td>
              <td className="px-4 py-3">{reportData.program}</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-bold bg-yellow-200 dark:bg-yellow-800">
                Academic Year
              </td>
              <td className="px-4 py-3">{reportData.academicYear}</td>
              <td className="px-4 py-3 font-bold bg-yellow-200 dark:bg-yellow-800">
                Semester
              </td>
              <td className="px-4 py-3">{reportData.semester}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="px-4 sm:px-8 pb-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-800 dark:text-blue-300">
          {reportData.academicYear} - {reportData.semester}
        </h2>

        <div className="overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-600">
          <table className="w-full text-sm sm:text-base">
            <thead className="bg-blue-700 dark:bg-blue-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Code</th>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-center">Credit</th>
                <th className="px-4 py-3 text-center">Grade</th>
                <th className="px-4 py-3 text-center">Point</th>
                <th className="px-4 py-3 text-center">GP×CH</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {reportData.courses.map((c, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                >
                  <td className="px-4 py-3 font-mono">{c.code}</td>
                  <td className="px-4 py-3">{c.title}</td>
                  <td className="px-4 py-3 text-center">{c.credit}</td>
                  <td className="px-4 py-3 text-center font-bold text-blue-700 dark:text-blue-400">
                    {c.grade}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {c.point.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">{c.gp.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 dark:bg-gray-700 font-bold">
                <td colSpan={2} className="px-4 py-4 text-right">
                  Total
                </td>
                <td className="px-4 py-4 text-center">{totalCredits}</td>
                <td className="px-4 py-4 text-center">-</td>
                <td className="px-4 py-4 text-center">-</td>
                <td className="px-4 py-4 text-center">{totalGP.toFixed(2)}</td>
              </tr>
              <tr className="bg-blue-50 dark:bg-blue-900/40">
                <td colSpan={4} className="px-4 py-4 text-right text-lg">
                  Semester GPA
                </td>
                <td
                  colSpan={2}
                  className="px-4 py-4 text-center text-3xl font-bold text-blue-700 dark:text-blue-300"
                >
                  {semesterGPA}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="bg-green-50 dark:bg-green-900/30 border-2 border-green-400 dark:border-green-600 rounded-lg p-6">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Cumulative GPA
            </p>
            <p className="text-4xl font-bold text-green-700 dark:text-green-400">
              {reportData.cgpa}
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-400 dark:border-blue-600 rounded-lg p-6">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Credits Earned
            </p>
            <p className="text-4xl font-bold text-blue-700 dark:text-blue-400">
              {reportData.earnedCredits}
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/30 border-2 border-purple-400 dark:border-purple-600 rounded-lg p-6">
            <p className="text-lg text-gray-700 dark:text-gray-300">Status</p>
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">
              Good Standing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TranscriptView({ transcript }: { transcript: TranscriptRecord }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-2xl border-4 border-black dark:border-gray-600 font-mono text-xs sm:text-sm overflow-x-auto">
      <div className="text-center py-4 bg-cyan-100 dark:bg-cyan-900 border-b-4 border-black dark:border-gray-600">
        <h1 className="text-xl sm:text-2xl font-bold">
          DEUTSCHE HOCHSCHULE FÜR MEDIZIN
        </h1>
        <h2 className="text-lg sm:text-xl font-bold">
          STUDENT ACADEMIC TRANSCRIPT
        </h2>
        <p className="font-bold">OFFICE OF REGISTRAR</p>
      </div>

      <div className="p-4">
        <table className="w-full border-collapse mb-6">
          <tbody>
            <tr className="bg-cyan-100 dark:bg-cyan-900 border-2 border-black dark:border-gray-600">
              <td className="px-3 py-2 font-bold">ID Number</td>
              <td className="px-3 py-2">{transcript.student.id}</td>
              <td className="px-3 py-2 font-bold">Full Name</td>
              <td colSpan={5} className="px-3 py-2">
                {transcript.student.name}
              </td>
            </tr>
            <tr className="bg-cyan-100 dark:bg-cyan-900 border-2 border-black dark:border-gray-600">
              <td className="px-3 py-2 font-bold">Sex</td>
              <td className="px-3 py-2">{transcript.student.gender}</td>
              <td className="px-3 py-2 font-bold">Date of Birth</td>
              <td className="px-3 py-2">{transcript.student.dob}</td>
              <td className="px-3 py-2 font-bold">Program</td>
              <td className="px-3 py-2">{transcript.student.program}</td>
              <td className="px-3 py-2 font-bold">Faculty</td>
              <td className="px-3 py-2">{transcript.student.faculty}</td>
            </tr>
            <tr className="bg-cyan-100 dark:bg-cyan-900 border-2 border-black dark:border-gray-600">
              <td className="px-3 py-2 font-bold">Date of Admission</td>
              <td colSpan={7} className="px-3 py-2">
                {transcript.student.admissionDate}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {transcript.semesters.map((sem, i) => (
            <div key={i} className="border-4 border-black dark:border-gray-600">
              <div className="bg-orange-500 dark:bg-orange-600 text-white font-bold px-3 py-2 text-center text-xs sm:text-sm">
                Academic Year: {sem.year} G.C • {sem.semester} • Class Year I
              </div>
              <table className="w-full border border-gray-600 dark:border-gray-500">
                <thead className="bg-gray-300 dark:bg-gray-700">
                  <tr>
                    <th className="border border-gray-600 dark:border-gray-500 px-2 py-1">
                      Course Code
                    </th>
                    <th className="border border-gray-600 dark:border-gray-500 px-2 py-1">
                      Course Title
                    </th>
                    <th className="border border-gray-600 dark:border-gray-500 px-2 py-1">
                      CH
                    </th>
                    <th className="border border-gray-600 dark:border-gray-500 px-2 py-1">
                      Grade
                    </th>
                    <th className="border border-gray-600 dark:border-gray-500 px-2 py-1">
                      Point
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sem.courses.map((c, j) => (
                    <tr
                      key={j}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <td className="border border-gray-400 dark:border-gray-600 px-2 py-1">
                        {c.code}
                      </td>
                      <td className="border border-gray-400 dark:border-gray-600 px-2 py-1">
                        {c.title}
                      </td>
                      <td className="border border-gray-400 dark:border-gray-600 px-2 py-1 text-center">
                        {c.ch}
                      </td>
                      <td className="border border-gray-400 dark:border-gray-600 px-2 py-1 text-center font-bold text-blue-700 dark:text-blue-400">
                        {c.grade}
                      </td>
                      <td className="border border-gray-400 dark:border-gray-600 px-2 py-1 text-center">
                        {c.point}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-orange-500 dark:bg-orange-600 text-white font-bold px-3 py-2 text-right text-xs sm:text-sm">
                TOTAL {sem.totalCH} CH → {sem.totalPoint} Points → GPA:{" "}
                {sem.gpa}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-8 sm:gap-16 p-8 sm:p-12 border-t-4 border-black dark:border-gray-600 mt-8">
          <div className="text-center">
            <div className="h-28 sm:h-32 border-4 border-dashed rounded-xl mb-4 bg-gray-100 dark:bg-gray-700"></div>
            <p className="font-bold text-base sm:text-lg">REGISTRAR OFFICE</p>
          </div>
          <div className="text-center">
            <div className="h-28 sm:h-32 border-4 border-dashed rounded-xl mb-4 bg-gray-100 dark:bg-gray-700"></div>
            <p className="font-bold text-base sm:text-lg">DEAN OFFICE</p>
          </div>
        </div>
      </div>
    </div>
  );
}
