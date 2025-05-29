const authRoute = require('./auth.route');
const boardRoute = require('./board.route');

module.exports = (app) => {

    app.use("/auth", authRoute)
    app.use("/boards", boardRoute)
}