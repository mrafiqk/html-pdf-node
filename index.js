const puppeteer = require('puppeteer');
var Promise = require('bluebird');
const hb = require('handlebars')

module.exports
async function generatePdf(file, options, callback) {
  // we are using headless mode
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  if(file.content) {
    console.log("Compiing the template with handlebars")
    // we have compile our code with handlebars
    const template = hb.compile(file.content, { strict: true });
    const result = template(file.content);
    const html = result;

    // We set the page content as the generated html by handlebars
    await page.setContent(html);
  } else {
    await page.goto(file.url);
  }

  return Promise.props(page.pdf(options))
    .then(async function(data) {
       await browser.close();
       return { pdf: data.docs };
    }).asCallback(callback);
}

module.exports.generatePdf = generatePdf;
