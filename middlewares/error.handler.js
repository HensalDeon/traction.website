function handleError(res, error) {
  console.error('💥',error);
  res.status(500).json({status:false,message: error?.message });
}
module.exports = { handleError };
