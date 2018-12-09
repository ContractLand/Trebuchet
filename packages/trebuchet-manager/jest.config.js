module.exports = {
  testEnvironment: "node",
  testPathIgnorePatterns: ["node_modules", "e2e"],
  collectCoverage: true,
  coverageReporters: ["html", "lcov", "text", "clover"]
};
