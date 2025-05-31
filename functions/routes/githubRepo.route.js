const express = require("express");
const controller = require("../controllers/githubRepo.controller.js");

const router = express.Router();

router.get("/repositories/:repositoryId/github-info", controller.getGitHubInfo);

module.exports = router;