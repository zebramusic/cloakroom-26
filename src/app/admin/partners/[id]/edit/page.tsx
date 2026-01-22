import PartnerForm from "../../new/page";

export const dynamic = "force-dynamic";

export default async function EditPartnerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <PartnerForm partnerId={id} />;
}
