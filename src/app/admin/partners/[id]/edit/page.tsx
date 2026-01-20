import PartnerForm from "../new/page";

export default function EditPartnerPage({
  params,
}: {
  params: { id: string };
}) {
  return <PartnerForm partnerId={params.id} />;
}
