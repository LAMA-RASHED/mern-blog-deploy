"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
// app.use(errorHandler):

module.exports = (err, req, res, next) => {

    return res.status(err?.statusCode || 500).send({
        error: true,
        success: false,
        message: err.message || 'Something went wrong',
        cause: err.cause,
        body: req.body,
        stack: err.stack,
    });
}
