export const dynamic = 'force-dynamic';
import { getAssessmentsAdmin } from "@/app/actions";
import DataClient from "./DataClient";

export default async function AdminDataPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; term?: string; schoolId?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const { assessments, total, pages } = await getAssessmentsAdmin(
    page,
    params.schoolId,
    params.term
  );

  return (
    <DataClient
      initialAssessments={assessments as any}
      total={total}
      pages={pages}
      currentPage={page}
    />
  );
}
