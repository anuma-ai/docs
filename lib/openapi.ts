import { createOpenAPI } from "fumadocs-openapi/server";
import spec from "../public/swagger.json";

export const openapi = createOpenAPI({
  input: () => ({
    portal: spec,
  }),
});
