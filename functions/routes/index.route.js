const boardRoute = require('./board.route');

module.exports = (app) => {

    app.use("/boards", boardRoute)
}