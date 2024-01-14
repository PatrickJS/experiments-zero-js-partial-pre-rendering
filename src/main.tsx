import { Hono } from "hono/mod.ts";
import { stream } from "hono/helper.ts";
import { serveStatic } from "hono/middleware.ts";

const app = new Hono();

app.get("/", (c) => {
  return stream(c, async (stream) => {
    c.header("Content-Type", "text/html");
    await stream.write(/*html*/ `
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Home</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
  </head>
  <body>
    <nav>
      <a href="/" aria-current="page">Home</a>
      <a href="/page2.html">Other page</a>
    </nav>
    <main>
      `);

    await stream.write(/*html*/ `
      <template  shadowrootmode="open">
        <h1>Home page</h1>
        <hr />
        <slot name="id-1">
          Loading...
        </slot>
        <hr />
        <footer>copyright</footer>
      </template>
      `);

    // fake waiting
    await stream.sleep(1_000);

    await stream.write(/*html*/ `
      <div slot="id-1">
        Content Loaded
      </div>
      `);
    // await stream.sleep(1_000);
    // await stream.write(/*html*/`
    // <div slot="id-1">
    //   Content Loaded again
    // </div>
    // `);
    // await stream.sleep(1_000);
    // await stream.write(/*html*/`
    // <div slot="id-1">
    //   Content Loaded again
    // </div>
    // `);

    await stream.write(/*html*/ `
    </main>
  </body>
</html>
      `);
    // done
  });
});
app.get(
  "*",
  serveStatic({
    root: "./public",
  })
);

Deno.serve(app.fetch);
