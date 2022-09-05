/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const puppeteer = require('puppeteer');
const Promise = require('bluebird');
const hb = require('handlebars');
const inlineCss = require('inline-css');

async function generatePdf(file, options, callback) {
  // we are using headless mode
  let args = ['--no-sandbox', '--disable-setuid-sandbox'];
  if (options.args) {
    args = options.args;
    delete options.args;
  }

  const browser = await puppeteer.launch({
    args,
  });
  const page = await browser.newPage();

  if (file.content) {
    const data = await inlineCss(file.content, { url: '/' });
    console.log('Compiling the template with handlebars');
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
      waitUntil: ['load', 'networkidle0'], // wait for page to load completely
    });
  }
  if (options.autoHeightAndSinglePage) {
    await page.setViewport({
      width: options.widthViewport, // special width in integer for autoHeightAndSinglePage
      height: 1,
      deviceScaleFactor: 1,
    });
    const height = await page.evaluate(() => document.documentElement.offsetHeight); // sir, -auto-height who wants
    options.height = height;
    options.width = `${String(options.widthViewport)}px`;
    options.pageRanges = '1';
  }

  return Promise.props(page.pdf(options))
    .then(async (data) => {
      await browser.close();
      return Buffer.from(Object.values(data));
    })
    .asCallback(callback);
}

async function generatePdfs(files, options, callback) {
  // we are using headless mode
  let args = ['--no-sandbox', '--disable-setuid-sandbox'];
  if (options.args) {
    args = options.args;
    // eslint-disable-next-line no-param-reassign
    delete options.args;
  }
  const browser = await puppeteer.launch({
    args,
  });
  const pdfs = [];
  const page = await browser.newPage();
  for (const file of files) {
    if (file.content) {
      const data = await inlineCss(file.content, { url: '/' });
      console.log('Compiling the template with handlebars');
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
    const pdfObj = JSON.parse(JSON.stringify(file));
    delete pdfObj.content;
    if (options.autoHeightAndSinglePage) {
      await page.setViewport({
        width: options.widthViewport, // special width in integer for autoHeightAndSinglePage
        height: 1,
        deviceScaleFactor: 1,
      });
      const height = await page.evaluate(() => document.documentElement.offsetHeight); // sir, -auto-height who wants
      options.height = height;
      options.width = `${String(options.widthViewport)}px`;
      options.pageRanges = '1';
    }
    pdfObj.buffer = Buffer.from(Object.values(await page.pdf(options)));
    pdfs.push(pdfObj);
  }

  return Promise.resolve(pdfs)
    .then(async (data) => {
      await browser.close();
      return data;
    })
    .asCallback(callback);
}

module.exports.generatePdf = generatePdf;
module.exports.generatePdfs = generatePdfs;
