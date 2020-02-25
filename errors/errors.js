exports.handleCustomErrors = (err, req, res, next) => {
  const { status, msg } = err;
  if (status !== undefined) {
    res.status(status).send({ msg });
  } else {
    next(err);
  }
};

exports.notFoundHandler = (err, req, res, next) => {
  console.log(err);
  const { status, msg } = err;
  if (status !== undefined) {
    res.status(status).send({ msg });
  }
};

exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code) {
    const errorCodes = { "22P02": { status: 400, msg: "Invalid input" } };
    const msg = errorCodes[err.code].msg;
    const status = errorCodes[err.code].status;
    res.status(status).send({ msg });
  } else {
    next(err);
  }
};
