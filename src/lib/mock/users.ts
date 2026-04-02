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
      languagePreference: "tr",
      linkedStudentIds: ["s-1"],
    },
    {
      id: "p-2",
      role: "parent",
      name: "Maria Ivanova",
      languagePreference: "bg",
      linkedStudentIds: ["s-2"],
    },
    {
      id: "p-3",
      role: "parent",
      name: "Sarah Smith",
      languagePreference: "en",
      linkedStudentIds: ["s-1", "s-3"],
    },
  ],
  teacher: [
    { id: "t-1", role: "teacher", name: "Mevr. De Smet" },
    { id: "t-2", role: "teacher", name: "Dhr. Van den Broeck" },
  ],
  student: [
    { id: "s-1", role: "student", name: "Noah" },
    { id: "s-2", role: "student", name: "Mila" },
    { id: "s-3", role: "student", name: "Yusuf" },
  ],
};

