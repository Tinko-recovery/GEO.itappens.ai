import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export async function renderPdfFromHtml(html: string) {
  const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || (await chromium.executablePath());

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath,
    headless: true,
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    return await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "18px",
        right: "18px",
        bottom: "18px",
        left: "18px",
      },
    });
  } finally {
    await browser.close();
  }
}
