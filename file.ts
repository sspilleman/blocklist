import { blacklist, dynamic } from "./lists.ts";

const url = "https://filters.adavoid.org/ultimate-ad-filter.txt";
let txt: string | undefined = undefined;
let lines: string[] | undefined = undefined;

const regexes: RegExp[] = [
  /xvideos/i,
  /^$/i,
  /xhcdn/i,
  /tsyndicate/i,
  /hpyjmp/i,
  /blcdog/i,
  /acscdn/i,
  /tapecontent\.net/i,
];

const filter = (line: string) => {
  const length = regexes.filter((r) => r.test(line)).length;
  //   if (line.includes("tsyndicate")) console.log(length, line);
  return length === 0;
};

const download = async () => {
  const response = await fetch(url);
  // age = new Date().getTime();
  if (response.ok) {
    console.log("download ok");
    txt = await response.text();
    lines = txt.split(/\n/);
  } else {
    console.log("download failed");
    lines = undefined;
  }
};

export const get = async (): Promise<string | undefined> => {
  await download();
  if (lines) {
    for (const url of dynamic) {
      lines.push(url);
    }
    for (const url of blacklist.filter((s) => s.endsWith("/"))) {
      lines.push(`*.${url.slice(0, -1)}`);
    }
    for (const url of blacklist.filter((s) => !s.endsWith("/"))) {
      lines.push(`/${url.replace(/\-/g, "\\-")}/i`);
    }
    console.log("lines:", lines.filter(filter).length);
    return lines.filter(filter).join("\n");
  }
};
