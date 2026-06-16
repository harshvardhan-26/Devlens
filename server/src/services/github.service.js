import axios from "axios";
import { httpError } from "../utils/httpError.js";

const IMPORTANT_EXTENSIONS = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".py",
  ".java",
  ".go",
  ".rb",
  ".php",
  ".cs",
  ".html",
  ".css",
  ".scss",
  ".json",
  ".md",
  ".yml",
  ".yaml",
  ".sql",
  ".prisma",
  ".env.example"
]);

const IMPORTANT_FILENAMES = new Set([
  "package.json",
  "vite.config.js",
  "vite.config.ts",
  "next.config.js",
  "tailwind.config.js",
  "README.md",
  "Dockerfile",
  "docker-compose.yml"
]);

const IGNORED_SEGMENTS = new Set([
  "node_modules",
  "dist",
  "build",
  ".git",
  ".next",
  ".nuxt",
  "coverage",
  "vendor",
  "target",
  ".venv",
  "__pycache__",
  "public/assets"
]);

const MAX_FILES = 35;
const MAX_FILE_BYTES = 24_000;
const MAX_TOTAL_CHARS = 120_000;

function githubHeaders() {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}` // 🔥 IMPORTANT
  };
}

export function parseGithubUrl(githubUrl) {
  try {
    const url = new URL(githubUrl);
    const [, owner, repoWithSuffix] = url.pathname.split("/");
    const repo = repoWithSuffix?.replace(/\.git$/, "");

    if (!owner || !repo || !url.hostname.includes("github.com")) {
      throw new Error("Invalid GitHub URL");
    }

    return { owner, repo };
  } catch {
    throw httpError(400, "Enter a valid GitHub repository URL.");
  }
}

function extensionFor(path) {
  const name = path.split("/").pop() || path;
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot) : name;
}

function isImportantFile(path) {
  const name = path.split("/").pop();
  const ext = extensionFor(path);
  const ignored = path.split("/").some((segment) => IGNORED_SEGMENTS.has(segment));

  return !ignored && (IMPORTANT_FILENAMES.has(name) || IMPORTANT_EXTENSIONS.has(ext));
}

function isMeaningfulFile(path) {
  const p = path.toLowerCase();

  // ❌ ignore junk
  if (
    p.includes("node_modules") ||
    p.includes("dist") ||
    p.includes("build") ||
    p.includes(".min.") ||
    p.endsWith(".lock") ||
    p.endsWith(".png") ||
    p.endsWith(".jpg") ||
    p.endsWith(".jpeg") ||
    p.endsWith(".gif") ||
    p.endsWith(".svg") ||
    p.endsWith(".ico")
  ) {
    return false;
  }

  // ✅ allow useful files only
  return isImportantFile(path);
}

function languageFor(path) {
  const ext = extensionFor(path).replace(".", "");
  const map = {
    js: "JavaScript",
    jsx: "React",
    ts: "TypeScript",
    tsx: "React TypeScript",
    py: "Python",
    html: "HTML",
    css: "CSS",
    scss: "SCSS",
    json: "JSON",
    md: "Markdown",
    yml: "YAML",
    yaml: "YAML",
    prisma: "Prisma"
  };
  return map[ext] || ext.toUpperCase();
}

function inferProjectType(files) {
  const paths = files.map((file) => file.path.toLowerCase());
  const hasFrontend = paths.some((path) => path.includes("src/") && /\.(jsx|tsx|css|html)$/.test(path));
  const hasBackend = paths.some((path) => /server|api|routes|controllers|models|express|fastapi|django/.test(path));

  if (hasFrontend && hasBackend) return "Full-stack";
  if (hasFrontend) return "Frontend";
  if (hasBackend) return "Backend";
  return "General software";
}

async function fetchTextFile(owner, repo, branch, path) {
  const encodedPath = path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${encodedPath}`;
  const response = await axios.get(url, {
    headers: githubHeaders(),
    responseType: "text",
    transformResponse: [(data) => data],
    timeout: 15_000,
    maxContentLength: MAX_FILE_BYTES
  });

  return String(response.data).slice(0, MAX_FILE_BYTES);
}

export async function extractRepository(githubUrl) {
  const { owner, repo } = parseGithubUrl(githubUrl);

  let repoResponse;

  try {
    repoResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: githubHeaders(),
        timeout: 15000
      }
    );
  } catch (err) {

    if (err.response?.status === 404) {
      throw httpError(
        404,
        "GitHub repository not found. Check the URL and try again."
      );
    }

    if (err.response?.status === 403) {
      throw httpError(
        403,
        "GitHub API rate limit reached. Please try again later."
      );
    }

    throw httpError(
      500,
      "Failed to access GitHub repository."
    );
  }

  const branch = repoResponse.data.default_branch;

  const treeResponse = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`,
    {
      headers: githubHeaders(),
      timeout: 20_000
    }
  );

  const candidates = treeResponse.data.tree
    .filter(
    (item) =>
    item.type === "blob" &&
    item.size <= MAX_FILE_BYTES &&
    isMeaningfulFile(item.path)
)
    .sort((a, b) => {
    const priority = (file) => {
    const name = file.path.toLowerCase();

    if (name.includes("index") || name.includes("app")) return 0;
    if (name.endsWith(".js") || name.endsWith(".ts")) return 1;
    if (name.endsWith(".html")) return 2;
    if (name.endsWith(".css")) return 3;
    return 5;
  };

  return priority(a) - priority(b) || a.path.length - b.path.length;
})
    .slice(0, MAX_FILES);

  const files = [];
  let totalChars = 0;

  // 🔥 NEW: per-file content limit
  const MAX_FILE_CONTENT = 3000;

  for (const file of candidates) {
    if (totalChars >= MAX_TOTAL_CHARS) break;

    try {
      const content = await fetchTextFile(owner, repo, branch, file.path);

      const available = MAX_TOTAL_CHARS - totalChars;

      // ✅ FIX: first limit per file, then apply global cap
      const perFileLimited = content.slice(0, MAX_FILE_CONTENT);
      const sliced = perFileLimited.slice(0, available);

      files.push({
        path: file.path,
        language: languageFor(file.path),
        bytes: Buffer.byteLength(sliced, "utf8"),
        content: sliced
      });

      totalChars += sliced.length;

    } catch {
      // Skip files that cannot be fetched or decoded
    }
  }

  if (!files.length) {
    throw httpError(
      422,
      "No analyzable source files were found in this repository."
    );
  }

  return {
    projectName: repoResponse.data.name,
    githubUrl,
    projectType: inferProjectType(files),
    files
  };
}

export function extractUploadedFiles(uploadedFiles) {
  const files = uploadedFiles
    .filter((file) => isImportantFile(file.originalname) && file.size <= MAX_FILE_BYTES)
    .slice(0, MAX_FILES)
    .map((file) => ({
      path: file.originalname,
      language: languageFor(file.originalname),
      bytes: file.size,
      content: file.buffer.toString("utf8").slice(0, MAX_FILE_BYTES)
    }));

  if (!files.length) {
    throw httpError(422, "Upload source files such as .js, .tsx, .py, .html, .css, .json, or README files.");
  }

  return {
    projectName: "Uploaded Project",
    sourceType: "upload",
    projectType: inferProjectType(files),
    files
  };
}
