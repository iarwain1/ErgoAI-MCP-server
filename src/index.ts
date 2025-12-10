#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { spawn, execSync } from "child_process";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";

// Configuration interface
interface ErgoConfig {
  ergoPath?: string;
  timeout?: number;
}

// Get ErgoAI executable path based on platform
function getErgoExecutable(customPath?: string): string {
  if (customPath && fs.existsSync(customPath)) {
    return customPath;
  }

  const platform = os.platform();
  const possiblePaths: string[] = [];

  if (platform === "win32") {
    // Windows paths
    const userHome = os.homedir();
    possiblePaths.push(
      path.join(userHome, "Coherent", "ErgoAI", "ErgoAI", "runergo.bat"),
      path.join(userHome, "Coherent", "ERGOAI", "ErgoAI", "runergo.bat"),
      "C:\\Coherent\\ErgoAI\\ErgoAI\\runergo.bat",
      "C:\\Coherent\\ERGOAI\\ErgoAI\\runergo.bat",
      path.join(
        process.env.PROGRAMFILES || "C:\\Program Files",
        "Coherent",
        "ErgoAI",
        "ErgoAI",
        "runergo.bat"
      )
    );

    // Check if runergo is in PATH
    try {
      execSync("where runergo.bat", { encoding: "utf8", stdio: "pipe" });
      return "runergo.bat";
    } catch {
      // Not in PATH, continue checking
    }
  } else {
    // Linux/Mac paths
    const userHome = os.homedir();
    possiblePaths.push(
      path.join(userHome, "Coherent", "ERGOAI", "ErgoAI", "runergo"),
      path.join(userHome, "Coherent", "ErgoAI", "ErgoAI", "runergo"),
      "/opt/Coherent/ERGOAI/ErgoAI/runergo",
      "/opt/Coherent/ErgoAI/ErgoAI/runergo",
      "/usr/local/Coherent/ERGOAI/ErgoAI/runergo",
      "/usr/local/Coherent/ErgoAI/ErgoAI/runergo"
    );

    // Check if runergo is in PATH
    try {
      execSync("which runergo", { encoding: "utf8", stdio: "pipe" });
      return "runergo";
    } catch {
      // Not in PATH, continue checking
    }
  }

  // Check each possible path
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  // Check environment variable
  const envPath = process.env.ERGOAI_PATH;
  if (envPath) {
    const executable =
      platform === "win32"
        ? path.join(envPath, "runergo.bat")
        : path.join(envPath, "runergo");
    if (fs.existsSync(executable)) {
      return executable;
    }
  }

  throw new Error(
    `ErgoAI executable not found. Please set the ERGOAI_PATH environment variable ` +
      `to the directory containing runergo (e.g., /path/to/ErgoAI/ErgoAI), ` +
      `or ensure runergo is in your system PATH.`
  );
}

// Execute ErgoAI command and return the result
async function executeErgo(
  command: string,
  options: {
    timeout?: number;
    workingDir?: string;
    ergoPath?: string;
  } = {}
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  const timeout = options.timeout || 30000;
  const ergoExe = getErgoExecutable(options.ergoPath);

  return new Promise((resolve, reject) => {
    const args = ["--noprompt", "-e", command];

    const proc = spawn(ergoExe, args, {
      cwd: options.workingDir || process.cwd(),
      shell: process.platform === "win32",
      env: { ...process.env },
    });

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    proc.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    const timer = setTimeout(() => {
      proc.kill("SIGTERM");
      reject(new Error(`ErgoAI execution timed out after ${timeout}ms`));
    }, timeout);

    proc.on("close", (code) => {
      clearTimeout(timer);
      resolve({
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        exitCode: code ?? 0,
      });
    });

    proc.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

// Execute multiple ErgoAI commands in sequence within a single session
async function executeErgoSession(
  commands: string[],
  options: {
    timeout?: number;
    workingDir?: string;
    ergoPath?: string;
  } = {}
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  const timeout = options.timeout || 60000;
  const ergoExe = getErgoExecutable(options.ergoPath);

  return new Promise((resolve, reject) => {
    const args = ["--noprompt"];

    const proc = spawn(ergoExe, args, {
      cwd: options.workingDir || process.cwd(),
      shell: process.platform === "win32",
      env: { ...process.env },
    });

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    proc.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    const timer = setTimeout(() => {
      proc.kill("SIGTERM");
      reject(new Error(`ErgoAI session timed out after ${timeout}ms`));
    }, timeout);

    // Send commands
    for (const cmd of commands) {
      proc.stdin.write(cmd + "\n");
    }

    // Send halt command to exit
    proc.stdin.write("\\halt.\n");
    proc.stdin.end();

    proc.on("close", (code) => {
      clearTimeout(timer);
      resolve({
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        exitCode: code ?? 0,
      });
    });

    proc.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

// Parse ErgoAI output to extract results and errors
function parseErgoOutput(output: string): {
  results: string[];
  warnings: string[];
  errors: string[];
  raw: string;
} {
  const lines = output.split("\n");
  const results: string[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Skip initialization messages
    if (
      trimmed.includes("Loading") &&
      (trimmed.includes(".xwam") || trimmed.includes(".P"))
    ) {
      continue;
    }

    // Detect warnings
    if (
      trimmed.toLowerCase().includes("warning") ||
      trimmed.startsWith("+++")
    ) {
      warnings.push(trimmed);
    }
    // Detect errors
    else if (
      trimmed.toLowerCase().includes("error") ||
      trimmed.startsWith("***") ||
      trimmed.includes("Syntax error") ||
      trimmed.includes("Undefined")
    ) {
      errors.push(trimmed);
    }
    // Regular output
    else {
      results.push(trimmed);
    }
  }

  return { results, warnings, errors, raw: output };
}

// Tool definitions
const tools: Tool[] = [
  {
    name: "run_ergo_query",
    description: `Execute an ErgoAI query and return the results.
The query should be valid ErgoAI syntax and must end with a period (.).
In ErgoAI, queries in the interactive shell do NOT use the ?- prefix.

Examples:
- "mortal(?X)." - Find all X that are mortal
- "john[age -> ?A]." - Get John's age
- "?X : Person." - Find all instances of Person class

The tool returns query results, any warnings, and any errors.`,
    inputSchema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description:
            "The ErgoAI query to execute. Must end with a period (.). Do NOT include the ?- prefix.",
        },
        module: {
          type: "string",
          description:
            'Optional module name to query against (default: "main")',
        },
        timeout: {
          type: "number",
          description:
            "Optional timeout in milliseconds (default: 30000, max: 300000)",
        },
        working_directory: {
          type: "string",
          description: "Optional working directory for file operations",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "run_ergo_file",
    description: `Load and execute an ErgoAI file (.ergo).
This loads the file into a module and optionally executes queries from it.

The file should contain valid ErgoAI code including facts, rules, and optionally queries.
Queries in files should use the ?- prefix.

Returns load status, any query results, warnings, and errors.`,
    inputSchema: {
      type: "object" as const,
      properties: {
        file_path: {
          type: "string",
          description:
            "Path to the .ergo file to load. Can be absolute or relative to the working directory.",
        },
        module: {
          type: "string",
          description:
            'Module name to load the file into (default: "main"). Use different modules to organize knowledge.',
        },
        queries: {
          type: "array",
          items: { type: "string" },
          description:
            "Optional array of queries to execute after loading the file. Each query must end with a period.",
        },
        timeout: {
          type: "number",
          description:
            "Optional timeout in milliseconds (default: 60000, max: 300000)",
        },
        working_directory: {
          type: "string",
          description:
            "Optional working directory. If not specified, uses the directory containing the file.",
        },
      },
      required: ["file_path"],
    },
  },
  {
    name: "run_ergo_code",
    description: `Execute inline ErgoAI code (facts, rules, and queries).
This is useful for testing small code snippets or adding facts/rules dynamically.

The code can include:
- Facts: "man(socrates)."
- Rules: "mortal(?X) :- man(?X)."
- Queries: Use run_ergo_query for queries, or include them prefixed with ?- here

Returns execution results, warnings, and errors.`,
    inputSchema: {
      type: "object" as const,
      properties: {
        code: {
          type: "string",
          description:
            "ErgoAI code to execute. Can include facts, rules, and queries. Each statement must end with a period.",
        },
        module: {
          type: "string",
          description:
            'Module to execute the code in (default: "main"). Different modules provide separate namespaces.',
        },
        timeout: {
          type: "number",
          description:
            "Optional timeout in milliseconds (default: 60000, max: 300000)",
        },
        working_directory: {
          type: "string",
          description: "Optional working directory for any file operations",
        },
      },
      required: ["code"],
    },
  },
  {
    name: "check_ergo_syntax",
    description: `Check ErgoAI code for syntax errors without executing it.
This compiles the code and reports any syntax errors or warnings.

Useful for validating code before execution.`,
    inputSchema: {
      type: "object" as const,
      properties: {
        code: {
          type: "string",
          description: "ErgoAI code to check for syntax errors",
        },
        timeout: {
          type: "number",
          description: "Optional timeout in milliseconds (default: 30000)",
        },
      },
      required: ["code"],
    },
  },
  {
    name: "get_ergo_help",
    description: `Get help information about ErgoAI shell commands and syntax.
Returns the built-in help documentation from ErgoAI.`,
    inputSchema: {
      type: "object" as const,
      properties: {
        topic: {
          type: "string",
          description:
            'Optional help topic. Leave empty for general help, or specify a topic like "load", "query", etc.',
        },
      },
      required: [],
    },
  },
];

// Create and configure the MCP server
const server = new Server(
  {
    name: "ergoai-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "run_ergo_query": {
        const query = args?.query as string;
        const module = (args?.module as string) || "main";
        const timeout = Math.min(
          (args?.timeout as number) || 30000,
          300000
        );
        const workingDir = args?.working_directory as string | undefined;

        if (!query) {
          throw new Error("Query is required");
        }

        // Ensure query ends with period
        const cleanQuery = query.trim().endsWith(".")
          ? query.trim()
          : query.trim() + ".";

        // Build command: if module is specified and not main, use module context
        let command: string;
        if (module && module !== "main") {
          command = `${cleanQuery.replace(/\.$/, "")}@${module}. \\halt.`;
        } else {
          command = `${cleanQuery} \\halt.`;
        }

        const result = await executeErgo(command, {
          timeout,
          workingDir,
        });

        const parsed = parseErgoOutput(result.stdout + "\n" + result.stderr);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: result.exitCode === 0 && parsed.errors.length === 0,
                  query: cleanQuery,
                  module,
                  results: parsed.results,
                  warnings: parsed.warnings,
                  errors: parsed.errors,
                  raw_output: parsed.raw,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "run_ergo_file": {
        const filePath = args?.file_path as string;
        const module = (args?.module as string) || "main";
        const queries = (args?.queries as string[]) || [];
        const timeout = Math.min(
          (args?.timeout as number) || 60000,
          300000
        );
        let workingDir = args?.working_directory as string | undefined;

        if (!filePath) {
          throw new Error("file_path is required");
        }

        // Resolve file path
        const absolutePath = path.isAbsolute(filePath)
          ? filePath
          : path.resolve(workingDir || process.cwd(), filePath);

        if (!fs.existsSync(absolutePath)) {
          throw new Error(`File not found: ${absolutePath}`);
        }

        // Use file's directory as working directory if not specified
        if (!workingDir) {
          workingDir = path.dirname(absolutePath);
        }

        // Build commands
        const commands: string[] = [];

        // Load the file
        const fileName = path.basename(absolutePath);
        if (module && module !== "main") {
          commands.push(`['${fileName}' >> ${module}].`);
        } else {
          commands.push(`['${fileName}'].`);
        }

        // Add queries
        for (const q of queries) {
          const cleanQ = q.trim().endsWith(".") ? q.trim() : q.trim() + ".";
          if (module && module !== "main") {
            commands.push(`${cleanQ.replace(/\.$/, "")}@${module}.`);
          } else {
            commands.push(cleanQ);
          }
        }

        const result = await executeErgoSession(commands, {
          timeout,
          workingDir,
        });

        const parsed = parseErgoOutput(result.stdout + "\n" + result.stderr);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: result.exitCode === 0 && parsed.errors.length === 0,
                  file: absolutePath,
                  module,
                  queries_executed: queries,
                  results: parsed.results,
                  warnings: parsed.warnings,
                  errors: parsed.errors,
                  raw_output: parsed.raw,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "run_ergo_code": {
        const code = args?.code as string;
        const module = (args?.module as string) || "main";
        const timeout = Math.min(
          (args?.timeout as number) || 60000,
          300000
        );
        const workingDir = args?.working_directory as string | undefined;

        if (!code) {
          throw new Error("code is required");
        }

        // Create a temporary file with the code
        const tmpDir = os.tmpdir();
        const tmpFile = path.join(
          tmpDir,
          `ergo_temp_${Date.now()}_${Math.random().toString(36).slice(2)}.ergo`
        );

        try {
          fs.writeFileSync(tmpFile, code, "utf8");

          // Build commands to load and execute
          const commands: string[] = [];
          if (module && module !== "main") {
            commands.push(`['${tmpFile}' >> ${module}].`);
          } else {
            commands.push(`['${tmpFile}'].`);
          }

          const result = await executeErgoSession(commands, {
            timeout,
            workingDir,
          });

          const parsed = parseErgoOutput(result.stdout + "\n" + result.stderr);

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    success:
                      result.exitCode === 0 && parsed.errors.length === 0,
                    module,
                    results: parsed.results,
                    warnings: parsed.warnings,
                    errors: parsed.errors,
                    raw_output: parsed.raw,
                  },
                  null,
                  2
                ),
              },
            ],
          };
        } finally {
          // Clean up temp file
          try {
            fs.unlinkSync(tmpFile);
          } catch {
            // Ignore cleanup errors
          }
        }
      }

      case "check_ergo_syntax": {
        const code = args?.code as string;
        const timeout = Math.min((args?.timeout as number) || 30000, 300000);

        if (!code) {
          throw new Error("code is required");
        }

        // Create a temporary file with the code
        const tmpDir = os.tmpdir();
        const tmpFile = path.join(
          tmpDir,
          `ergo_syntax_${Date.now()}_${Math.random().toString(36).slice(2)}.ergo`
        );

        try {
          fs.writeFileSync(tmpFile, code, "utf8");

          // Use compile command to check syntax without loading
          const command = `compile{'${tmpFile}'}. \\halt.`;

          const result = await executeErgo(command, { timeout });

          const parsed = parseErgoOutput(result.stdout + "\n" + result.stderr);

          const hasSyntaxErrors = parsed.errors.some(
            (e) =>
              e.toLowerCase().includes("syntax") ||
              e.toLowerCase().includes("error")
          );

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    valid: !hasSyntaxErrors,
                    warnings: parsed.warnings,
                    errors: parsed.errors,
                    raw_output: parsed.raw,
                  },
                  null,
                  2
                ),
              },
            ],
          };
        } finally {
          // Clean up temp file
          try {
            fs.unlinkSync(tmpFile);
          } catch {
            // Ignore cleanup errors
          }
        }
      }

      case "get_ergo_help": {
        const topic = args?.topic as string | undefined;

        let command: string;
        if (topic) {
          command = `\\help(${topic}). \\halt.`;
        } else {
          command = `\\help. \\halt.`;
        }

        const result = await executeErgo(command, { timeout: 15000 });

        return {
          content: [
            {
              type: "text",
              text: result.stdout || result.stderr || "No help available",
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: errorMessage,
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("ErgoAI MCP Server started");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
