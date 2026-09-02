import { Outlet, useParams } from "react-router-dom";
import { AiAssistant } from "./AiAssistant";

export function AiAssistantScope() {
  const { shopSlug = "" } = useParams<{ shopSlug: string }>();

  return (
    <>
      <Outlet />
      {shopSlug ? <AiAssistant key={shopSlug} shopSlug={shopSlug} /> : null}
    </>
  );
}
