import { getHierarchy, getStudentsList } from "@/app/actions";
import RosterClient from "./RosterClient";

export default async function StudentsDirectoryPage() {
  const hierarchy = await getHierarchy();
  const initialData = await getStudentsList("", 1);

  return <RosterClient hierarchy={hierarchy} initialData={initialData} />;
}
