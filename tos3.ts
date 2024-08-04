import * as Minio from "npm:minio@7.1.4";

const s3config: Minio.ClientOptions = {
    port: 9000,
    useSSL: false,
    endPoint: "beast",
    region: "eu-central-1",
    accessKey: "root",
    secretKey: "Jennajameson0!",
};

const minio = new Minio.Client(s3config);

const url = "https://filters.adavoid.org/ultimate-ad-filter.txt";

const regexes: RegExp[] = [
    /xvideos-cdn/,
];

const filter = (line: string) => {
    return regexes.filter((r) => r.test(line)).length === 0;
};

const download = async () => {
    const response = await fetch(url);
    let lines: string[] | undefined = undefined;
    if (response.ok) {
        console.log("download ok");
        const txt = await response.text();
        lines = txt.split(/\n/).filter(filter);
        console.log("lines:", lines.length);
    } else console.log("download failed");
    return lines;
};

const upload = async (s: string) => {
    // await minio.putObject("shared", "blocklist.txt", s, (err, obj) => {
    //     if (err) console.log(err);
    //     else console.log(obj.etag);
    // });
    const r = await minio.putObject("shared", "blocklist.txt", s, undefined, {
        "Content-Type": "text/plain",
    });
    console.log(r);
};

const lines = await download();
if (lines !== undefined) {
    await upload(lines.join("\n"));
}

// https://s3.spilleman.nl/shared/blocklist.txt