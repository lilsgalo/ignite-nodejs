import fs from "node:fs";
import { parse } from "csv-parse";

async function run() {
  const linesParse = fs
    .createReadStream(new URL("./tasks-ignite-desafio-01.csv", import.meta.url))
    .pipe(
      parse({
        delimiter: ",",
        skipEmptyLines: true,
        fromLine: 2,
      })
    );

  for await (const line of linesParse) {
    const [title, description] = line;

    await fetch("http://localhost:3333/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
