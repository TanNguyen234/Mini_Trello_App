const boardRoute = require('./board.route');
const cardRoute = require('./card.route')

module.exports = (app) => {

    app.use("/boards", boardRoute)
    app.use("/boards/:boardId", cardRoute)
}