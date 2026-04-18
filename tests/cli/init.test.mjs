import { test, expect, describe, beforeAll, afterAll, spyOn } from "bun:test";
import { initCommand } from "../../src/cli/init.mjs";
import fs from "fs";
import path from "path";
import os from "os";
import { logger } from "../../src/core/logger.mjs";

// Silent logger for tests
spyOn(logger, "info").mockImplementation(() => {});
spyOn(logger, "success").mockImplementation(() => {});
spyOn(logger, "error").mockImplementation(() => {});
spyOn(logger, "box").mockImplementation(() => {});
spyOn(logger, "tip").mockImplementation(() => {});

describe("CLI: init", () => {
  let testRoot;
  let originalExit;
  let originalCwd;

  beforeAll(() => {
    testRoot = fs.mkdtempSync(path.join(os.tmpdir(), "porto-cli-test-"));
    originalExit = process.exit;
    originalCwd = process.cwd();
    process.chdir(testRoot);
  });

  afterAll(() => {
    process.chdir(originalCwd);
    process.exit = originalExit;
    fs.rmSync(testRoot, { recursive: true, force: true });
  });

  test("should initialize a new project with correct structure", async () => {
    const projectName = "fresh-project";
    const projectPath = path.join(testRoot, projectName);

    // Mock exit to prevent killing the test runner
    process.exit = (code) => {
      if (code !== 0) throw new Error(`Exit called with code ${code}`);
    };

    await initCommand(projectName, { install: false, githubPages: true });

    // 1. Check directories
    expect(fs.existsSync(projectPath)).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "notes"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "blog"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "static"))).toBe(true);

    // 2. Check essential files
    expect(fs.existsSync(path.join(projectPath, "package.json"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, "config.js"))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, ".gitignore"))).toBe(true);

    // 3. Verify package.json customization
    const pkg = JSON.parse(
      fs.readFileSync(path.join(projectPath, "package.json"), "utf8"),
    );
    expect(pkg.name).toBe(projectName);
    expect(pkg.dependencies.portosaurus).toBeDefined();

    // 4. Verify config.js customization
    const config = fs.readFileSync(path.join(projectPath, "config.js"), "utf8");
    expect(config).toContain(`title: "${projectName}"`);
  });

  test("should fail if directory already exists", async () => {
    const projectName = "existing-project";
    fs.mkdirSync(path.join(testRoot, projectName));

    let exitCode = 0;
    process.exit = (code) => {
      exitCode = code;
      throw new Error("Exit called");
    };

    try {
      await initCommand(projectName, { install: false });
    } catch (e) {
      // Expected catch from the throw in mocked exit
    }

    expect(exitCode).toBe(1);
  });
});
