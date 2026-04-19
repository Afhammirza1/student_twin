function success(res, data = {}, message = "Success") {
  return res.json({
    success: true,
    message,
    data,
  });
}

function error(res, message = "Error", status = 400) {
  return res.status(status).json({
    success: false,
    message,
  });
}

module.exports = { success, error, failure: error };
