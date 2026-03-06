export async function getRepoData(owner: string, repo: string) {
    const token = process.env.GITHUB_TOKEN;
    const headers: HeadersInit = {
        "Accept": "application/vnd.github.v3+json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    // 1. Fetch Repository Metadata
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    if (!repoRes.ok) throw new Error(`Failed to fetch repo: ${repoRes.statusText}`);
    const repoData = await repoRes.json();

    // 2. Fetch File Tree (Recursive, truncated)
    const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${repoData.default_branch}?recursive=1`, { headers });
    if (!treeRes.ok) throw new Error(`Failed to fetch tree: ${treeRes.statusText}`);
    const treeData = await treeRes.json();

    // 3. Fetch README (if exists)
    let readmeContent = "";
    try {
        const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers });
        if (readmeRes.ok) {
            const readmeJson = await readmeRes.json();
            readmeContent = Buffer.from(readmeJson.content, 'base64').toString('utf-8');
        }
    } catch (e) {
        console.warn("README fetch failed", e);
    }

    // 4. Fetch package.json (if exists/relevant for JS/TS)
    let packageJsonContent = "";
    try {
        const pkgRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/package.json`, { headers });
        if (pkgRes.ok) {
            const pkgJson = await pkgRes.json();
            packageJsonContent = Buffer.from(pkgJson.content, 'base64').toString('utf-8');
        }
    } catch (e) {
        console.warn("package.json fetch failed", e);
    }

    return {
        name: repoData.name,
        owner: repoData.owner.login,
        description: repoData.description,
        stars: repoData.stargazers_count,
        language: repoData.language,
        tree: (treeData.tree as { path: string }[]).map((t) => t.path).slice(0, 300), // Limit to top 300 files for context window
        readme: readmeContent.slice(0, 8000), // Limit README size
        packageJson: packageJsonContent
    };
}
