const endPoints = {
  login: "/auth/login",
  register: "/auth/register",
  applicantsRegister:
    "https://deutschemedizin-collage-backend-production.up.railway.app/api/applicants/register", // POST
  registrarApplicantRegister: "/auth/register/student",
  studentStatus: "/student-statuses",
  batchClassSemsterYear: "/bcsy",
  applicantsList: "/applicants", // GET

  applicantDetail: "/applicants/:id", // GET
  applicantUpdateStatus: "/applicants/:id/status", // PUT
  applicantPhoto: "/applicants/:id/photo", // GET
  applicantDocument: "/applicants/:id/document", // GET
  students: "/students", // GET
  studentsDeactivation: "/students/:id/disable",
  studentsActivation: "/students/:id/enable",
  createDepartmentHead: "/auth/create-department-head",
  createTeacher: "/auth/create-teacher",
  departmentHeads: "/department-heads",
  teachers: "/teachers",
  departments: "/departments",
  impairments: "/impairments",
  semesters: "/semesters",
  schoolBackgrounds: "/school-backgrounds",
  programModality: "/program-modality",
  classYears: "/class-years",
  semester: "/semesters",
  BatchClassYearSemesters: "/bcsy",
  batches: "/batches",
  courses: "/courses/single",
  regions: "/region",
  allWoreda: "/woreda",
  allZones: "/zone",
  allRegion: "/region",
  zonesByRegion: "/zone/region",
  woredasByZone: "/woreda/zone",
  notifications: "/notifications/me", // GET
  notificationsLatest: "/notifications/me/latest", // GET
  markNotificationRead: "/notifications/:id/read", // PATCH
  markAllNotificationsRead: "/notifications/me/read-all", // PATCH
};

export default endPoints;
