// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { useMemo, useState } from "react"
// import { Link } from "react-router-dom"
// import { UserPlus } from "lucide-react"

// type Teacher = { id: string; name: string; qualification: string; courses: number }

// const MOCK_TEACHERS: Teacher[] = [
//   { id: "T-100", name: "Dr. Alemu", qualification: "PhD Biology", courses: 3 },
//   { id: "T-101", name: "Dr. Sara", qualification: "PhD Chemistry", courses: 4 },
//   { id: "T-102", name: "Mr. Bekele", qualification: "MSc Physics", courses: 2 },
// ]

// export default function HeadTeachers() {
//   const [query, setQuery] = useState("")
//   const filtered = useMemo(() => {
//     return MOCK_TEACHERS.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()) || t.id.toLowerCase().includes(query.toLowerCase()))
//   }, [query])

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold">Department Teachers</h1>
//         <Link to="/head/create-teacher">
//           <Button className="flex items-center gap-2">
//             <UserPlus className="h-4 w-4" />
//             Create Teacher
//           </Button>
//         </Link>
//       </div>
//       <Card>
//         <CardHeader>
//           <CardTitle>Teacher Management</CardTitle>
//           <CardDescription>Assign courses and track workload</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//             <Input placeholder="Search by name or ID" value={query} onChange={(e) => setQuery(e.target.value)} />
//             <div className="md:col-span-2 flex gap-2">
//               <Button className="w-full">Assign Course</Button>
//               <Button variant="outline" className="w-full">Export</Button>
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="min-w-full text-sm">
//               <thead>
//                 <tr className="text-left border-b">
//                   <th className="py-2 pr-4">ID</th>
//                   <th className="py-2 pr-4">Name</th>
//                   <th className="py-2 pr-4">Qualification</th>
//                   <th className="py-2 pr-4">Courses</th>
//                   <th className="py-2 pr-4">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map((t) => (
//                   <tr key={t.id} className="border-b">
//                     <td className="py-2 pr-4">{t.id}</td>
//                     <td className="py-2 pr-4">{t.name}</td>
//                     <td className="py-2 pr-4">{t.qualification}</td>
//                     <td className="py-2 pr-4">{t.courses}</td>
//                     <td className="py-2 pr-4">
//                       <div className="flex gap-2">
//                         <Button size="sm">Assign</Button>
//                         <Button size="sm" variant="outline">Profile</Button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useMemo, useState } from "react";

type Teacher = {
  id: string;
  name: string;
  qualification: string;
  courses: number;
};

const MOCK_TEACHERS: Teacher[] = [
  { id: "T-100", name: "Dr. Alemu", qualification: "PhD Biology", courses: 3 },
  { id: "T-101", name: "Dr. Sara", qualification: "PhD Chemistry", courses: 4 },
  { id: "T-102", name: "Mr. Bekele", qualification: "MSc Physics", courses: 2 },
];

export default function HeadTeachers() {
  const [query, setQuery] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const filtered = useMemo(() => {
    return MOCK_TEACHERS.filter(
      (t) =>
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.id.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Department Teachers</h1>
        <Link to="/head/create-teacher">
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Create Teacher
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Teacher Management</CardTitle>
          <CardDescription>
            View teacher profiles and assigned courses
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Search only */}
          <Input
            placeholder="Search by name or ID"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-3 pr-4">ID</th>
                  <th className="py-3 pr-4">Name</th>
                  <th className="py-3 pr-4">Qualification</th>
                  <th className="py-3 pr-4">Courses</th>
                  <th className="py-3 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((teacher) => (
                  <tr key={teacher.id} className="border-b">
                    <td className="py-3 pr-4">{teacher.id}</td>
                    <td className="py-3 pr-4 font-medium">{teacher.name}</td>
                    <td className="py-3 pr-4">{teacher.qualification}</td>
                    <td className="py-3 pr-4">{teacher.courses}</td>
                    <td className="py-3 pr-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedTeacher(teacher)}
                          >
                            Profile
                          </Button>
                        </DialogTrigger>

                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Teacher Profile</DialogTitle>
                          </DialogHeader>

                          {selectedTeacher && (
                            <div className="space-y-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    ID
                                  </p>
                                  <p className="font-medium">
                                    {selectedTeacher.id}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    Name
                                  </p>
                                  <p className="font-medium">
                                    {selectedTeacher.name}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    Qualification
                                  </p>
                                  <p className="font-medium">
                                    {selectedTeacher.qualification}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    Courses Assigned
                                  </p>
                                  <p className="font-medium">
                                    {selectedTeacher.courses}
                                  </p>
                                </div>
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
