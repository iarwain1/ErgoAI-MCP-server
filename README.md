# ErgoAI MCP Server

An MCP (Model Context Protocol) server that enables AI coding agents to interact with the [ErgoAI](https://github.com/ErgoAI) reasoning engine. This allows AI assistants like Claude, OpenAI Codex, and Gemini to run ErgoAI code, execute queries, and work with logic programming directly.

## What is MCP?

The [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) is an open standard that allows AI assistants to connect to external tools and data sources. Think of it as a universal adapter that lets AI coding agents interact with various services - in this case, the ErgoAI logic programming and reasoning engine.

## What is ErgoAI?

[ErgoAI](https://github.com/ErgoAI) is a powerful knowledge representation and reasoning system based on F-logic, HiLog, and Transaction Logic. It allows you to:

- Define facts and rules using logic programming
- Perform complex reasoning and inference
- Query knowledge bases
- Handle defeasible (non-monotonic) reasoning

## Prerequisites

Before using this MCP server, you need:

1. **ErgoAI installed on your system**
   - Download from the [official ErgoAI releases](https://github.com/ErgoAI/ErgoAI/releases)
   - Follow the installation instructions for your operating system (Windows, macOS, or Linux)
   - After installation, verify it works by running `runergo` from the command line

2. **Node.js 18 or higher**
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

3. **An AI coding agent that supports MCP**
   - Claude Code (CLI, VS Code extension, or Claude Desktop)
   - OpenAI Codex (via VS Code extension with MCP support)
   - Gemini Code Assist (via VS Code extension)

## Installation

### Option 1: Install from npm (Recommended)

```bash
npm install -g ergoai-mcp-server
```

### Option 2: Install from Source

```bash
# Clone the repository
git clone https://github.com/iarwain1/ErgoAI-MCP-server.git
cd ErgoAI-MCP-server

# Install dependencies
npm install

# Build the server
npm run build

# Optionally, link it globally
npm link
```

## Configuration

The server automatically searches for the ErgoAI installation in common locations:

**Windows:**
- `%USERPROFILE%\Coherent\ErgoAI\ErgoAI\runergo.bat`
- `C:\Coherent\ErgoAI\ErgoAI\runergo.bat`

**macOS/Linux:**
- `~/Coherent/ERGOAI/ErgoAI/runergo`
- `/opt/Coherent/ERGOAI/ErgoAI/runergo`

If ErgoAI is installed in a different location, set the `ERGOAI_PATH` environment variable to the directory containing the `runergo` executable:

```bash
# Linux/macOS
export ERGOAI_PATH=/path/to/ErgoAI/ErgoAI

# Windows (PowerShell)
$env:ERGOAI_PATH = "C:\path\to\ErgoAI\ErgoAI"

# Windows (Command Prompt)
set ERGOAI_PATH=C:\path\to\ErgoAI\ErgoAI
```

---

## Using with AI Coding Agents

### Claude Code

Claude Code is Anthropic's official AI coding assistant. There are several ways to use the ErgoAI MCP server with it:

#### Claude Code CLI

The Claude Code CLI is a command-line interface for Claude. To add the ErgoAI MCP server:

1. **Install Claude Code CLI** (if not already installed):
   ```bash
   npm install -g @anthropic-ai/claude-code
   ```

2. **Configure the MCP server** by editing your Claude Code settings file:

   **Location:**
   - macOS/Linux: `~/.claude/settings.json`
   - Windows: `%USERPROFILE%\.claude\settings.json`

   **Add the server configuration:**
   ```json
   {
     "mcpServers": {
       "ergoai": {
         "command": "npx",
         "args": ["ergoai-mcp-server"],
         "env": {
           "ERGOAI_PATH": "/path/to/ErgoAI/ErgoAI"
         }
       }
     }
   }
   ```

   Or if you installed from source:
   ```json
   {
     "mcpServers": {
       "ergoai": {
         "command": "node",
         "args": ["/path/to/ErgoAI-MCP-server/dist/index.js"],
         "env": {
           "ERGOAI_PATH": "/path/to/ErgoAI/ErgoAI"
         }
       }
     }
   }
   ```

3. **Start Claude Code** and the ErgoAI tools will be available

For more details, see the [Claude Code documentation](https://docs.anthropic.com/en/docs/claude-code).

#### Claude Code VS Code Extension

1. **Install the Claude Code extension** from the VS Code marketplace

2. **Open VS Code Settings** (Cmd/Ctrl + ,) and search for "MCP"

3. **Edit the MCP servers configuration** in your VS Code `settings.json`:
   ```json
   {
     "claude.mcpServers": {
       "ergoai": {
         "command": "npx",
         "args": ["ergoai-mcp-server"],
         "env": {
           "ERGOAI_PATH": "/path/to/ErgoAI/ErgoAI"
         }
       }
     }
   }
   ```

4. **Restart VS Code** to load the MCP server

For more details, see the [Claude Code VS Code extension documentation](https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code).

#### Claude Code on the Web

Claude Code on the web supports MCP servers through remote server connections. Currently, this requires:

1. Running the MCP server locally or on a server
2. Using a tunneling service or configuring remote access

For the most up-to-date instructions, see the [Claude Code web documentation](https://claude.ai/code).

#### Claude Desktop App

The Claude Desktop app has built-in MCP support:

1. **Open Claude Desktop settings** (click your profile icon → Settings)

2. **Navigate to the "Developer" section**

3. **Edit the MCP configuration file** at:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

   Add:
   ```json
   {
     "mcpServers": {
       "ergoai": {
         "command": "npx",
         "args": ["ergoai-mcp-server"],
         "env": {
           "ERGOAI_PATH": "/path/to/ErgoAI/ErgoAI"
         }
       }
     }
   }
   ```

4. **Restart Claude Desktop**

For more details, see the [MCP quickstart guide](https://modelcontextprotocol.io/quickstart/user).

---

### OpenAI Codex

OpenAI Codex can be used through various interfaces that support MCP:

#### VS Code with OpenAI Extension

If using an OpenAI-compatible VS Code extension that supports MCP:

1. **Check if your OpenAI extension supports MCP** - review its documentation

2. **Configure the MCP server** in your extension's settings. The exact location varies by extension, but typically involves adding to a configuration file:

   ```json
   {
     "mcp": {
       "servers": {
         "ergoai": {
           "command": "npx",
           "args": ["ergoai-mcp-server"],
           "env": {
             "ERGOAI_PATH": "/path/to/ErgoAI/ErgoAI"
           }
         }
       }
     }
   }
   ```

3. **Restart VS Code**

#### Using with OpenAI API Directly

If you're building custom applications with the OpenAI API that need ErgoAI integration, you can:

1. Run the MCP server as a subprocess
2. Use the MCP client SDK to communicate with it
3. Pass tool results to the OpenAI API

For implementation details, see the [MCP SDK documentation](https://github.com/modelcontextprotocol/sdk).

---

### Gemini Code Assist

Google's Gemini Code Assist can be configured to use MCP servers:

#### VS Code Extension

1. **Install Gemini Code Assist** from the VS Code marketplace

2. **Configure MCP servers** in your VS Code settings. Check the extension documentation for the exact setting name, but it typically follows this pattern:

   ```json
   {
     "gemini.mcpServers": {
       "ergoai": {
         "command": "npx",
         "args": ["ergoai-mcp-server"],
         "env": {
           "ERGOAI_PATH": "/path/to/ErgoAI/ErgoAI"
         }
       }
     }
   }
   ```

3. **Restart VS Code**

For the latest configuration instructions, see the [Gemini Code Assist documentation](https://cloud.google.com/gemini/docs/code-assist/overview).

---

## Available Tools

The ErgoAI MCP server provides the following tools to AI agents:

### `run_ergo_query`

Execute an ErgoAI query and return results.

**Parameters:**
- `query` (required): The ErgoAI query to execute. Must end with a period (`.`). Do NOT include the `?-` prefix.
- `module` (optional): Module name to query against (default: "main")
- `timeout` (optional): Timeout in milliseconds (default: 30000, max: 300000)
- `working_directory` (optional): Working directory for file operations

**Example queries:**
```ergo
// Find all X that are mortal
mortal(?X).

// Get John's age
john[age -> ?A].

// Find all instances of Person class
?X : Person.
```

### `run_ergo_file`

Load and execute an ErgoAI file (.ergo).

**Parameters:**
- `file_path` (required): Path to the .ergo file
- `module` (optional): Module to load the file into (default: "main")
- `queries` (optional): Array of queries to execute after loading
- `timeout` (optional): Timeout in milliseconds (default: 60000)
- `working_directory` (optional): Working directory

### `run_ergo_code`

Execute inline ErgoAI code (facts, rules, and queries).

**Parameters:**
- `code` (required): ErgoAI code to execute
- `module` (optional): Module to execute in (default: "main")
- `timeout` (optional): Timeout in milliseconds (default: 60000)
- `working_directory` (optional): Working directory

**Example:**
```ergo
// Define facts and rules
man(socrates).
mortal(?X) :- man(?X).

// Query (with ?- prefix in code)
?- mortal(?X).
```

### `check_ergo_syntax`

Check ErgoAI code for syntax errors without executing it.

**Parameters:**
- `code` (required): ErgoAI code to check
- `timeout` (optional): Timeout in milliseconds (default: 30000)

### `get_ergo_help`

Get help information about ErgoAI commands and syntax.

**Parameters:**
- `topic` (optional): Specific help topic

---

## Example Usage

Once configured, you can ask your AI coding agent to:

1. **Run a simple query:**
   > "Query ErgoAI to find all instances of the Person class"

2. **Load and query a file:**
   > "Load the family.ergo file and find all parent-child relationships"

3. **Write and test ErgoAI code:**
   > "Create ErgoAI rules to determine if someone is an ancestor, then test it"

4. **Debug ErgoAI code:**
   > "Check this ErgoAI code for syntax errors: mortal(?X) :- man(?X)"

---

## ErgoAI Quick Reference

For AI agents working with ErgoAI, here are key syntax points:

### Comments
```ergo
// Single-line comment
/* Multi-line
   comment */
```

### Facts
```ergo
man(socrates).
john[age -> 30].
john : Person.
```

### Rules
```ergo
mortal(?X) :- man(?X).
grandparent(?X, ?Z) :- parent(?X, ?Y), parent(?Y, ?Z).
```

### Queries (in files)
```ergo
?- mortal(?X).
```

### Queries (in shell/interactive)
```ergo
mortal(?X).
```

For comprehensive ErgoAI documentation, see the included `ErgoAI Guide for LLMs.md` file.

---

## Troubleshooting

### "ErgoAI executable not found"

1. Verify ErgoAI is installed: run `runergo` directly in your terminal
2. Set the `ERGOAI_PATH` environment variable to the directory containing `runergo`
3. Ensure the path is correct for your operating system

### "Timeout" errors

- Increase the `timeout` parameter in your query
- Check that ErgoAI is not stuck in an infinite loop
- Verify your knowledge base isn't too large for the default timeout

### Queries return no results

- Ensure facts/rules are loaded before querying
- Check that the query syntax is correct (no `?-` prefix in interactive queries)
- Verify you're querying the correct module

### MCP server not appearing in your AI agent

- Restart your AI coding agent after configuration changes
- Check the configuration file path is correct for your OS
- Verify Node.js is in your system PATH
- Check the logs for error messages

### Windows-specific issues

- Use forward slashes (`/`) or escaped backslashes (`\\`) in paths
- Ensure `runergo.bat` is the executable name (not just `runergo`)
- Run your terminal as Administrator if there are permission issues

---

## Additional Resources

- [ErgoAI GitHub Repository](https://github.com/ErgoAI)
- [ErgoAI Documentation](https://github.com/ErgoAI/ErgoAI/wiki)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)

---

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

MIT License - see LICENSE file for details.
