import { getHierarchy, getSettings } from "@/app/actions";
import LiveTrackerClient from "./client-page";

export default async function LiveAssessmentPage() {
  const hierarchy = await getHierarchy();
  const settings = await getSettings();

  return <LiveTrackerClient hierarchy={hierarchy} settings={settings} />;
}
