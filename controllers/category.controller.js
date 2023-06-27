const { handleError } = require('../middlewares/error.handler');

const {
  fetchCategories,
  addCategory,
  updateCategory,
} = require('../models/category.model');


/**
 * This function uses async/await to fetch categories and render them on an admin page, handling errors
 * if they occur.
 * @param req - The `req` parameter is an object that represents the HTTP request made to the server.
 * It contains information such as the request method, URL, headers, and any data sent in the request
 * body.
 * @param res - `res` is the response object that is used to send the response back to the client. It
 * is an instance of the `http.ServerResponse` class in Node.js. The `res` object has methods like
 * `res.render()` to render a view template, `res.send()` to send a
 */
async function httpGetCategories(req, res) {
  try {
    const response = await fetchCategories();
    if (response.status) {
      res.render('admin/categories', { category: response.categories ,activePage:'categories'
    });
    } else {
      res.render('admin/categories', { category: [] });
    }
  } catch (error) {
    handleError(res, error);
  }
}
/**
 * This is an asynchronous function that handles a HTTP POST request to add a category and returns a
 * JSON response with a status and message.
 * @param req - The `req` parameter is an object that represents the HTTP request made to the server.
 * It contains information such as the request method, headers, URL, and request body. In this case,
 * the `req` object is used to extract the `name` property from the request body.
 * @param res - The `res` parameter in this function refers to the response object that will be sent
 * back to the client making the HTTP request. It is used to send the response data back to the client
 * in the form of JSON data.
 */

async function httpPostCategories(req, res) {
  const { name } = req.body;
  try {
    const response = await addCategory(name);
    if (response.status) {
      res.json({ status: true,message:response.message });
    } else {
      res.json({ status: false ,message: response.message});
    }
  } catch (error) {
    handleError(res, error);
  }
}
/**
 * This is an asynchronous function that updates the status of a category and returns a JSON response
 * indicating whether the update was successful or not.
 * @param req - The request object containing information about the HTTP request made to the server.
 * @param res - The "res" parameter in the function represents the response object that will be sent
 * back to the client making the HTTP request. It is used to send the HTTP response back to the client
 * with the appropriate status code and response data.
 */

async function httpPutCategory(req, res) {
  const  {id,status}  = req.body;
  try {
    const response = await updateCategory(id,status);
    if(response.status){
      res.status(200).json({status:true});
    }else{
      res.status(400).json({status:false});
    }
  } catch (error) {
    handleError(res,error);
  }
}

module.exports = {
  httpGetCategories,
  httpPostCategories,
  httpPutCategory,
};
