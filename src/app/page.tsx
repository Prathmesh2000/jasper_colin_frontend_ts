import { ProductViewComponent } from "@/components/productView";
import { headers } from "next/headers";

export default async function ProductViewPage(){
  const headersList = await headers();
  const role = headersList.get('role');

  return (
    <ProductViewComponent role = {role || "user"}/>
  )
}