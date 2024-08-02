import { Application, Context, Router, Status } from "https://deno.land/x/oak@v16.1.0/mod.ts";
import { get } from "./file.ts";

const router: Router = new Router();
router.get("/", async (ctx: Context) => {
  console.log(`IP: ${ctx.request.ip}`);
  const file = await get();
  if (file) {
    // ctx.response.headers.set("content-type", "text/plain; charset=utf-8");
    ctx.response.status = Status.OK;
    ctx.response.body = file;
  } else {
    // ctx.response.headers.set("content-type", "text/plain; charset=utf-8");
    ctx.response.status = Status.NotFound;
    ctx.response.body = "file not found";
  }
});

const app = new Application();
app.addEventListener("listen", (e) => console.log(`Listen: ${e.port}`));
app.use(router.routes());
app.use(router.allowedMethods());
app.listen({ port: 10101 });

// deno bundle --config ./deno.tsconfig.json --import-map deps.json formule1/web.ts formule1/deploy.ts
