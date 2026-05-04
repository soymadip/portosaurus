export function looksLikeTestProject(projectName) {
  const testTerms = [
    "test",
    "testing",
    "spec",
    "specs",
    "ci",
    "demo",
    "example",
  ];
  const n = String(projectName).toLowerCase();

  if (!projectName) {
    return false;
  }

  return testTerms.some((t) => n.includes(t));
}

export default looksLikeTestProject;
