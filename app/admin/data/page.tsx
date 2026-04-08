import { getAssessmentsAdmin } from "@/app/actions";
import { getImplementationLogsAdmin } from "@/app/actions/implementation";
import DataClient from "./DataClient";

export default async function AdminDataPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; term?: string; schoolId?: string; tab?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const tab = params.tab ?? "assessments";

  let data: any = { items: [], total: 0, pages: 0 };

  if (tab === "implementation") {
    const result = await getImplementationLogsAdmin(page, params.schoolId);
    data = { items: result.logs, total: result.total, pages: result.pages };
  } else {
    const { assessments, total, pages } = await getAssessmentsAdmin(
      page,
      params.schoolId,
      params.term
    );
    data = { items: assessments, total, pages };
  }

  return (
    <DataClient
      initialItems={data.items as any}
      total={data.total}
      pages={data.pages}
      currentPage={page}
      activeTab={tab as "assessments" | "implementation"}
    />
  );
}
