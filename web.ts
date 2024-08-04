
import { get } from "./file.ts";

const handler: Deno.ServeHandler = async (_request: Request) => {
  const file = await get();
  if (file) {
    return new Response(file, { status: 200 });
  } else {
    return new Response("not found", { status: 404 });
  }
};

const hostname = "0.0.0.0";
const port = 10101;
const options: Deno.ServeOptions | Deno.ServeTlsOptions = { hostname, port };

Deno.serve(options, handler);

// https://s3.spilleman.nl/shared/blocklist.txt
// https://blocklist.deno.dev/blocklist.txt