module.exports = async ({github, context, core}) => {
  const { ISSUE_TITLE, ISSUE_MESSAGE } = process.env;
  const commitSha = context.sha;
  const actor = context.actor;
  
  // 1. Search for existing open issue with this title
  const searchQuery = `repo:${context.repo.owner}/${context.repo.repo} type:issue state:open in:title "${ISSUE_TITLE}"`;
  
  const searchResult = await github.rest.search.issuesAndPullRequests({
    q: searchQuery
  });

  if (searchResult.data.total_count > 0) {
    const existingIssueNumber = searchResult.data.items[0].number;
    console.log(`Matching issue found: #${existingIssueNumber}. Adding comment.`);
    
    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: existingIssueNumber,
      body: `⚠️ **Re-detected** in commit ${commitSha} by @${actor}.\n\n${ISSUE_MESSAGE}`
    });
  } else {
    console.log("No matching issue found. Creating new one.");
    await github.rest.issues.create({
      owner: context.repo.owner,
      repo: context.repo.repo,
      title: ISSUE_TITLE,
      assignees: [actor],
      labels: ['security', 'automated-alert'],
      body: `Initial detection in commit ${commitSha} by @${actor}.\n\n${ISSUE_MESSAGE}`
    });
  }
};