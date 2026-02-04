exports.notFound = (req, res) => {
  res.status(404).render("error", { status: 404, message: "Page not found." });
};

exports.errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).render("error", {
    status: err.statusCode || 500,
    message: err.message || "Server error."
  });
};
