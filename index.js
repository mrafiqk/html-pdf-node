const puppeteer = require('puppeteer');
var Promise = require('bluebird');
const hb = require('handlebars')
const inlineCss = require('inline-css')
module.exports
async function generatePdf(file, options, callback) {
  // we are using headless mode
  let args = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
  ];
  if(options.args) {
    args = options.args;
    delete options.args;
  }

  const browser = await puppeteer.launch({
    args: args
  });
  const page = await browser.newPage();

  if(file.content) {
    data = await inlineCss(file.content, {url:"/"});
    console.log("Compiling the template with handlebars")
    // we have compile our code with handlebars
    const template = hb.compile(data, { strict: true });
    const result = template(data);
    const html = result;

    // We set the page content as the generated html by handlebars
    await page.setContent(html, {
      waitUntil: 'networkidle0', // wait for page to load completely
    });
  } else {
    await page.goto(file.url, {
      waitUntil:[ 'load', 'networkidle0'], // wait for page to load completely
    });
  }

  return Promise.props(page.pdf(options))
    .then(async function(data) {
       await browser.close();

       return Buffer.from(Object.values(data));
    }).asCallback(callback);
}

async function generatePdfs(files, options, callback) {
  // we are using headless mode
  let args = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
  ];
  if(options.args) {
    args = options.args;
    delete options.args;
  }
  const browser = await puppeteer.launch({
    args: args
  });
  let pdfs = [];
  const page = await browser.newPage();
  for(let file of files) {
    if(file.content) {
      data = await inlineCss(file.content, {url:"/"})
      console.log("Compiling the template with handlebars")
      // we have compile our code with handlebars
      const template = hb.compile(data, { strict: true });
      const result = template(data);
      const html = result;
      // We set the page content as the generated html by handlebars
      await page.setContent(html, {
        waitUntil: 'networkidle0', // wait for page to load completely
      });
    } else {
      await page.goto(file.url, {
        waitUntil: 'networkidle0', // wait for page to load completely
      });
    }
    let pdfObj = JSON.parse(JSON.stringify(file));
    delete pdfObj['content'];
    pdfObj['buffer'] = Buffer.from(Object.values(await page.pdf(options)));
    pdfs.push(pdfObj);
  }

  return Promise.resolve(pdfs)
    .then(async function(data) {
       await browser.close();
       return data;
    }).asCallback(callback);
}

module.exports.generatePdf = generatePdf;
module.exports.generatePdfs = generatePdfs;
