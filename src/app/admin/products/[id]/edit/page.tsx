import ProductForm from "../new/page";

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  return <ProductForm productId={params.id} />;
}
