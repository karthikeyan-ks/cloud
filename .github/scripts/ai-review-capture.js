module.exports = async ({ github, context, core }) => {
    const { ISSUE_TITLE, ISSUE_MESSAGE } = process.env;
    const commitSha = context.sha;
    const actor = context.actor;

    // --- 1. RETRY LOGIC: Wait for Codex to finish ---
    let codexCheck = null;
    const maxRetries = 3;
    const delay = 20000; // 20 seconds between checks

    for (let i = 0; i < maxRetries; i++) {
        console.log(`Checking for Codex results (Attempt ${i + 1}/${maxRetries})...`);
        
        const { data: checks } = await github.rest.checks.listForRef({
            owner: context.repo.owner,
            repo: context.repo.repo,
            ref: commitSha,
        });

        // Looking for the Codex Check Run
        codexCheck = checks.check_runs.find(run => 
            run.name.toLowerCase().includes('codex') || 
            (run.app && run.app.name.toLowerCase().includes('chatgpt'))
        );

        // If found and has content, we're good to go
        if (codexCheck && codexCheck.output && codexCheck.output.summary) {
            console.log("✅ Codex review found!");
            break;
        }

        if (i < maxRetries - 1) {
            console.log(`Waiting ${delay/1000}s for Codex to respond...`);
            await new Promise(r => setTimeout(r, delay));
        }
    }

    // --- 2. THE EXIT CONDITION ---
    if (!codexCheck || !codexCheck.output || !codexCheck.output.summary) {
        core.info("⏭️ No Codex review found after waiting. Skipping issue creation to avoid noise.");
        return; // EXIT HERE: No issue will be created
    }

    // --- 3. DATA PARSING (Only runs if Codex was found) ---
    let labels = ['automated-scan'];
    let finalBody = `**Detection in commit:** ${commitSha}\n**Triggered by:** @${actor}\n\n${ISSUE_MESSAGE}`;

    try {
        const jsonMatch = codexCheck.output.summary.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const codexData = JSON.parse(jsonMatch[0]);
            
            if (codexData.category) labels.push(codexData.category.toLowerCase());
            if (codexData.priority) labels.push(codexData.priority.toLowerCase());
            
            finalBody = `## 🤖 AI Analysis (${codexData.category || 'Review'})\n` +
                        `> **Summary:** ${codexData.summary}\n\n` +
                        `**💡 Suggestion:**\n${codexData.fix_suggestion}\n\n` +
                        `---\n${finalBody}`;
        } else {
            // Fallback if Codex provided text but no JSON
            finalBody = `## 🤖 Raw AI Summary\n${codexCheck.output.summary}\n\n---\n${finalBody}`;
            labels.push('needs-manual-review');
        }
    } catch (e) {
        core.warning("JSON parsing failed, using raw output.");
        finalBody = `## 🤖 Raw AI Summary\n${codexCheck.output.summary}\n\n---\n${finalBody}`;
    }

    // --- 4. CREATE THE ISSUE ---
    await github.rest.issues.create({
        owner: context.repo.owner,
        repo: context.repo.repo,
        title: ISSUE_TITLE,
        labels: [...new Set(labels)],
        body: finalBody,
        assignees: [actor]
    });
    
    core.info("🚀 Issue created successfully with Codex context.");
};