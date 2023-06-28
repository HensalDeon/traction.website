const { handleError } = require('../middlewares/error.handler');

const {
  fetchAllUsers,
  findUserWithId,
  getGraphData,
  getChartData,
  getDashBoardData,
} = require('../models/admin.model');

// const { generateSalesReport } = require('../config/pdfKit');
const { getOrderData } = require('../models/order.model');

/**
 * This function renders the admin dashboard page in response to an HTTP GET request.
 * @param req - The `req` parameter is an object that represents the HTTP request made by the client to
 * the server. It contains information such as the request method, URL, headers, and any data sent in
 * the request body.
 * @param res - The `res` parameter is an object that represents the HTTP response that will be sent
 * back to the client. It contains methods and properties that allow the server to send data, headers,
 * and status codes back to the client. In this case, the `res` object is being used to render a
 */
async function httpGetDashBoard(req, res) {
  try {
    const result = await getDashBoardData();
    res.render('admin/dashboard', {
      totalRevenue: result.totalRevenue,
      totalOrdersCount: result.totalOrdersCount,
      totalProductsCount: result.totalProductsCount,
      totalCategoriesCount: result.totalCategoriesCount,
      currentMonthEarnings: result.currentMonthEarnings,
      activePage:'dashboard'
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

async function httpGetLogin(req, res) {
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
async function httpPostLogin(req, res) {
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
async function httpGetUsers(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const response = await fetchAllUsers(page, limit);
    if (response.status) {
      res.render('admin/users', {
        users: response.users,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        limit: response.limit,
        activePage:'users'
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
async function httpPutBlockUser(req, res) {
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

async function httpGetLogout(req, res) {
  try {
    req.session.destroy();
    res.redirect('/admin/login');
  } catch (error) {
    handleError(res, error);
  }
}

async function httpGet404(req, res) {
  try {
    res.render('admin/404');
  } catch (error) {
    handleError(res, error);
  }
}

//chart data
async function httpGetGraphData(req, res) {
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
async function httpGetChartData(req, res) {
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

async function httpGetReport(req, res) {
  try {
    const reportData = await getOrderData();
     generateSalesReport(reportData, res);
  } catch (error) {
    handleError(res, error);
  }
}

module.exports = {
  httpGetDashBoard,
  httpGetLogin,
  httpPostLogin,
  httpGetUsers,
  httpPutBlockUser,
  httpGetLogout,
  httpGet404,
  httpGetGraphData,
  httpGetChartData,
  httpGetReport,
};
