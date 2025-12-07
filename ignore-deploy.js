const allowed = ["main", "master", "dev", "development", "production"];

const branch = process.env.VERCEL_GIT_COMMIT_REF;

if (!allowed.includes(branch)) {
  console.log(`Ignoring deployment for branch: ${branch}`);
  process.exit(1);
}

console.log(`Deployment allowed for branch: ${branch}`);
process.exit(0);
