import { line } from "https://esm.sh/v133/d3-shape@3.2.0/es2022/d3-shape.mjs";

const url = "https://filters.adavoid.org/ultimate-ad-filter.txt";

let lines: string[] | undefined = undefined;
let age = new Date("2000-01-01").getTime();

const regexes: RegExp[] = [
    /xvideos-cdn/,
];

const filter = (line: string) => {
    return regexes.filter((r) => r.test(line)).length === 0;
};

const download = async () => {
    const response = await fetch(url);
    age = new Date().getTime();
    if (response.ok) {
        console.log("download ok");
        const txt = await response.text();
        lines = txt.split(/\n/).filter(filter);
        console.log("lines:", lines.length);
    } else {
        console.log("download failed");
        lines = undefined;
    }
};

export const get = async (): Promise<string | undefined> => {
    const now = new Date().getTime();
    if ((now - age) > 1000 * 60 * 60 * 24) {
        console.log("refreshing");
        await download();
        if (lines) return lines.join("\n");
        else return undefined;
    } else if (lines) {
        console.log("cached");
        return lines.join("\n");
    } else {
        return undefined;
    }
};
