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

  console.log(report, '❤️❤️');

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

function generateInvoice(orderDetails, res) {
  const doc = new PDFDocument({ margin: 50 });
  generateInvoiceHeader(doc);
  generateCustomerInformation(doc, orderDetails)
  const tableTop = generateInvoiceTable(doc, orderDetails);
  generateSubtotal(doc, orderDetails, tableTop)
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=order-Invoice.pdf');

  doc.pipe(res);
  doc.end();
}

function generateInvoiceHeader(doc) {
  doc
    .image('public/user/assets/imgs/theme/redLogo.png', 50, 57, { width: 115, height:30 })
    .fillColor('#444444')
    .fontSize(20)
    .fontSize(10)
    .text(' Bombay Mutual, D N Marg', 200, 65, { align: 'right' })
    .text('Fort , Mumbai, India', 200, 80, { align: 'right' })
    .moveDown();
}
function generateCustomerInformation(doc, invoice) {
  const shipping = invoice.orderData;

  doc.text(`Invoice Number: ${shipping.orderNumber}`, 50, 200)
    .text(`Invoice Date: ${formatDate(new Date())}`, 50, 215)
    .text('Ship To:', 250, 200)
    .text(shipping.user.username, 250, 215)
    .text(shipping.shippingAddress.street_address, 250, 230)
    .text(`${shipping.shippingAddress.city}, ${shipping.shippingAddress.state}, ${shipping.shippingAddress.country}`,
      250,
      245,
    )
    .text(shipping.shippingAddress.phone, 250, 260)
    .text(shipping.shippingAddress.email, 250, 275)
    .moveDown();
}

function generateInvoiceTable(doc, orderDetail) {
  let i;
  const tableTop = 330;
  doc.font('Helvetica-Bold');
  generateTableRow(doc, tableTop, 'Date', 'Product', 'Quantity', 'Price', 'Total');
  doc.font('Helvetica');

  const orderData = orderDetail.orderData;
  const items = orderData.items;
  for (i = 0; i < items.length; i++) {
    let item = items[i];
    const position = tableTop + (i + 1) * 30;
    generateInvoiceTableRow(
      doc,
      position,
      item,
      orderData
    );
  }
  return tableTop;
}

function generateInvoiceTableRow(doc, y, item, orderData) {
  const product = item.product.productName;
  const quantity = item.quantity;
  const price = item.product.productPrice;
  doc
    .fontSize(10)
    .text(formatDate(orderData.date), 50, y)
    .text(product, 150, y, { width: 170, align: 'left' })
    .text(quantity.toString(), 350, y, { width: 90, align: 'centre' })
    .text(price, 435, y, { width: 90, align: 'centre' })
    .text((quantity * price).toString(), 525, y, { width: 90, align: 'centre' })
  doc.moveDown(0.5);
}

function generateSubtotal(doc, orderDetail, tableTop) {
  const items = orderDetail.orderData.items;
  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.product.productPrice, 0);

  // Display the subtotal row
  const ySubtotal = tableTop + (items.length + 1) * 30; // Adjust the vertical position for the subtotal row
  doc
    .fontSize(10)
    .text('Subtotal    :', 435, ySubtotal)
    .text(subtotal.toString(), 495, ySubtotal, { width: 90, align: 'center' });

}


module.exports = { generateSalesReport, generateInvoice };
