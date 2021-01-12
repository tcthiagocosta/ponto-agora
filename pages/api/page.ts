import chrome from 'chrome-aws-lambda';
import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer-core';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await getScreenshot();
}

const senha = 'Furacao@2000';

export async function getOptions() {
  const isDev = !process.env.AWS_REGION
  let options;

  const chromeExecPaths = {
    win32: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    linux: '/usr/bin/google-chrome',
    darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  }
  
  const exePath = chromeExecPaths[process.platform]

  if (isDev) {
    options = {
      args: [],
      executablePath: exePath,
      headless: false
    }
  } else {
    options = {
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: false
    }
  }

  return options
}

async function getScreenshot() {

  const options = await getOptions();
  const browser = await puppeteer.launch(options);

  const page = await browser.newPage();
  await page.goto('https://webponto.norber.com.br/webPontoIndra/default.asp');
  await page.type('#CodEmpresa', '1')
  await page.type('#requiredusuario', '684162')
  await page.type('#requiredsenha', senha)

  await page.click('[type="submit"]')

  await page.waitForNavigation()

  await page.goto('https://webponto.norber.com.br/webPontoIndra/just_user/IncluirMarcacaoOnLine.asp');
  
  //await page.click('#Button1')
  await page.waitForTimeout(5000)
  await page.close();
  await browser.close();
}