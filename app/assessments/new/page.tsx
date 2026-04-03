export const dynamic = 'force-dynamic';
import { getSchools } from "@/app/actions";
import RecordAssessmentPage from "./client-page";

export default async function Page() {
  const schools = await getSchools();
  return <RecordAssessmentPage schools={schools} />;
}
