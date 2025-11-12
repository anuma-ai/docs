import { createOpenAPI } from "fumadocs-openapi/server";
import spec from "@reverbia/portal/swagger.json";

export const openapi = createOpenAPI({
  input: () => ({
    portal: spec,
  }),
});
