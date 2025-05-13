'use strict';
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
// MongoDB Connection:

const mongoose = require('mongoose');

const dbConnection = function () {
  // Connect:
  mongoose
    .connect(process.env.MONGODB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('* DB Connected * '.yellow.underline);
      require('./sync')(); // !!! It clear database.
    })
    .catch((err) => console.log('* DB Not Connected * '.red, err));
};

/* ------------------------------------------------------- */
module.exports = {
  mongoose,
  dbConnection,
};
