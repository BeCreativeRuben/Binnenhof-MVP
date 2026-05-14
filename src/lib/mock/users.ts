import type { Role, SessionUser } from "@/components/session/SessionProvider";

export type DemoUser = SessionUser & {
  languagePreference?: "nl" | "en" | "tr" | "bg" | "ps" | "fa" | "sk";
  linkedStudentIds?: string[];
};

export const DEMO_USERS: Record<Role, DemoUser[]> = {
  parent: [
    {
      id: "p-1",
      role: "parent",
      name: "Aylin Demir",
      username: "parent.aylin",
      classId: null,
      teacherUserId: null,
      languagePreference: "tr",
      linkedStudentIds: ["s-3"],
    },
    {
      id: "p-2",
      role: "parent",
      name: "Maria Ivanova",
      username: "parent.maria",
      classId: null,
      teacherUserId: null,
      languagePreference: "bg",
      linkedStudentIds: ["s-1"],
    },
    {
      id: "p-3",
      role: "parent",
      name: "Sarah Smith",
      username: "parent.sarah",
      classId: null,
      teacherUserId: null,
      languagePreference: "en",
      linkedStudentIds: ["s-2"],
    },
  ],
  teacher: [
    { id: "t-1", role: "teacher", name: "Mevr. De Smet", username: "teacher.desmet", classId: "klas-a", teacherUserId: null },
    { id: "t-2", role: "teacher", name: "Dhr. Van den Broeck", username: "teacher.vdbroeck", classId: "klas-b", teacherUserId: null },
  ],
  student: [
    { id: "s-1", role: "student", name: "Noah", username: "student.noah", classId: "klas-a", teacherUserId: "t-1" },
    { id: "s-2", role: "student", name: "Mila", username: "student.mila", classId: "klas-a", teacherUserId: "t-1" },
    { id: "s-3", role: "student", name: "Yusuf", username: "student.yusuf", classId: "klas-b", teacherUserId: "t-2" },
  ],
};

