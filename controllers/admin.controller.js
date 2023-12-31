const { handleError } = require('../middlewares/error.handler');

const {
  fetchAllUsers,
  findUserWithId,
  getGraphData,
  getChartData,
  getDashBoardData,
} = require('../models/admin.model');
const { getProductStocks } = require('../models/product.model');
const { generateSalesReport, generateStocksReport } = require('../config/pdfKit');
const { generateSalesReportExcel } = require('../config/excel');

const { getOrderData, getOrders } = require('../models/order.model');
const { end } = require('pdfkit');

/**
 * This function renders the admin dashboard page in response to an  GET request.
 * @param req - The `req` parameter is an object that represents the HTTP request made by the client to
 * the server. It contains information such as the request method, URL, headers, and any data sent in
 * the request body.
 * @param res - The `res` parameter is an object that represents the HTTP response that will be sent
 * back to the client. It contains methods and properties that allow the server to send data, headers,
 * and status codes back to the client. In this case, the `res` object is being used to render a
 */
async function GetDashBoard(req, res) {
  try {
    const result = await getDashBoardData();
    const orders = await getOrderData()
    res.render('admin/dashboard', {
      totalRevenue: result.totalRevenue,
      totalOrdersCount: result.totalOrdersCount,
      totalProductsCount: result.totalProductsCount,
      totalCategoriesCount: result.totalCategoriesCount,
      currentMonthEarnings: result.currentMonthEarnings,
      orders: orders,
      activePage: 'dashboard'
    });
  } catch (error) {
    handleError(res, error);
  }
}
/**
 * This function renders a login page for an admin.
 * @param req - The request object represents the HTTP request that the server receives from the
 * client. It contains information about the request, such as the URL, headers, and any data that was
 * sent in the request.
 * @param res - The `res` parameter is an object representing the HTTP response that will be sent back
 * to the client. It contains methods and properties that allow the server to send data, headers, and
 * status codes back to the client. In this case, the `res` object is being used to render a login
 */

async function GetLogin(req, res) {
  try {
    res.render('admin/login');
  } catch (error) {
    handleError(res, error);
  }
}

/**
 * This function handles a HTTP POST request for user login and checks if the user is an admin.
 * @param req - The `req` parameter is an object representing the HTTP request made to the server. It
 * contains information such as the request method, headers, URL, and any data sent in the request
 * body.
 * @param res - The "res" parameter is the response object that will be sent back to the client making
 * the HTTP request. It contains information such as the status code, headers, and body of the
 * response.
 * @returns This function returns a JSON response with a status and error message if the login
 * credentials are incorrect or if the admin credentials are not set. If the login credentials are
 * correct, it sets a session variable and returns a JSON response with a status of true.
 */
async function PostLogin(req, res) {
  try {
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      if (
        req.body.email === process.env.ADMIN_EMAIL &&
        req.body.password === process.env.ADMIN_PASSWORD
      ) {
        req.session.adminLoggedIn = true;
        return res.status(200).json({ status: true });
      } else {
        return res.status(400).json({ status: false, error: 'Email or password is incorrect.' });
      }
    } else {
      return res.status(400).json({ error: 'Admin credentials are not set.' });
    }
  } catch (error) {
    handleError(res, error);
  }
}

/**
 * This function fetches all users and renders them on an admin page, or throws an error if the fetch
 * fails.
 * @param req - The req parameter is an object that represents the HTTP request made to the server. It
 * contains information such as the request method, URL, headers, and any data sent in the request
 * body.
 * @param res - `res` is the response object that is used to send the HTTP response back to the client.
 * It is an instance of the `http.ServerResponse` class in Node.js. The `res` object has methods like
 * `res.render()` to render a view template, `res.send()` to send
 */
async function GetUsers(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchQuery = req.query.searchTerm || "";

    const response = await fetchAllUsers(page, limit, searchQuery);
    console.log(response.users,'❤️❤️❤️');
    if (response.status) {
      res.render('admin/users', {
        users: response.users,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        limit: response.limit,
        activePage: 'users'
      });
    } else {
      throw new Error('Failed to fetch users');
    }
  } catch (error) {
    handleError(res, error);
  }
}

/**
 * This function updates the status of a user and returns a response with a success message or an error
 * message if the user is not found.
 * @param req - The req parameter is an object that represents the HTTP request made to the server. It
 * contains information such as the request method, headers, URL, and body.
 * @param res - The "res" parameter is the response object that will be sent back to the client making
 * the HTTP request. It contains information such as the status code and message that will be returned
 * to the client.
 * @returns a response object with a status code and a message. If the user is not found, the status
 * code will be 404 and the message will be "User not found". If the user is found, the status code
 * will be 200 and the message will be "User status updated. User [action]ed successfully."
 */
async function PutBlockUser(req, res) {
  const { id, action } = req.body;
  try {
    const user = await findUserWithId(id, action);
    if (!user.status) {
      return res.send({ status: 404, message: 'User not found' });
    } else {
      return res.send({
        status: 200,
        message: `User status updated.User ${action}ed succesfully.`,
      });
    }
  } catch (error) {
    handleError(res, error);
  }
}
/**
 * The above code contains two async functions, one for logging out and one for rendering a 404 error
 * page in an admin panel.
 * @param req - The `req` parameter is an object that represents the HTTP request made by the client to
 * the server. It contains information such as the request method, URL, headers, and any data sent in
 * the request body. In these functions, `req` is used to access the session object and to render
 * @param res - `res` is an object representing the HTTP response that will be sent back to the client.
 * It contains methods for setting the response status, headers, and body. In these functions, `res` is
 * used to redirect the user to a login page or render a 404 error page.
 */

async function GetLogout(req, res) {
  try {
    req.session.destroy();
    res.redirect('/admin/login');
  } catch (error) {
    handleError(res, error);
  }
}

async function Get404(req, res) {
  try {
    res.render('admin/404');
  } catch (error) {
    handleError(res, error);
  }
}

//chart data
async function GetGraphData(req, res) {
  try {
    const result = await getGraphData();
    if (result.status) {
      res.json({
        labels: result.labels,
        sales: result.salesData,
        products: result.productsData,
        message: result.message,
        success: true,
      });
    } else {
      res.json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
async function GetChartData(req, res) {
  try {
    const result = await getChartData();
    if (result.status) {
      const { popularProducts } = result;

      // Populate the chart data
      const labels = popularProducts.map((product) => product.productName);
      const data = popularProducts.map((product) => product.totalOrders);
      const stocks = popularProducts.map((product) => product.stocks); // Fetch product stock data

      return res.json({
        success: true,
        labels,
        data,
        stocks,
      });
    } else {
      return res.json({
        success: false,
        message: 'Oops! Something went wrong. Chart data not found.',
      });
    }
  } catch (error) {
    handleError(res, error);
  }
}
async function GetDisplayReport(req, res) {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const reportData = await getOrders(startDate, endDate);
    return res.status(200).json(reportData)
  } catch (error) {
    handleError(res, error)
  }
}

async function GetStocksReport(req, res) {
  try {
    const stockReport = await getProductStocks();
    if (!stockReport) {
      return res.status(400).json({ message: 'Unable to fetch stock details!' })
    }
    generateStocksReport(stockReport, res);
  } catch (error) {
    handleError(res, error)
  }
}

async function GetReport(req, res) {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    let reportData;
    if (startDate == 'null' && endDate === 'null') {
      reportData = await getOrderData();
      generateSalesReport(reportData, res);
    } else {
      reportData = await getOrders(startDate, endDate);
      generateSalesReport(reportData, res);
    }
  } catch (error) {
    handleError(res, error);
  }
}
async function GetReportExcel(req, res) {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    let reportData;
    if (startDate === 'null' && endDate === 'null') {
      reportData = await getOrderData();
    } else {
      reportData = await getOrders(startDate, endDate);
    }
    const workbook = await generateSalesReportExcel(reportData);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=sales-report.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    handleError(res, error);
  }
}


module.exports = {
  GetDashBoard,
  GetLogin,
  PostLogin,
  GetUsers,
  PutBlockUser,
  GetLogout,
  Get404,
  GetGraphData,
  GetChartData,
  GetReport,
  GetDisplayReport,
  GetStocksReport,
  GetReportExcel,
};
