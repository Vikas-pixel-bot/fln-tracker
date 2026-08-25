import { getAllExternalDashboards, getDashboardHeaderConfig } from "@/app/actions/dashboards";
import DashboardAdminClient from "./DashboardAdminClient";

export const metadata = {
  title: "Admin - Program Implementation Dashboards",
};

export default async function AdminDashboardsPage() {
  const [dashboards, headerConfig] = await Promise.all([
    getAllExternalDashboards(),
    getDashboardHeaderConfig(),
  ]);

  return (
    <div className="p-6">
      <DashboardAdminClient initialDashboards={dashboards} initialHeaderConfig={headerConfig} />
    </div>
  );
}

