const fs = require('fs');
const path = require('path');
const https = require('https');

const TOKEN = process.env.VERCEL_TOKEN || 'paste-your-token-here';
const DEPLOYMENT_ID = 'dpl_7tBKZWaWA52fZrTFURyR6Dt1CEko';
const TEAM_ID = 'team_VdnELEXYdklAFHvFPML6fRtD';
const OUTPUT_DIR = path.join(__dirname, 'recovered-code');
const CONCURRENCY = 10;

const SKIP_FOLDERS = new Set(['node_modules', 'dist', '.tanstack', '.git']);

function apiGet(urlPath) {
  return new Promise((resolve, reject) => {
    const separator = urlPath.includes('?') ? '&' : '?';
    const fullPath = `${urlPath}${separator}teamId=${TEAM_ID}`;
    https.get({
      hostname: 'api.vercel.com',
      path: fullPath,
      headers: { Authorization: `Bearer ${TOKEN}` }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

function shouldSkip(filePath) {
  return filePath.split('/').some(part => SKIP_FOLDERS.has(part));
}

async function downloadFile(fileId, filePath) {
  const fullPath = path.join(OUTPUT_DIR, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  const content = await apiGet(`/v7/deployments/${DEPLOYMENT_ID}/files/${fileId}`);
  if (!content.data) {
    console.log('Skipped (no data):', filePath);
    return;
  }
  fs.writeFileSync(fullPath, Buffer.from(content.data, 'base64'));
  console.log('Downloaded:', filePath);
}

function flattenTree(nodes, currentPath = '') {
  let files = [];
  for (const node of nodes) {
    const nodePath = currentPath ? `${currentPath}/${node.name}` : node.name;
    if (shouldSkip(nodePath)) continue;
    if (node.type === 'directory' && node.children) {
      files = files.concat(flattenTree(node.children, nodePath));
    } else if (node.type === 'file' && node.uid) {
      const fullPath = path.join(OUTPUT_DIR, nodePath);
      if (!fs.existsSync(fullPath)) {
        files.push({ uid: node.uid, path: nodePath });
      }
    }
  }
  return files;
}

async function runWithConcurrency(tasks, concurrency) {
  const results = [];
  for (let i = 0; i < tasks.length; i += concurrency) {
    const batch = tasks.slice(i, i + concurrency);
    results.push(...await Promise.all(batch.map(fn => fn().catch(e => e))));
  }
  return results;
}

async function main() {
  console.log('Fetching file tree...');
  const tree = await apiGet(`/v13/deployments/${DEPLOYMENT_ID}/files`);
  const rootNodes = Array.isArray(tree) ? tree : (tree.tree || []);
  const allFiles = flattenTree(rootNodes);
  console.log(`Found ${allFiles.length} files to download`);

  const tasks = allFiles.map(f => () => downloadFile(f.uid, f.path));
  await runWithConcurrency(tasks, CONCURRENCY);
  console.log('Done! Files saved to:', OUTPUT_DIR);
}

main().catch(console.error);
