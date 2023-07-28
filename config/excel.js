const Excel = require('exceljs');

async function generateSalesReportExcel(reportData) {
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet('Sales Report');

  const headerRow = worksheet.addRow(['Date', 'Product', 'Quantity', 'Price', 'Total']);
  headerRow.font = { bold: true };

  reportData.forEach(entry => {
    const formattedDate = formatDate(entry.date);
    const total = entry.quantity * parseFloat(entry.price);
    worksheet.addRow([formattedDate, entry.product, entry.quantity, entry.price, total]);
  });

  worksheet.getColumn(1).width = 20;
  worksheet.getColumn(2).width = 30;
  worksheet.getColumn(3).width = 12;
  worksheet.getColumn(4).width = 12;
  worksheet.getColumn(5).width = 12;

  // Calculate and display the subtotal
  const lastRowNum = worksheet.lastRow.number;
  worksheet.addRow([]);
  worksheet.getCell(`E${lastRowNum + 1}`).value = { formula: `SUM(E2:E${lastRowNum})` };
  worksheet.getRow(lastRowNum + 1).font = { bold: true };
  worksheet.getCell(`D${lastRowNum + 1}`).value = 'Subtotal';

  return workbook;
}

function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

module.exports = {
  generateSalesReportExcel,
};
