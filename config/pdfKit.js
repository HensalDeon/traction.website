const PDFDocument = require('pdfkit');

async function generateSalesReport(reportData, res) {
  const doc = new PDFDocument();

  generateHeader(doc);
  generateReportTable(doc, reportData);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=sales-report.pdf');

  doc.pipe(res);
  doc.end();
}

function generateHeader(doc) {
  doc.fontSize(20).text('Sales Report', { align: 'center' }).moveDown(0.5);
}

function generateReportTable(doc, report) {
  let i;
  const tableTop = 150;

  doc.font('Helvetica-Bold');
  generateTableRow(doc, tableTop, 'Date', 'Product', 'Quantity', 'Price', 'Total');
  doc.font('Helvetica');

  for (i = 0; i < report.length; i++) {
    const entry = report[i];
    const position = tableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      formatDate(entry.date),
      entry.product,
      entry.quantity,
      parseFloat(entry.price),
      entry.quantity * parseFloat(entry.price),
    );
  }
}

function generateTableRow(doc, y, date, product, quantity, price, total) {
  doc
    .fontSize(10)
    .text(date, 50, y)
    .text(product, 150, y)
    .text(quantity.toString(), 280, y, { width: 90, align: 'right' })
    .text(price, 370, y, { width: 90, align: 'right' })
    .text(total, 460, y, { width: 90, align: 'right' });
}

function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

module.exports = { generateSalesReport };
