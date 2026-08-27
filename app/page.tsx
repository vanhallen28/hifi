import "./site.css";
import Landing from "./Landing";
import { getContent } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Page() {
  const content = await getContent();
  return <Landing content={content} />;
}
