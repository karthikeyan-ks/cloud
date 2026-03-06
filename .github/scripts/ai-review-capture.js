module.exports = async ({ github, context, core }) => {
    const { ISSUE_TITLE, ISSUE_MESSAGE } = process.env;
    const commitSha = context.sha;

    // 1. Fetch Codex Review
    const { data: checks } = await github.rest.checks.listForRef({
        owner: context.repo.owner,
        repo: context.repo.repo,
        ref: commitSha,
    });

    const codexCheck = checks.check_runs.find(run => 
        run.name.toLowerCase().includes('codex') || run.app.name.toLowerCase().includes('chatgpt')
    );

    let labels = ['automated-scan'];
    let finalBody = ISSUE_MESSAGE;

    if (codexCheck && codexCheck.output && codexCheck.output.summary) {
        try {
            // Extract JSON from Codex summary (looks for text between { and })
            const jsonMatch = codexCheck.output.summary.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const codexData = JSON.parse(jsonMatch[0]);
                
                // Use Codex's category as the label!
                labels.push(codexData.category); 
                labels.push(codexData.priority);
                
                finalBody = `### 🤖 AI Analysis\n**Summary:** ${codexData.summary}\n\n**Suggestion:** ${codexData.fix_suggestion}\n\n---\n${ISSUE_MESSAGE}`;
            }
        } catch (e) {
            console.log("Could not parse Codex JSON, falling back to default labels.");
            labels.push('security'); // fallback
        }
    }

    // 2. Create the Issue with Dynamic Labels
    await github.rest.issues.create({
        owner: context.repo.owner,
        repo: context.repo.repo,
        title: ISSUE_TITLE,
        labels: labels,
        body: finalBody
    });
}