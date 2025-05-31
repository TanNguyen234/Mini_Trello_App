exports.getGitHubInfo = async (req, res) => {
  const { repositoryId } = req.params;

  try {
    const [branchesRes, pullsRes, issuesRes, commitsRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${repositoryId}/branches`),
      fetch(`https://api.github.com/repos/${repositoryId}/pulls`),
      fetch(`https://api.github.com/repos/${repositoryId}/issues`),
      fetch(`https://api.github.com/repos/${repositoryId}/commits`)
    ]);

    if (!branchesRes.ok || !pullsRes.ok || !issuesRes.ok || !commitsRes.ok) {
      throw new Error('One or more GitHub API requests failed');
    }

    // Parse all responses to JSON
    const [branches, pulls, issues, commits] = await Promise.all([
      branchesRes.json(),
      pullsRes.json(),
      issuesRes.json(),
      commitsRes.json()
    ]);

    res.status(200).json({
      repositoryId,
      branches: branches.map(b => ({
        name: b.name,
        lastCommitSha: b.commit.sha
      })),
      pulls: pulls.map(p => ({
        title: p.title,
        pullNumber: p.number
      })),
      issues: issues
        .filter(i => !i.pull_request)
        .map(i => ({
          title: i.title,
          issueNumber: i.number
        })),
      commits: commits.map(c => ({
        sha: c.sha,
        message: c.commit.message
      }))
    });
  } catch (err) {
    res.status(500).json({ error: "GitHub API failed", detail: err.message });
  }
};