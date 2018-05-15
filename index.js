const puppeteer = require('puppeteer')
const serveStatic = require('serve-static')
const http = require('http')
const serve = serveStatic('html')
const finalhandler = require('finalhandler')
const server = http.createServer((req, res) => serve(req, res, finalhandler(req, res)))

const PORT = process.env.PORT || 3000
 
server.listen(PORT, async () => {
  const browser = await puppeteer.launch({
    headless: false
  })
  const page = await browser.newPage()

  const frameName = 'bob'

  await page.goto(`http://localhost:${PORT}`)
  await page.waitForSelector(`iframe[name=${frameName}]`)

  console.info(`Found frame selector iframe[name=${frameName}]`)

  const frames = page.frames()

  console.info('Available frames', frames.map(frame => frame.name()))

  if (frames.find(frame => frame.name().includes(frameName))) {
    console.info(`Frame ${frameName} was in the DOM and in the frames list`)
  } else {
    console.error(`Frame ${frameName} was in the DOM but not in the frames list`)
  }

  await browser.close()

  server.close()
})
