const boardRoute = require('./board.route');
const cardRoute = require('./card.route')
const taskRoute = require('./task.route')

module.exports = (app) => {

    app.use("/boards", boardRoute)
    app.use("/boards/:boardId", cardRoute)
    app.use("/boards/:boardId/cards/:id/tasks", taskRoute)
}