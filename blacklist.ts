import puppeteer, {
  Browser,
  HTTPRequest,
  Page,
  PuppeteerLifeCycleEvent,
} from "npm:puppeteer@23.0.2";
import { brightGreen as green } from "libs/utils/colors.ts";
import { blacklist, dynamic, whitelist } from "./lists.ts";

// PUPPETEER_PRODUCT=chrome deno run -A https://deno.land/x/puppeteer@16.2.0/install.ts
// Downloaded /Users/sander/Library/Caches/deno/deno_puppeteer/chromium/mac-1022525/chrome-mac/Chromium.app/Contents/MacOS/Chromium
// rm -rf /Users/sander/Library/Caches/deno/deno_puppeteer
// npx puppeteer browsers install chrome

const includes = (u: string, s: string) =>
  u.toLowerCase().includes(s.toLowerCase());

function intercept(interceptedRequest: HTTPRequest) {
  const url = interceptedRequest.url();
  const whitelisted = whitelist.filter((s) => includes(url, s)).length !== 0;
  const blacklisted = blacklist.filter((s) => includes(url, s)).length !== 0;
  if (!whitelisted && !blacklisted) console.log(url);
  if (blacklisted) return interceptedRequest.abort();
  else return interceptedRequest.continue();
}

async function startPuppeteer() {
  const browser = await puppeteer.launch({
    browser: "chrome",
    headless: true,
    defaultViewport: { width: 1400, height: 1024 },
    args: ["--window-size=1600,1280"],
  });
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on("request", intercept);
  return { browser, page };
}

async function stopPuppeteer(page: Page, browser: Browser) {
  await page.close();
  await browser.close();
}

const waitUntil: PuppeteerLifeCycleEvent[] = [
  "networkidle0",
  "load",
  "domcontentloaded",
  "networkidle2",
];

async function start(urls: string[]) {
  const { browser, page } = await startPuppeteer();
  for (const url of urls) {
    console.log(green(url));
    await page.goto(url, { waitUntil });
  }
  await stopPuppeteer(page, browser);
  for (const url of dynamic) {
    console.log(url);
  }
  for (const url of blacklist.filter((s) => s.endsWith("/"))) {
    console.log(`*.${url.slice(0, -1)}`);
  }
  for (const url of blacklist.filter((s) => !s.endsWith("/"))) {
    console.log(`/${url.replace(/\-/g, "\\-")}/i`);
  }
}

const urls: string[] = [
  "https://www.eporner.com/video-4wLSjIkVll6/hot-melody-nakai-will-have-her-pussy-licked-and-her-ass-fucked-002/",
];

await start(urls);
