import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        coverage: {
            exclude: [
                "src/cli.ts",
                "src/bin.ts",
                "src/generated/**",
                "src/types.ts",
            ],
            include: ["src/**/*.ts"],
            provider: "v8",
            reporter: [
                "text",
                "json-summary",
                "lcov",
                "cobertura",
            ],
            reportsDirectory: "coverage",
            thresholds: {
                branches: 85,
                functions: 90,
                lines: 90,
                statements: 90,
            },
        },
        environment: "node",
        include: ["test/**/*.test.ts"],
        outputFile: {
            junit: "reports/vitest/junit.xml",
        },
        reporters: ["default", "junit"],
        restoreMocks: true,
        slowTestThreshold: 1000,
    },
});
