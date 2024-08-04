import * as Minio from "npm:minio@7.1.4";
import { get } from "./file.ts";

const minio = new Minio.Client({
    port: 9000,
    useSSL: false,
    endPoint: "beast",
    region: "eu-central-1",
    accessKey: "root",
    secretKey: "Jennajameson0!",
});

const upload = async (s: string) => {
    const r = await minio.putObject("shared", "blocklist.txt", s, undefined, {
        "Content-Type": "text/plain",
    });
    console.log(r.etag);
};

const file = await get();
if (file) {
    await upload(file);
}
// https://s3.spilleman.nl/shared/blocklist.txt
