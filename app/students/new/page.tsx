import { getSchools } from "@/app/actions";
import AddStudentPage from "./client-page";

export default async function Page() {
  const schools = await getSchools();
  return <AddStudentPage schools={schools} />;
}
