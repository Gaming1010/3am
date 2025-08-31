const express = require("express");
const puppeteer = require("puppeteer");
const bodyParser = require("body-parser");
const port = 3000;


const app = express();
let browser, page;

app.use(bodyParser.json());
app.use(express.static("public")); // serve HTML page with buttons

async function initBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: false,
      userDataDir: "./my-profile",
    });
    page = await browser.newPage();
    await page.goto("https://aternos.org/server", { waitUntil: "networkidle0" });
    let div_selector_to_remove= ".boost-cta-box";
  }
  return page;
}

// Endpoint to trigger clicks
app.post("/click-coords", async (req, res) => {
  const { x, y } = req.body;
  console.log("clicked");
  try {
    const p = await initBrowser();
    await p.mouse.click(x, y);
    res.send("Clicked at coordinates!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error clicking.");
  }
});


// Endpoint to get screenshot
app.get("/screenshot", async (req, res) => {
  try {
    const p = await initBrowser();
    const screenshot = await p.screenshot({ type: "png" });
    res.set("Content-Type", "image/png");
    res.send(screenshot);
  } catch (err) {
    res.status(500).send("Error capturing screenshot.");
  }
});

app.listen(port, () => {
  console.log("Server running on http://localhost:"+port);
});

