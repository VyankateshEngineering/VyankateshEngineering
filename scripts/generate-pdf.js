const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generatePDF() {
  console.log('Starting PDF generation...');
  
  // Ensure we can connect to the local server
  const url = 'http://localhost:3000/catalogue-print';
  const outputPath = path.join(__dirname, '../public/Vyankatesh-Engineering-Catalogue-v1.0.pdf');

  try {
    console.log('Launching Puppeteer...');
    // In restricted environments, we might need no-sandbox
    const browser = await puppeteer.launch({ 
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    
    const page = await browser.newPage();
    
    // Set viewport to A4 size roughly
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
    
    console.log(`Navigating to ${url}...`);
    // Wait until network is idle to ensure images load
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    
    console.log('Generating PDF...');
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });
    
    console.log(`PDF successfully generated at: ${outputPath}`);
    await browser.close();
  } catch (error) {
    console.error('Error generating PDF:', error);
    process.exit(1);
  }
}

generatePDF();
