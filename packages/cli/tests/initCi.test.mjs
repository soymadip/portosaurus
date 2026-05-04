import {
  test,
  expect,
  describe,
  beforeAll,
  afterAll,
  afterEach,
  mock,
} from "bun:test";
import { initCiCommand } from "../src/commands/initCi.mjs";
import fs from "fs";
import path from "path";
import os from "os";

let currentWizardMock = async () => ({
  hostingPlatform: "github-pages",
  confirm: true,
});

mock.module("@portosaur/wizard", () => {
  return {
    runWizard: async (opts) => currentWizardMock(opts),
    spinner: () => ({ start: () => {}, stop: () => {} }),
    intro: () => {},
    outro: () => {},
  };
});

// Mock utils
const cliSrcDir = path.resolve(import.meta.dirname, "../src");
const cliPkgDir = path.resolve(import.meta.dirname, "..");

mock.module("../src/utils/index.mjs", () => {
  return {
    detectVcsProvider: () => "github",
    getGitConfig: () => ({ "user.name": "Test User" }),
    resolvePlatformKey: (platforms, key) => {
      if (!key) return null;
      if (platforms[key]) return key;
      const found = Object.keys(platforms).find(
        (k) => k.toLowerCase() === key.toLowerCase(),
      );
      return found || null;
    },
    getPlatformUserGuess: () => "testuser",
    validateProject: () => true, // Assume project is valid
    printWorkflowTips: () => {},
    warnIfRepoNameMismatch: () => {},
    isInteractive: (options) => !options.hosting,
    Paths: {
      root: cliPkgDir,
      templates: path.join(cliSrcDir, "templates"),
      registry: path.join(cliSrcDir, "templates/registry.yml"),
      workflows: path.join(cliSrcDir, "templates/workflows"),
      packageJson: path.join(cliPkgDir, "package.json"),
    },
  };
});

describe("CLI: init-ci", () => {
  let testRoot;
  let originalExit;
  let originalCwd;

  beforeAll(() => {
    testRoot = fs.mkdtempSync(path.join(os.tmpdir(), "porto-ci-test-"));
    originalExit = process.exit;
    originalCwd = process.cwd();
    process.chdir(testRoot);

    // Create a fake project structure
    fs.writeFileSync(
      path.join(testRoot, "config.yml"),
      "site: { title: 'Test' }",
    );
  });

  afterAll(() => {
    process.chdir(originalCwd);
    process.exit = originalExit;
    fs.rmSync(testRoot, { recursive: true, force: true });
  });

  afterEach(() => {
    process.exit = originalExit;
  });

  test("should setup CI for GitHub Pages (Interactive)", async () => {
    currentWizardMock = async () => ({
      hostingPlatform: "github-pages",
      confirm: true,
    });

    await initCiCommand({});

    expect(
      fs.existsSync(path.join(testRoot, ".github/workflows/deploy.yml")),
    ).toBe(true);
  });

  test("should setup CI for GitLab Pages (Non-Interactive)", async () => {
    await initCiCommand({ hosting: "gitlab-pages" });

    expect(fs.existsSync(path.join(testRoot, ".gitlab-ci.yml"))).toBe(true);
  });

  test("should fail for invalid hosting platform", async () => {
    let exitCode = 0;
    process.exit = (code) => {
      exitCode = code;
      throw new Error("Exit called");
    };

    try {
      await initCiCommand({ hosting: "invalid-platform" });
    } catch (e) {}

    expect(exitCode).toBe(1);
  });
});
