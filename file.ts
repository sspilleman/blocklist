import { blacklist, dynamic } from "./blacklist.ts";

const url = "https://filters.adavoid.org/ultimate-ad-filter.txt";
let txt: string | undefined = undefined;
let lines: string[] | undefined = undefined;

const regexes: RegExp[] = [
    /.*xvideos.*/,
    /^$/,
];

const filter = (line: string) => {
    return regexes.filter((r) => r.test(line)).length === 0;
};

const download = async () => {
    const response = await fetch(url);
    // age = new Date().getTime();
    if (response.ok) {
        console.log("download ok");
        txt = await response.text();
        lines = txt.split(/\n/).filter(filter);
        console.log("lines:", lines.length);
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
        return lines.join("\n");
    }
    // const now = new Date().getTime();
    // if ((now - age) > 1000 * 60 * 60 * 24) {
    //     console.log("refreshing");
    //     await download();
    //     if (lines) return lines.join("\n");
    //     else return undefined;
    // } else if (lines) {
    //     console.log("cached");
    //     return lines.join("\n");
    // } else {
    //     return undefined;
    // }
};
