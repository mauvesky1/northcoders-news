exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status !== undefined) {
    const { status, msg } = err;
    res.status(status).send({ msg });
  } else {
    next(err);
  }
};

exports.notFoundHandler = (err, req, res, next) => {
  const { status, msg } = err;
  if (status !== undefined) {
    res.status(status).send({ msg });
  }
};

exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code) {
    const errorCodes = {
      "22P02": { status: 400, msg: "Invalid input" },
      "23503": {
        status: 404,
        msg:
          "Not Found; either a parameter does not exist or the body is missing a necessary key"
      },
      "42703": { status: 404, msg: "Not Found in database" }
    };
    const msg = errorCodes[err.code].msg;
    const status = errorCodes[err.code].status;

    res.status(status).send({ msg });
  } else {
    next(err);
  }
};
exports.methodNotAllowed = (req, res, next) => {
  res.status(405).send();
};
