const boardRoute = require('./board.route');
const cardRoute = require('./card.route')
const taskRoute = require('./task.route')
const githubAttachment = require('./githubAttachment.route')
const githubRepo = require('./githubRepo.route')

module.exports = (app) => {

    app.use("/boards", boardRoute)
    app.use("/boards/:boardId", cardRoute)
    app.use("/boards/:boardId/cards/:id/tasks", taskRoute)
    app.use("/boards/:boardId/cards/:cardId/tasks/:taskId", githubAttachment)
    app.use("/", githubRepo)
}