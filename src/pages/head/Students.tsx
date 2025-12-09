import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMemo, useState } from "react";

// Removed attendance from type
type Student = {
  id: string;
  name: string;
  year: string;
  gpa: number;
};

// Removed attendance from mock data
const MOCK_STUDENTS: Student[] = [
  { id: "S-0001", name: "Abebe Bekele", year: "Year 1", gpa: 3.6 },
  { id: "S-0002", name: "Hanna G.", year: "Year 2", gpa: 2.7 },
  { id: "S-0003", name: "Kebede T.", year: "Year 3", gpa: 3.1 },
  { id: "S-0004", name: "Sara M.", year: "Year 4", gpa: 3.9 },
];

export default function HeadStudents() {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filtered = useMemo(() => {
    return MOCK_STUDENTS.filter((s) => {
      const matchesQuery =
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.id.toLowerCase().includes(query.toLowerCase());
      const matchesYear = year === "All" || s.year === year;
      return matchesQuery && matchesYear;
    });
  }, [query, year]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Department Students</h1>

      <Card>
        <CardHeader>
          <CardTitle>Student Management</CardTitle>
          <CardDescription>
            Search, filter, and view student profiles
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              placeholder="Search by name or ID"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select
              className="border rounded px-3 py-2 bg-background"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option>All</option>
              <option>Year 1</option>
              <option>Year 2</option>
              <option>Year 3</option>
              <option>Year 4</option>
            </select>

            {/* Only Export button remains */}
            <Button className="w-full">Export</Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-4">ID</th>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Year</th>
                  <th className="py-2 pr-4">GPA</th>
                  <th className="py-2 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-b">
                    <td className="py-2 pr-4">{s.id}</td>
                    <td className="py-2 pr-4">{s.name}</td>
                    <td className="py-2 pr-4">{s.year}</td>
                    <td className="py-2 pr-4">{s.gpa.toFixed(2)}</td>
                    <td className="py-2 pr-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedStudent(s)}
                          >
                            Profile
                          </Button>
                        </DialogTrigger>

                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Student Profile</DialogTitle>{" "}
                          </DialogHeader>

                          {selectedStudent && (
                            <div className="space-y-3 mt-4">
                              <div>
                                <strong>ID:</strong> {selectedStudent.id}
                              </div>
                              <div>
                                <strong>Name:</strong> {selectedStudent.name}
                              </div>
                              <div>
                                <strong>Year:</strong> {selectedStudent.year}
                              </div>
                              <div>
                                <strong>GPA:</strong>{" "}
                                {selectedStudent.gpa.toFixed(2)}
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
