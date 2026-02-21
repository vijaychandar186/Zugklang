# Claude Code Settings

> Configure Claude Code with global and project-level settings and environment variables.

Claude Code offers a variety of settings to configure its behavior. Run `/config` to open the Settings interface.

---

## Configuration Scopes

| Scope | Location | Who it affects | Shared with team? |
|:------|:---------|:---------------|:------------------|
| **Managed** | System-level `managed-settings.json` | All users on the machine | Yes (deployed by IT) |
| **User** | `~/.claude/` | You, across all projects | No |
| **Project** | `.claude/` in repository | All repo collaborators | Yes (committed to git) |
| **Local** | `.claude/*.local.*` | You, in this repo only | No (gitignored) |

### When to Use Each Scope

- **Managed** — Security policies, compliance requirements, configs deployed by IT/DevOps
- **User** — Personal preferences, tools across all projects, API keys
- **Project** — Team-shared settings (permissions, hooks, MCP servers)
- **Local** — Personal overrides for a specific project, machine-specific settings

### Scope Precedence (highest to lowest)

1. **Managed** — cannot be overridden
2. **Command line arguments** — temporary session overrides
3. **Local** — overrides project and user
4. **Project** — overrides user
5. **User** — baseline defaults

### File Locations by Feature

| Feature | User | Project | Local |
|:--------|:-----|:--------|:------|
| **Settings** | `~/.claude/settings.json` | `.claude/settings.json` | `.claude/settings.local.json` |
| **Subagents** | `~/.claude/agents/` | `.claude/agents/` | — |
| **MCP servers** | `~/.claude.json` | `.mcp.json` | `~/.claude.json` (per-project) |
| **Plugins** | `~/.claude/settings.json` | `.claude/settings.json` | `.claude/settings.local.json` |
| **CLAUDE.md** | `~/.claude/CLAUDE.md` | `CLAUDE.md` or `.claude/CLAUDE.md` | `CLAUDE.local.md` |

---

## Settings Files

- **User settings**: `~/.claude/settings.json`
- **Project settings (shared)**: `.claude/settings.json`
- **Project settings (local)**: `.claude/settings.local.json`
- **Managed settings** (system directories, requires admin):
  - macOS: `/Library/Application Support/ClaudeCode/`
  - Linux/WSL: `/etc/claude-code/`
  - Windows: `C:\Program Files\ClaudeCode\`

### Example `settings.json`

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": ["Bash(npm run lint)", "Bash(npm run test *)", "Read(~/.zshrc)"],
    "deny": ["Bash(curl *)", "Read(./.env)", "Read(./.env.*)", "Read(./secrets/**)"]
  },
  "env": {
    "CLAUDE_CODE_ENABLE_TELEMETRY": "1"
  },
  "companyAnnouncements": [
    "Welcome! Review code guidelines at docs.acme.com"
  ]
}
```

---

## Available Settings

| Key | Description | Example |
|:----|:------------|:--------|
| `apiKeyHelper` | Script to generate auth value | `/bin/generate_temp_api_key.sh` |
| `cleanupPeriodDays` | Days before inactive sessions are deleted (default: 30) | `20` |
| `companyAnnouncements` | Startup announcements (cycled randomly) | `["Welcome!"]` |
| `env` | Environment variables for every session | `{"FOO": "bar"}` |
| `attribution` | Git commit and PR attribution | `{"commit": "🤖 Claude Code", "pr": ""}` |
| `permissions` | Permission rules (see below) | — |
| `hooks` | Custom lifecycle commands | See hooks docs |
| `disableAllHooks` | Disable all hooks and status line | `true` |
| `allowManagedHooksOnly` | *(Managed)* Only managed hooks run | `true` |
| `allowManagedPermissionRulesOnly` | *(Managed)* Only managed permission rules apply | `true` |
| `model` | Override the default model | `"claude-sonnet-4-6"` |
| `availableModels` | Restrict which models users can select | `["sonnet", "haiku"]` |
| `statusLine` | Custom status line script | `{"type": "command", "command": "~/.claude/statusline.sh"}` |
| `fileSuggestion` | Custom `@` file autocomplete script | `{"type": "command", "command": "~/.claude/file-suggestion.sh"}` |
| `respectGitignore` | File picker respects `.gitignore` (default: `true`) | `false` |
| `outputStyle` | Adjust the system prompt style | `"Explanatory"` |
| `forceLoginMethod` | Restrict login to `claudeai` or `console` | `"claudeai"` |
| `forceLoginOrgUUID` | Auto-select an org during login | `"xxxxxxxx-..."` |
| `enableAllProjectMcpServers` | Auto-approve all project MCP servers | `true` |
| `enabledMcpjsonServers` | Approved MCP servers | `["memory", "github"]` |
| `disabledMcpjsonServers` | Rejected MCP servers | `["filesystem"]` |
| `allowedMcpServers` | *(Managed)* MCP server allowlist | `[{"serverName": "github"}]` |
| `deniedMcpServers` | *(Managed)* MCP server denylist | `[{"serverName": "filesystem"}]` |
| `strictKnownMarketplaces` | *(Managed)* Plugin marketplace allowlist | `[{"source": "github", "repo": "acme/plugins"}]` |
| `alwaysThinkingEnabled` | Enable extended thinking by default | `true` |
| `plansDirectory` | Plan files location (relative to project root) | `"./plans"` |
| `showTurnDuration` | Show turn duration after responses | `true` |
| `spinnerVerbs` | Customize spinner action verbs | `{"mode": "append", "verbs": ["Pondering"]}` |
| `language` | Claude's preferred response language | `"japanese"` |
| `autoUpdatesChannel` | Release channel: `"stable"` or `"latest"` | `"stable"` |
| `spinnerTipsEnabled` | Show tips while Claude works (default: `true`) | `false` |
| `terminalProgressBarEnabled` | Enable terminal progress bar (default: `true`) | `false` |
| `prefersReducedMotion` | Reduce UI animations | `true` |
| `teammateMode` | Agent team display: `auto`, `in-process`, or `tmux` | `"in-process"` |

---

## Permission Settings

| Key | Description | Example |
|:----|:------------|:--------|
| `allow` | Allow tool use without prompting | `["Bash(git diff *)"]` |
| `ask` | Prompt for confirmation | `["Bash(git push *)"]` |
| `deny` | Block tool use entirely | `["WebFetch", "Read(./.env)"]` |
| `additionalDirectories` | Extra working directories Claude can access | `["../docs/"]` |
| `defaultMode` | Default permission mode | `"acceptEdits"` |
| `disableBypassPermissionsMode` | Prevent `bypassPermissions` mode | `"disable"` |

### Permission Rule Syntax

Format: `Tool` or `Tool(specifier)`. Evaluation order: **deny → ask → allow**. First matching rule wins.

| Rule | Effect |
|:-----|:-------|
| `Bash` | All Bash commands |
| `Bash(npm run *)` | Commands starting with `npm run` |
| `Read(./.env)` | Reading the `.env` file |
| `WebFetch(domain:example.com)` | Fetch requests to example.com |

Wildcards support word boundaries: `Bash(ls *)` matches `ls -la` but not `lsof`.

---

## Sandbox Settings

| Key | Description | Example |
|:----|:------------|:--------|
| `enabled` | Enable bash sandboxing (default: `false`) | `true` |
| `autoAllowBashIfSandboxed` | Auto-approve sandboxed bash (default: `true`) | `true` |
| `excludedCommands` | Commands that run outside sandbox | `["git", "docker"]` |
| `allowUnsandboxedCommands` | Allow `dangerouslyDisableSandbox` escape hatch (default: `true`) | `false` |
| `network.allowUnixSockets` | Allowed Unix socket paths | `["~/.ssh/agent-socket"]` |
| `network.allowAllUnixSockets` | Allow all Unix sockets (default: `false`) | `true` |
| `network.allowLocalBinding` | Allow binding to localhost ports, macOS only (default: `false`) | `true` |
| `network.allowedDomains` | Allowed outbound domains (supports wildcards) | `["github.com", "*.npmjs.org"]` |
| `network.httpProxyPort` | HTTP proxy port | `8080` |
| `network.socksProxyPort` | SOCKS5 proxy port | `8081` |
| `enableWeakerNestedSandbox` | Weaker sandbox for Docker without privileges — **reduces security** | `true` |

```json
{
  "sandbox": {
    "enabled": true,
    "excludedCommands": ["docker"],
    "network": {
      "allowedDomains": ["github.com", "*.npmjs.org"],
      "allowLocalBinding": true
    }
  }
}
```

---

## Attribution Settings

| Key | Description |
|:----|:------------|
| `commit` | Git commit attribution (empty string = hide) |
| `pr` | Pull request attribution (empty string = hide) |

```json
{
  "attribution": {
    "commit": "Generated with AI\n\nCo-Authored-By: AI <ai@example.com>",
    "pr": ""
  }
}
```

---

## Excluding Sensitive Files

```json
{
  "permissions": {
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)",
      "Read(./config/credentials.json)"
    ]
  }
}
```

---

## Plugin Configuration

### `enabledPlugins`

```json
{
  "enabledPlugins": {
    "formatter@acme-tools": true,
    "deployer@acme-tools": true,
    "analyzer@security-plugins": false
  }
}
```

### `extraKnownMarketplaces`

```json
{
  "extraKnownMarketplaces": {
    "acme-tools": {
      "source": { "source": "github", "repo": "acme-corp/claude-plugins" }
    }
  }
}
```

### `strictKnownMarketplaces` *(Managed Only)*

| Value | Behavior |
|:------|:---------|
| `undefined` | No restrictions |
| `[]` | Complete lockdown |
| List of sources | Only listed marketplaces allowed |

```json
{
  "strictKnownMarketplaces": [
    { "source": "github", "repo": "acme-corp/approved-plugins" },
    { "source": "npm", "package": "@acme-corp/compliance-plugins" },
    { "source": "hostPattern", "hostPattern": "^github\\.example\\.com$" }
  ]
}
```

| Aspect | `strictKnownMarketplaces` | `extraKnownMarketplaces` |
|:-------|:--------------------------|:-------------------------|
| **Purpose** | Policy enforcement | Team convenience |
| **Settings file** | `managed-settings.json` only | Any settings file |
| **Behavior** | Blocks non-allowlisted additions | Auto-installs missing marketplaces |
| **Can be overridden** | No | Yes |

---

## Environment Variables

| Variable | Purpose |
|:---------|:--------|
| `ANTHROPIC_API_KEY` | API key for model requests |
| `ANTHROPIC_AUTH_TOKEN` | Custom `Authorization` header value |
| `ANTHROPIC_MODEL` | Model alias or name to use |
| `ANTHROPIC_DEFAULT_OPUS_MODEL` | Full model name for `opus` alias |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | Full model name for `sonnet` alias |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | Full model name for `haiku` alias |
| `BASH_DEFAULT_TIMEOUT_MS` | Default timeout for bash commands |
| `BASH_MAX_OUTPUT_LENGTH` | Max characters in bash output before truncation |
| `BASH_MAX_TIMEOUT_MS` | Max timeout the model can set |
| `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` | Context % to trigger auto-compaction (1–100) |
| `CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR` | Return to original dir after each Bash command |
| `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD` | `1` = load CLAUDE.md from `--add-dir` directories |
| `CLAUDE_CODE_DISABLE_AUTO_MEMORY` | `1` = disable auto memory |
| `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS` | `1` = disable background tasks |
| `CLAUDE_CODE_EFFORT_LEVEL` | `low`, `medium`, or `high` (Opus 4.6 only) |
| `CLAUDE_CODE_ENABLE_TELEMETRY` | `1` = enable OpenTelemetry |
| `CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS` | Override token limit for file reads |
| `CLAUDE_CODE_HIDE_ACCOUNT_INFO` | `1` = hide email/org from UI |
| `CLAUDE_CODE_MAX_OUTPUT_TOKENS` | Max output tokens (default: 32,000; max: 64,000) |
| `CLAUDE_CODE_SHELL` | Override automatic shell detection |
| `CLAUDE_CODE_SHELL_PREFIX` | Prefix wrapper for all bash commands |
| `CLAUDE_CODE_SIMPLE` | `1` = minimal system prompt and tools only |
| `CLAUDE_CODE_SUBAGENT_MODEL` | Model for subagents |
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | Disables autoupdater, bug command, error reporting, and telemetry |
| `CLAUDE_CODE_USE_BEDROCK` | Use Amazon Bedrock |
| `CLAUDE_CODE_USE_VERTEX` | Use Google Vertex AI |
| `CLAUDE_CODE_USE_FOUNDRY` | Use Microsoft Foundry |
| `CLAUDE_CONFIG_DIR` | Override config/data storage location |
| `DISABLE_AUTOUPDATER` | `1` = disable automatic updates |
| `DISABLE_BUG_COMMAND` | `1` = disable `/bug` command |
| `DISABLE_COST_WARNINGS` | `1` = disable cost warnings |
| `DISABLE_ERROR_REPORTING` | `1` = opt out of Sentry |
| `DISABLE_PROMPT_CACHING` | `1` = disable all prompt caching |
| `DISABLE_PROMPT_CACHING_HAIKU` | `1` = disable caching for Haiku |
| `DISABLE_PROMPT_CACHING_SONNET` | `1` = disable caching for Sonnet |
| `DISABLE_PROMPT_CACHING_OPUS` | `1` = disable caching for Opus |
| `DISABLE_TELEMETRY` | `1` = opt out of Statsig telemetry |
| `ENABLE_TOOL_SEARCH` | MCP tool search: `auto`, `auto:N`, `true`, `false` |
| `HTTP_PROXY` / `HTTPS_PROXY` | Proxy for network connections |
| `NO_PROXY` | Domains to bypass proxy |
| `MAX_MCP_OUTPUT_TOKENS` | Max tokens in MCP responses (default: 25,000) |
| `MAX_THINKING_TOKENS` | Extended thinking budget (`0` = disabled) |
| `MCP_TIMEOUT` | MCP server startup timeout (ms) |
| `MCP_TOOL_TIMEOUT` | MCP tool execution timeout (ms) |
| `USE_BUILTIN_RIPGREP` | `0` = use system `rg` instead of bundled |

---

## Available Tools

| Tool | Description | Permission Required |
|:-----|:------------|:--------------------|
| **AskUserQuestion** | Multiple-choice questions for requirements or clarification | No |
| **Bash** | Execute shell commands | Yes |
| **Edit** | Targeted file edits | Yes |
| **ExitPlanMode** | Prompt to exit plan mode | Yes |
| **Glob** | Pattern-based file finding | No |
| **Grep** | Search file contents | No |
| **KillShell** | Kill a background bash shell | No |
| **MCPSearch** | Search/load MCP tools | No |
| **NotebookEdit** | Modify Jupyter cells | Yes |
| **Read** | Read file contents | No |
| **Skill** | Execute a skill in conversation | Yes |
| **Task** | Run a sub-agent for complex tasks | No |
| **TaskCreate/Get/List/Update** | Manage task list | No |
| **TaskOutput** | Retrieve background task output | No |
| **WebFetch** | Fetch content from a URL | Yes |
| **WebSearch** | Web search with domain filtering | Yes |
| **Write** | Create or overwrite files | Yes |
| **LSP** | Code intelligence via language servers | No |

### Bash Tool Behavior

- **Working directory persists** across commands
- **Environment variables do NOT persist** — each command is a fresh shell

**Options to persist environment variables:**

1. Activate before launching: `conda activate myenv && claude`
2. Export `CLAUDE_ENV_FILE` pointing to a setup script
3. Use a `SessionStart` hook that writes to `$CLAUDE_ENV_FILE`
# Configure Permissions

> Control what Claude Code can access and do with fine-grained permission rules, modes, and managed policies.

---

## Permission System

Claude Code uses a tiered permission system to balance power and safety:

| Tool type | Example | Approval required | "Yes, don't ask again" behavior |
|:----------|:--------|:------------------|:--------------------------------|
| Read-only | File reads, Grep | No | N/A |
| Bash commands | Shell execution | Yes | Permanently per project directory and command |
| File modification | Edit/write files | Yes | Until session end |

---

## Managing Permissions

Run `/permissions` to view and manage all permission rules. The UI shows all rules and the `settings.json` file they come from.

- **Allow** — Claude Code uses the tool without manual approval
- **Ask** — Prompts for confirmation before each use
- **Deny** — Blocks the tool entirely

Rules are evaluated in order: **deny → ask → allow**. The first matching rule wins.

---

## Permission Modes

Set `defaultMode` in your settings files to control how tools are approved:

| Mode | Description |
|:-----|:------------|
| `default` | Standard behavior: prompts for permission on first use |
| `acceptEdits` | Automatically accepts file edit permissions for the session |
| `plan` | Claude can analyze but not modify files or execute commands |
| `dontAsk` | Auto-denies tools unless pre-approved via `/permissions` or `allow` rules |
| `bypassPermissions` | Skips all permission prompts (use only in isolated environments) |

> **Warning:** `bypassPermissions` disables all permission checks. Only use in isolated containers/VMs. Admins can prevent this by setting `disableBypassPermissionsMode: "disable"` in managed settings.

---

## Permission Rule Syntax

Rules follow the format `Tool` or `Tool(specifier)`.

### Match All Uses of a Tool

| Rule | Effect |
|:-----|:-------|
| `Bash` | All Bash commands |
| `WebFetch` | All web fetch requests |
| `Read` | All file reads |

`Bash(*)` is equivalent to `Bash`.

### Wildcard Patterns

Wildcards can appear at any position:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(git commit *)",
      "Bash(git * main)",
      "Bash(* --version)",
      "Bash(* --help *)"
    ],
    "deny": [
      "Bash(git push *)"
    ]
  }
}
```

> **Word boundary note:** `Bash(ls *)` matches `ls -la` but not `lsof`. `Bash(ls*)` matches both.

---

## Tool-Specific Permission Rules

### Bash

- `Bash(npm run build)` — exact match
- `Bash(npm run test *)` — prefix match
- `Bash(* install)` — suffix match
- `Bash(git * main)` — middle wildcard

> **Security note:** Claude Code is aware of shell operators (`&&`), so `Bash(safe-cmd *)` won't permit `safe-cmd && other-cmd`. However, argument-constraining patterns (e.g., `Bash(curl http://github.com/ *)`) are fragile — use `WebFetch` with domain rules for reliable URL filtering instead.

### Read and Edit

Both follow the [gitignore](https://git-scm.com/docs/gitignore) specification:

| Pattern | Meaning | Example | Matches |
|:--------|:--------|:--------|:--------|
| `//path` | Absolute path from filesystem root | `Read(//Users/alice/secrets/**)` | `/Users/alice/secrets/**` |
| `~/path` | From home directory | `Read(~/Documents/*.pdf)` | `/Users/alice/Documents/*.pdf` |
| `/path` | Relative to settings file | `Edit(/src/**/*.ts)` | `<settings file path>/src/**/*.ts` |
| `path` or `./path` | Relative to current directory | `Read(*.env)` | `<cwd>/*.env` |

> **Warning:** `/Users/alice/file` is NOT an absolute path — it's relative to your settings file. Use `//Users/alice/file` for absolute paths.

- `*` matches files in a single directory
- `**` matches recursively across directories
- Use just the tool name (e.g., `Read`) to allow all file access

### WebFetch

- `WebFetch(domain:example.com)` — matches fetch requests to example.com

### MCP

- `mcp__puppeteer` — all tools from the `puppeteer` server
- `mcp__puppeteer__puppeteer_navigate` — specific tool from the `puppeteer` server

### Task (Subagents)

- `Task(Explore)` — matches the Explore subagent
- `Task(my-custom-agent)` — matches a custom subagent

To disable the Explore agent:
```json
{
  "permissions": {
    "deny": ["Task(Explore)"]
  }
}
```

---

## Extending Permissions with Hooks

[Hooks](hooks.md) let you run custom shell commands for permission evaluation at runtime. PreToolUse hooks run before the permission system, and their output can approve or deny tool calls.

---

## Working Directories

By default, Claude has access to files in the launch directory. Extend access via:

- **Startup**: `--add-dir <path>` CLI argument
- **During session**: `/add-dir` command
- **Persistent**: `additionalDirectories` in settings files

---

## How Permissions and Sandboxing Interact

Permissions and [sandboxing](sandboxing.md) are complementary layers:

- **Permissions** — control which tools Claude Code can use and which files/domains it can access (applies to all tools)
- **Sandboxing** — OS-level enforcement restricting what Bash commands can access (applies to Bash only)

Use both for defense-in-depth:
- Permission deny rules block Claude from attempting restricted access
- Sandbox restrictions prevent Bash commands from reaching resources outside defined boundaries, even if prompt injection bypasses Claude's decision-making

---

## Managed Settings

Deploy `managed-settings.json` to system directories for centralized control. These cannot be overridden by user or project settings.

**File locations:**
- macOS: `/Library/Application Support/ClaudeCode/managed-settings.json`
- Linux/WSL: `/etc/claude-code/managed-settings.json`
- Windows: `C:\Program Files\ClaudeCode\managed-settings.json`

### Managed-Only Settings

| Setting | Description |
|:--------|:------------|
| `disableBypassPermissionsMode` | Set to `"disable"` to block `bypassPermissions` mode |
| `allowManagedPermissionRulesOnly` | When `true`, only managed `allow`/`ask`/`deny` rules apply |
| `allowManagedHooksOnly` | When `true`, only managed and SDK hooks load |
| `strictKnownMarketplaces` | Controls which plugin marketplaces users can add |

---

## Example Configurations

Starter configurations are available in the [claude-code examples repository](https://github.com/anthropics/claude-code/tree/main/examples/settings).

---

## See Also

- [Settings](settings.md) — complete configuration reference
- [Sandboxing](sandboxing.md) — OS-level filesystem and network isolation
- [Hooks](hooks.md) — automate workflows and extend permission evaluation
# Sandboxing

> OS-level filesystem and network isolation for safer, more autonomous Claude Code execution.

---

## Overview

Claude Code's native sandboxing creates defined security boundaries so Claude can work more freely with reduced risk — without requiring constant permission prompts for every bash command.

The sandboxed bash tool uses OS-level primitives to enforce both filesystem and network isolation.

---

## Why Sandboxing Matters

Traditional permission-based security requires constant approval for bash commands, which can lead to:

- **Approval fatigue** — repeated clicking causes less attention to what's being approved
- **Reduced productivity** — constant interruptions slow workflows
- **Limited autonomy** — Claude waits for approvals instead of working

Sandboxing addresses this by:

1. **Defining clear boundaries** — specify exactly which directories and network hosts Claude can access
2. **Reducing permission prompts** — safe commands within the sandbox don't require approval
3. **Maintaining security** — attempts outside the sandbox trigger immediate notifications
4. **Enabling autonomy** — Claude works independently within defined limits

> **Warning:** Effective sandboxing requires **both** filesystem and network isolation. Without network isolation, a compromised agent could exfiltrate sensitive files. Without filesystem isolation, it could backdoor system resources to gain network access.

---

## How It Works

### Filesystem Isolation

- **Write access**: current working directory and subdirectories
- **Read access**: entire system, except denied directories
- **Blocked**: modifying files outside the working directory without explicit permission
- **Configurable**: define custom allowed and denied paths via settings

### Network Isolation

Network access is controlled through a proxy server running outside the sandbox:

- Only approved domains can be accessed
- New domain requests trigger permission prompts
- Restrictions apply to all scripts, programs, and subprocesses spawned by commands

### OS-Level Enforcement

| Platform | Mechanism |
|:---------|:----------|
| macOS | Seatbelt |
| Linux | [bubblewrap](https://github.com/containers/bubblewrap) |
| WSL2 | bubblewrap |

> WSL1 is not supported (bubblewrap requires kernel features only in WSL2).

All child processes inherit the same security boundaries.

---

## Getting Started

### Prerequisites

**macOS**: works out of the box (uses built-in Seatbelt).

**Linux and WSL2**: install required packages first:

Ubuntu/Debian:
```bash
sudo apt-get install bubblewrap socat
```

Fedora:
```bash
sudo dnf install bubblewrap socat
```

### Enable Sandboxing

Run `/sandbox` in Claude Code to open the sandbox configuration menu. If required dependencies are missing, the menu displays installation instructions.

### Sandbox Modes

**Auto-allow mode**: Bash commands run inside the sandbox and are automatically allowed. Commands that can't be sandboxed fall back to the regular permission flow. Explicit ask/deny rules are always respected.

**Regular permissions mode**: All bash commands go through the standard permission flow, even when sandboxed.

> Both modes enforce the same filesystem and network restrictions — the difference is only whether sandboxed commands are auto-approved.

> **Note:** Auto-allow mode works independently of your permission mode setting. Even outside "accept edits" mode, sandboxed bash commands run automatically when auto-allow is enabled — including commands that modify files within sandbox boundaries.

---

## Configuration

Add sandbox settings to your `settings.json`. See [Settings](settings.md#sandbox-settings) for the full reference.

```json
{
  "sandbox": {
    "enabled": true,
    "autoAllowBashIfSandboxed": true,
    "excludedCommands": ["docker"],
    "network": {
      "allowedDomains": ["github.com", "*.npmjs.org", "registry.yarnpkg.com"],
      "allowUnixSockets": ["/var/run/docker.sock"],
      "allowLocalBinding": true
    }
  },
  "permissions": {
    "deny": [
      "Read(.envrc)",
      "Read(~/.aws/**)"
    ]
  }
}
```

**Compatibility notes:**
- `watchman` is incompatible with sandboxing. If using Jest, try `jest --no-watchman`
- `docker` is incompatible with the sandbox — add it to `excludedCommands`

---

## Escape Hatch

When a command fails due to sandbox restrictions, Claude may retry with `dangerouslyDisableSandbox`. These commands go through the normal permission flow (requiring user approval).

To disable this escape hatch entirely:

```json
{
  "sandbox": {
    "allowUnsandboxedCommands": false
  }
}
```

When disabled, all commands must run sandboxed or be listed in `excludedCommands`.

---

## Security Benefits

### Protection Against Prompt Injection

Even if an attacker manipulates Claude Code through prompt injection, the sandbox protects your system:

**Filesystem protection:**
- Cannot modify critical config files (`~/.bashrc`, `/bin/`)
- Cannot read files denied in permission settings

**Network protection:**
- Cannot exfiltrate data to attacker-controlled servers
- Cannot download malicious scripts from unauthorized domains
- Cannot contact domains not explicitly allowed

### Reduced Attack Surface

Sandboxing limits damage from malicious dependencies, compromised scripts, social engineering, and prompt injection attacks.

### Transparent Operation

When Claude attempts to access resources outside the sandbox:
1. The operation is blocked at the OS level
2. You receive an immediate notification
3. You can deny, allow once, or update your configuration

---

## Security Limitations

- **Network inspection**: The sandbox restricts which domains are accessible but does not inspect traffic. Only allow trusted domains. Broad domains like `github.com` may allow data exfiltration.
- **Domain fronting**: It may be possible to bypass network filtering through [domain fronting](https://en.wikipedia.org/wiki/Domain_fronting).
- **Unix socket privilege escalation**: `allowUnixSockets` can grant access to powerful services. For example, allowing `/var/run/docker.sock` effectively grants host access.
- **Filesystem escalation**: Overly broad write permissions can enable privilege escalation if they include directories with executables in `$PATH` or shell config files.
- **Linux sandbox strength**: The Linux implementation is strong, but `enableWeakerNestedSandbox` mode (for Docker without privileged namespaces) considerably weakens security.

---

## How Sandboxing Relates to Permissions

| Layer | Scope | What it controls |
|:------|:------|:----------------|
| **Permissions** | All tools | Which tools Claude can use; which files/domains are accessible |
| **Sandboxing** | Bash only | OS-level enforcement of filesystem and network boundaries |

Configure filesystem and network restrictions through permission rules:
- `Read`/`Edit` deny rules — block file access
- `WebFetch` allow/deny rules — control domain access
- Sandbox `allowedDomains` — control Bash command network access

---

## Advanced: Custom Proxy

For organizations requiring advanced network security:

```json
{
  "sandbox": {
    "network": {
      "httpProxyPort": 8080,
      "socksProxyPort": 8081
    }
  }
}
```

A custom proxy can decrypt and inspect HTTPS traffic, apply custom filtering, log all requests, and integrate with existing security infrastructure.

---

## Open Source Sandbox Runtime

The sandbox runtime is available as an open source npm package:

```bash
npx @anthropic-ai/sandbox-runtime <command-to-sandbox>
```

Source: [github.com/anthropic-experimental/sandbox-runtime](https://github.com/anthropic-experimental/sandbox-runtime)

---

## Limitations

- Some tools requiring specific system access patterns may need configuration adjustments or must run outside the sandbox
- Supports macOS, Linux, and WSL2 — WSL1 is not supported; native Windows support is planned

---

## See Also

- [Permissions](permissions.md) — permission configuration and access control
- [Settings](settings.md) — complete configuration reference
# Model Configuration

> Configure which Claude model Claude Code uses, including aliases, environment variables, and effort levels.

---

## Available Models

For the `model` setting, configure either a **model alias** or a **model name** (full API name, Bedrock inference profile ARN, Foundry deployment name, or Vertex version name).

### Model Aliases

| Alias | Behavior |
|:------|:---------|
| `default` | Recommended model based on your account type |
| `sonnet` | Latest Sonnet model (currently Sonnet 4.6) for daily coding |
| `opus` | Latest Opus model (currently Opus 4.6) for complex reasoning |
| `haiku` | Fast, efficient Haiku model for simple tasks |
| `sonnet[1m]` | Sonnet with 1 million token context window |
| `opusplan` | Opus during plan mode, Sonnet during execution |

Aliases always point to the latest version. To pin to a specific version, use the full model name (e.g., `claude-opus-4-6`) or the corresponding environment variable.

---

## Setting Your Model

In order of priority:

1. **During session** — `/model <alias|name>`
2. **At startup** — `claude --model <alias|name>`
3. **Environment variable** — `ANTHROPIC_MODEL=<alias|name>`
4. **Settings file** — `"model"` field in `settings.json`

**Examples:**

```bash
# Start with Opus
claude --model opus

# Switch to Sonnet during session
/model sonnet
```

```json
{
  "model": "opus"
}
```

---

## Default Model Behavior

| User type | Default model |
|:----------|:-------------|
| Max, Team, or Pro subscribers | Opus 4.6 |
| Pay-as-you-go (API) users | Sonnet 4.5 |

---

## Special Model Behaviors

### `opusplan`

An automated hybrid approach:
- **Plan mode** — uses Opus for complex reasoning and architecture decisions
- **Execution mode** — automatically switches to Sonnet for code generation

### Extended Context (`[1m]` suffix)

Opus 4.6 and Sonnet 4.6 support a 1 million token context window (currently in beta).

```bash
/model sonnet[1m]
/model claude-sonnet-4-6[1m]
```

**Availability:**
- API and pay-as-you-go users: full access
- Pro, Max, Teams, Enterprise: available with extra usage enabled

Sessions use standard rates until they exceed 200K tokens; beyond that, long-context pricing applies.

---

## Restrict Model Selection

Use `availableModels` in managed or policy settings to restrict which models users can select:

```json
{
  "availableModels": ["sonnet", "haiku"]
}
```

When set, users cannot switch to models not in this list via `/model`, `--model`, Config tool, or `ANTHROPIC_MODEL`.

**The Default option is never restricted** — it always reflects the system's runtime default for the user's subscription tier.

### Control the Model Users Run On

Combine `availableModels` with `model` to fully control the experience:

```json
{
  "model": "sonnet",
  "availableModels": ["sonnet", "haiku"]
}
```

This ensures all users run Sonnet 4.5 and can only choose between Sonnet and Haiku.

---

## Adjust Effort Level

Effort levels control Opus 4.6's adaptive reasoning, which dynamically allocates thinking based on task complexity.

| Level | Effect |
|:------|:-------|
| `low` | Faster, cheaper — for straightforward tasks |
| `medium` | Balanced |
| `high` | Deeper reasoning — default |

**Setting effort:**
- In `/model`: use left/right arrow keys on the effort slider
- Environment variable: `CLAUDE_CODE_EFFORT_LEVEL=low|medium|high`
- Settings file: `"effortLevel"` field

Effort is currently supported on Opus 4.6 only.

---

## Checking Your Current Model

- In a custom [status line](statusline.md) (if configured)
- Run `/status` to see model and account information

---

## Environment Variables

| Variable | Description |
|:---------|:------------|
| `ANTHROPIC_DEFAULT_OPUS_MODEL` | Full model name for `opus` alias (or `opusplan` in plan mode) |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | Full model name for `sonnet` alias (or `opusplan` in execution mode) |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | Full model name for `haiku` alias and background tasks |
| `CLAUDE_CODE_SUBAGENT_MODEL` | Model for subagents |
| `ANTHROPIC_MODEL` | Model alias or name override |
| `CLAUDE_CODE_EFFORT_LEVEL` | Effort level: `low`, `medium`, or `high` |

> `ANTHROPIC_SMALL_FAST_MODEL` is deprecated — use `ANTHROPIC_DEFAULT_HAIKU_MODEL` instead.

---

## Pinning Models for Third-Party Deployments

When using Bedrock, Vertex AI, or Foundry, **always pin model versions** before rollout. Without pinning, model aliases resolve to the latest version — a new Anthropic release can silently break users whose accounts don't have the new model.

| Provider | Example |
|:---------|:--------|
| Bedrock | `export ANTHROPIC_DEFAULT_OPUS_MODEL='us.anthropic.claude-opus-4-6-v1'` |
| Vertex AI | `export ANTHROPIC_DEFAULT_OPUS_MODEL='claude-opus-4-6'` |
| Foundry | `export ANTHROPIC_DEFAULT_OPUS_MODEL='claude-opus-4-6'` |

Apply the same pattern for Sonnet and Haiku. To upgrade, update the environment variables and redeploy.

> **Note:** `availableModels` filtering matches on the alias (`opus`, `sonnet`, `haiku`), not the provider-specific model ID.

---

## Prompt Caching

Claude Code automatically uses [prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) to optimize performance and reduce costs.

| Variable | Description |
|:---------|:------------|
| `DISABLE_PROMPT_CACHING` | `1` = disable all prompt caching (overrides per-model settings) |
| `DISABLE_PROMPT_CACHING_HAIKU` | `1` = disable caching for Haiku only |
| `DISABLE_PROMPT_CACHING_SONNET` | `1` = disable caching for Sonnet only |
| `DISABLE_PROMPT_CACHING_OPUS` | `1` = disable caching for Opus only |
# Manage Claude's Memory

> Learn how to manage Claude Code's memory across sessions with different memory locations and best practices.

Claude Code has two kinds of persistent memory:

- **Auto memory** — Claude automatically saves useful context (project patterns, commands, preferences) across sessions
- **CLAUDE.md files** — Markdown files you write with instructions, rules, and preferences for Claude to follow

Both are loaded into Claude's context at the start of every session. Auto memory loads only the first 200 lines of its main file.

---

## Memory Types

| Memory Type | Location | Purpose | Use Case Examples | Shared With |
|:------------|:---------|:--------|:------------------|:------------|
| **Managed policy** | macOS: `/Library/Application Support/ClaudeCode/CLAUDE.md`<br>Linux: `/etc/claude-code/CLAUDE.md`<br>Windows: `C:\Program Files\ClaudeCode\CLAUDE.md` | Organization-wide instructions | Company standards, security policies | All users in org |
| **Project memory** | `./CLAUDE.md` or `./.claude/CLAUDE.md` | Team-shared project instructions | Architecture, coding standards, workflows | Team (via git) |
| **Project rules** | `./.claude/rules/*.md` | Modular, topic-specific instructions | Language guidelines, testing conventions | Team (via git) |
| **User memory** | `~/.claude/CLAUDE.md` | Personal preferences for all projects | Code style, personal tooling shortcuts | Just you (all projects) |
| **Project memory (local)** | `./CLAUDE.local.md` | Personal project-specific preferences | Sandbox URLs, preferred test data | Just you (current project) |
| **Auto memory** | `~/.claude/projects/<project>/memory/` | Claude's automatic notes and learnings | Project patterns, debugging insights | Just you (per project) |

> `CLAUDE.local.md` files are automatically added to `.gitignore`.

### Memory Loading Behavior

- CLAUDE.md files in the directory hierarchy **above** the working directory load in full at launch
- CLAUDE.md files in **child directories** load on demand when Claude reads files there
- Auto memory loads only the **first 200 lines** of `MEMORY.md`
- More specific instructions take precedence over broader ones

---

## Auto Memory

Auto memory is a persistent directory where Claude records learnings, patterns, and insights as it works — notes Claude writes for itself based on what it discovers.

> Auto memory is rolling out gradually. Opt in early by setting `CLAUDE_CODE_DISABLE_AUTO_MEMORY=0`.

### What Claude Remembers

- **Project patterns** — build commands, test conventions, code style
- **Debugging insights** — solutions to tricky problems, common error causes
- **Architecture notes** — key files, module relationships, important abstractions
- **Your preferences** — communication style, workflow habits, tool choices

### Storage Location

Each project gets its own memory directory: `~/.claude/projects/<project>/memory/`

The `<project>` path comes from the git repository root, so all subdirectories in the same repo share one memory directory. Git worktrees get separate directories.

```
~/.claude/projects/<project>/memory/
├── MEMORY.md          # Concise index, loaded into every session
├── debugging.md       # Detailed debugging patterns
├── api-conventions.md # API design decisions
└── ...
```

`MEMORY.md` is an index. Claude reads and writes files in this directory throughout sessions.

### How Auto Memory Works

- First 200 lines of `MEMORY.md` load into Claude's system prompt at session start
- Content beyond 200 lines is not loaded automatically — Claude is instructed to keep it concise by moving details into topic files
- Topic files (e.g., `debugging.md`) are not loaded at startup — Claude reads them on demand
- Claude reads and writes memory files during your session

### Managing Auto Memory

- Use `/memory` to open the file selector (includes your auto memory entrypoint alongside CLAUDE.md files)
- Tell Claude directly: "remember that we use pnpm, not npm" or "save to memory that API tests require a local Redis instance"

```bash
export CLAUDE_CODE_DISABLE_AUTO_MEMORY=1  # Force off
export CLAUDE_CODE_DISABLE_AUTO_MEMORY=0  # Force on
```

---

## CLAUDE.md Imports

CLAUDE.md files can import additional files using `@path/to/import` syntax:

```markdown
See @README for project overview and @package.json for available npm commands.

# Additional Instructions
- git workflow @docs/git-instructions.md
```

- Both relative and absolute paths are allowed
- Relative paths resolve relative to the file containing the import
- Imports are NOT evaluated inside code spans or code blocks
- Recursive imports are supported up to 5 hops deep
- For shared personal instructions across git worktrees, use a home-directory import:

```markdown
# Individual Preferences
- @~/.claude/my-project-instructions.md
```

> The first time Claude Code encounters external imports in a project, it shows a one-time approval dialog. Once declined, the dialog won't resurface and imports remain disabled.

---

## How Claude Looks Up Memories

Claude Code reads memories recursively: starting in the current working directory, it recurses up to (but not including) the root `/` and reads any CLAUDE.md or CLAUDE.local.md files it finds.

For example, running Claude Code in `foo/bar/` with memories in both `foo/CLAUDE.md` and `foo/bar/CLAUDE.md` loads both.

Claude also discovers CLAUDE.md files nested in subtrees under your current working directory — loaded on demand when Claude reads files in those subtrees.

### Load Memory from Additional Directories

By default, CLAUDE.md files from `--add-dir` directories are not loaded. To enable:

```bash
CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1 claude --add-dir ../shared-config
```

---

## Editing Memories

Use `/memory` during a session to open any memory file in your system editor.

---

## Set Up Project Memory

Bootstrap a CLAUDE.md for your codebase:

```
/init
```

**Tips:**
- Include frequently used commands (build, test, lint) to avoid repeated searches
- Document code style preferences and naming conventions
- Add important architectural patterns specific to your project

---

## Modular Rules with `.claude/rules/`

Organize instructions into multiple files for larger projects:

```
your-project/
├── .claude/
│   ├── CLAUDE.md           # Main project instructions
│   └── rules/
│       ├── code-style.md   # Code style guidelines
│       ├── testing.md      # Testing conventions
│       └── security.md     # Security requirements
```

All `.md` files in `.claude/rules/` are automatically loaded as project memory.

### Path-Specific Rules

Scope rules to specific files using YAML frontmatter:

```markdown
---
paths:
  - "src/api/**/*.ts"
---

# API Development Rules

- All API endpoints must include input validation
- Use the standard error response format
```

Rules without a `paths` field apply to all files.

### Glob Patterns

| Pattern | Matches |
|:--------|:--------|
| `**/*.ts` | All TypeScript files in any directory |
| `src/**/*` | All files under `src/` |
| `*.md` | Markdown files in project root |
| `src/components/*.tsx` | React components in a specific directory |

Brace expansion is supported:
```
src/**/*.{ts,tsx}
{src,lib}/**/*.ts
```

### Subdirectories

Rules can be organized into subdirectories — all `.md` files are discovered recursively:

```
.claude/rules/
├── frontend/
│   ├── react.md
│   └── styles.md
├── backend/
│   ├── api.md
│   └── database.md
└── general.md
```

### Symlinks

The `.claude/rules/` directory supports symlinks for sharing rules across projects:

```bash
ln -s ~/shared-claude-rules .claude/rules/shared
ln -s ~/company-standards/security.md .claude/rules/security.md
```

### User-Level Rules

Personal rules that apply to all projects:

```
~/.claude/rules/
├── preferences.md
└── workflows.md
```

User-level rules are loaded before project rules (project rules take higher priority).

---

## Organization-Level Memory

Deploy centrally managed CLAUDE.md files by placing them at the managed policy location and distributing via your configuration management system (MDM, Group Policy, Ansible, etc.).

---

## Best Practices

- **Be specific** — "Use 2-space indentation" beats "Format code properly"
- **Use structure** — Format each memory as a bullet point; group related memories under headings
- **Review periodically** — Update memories as your project evolves
# Customize Your Status Line

> Configure a custom status bar to monitor context window usage, costs, git status, and more.

The status line is a customizable bar at the bottom of Claude Code. It runs any shell script you configure — receiving JSON session data on stdin and displaying whatever your script prints.

---

## Set Up a Status Line

### Using `/statusline`

The `/statusline` command accepts natural language descriptions and generates a script automatically:

```
/statusline show model name and context percentage with a progress bar
```

Claude Code generates a script in `~/.claude/` and updates your settings.

### Manual Configuration

Add a `statusLine` field to your `~/.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "~/.claude/statusline.sh",
    "padding": 2
  }
}
```

You can also use inline commands:

```json
{
  "statusLine": {
    "type": "command",
    "command": "jq -r '\"[\\(.model.display_name)] \\(.context_window.used_percentage // 0)% context\"'"
  }
}
```

- `command` — runs in a shell; can be a script path or inline command
- `padding` — extra horizontal spacing in characters (default: `0`)

### Disable the Status Line

Run `/statusline` and ask it to remove it (e.g., `/statusline delete`), or manually delete the `statusLine` field from `settings.json`.

---

## How Status Lines Work

Claude Code pipes JSON session data to your script via stdin. Your script reads the JSON, extracts what it needs, and prints text to stdout. Claude Code displays whatever is printed.

**When it updates:** After each assistant message, when permission mode changes, or when vim mode toggles. Updates are debounced at 300ms.

**What your script can output:**
- **Multiple lines** — each `echo` becomes a separate row
- **Colors** — ANSI escape codes (e.g., `\033[32m` for green)
- **Clickable links** — OSC 8 escape sequences (requires iTerm2, Kitty, or WezTerm)

> The status line runs locally and does not consume API tokens. It temporarily hides during autocomplete, help menu, and permission prompts.

---

## Available Data

Claude Code sends the following JSON fields to your script via stdin:

| Field | Description |
|:------|:------------|
| `model.id`, `model.display_name` | Current model identifier and display name |
| `cwd`, `workspace.current_dir` | Current working directory |
| `workspace.project_dir` | Directory where Claude Code was launched |
| `cost.total_cost_usd` | Total session cost in USD |
| `cost.total_duration_ms` | Total wall-clock time since session started (ms) |
| `cost.total_api_duration_ms` | Time waiting for API responses (ms) |
| `cost.total_lines_added`, `cost.total_lines_removed` | Lines of code changed |
| `context_window.total_input_tokens` | Cumulative input tokens across session |
| `context_window.total_output_tokens` | Cumulative output tokens across session |
| `context_window.context_window_size` | Max context window size (200,000 or 1,000,000) |
| `context_window.used_percentage` | Pre-calculated % of context used |
| `context_window.remaining_percentage` | Pre-calculated % of context remaining |
| `context_window.current_usage` | Token counts from last API call (see below) |
| `exceeds_200k_tokens` | Whether most recent response exceeds 200k tokens |
| `session_id` | Unique session identifier |
| `transcript_path` | Path to conversation transcript file |
| `version` | Claude Code version |
| `output_style.name` | Name of the current output style |
| `vim.mode` | Vim mode (`NORMAL` or `INSERT`) when vim mode is enabled |
| `agent.name` | Agent name when using `--agent` flag |

### Context Window Fields

`current_usage` contains:
- `input_tokens` — input tokens in current context
- `output_tokens` — output tokens generated
- `cache_creation_input_tokens` — tokens written to cache
- `cache_read_input_tokens` — tokens read from cache

`used_percentage` is calculated from **input tokens only**: `input_tokens + cache_creation_input_tokens + cache_read_input_tokens`. It does not include `output_tokens`.

`current_usage` is `null` before the first API call.

---

## Build a Status Line Step by Step

This example displays model, working directory, and context usage.

**Step 1: Create a script**

Save to `~/.claude/statusline.sh`:

```bash
#!/bin/bash
input=$(cat)

MODEL=$(echo "$input" | jq -r '.model.display_name')
DIR=$(echo "$input" | jq -r '.workspace.current_dir')
PCT=$(echo "$input" | jq -r '.context_window.used_percentage // 0' | cut -d. -f1)

echo "[$MODEL] 📁 ${DIR##*/} | ${PCT}% context"
```

**Step 2: Make it executable**

```bash
chmod +x ~/.claude/statusline.sh
```

**Step 3: Add to settings**

```json
{
  "statusLine": {
    "type": "command",
    "command": "~/.claude/statusline.sh"
  }
}
```

---

## Examples

### Context Window Progress Bar

```bash
#!/bin/bash
input=$(cat)
MODEL=$(echo "$input" | jq -r '.model.display_name')
PCT=$(echo "$input" | jq -r '.context_window.used_percentage // 0' | cut -d. -f1)

BAR_WIDTH=10
FILLED=$((PCT * BAR_WIDTH / 100))
EMPTY=$((BAR_WIDTH - FILLED))
BAR=""
[ "$FILLED" -gt 0 ] && BAR=$(printf "%${FILLED}s" | tr ' ' '▓')
[ "$EMPTY" -gt 0 ] && BAR="${BAR}$(printf "%${EMPTY}s" | tr ' ' '░')"

echo "[$MODEL] $BAR $PCT%"
```

### Git Status with Colors

```bash
#!/bin/bash
input=$(cat)
MODEL=$(echo "$input" | jq -r '.model.display_name')
DIR=$(echo "$input" | jq -r '.workspace.current_dir')

GREEN='\033[32m'; YELLOW='\033[33m'; RESET='\033[0m'

if git rev-parse --git-dir > /dev/null 2>&1; then
    BRANCH=$(git branch --show-current 2>/dev/null)
    STAGED=$(git diff --cached --numstat 2>/dev/null | wc -l | tr -d ' ')
    MODIFIED=$(git diff --numstat 2>/dev/null | wc -l | tr -d ' ')

    GIT_STATUS=""
    [ "$STAGED" -gt 0 ] && GIT_STATUS="${GREEN}+${STAGED}${RESET}"
    [ "$MODIFIED" -gt 0 ] && GIT_STATUS="${GIT_STATUS}${YELLOW}~${MODIFIED}${RESET}"

    echo -e "[$MODEL] 📁 ${DIR##*/} | 🌿 $BRANCH $GIT_STATUS"
else
    echo "[$MODEL] 📁 ${DIR##*/}"
fi
```

### Cost and Duration Tracking

```bash
#!/bin/bash
input=$(cat)
MODEL=$(echo "$input" | jq -r '.model.display_name')
COST=$(echo "$input" | jq -r '.cost.total_cost_usd // 0')
DURATION_MS=$(echo "$input" | jq -r '.cost.total_duration_ms // 0')

COST_FMT=$(printf '$%.2f' "$COST")
DURATION_SEC=$((DURATION_MS / 1000))
MINS=$((DURATION_SEC / 60))
SECS=$((DURATION_SEC % 60))

echo "[$MODEL] 💰 $COST_FMT | ⏱️ ${MINS}m ${SECS}s"
```

### Multi-Line Display

```bash
#!/bin/bash
input=$(cat)
MODEL=$(echo "$input" | jq -r '.model.display_name')
DIR=$(echo "$input" | jq -r '.workspace.current_dir')
COST=$(echo "$input" | jq -r '.cost.total_cost_usd // 0')
PCT=$(echo "$input" | jq -r '.context_window.used_percentage // 0' | cut -d. -f1)
DURATION_MS=$(echo "$input" | jq -r '.cost.total_duration_ms // 0')

CYAN='\033[36m'; GREEN='\033[32m'; YELLOW='\033[33m'; RED='\033[31m'; RESET='\033[0m'

if [ "$PCT" -ge 90 ]; then BAR_COLOR="$RED"
elif [ "$PCT" -ge 70 ]; then BAR_COLOR="$YELLOW"
else BAR_COLOR="$GREEN"; fi

FILLED=$((PCT / 10)); EMPTY=$((10 - FILLED))
BAR=$(printf "%${FILLED}s" | tr ' ' '█')$(printf "%${EMPTY}s" | tr ' ' '░')
MINS=$((DURATION_MS / 60000)); SECS=$(((DURATION_MS % 60000) / 1000))

BRANCH=""
git rev-parse --git-dir > /dev/null 2>&1 && BRANCH=" | 🌿 $(git branch --show-current 2>/dev/null)"

echo -e "${CYAN}[$MODEL]${RESET} 📁 ${DIR##*/}$BRANCH"
COST_FMT=$(printf '$%.2f' "$COST")
echo -e "${BAR_COLOR}${BAR}${RESET} ${PCT}% | ${YELLOW}${COST_FMT}${RESET} | ⏱️ ${MINS}m ${SECS}s"
```

### Clickable Links (OSC 8)

```bash
#!/bin/bash
input=$(cat)
MODEL=$(echo "$input" | jq -r '.model.display_name')

REMOTE=$(git remote get-url origin 2>/dev/null | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')

if [ -n "$REMOTE" ]; then
    REPO_NAME=$(basename "$REMOTE")
    printf '%b' "[$MODEL] 🔗 \e]8;;${REMOTE}\a${REPO_NAME}\e]8;;\a\n"
else
    echo "[$MODEL]"
fi
```

### Caching Slow Operations

Use a stable, fixed filename for the cache file — do NOT use `$$` (process ID) as it changes every run:

```bash
#!/bin/bash
input=$(cat)
MODEL=$(echo "$input" | jq -r '.model.display_name')
DIR=$(echo "$input" | jq -r '.workspace.current_dir')

CACHE_FILE="/tmp/statusline-git-cache"
CACHE_MAX_AGE=5

cache_is_stale() {
    [ ! -f "$CACHE_FILE" ] || \
    [ $(($(date +%s) - $(stat -f %m "$CACHE_FILE" 2>/dev/null || stat -c %Y "$CACHE_FILE" 2>/dev/null || echo 0))) -gt $CACHE_MAX_AGE ]
}

if cache_is_stale; then
    if git rev-parse --git-dir > /dev/null 2>&1; then
        BRANCH=$(git branch --show-current 2>/dev/null)
        STAGED=$(git diff --cached --numstat 2>/dev/null | wc -l | tr -d ' ')
        MODIFIED=$(git diff --numstat 2>/dev/null | wc -l | tr -d ' ')
        echo "$BRANCH|$STAGED|$MODIFIED" > "$CACHE_FILE"
    else
        echo "||" > "$CACHE_FILE"
    fi
fi

IFS='|' read -r BRANCH STAGED MODIFIED < "$CACHE_FILE"

if [ -n "$BRANCH" ]; then
    echo "[$MODEL] 📁 ${DIR##*/} | 🌿 $BRANCH +$STAGED ~$MODIFIED"
else
    echo "[$MODEL] 📁 ${DIR##*/}"
fi
```

---

## Testing Your Script

```bash
echo '{"model":{"display_name":"Opus"},"context_window":{"used_percentage":25}}' | ./statusline.sh
```

---

## Tips

- Keep output short — long output may get truncated on narrow terminals
- Cache slow operations like `git status` — the script runs frequently
- Handle null values with fallbacks: `// 0` in jq, `or 0` in Python, `|| 0` in JavaScript
- If `disableAllHooks` is `true` in settings, the status line is also disabled

---

## Troubleshooting

| Issue | Fix |
|:------|:----|
| Status line not appearing | Verify script is executable (`chmod +x`); check output goes to stdout not stderr |
| Shows `--` or empty values | Handle null values with fallbacks; fields may be null before first API response |
| OSC 8 links not clickable | Requires iTerm2, Kitty, or WezTerm; Terminal.app doesn't support clickable links |
| Context % shows unexpected values | Use `used_percentage` not cumulative totals; `total_input_tokens` may exceed window size |
| Script errors or hangs | Non-zero exit codes or no output causes status line to go blank; test independently |
# Optimize Your Terminal Setup

> Claude Code works best when your terminal is properly configured.

---

## Themes and Appearance

Claude cannot control your terminal's theme — that's handled by your terminal application. Match Claude Code's theme to your terminal at any time via `/config`.

For additional customization, configure a [custom status line](statusline.md) to display contextual information (model, working directory, git branch) at the bottom of your terminal.

---

## Line Breaks

Options for entering line breaks in Claude Code:

| Method | Notes |
|:-------|:------|
| `\` followed by Enter | Quick escape, works everywhere |
| Shift+Enter | Works natively in iTerm2, WezTerm, Ghostty, and Kitty |
| Custom keybinding | Set up for other terminals via `/terminal-setup` |

### Set Up Shift+Enter

Run `/terminal-setup` within Claude Code to automatically configure Shift+Enter for VS Code, Alacritty, Zed, and Warp.

> The `/terminal-setup` command only appears in terminals that require manual configuration. iTerm2, WezTerm, Ghostty, and Kitty already support Shift+Enter natively.

**Option+Enter (VS Code, iTerm2, or macOS Terminal.app):**

For Mac Terminal.app:
1. Open Settings → Profiles → Keyboard
2. Check "Use Option as Meta Key"

For iTerm2 and VS Code terminal:
1. Open Settings → Profiles → Keys
2. Under General, set Left/Right Option key to "Esc+"

---

## Notifications

### iTerm 2 System Notifications

1. Open iTerm 2 Preferences
2. Navigate to Profiles → Terminal
3. Enable "Silence bell" and Filter Alerts → "Send escape sequence-generated alerts"
4. Set your preferred notification delay

> These notifications are specific to iTerm 2, not available in macOS Terminal.

### Custom Notification Hooks

For advanced notification handling, create [notification hooks](hooks.md#notification).

---

## Handling Large Inputs

- **Avoid direct pasting** of very long content — Claude Code may struggle with it
- **Use file-based workflows** — write content to a file and ask Claude to read it
- **VS Code terminal** is particularly prone to truncating long pastes

---

## Vim Mode

Enable a subset of Vim keybindings with `/vim` or via `/config`.

### Supported Vim Features

| Category | Keybindings |
|:---------|:------------|
| Mode switching | `Esc` → NORMAL, `i`/`I`, `a`/`A`, `o`/`O` → INSERT |
| Navigation | `h`/`j`/`k`/`l`, `w`/`e`/`b`, `0`/`$`/`^`, `gg`/`G`, `f`/`F`/`t`/`T` with `;`/`,` |
| Editing | `x`, `dw`/`de`/`db`/`dd`/`D`, `cw`/`ce`/`cb`/`cc`/`C`, `.` (repeat) |
| Yank/paste | `yy`/`Y`, `yw`/`ye`/`yb`, `p`/`P` |
| Text objects | `iw`/`aw`, `iW`/`aW`, `i"`/`a"`, `i'`/`a'`, `i(`/`a(`, `i[`/`a[`, `i{`/`a{` |
| Indentation | `>>`/`<<` |
| Line operations | `J` (join lines) |
# Customize Keyboard Shortcuts

> Customize keyboard shortcuts in Claude Code with a keybindings configuration file.

Run `/keybindings` to create or open your configuration file at `~/.claude/keybindings.json`.

> Changes to the keybindings file are automatically detected and applied without restarting.

---

## Configuration File

```json
{
  "$schema": "https://www.schemastore.org/claude-code-keybindings.json",
  "$docs": "https://code.claude.com/docs/en/keybindings",
  "bindings": [
    {
      "context": "Chat",
      "bindings": {
        "ctrl+e": "chat:externalEditor",
        "ctrl+u": null
      }
    }
  ]
}
```

Each binding block specifies a `context` and a map of keystrokes to actions. Set an action to `null` to unbind a default shortcut.

---

## Contexts

| Context | Description |
|:--------|:------------|
| `Global` | Applies everywhere in the app |
| `Chat` | Main chat input area |
| `Autocomplete` | Autocomplete menu is open |
| `Settings` | Settings menu |
| `Confirmation` | Permission and confirmation dialogs |
| `Tabs` | Tab navigation components |
| `Help` | Help menu is visible |
| `Transcript` | Transcript viewer |
| `HistorySearch` | History search mode (Ctrl+R) |
| `Task` | Background task is running |
| `ThemePicker` | Theme picker dialog |
| `Attachments` | Image/attachment bar navigation |
| `Footer` | Footer indicator navigation |
| `MessageSelector` | Rewind and summarize dialog |
| `DiffDialog` | Diff viewer navigation |
| `ModelPicker` | Model picker effort level |
| `Select` | Generic select/list components |
| `Plugin` | Plugin dialog |

---

## Available Actions

### App (`Global`)

| Action | Default | Description |
|:-------|:--------|:------------|
| `app:interrupt` | Ctrl+C | Cancel current operation |
| `app:exit` | Ctrl+D | Exit Claude Code |
| `app:toggleTodos` | Ctrl+T | Toggle task list |
| `app:toggleTranscript` | Ctrl+O | Toggle verbose transcript |

### History

| Action | Default | Description |
|:-------|:--------|:------------|
| `history:search` | Ctrl+R | Open history search |
| `history:previous` | Up | Previous history item |
| `history:next` | Down | Next history item |

### Chat

| Action | Default | Description |
|:-------|:--------|:------------|
| `chat:cancel` | Escape | Cancel current input |
| `chat:cycleMode` | Shift+Tab | Cycle permission modes |
| `chat:modelPicker` | Cmd+P / Meta+P | Open model picker |
| `chat:thinkingToggle` | Cmd+T / Meta+T | Toggle extended thinking |
| `chat:submit` | Enter | Submit message |
| `chat:undo` | Ctrl+_ | Undo last action |
| `chat:externalEditor` | Ctrl+G | Open in external editor |
| `chat:stash` | Ctrl+S | Stash current prompt |
| `chat:imagePaste` | Ctrl+V (Alt+V on Windows) | Paste image |

### Autocomplete

| Action | Default | Description |
|:-------|:--------|:------------|
| `autocomplete:accept` | Tab | Accept suggestion |
| `autocomplete:dismiss` | Escape | Dismiss menu |
| `autocomplete:previous` | Up | Previous suggestion |
| `autocomplete:next` | Down | Next suggestion |

### Confirmation

| Action | Default | Description |
|:-------|:--------|:------------|
| `confirm:yes` | Y, Enter | Confirm action |
| `confirm:no` | N, Escape | Decline action |
| `confirm:previous` | Up | Previous option |
| `confirm:next` | Down | Next option |
| `confirm:nextField` | Tab | Next field |
| `confirm:cycleMode` | Shift+Tab | Cycle permission modes |
| `confirm:toggleExplanation` | Ctrl+E | Toggle permission explanation |
| `permission:toggleDebug` | Ctrl+D | Toggle permission debug info |

### Transcript

| Action | Default | Description |
|:-------|:--------|:------------|
| `transcript:toggleShowAll` | Ctrl+E | Toggle show all content |
| `transcript:exit` | Ctrl+C, Escape | Exit transcript view |

### History Search

| Action | Default | Description |
|:-------|:--------|:------------|
| `historySearch:next` | Ctrl+R | Next match |
| `historySearch:accept` | Escape, Tab | Accept selection |
| `historySearch:cancel` | Ctrl+C | Cancel search |
| `historySearch:execute` | Enter | Execute selected command |

### Task

| Action | Default | Description |
|:-------|:--------|:------------|
| `task:background` | Ctrl+B | Background current task |

### Model Picker

| Action | Default | Description |
|:-------|:--------|:------------|
| `modelPicker:decreaseEffort` | Left | Decrease effort level |
| `modelPicker:increaseEffort` | Right | Increase effort level |

### Select

| Action | Default | Description |
|:-------|:--------|:------------|
| `select:next` | Down, J, Ctrl+N | Next option |
| `select:previous` | Up, K, Ctrl+P | Previous option |
| `select:accept` | Enter | Accept selection |
| `select:cancel` | Escape | Cancel selection |

### Plugin

| Action | Default | Description |
|:-------|:--------|:------------|
| `plugin:toggle` | Space | Toggle plugin selection |
| `plugin:install` | I | Install selected plugins |

### Other Contexts

| Context | Action | Default | Description |
|:--------|:-------|:--------|:------------|
| `ThemePicker` | `theme:toggleSyntaxHighlighting` | Ctrl+T | Toggle syntax highlighting |
| `Help` | `help:dismiss` | Escape | Close help menu |
| `Tabs` | `tabs:next` | Tab, Right | Next tab |
| `Tabs` | `tabs:previous` | Shift+Tab, Left | Previous tab |
| `Attachments` | `attachments:next` | Right | Next attachment |
| `Attachments` | `attachments:previous` | Left | Previous attachment |
| `Attachments` | `attachments:remove` | Backspace, Delete | Remove selected |
| `Attachments` | `attachments:exit` | Down, Escape | Exit attachment bar |
| `Footer` | `footer:next` | Right | Next footer item |
| `Footer` | `footer:previous` | Left | Previous footer item |
| `Footer` | `footer:openSelected` | Enter | Open selected item |
| `Footer` | `footer:clearSelection` | Escape | Clear selection |
| `MessageSelector` | `messageSelector:up` | Up, K | Move up |
| `MessageSelector` | `messageSelector:down` | Down, J | Move down |
| `MessageSelector` | `messageSelector:top` | Ctrl+Up, Meta+Up, Shift+K | Jump to top |
| `MessageSelector` | `messageSelector:bottom` | Ctrl+Down, Meta+Down, Shift+J | Jump to bottom |
| `MessageSelector` | `messageSelector:select` | Enter | Select message |
| `DiffDialog` | `diff:dismiss` | Escape | Close diff viewer |
| `DiffDialog` | `diff:previousFile` | Up | Previous file |
| `DiffDialog` | `diff:nextFile` | Down | Next file |
| `Settings` | `settings:search` | / | Enter search mode |
| `Settings` | `settings:retry` | R | Retry loading data |

---

## Keystroke Syntax

### Modifiers

Use `+` to combine modifiers with keys:

| Modifier | Keys |
|:---------|:-----|
| Control | `ctrl` or `control` |
| Alt/Option | `alt`, `opt`, or `option` |
| Shift | `shift` |
| Meta/Command | `meta`, `cmd`, or `command` |

Examples: `ctrl+k`, `shift+tab`, `meta+p`, `ctrl+shift+c`

### Special Keys

`escape`/`esc`, `enter`/`return`, `tab`, `space`, `up`, `down`, `left`, `right`, `backspace`, `delete`

### Uppercase Letters

A standalone uppercase letter implies Shift: `K` = `shift+k`. Uppercase with modifiers does NOT imply Shift: `ctrl+K` = `ctrl+k`.

### Chords

Space-separated sequences: `ctrl+k ctrl+s` (press Ctrl+K, release, then Ctrl+S)

---

## Reserved Shortcuts

These cannot be rebound:

| Shortcut | Reason |
|:---------|:-------|
| Ctrl+C | Hardcoded interrupt/cancel |
| Ctrl+D | Hardcoded exit |

---

## Terminal Conflicts

| Shortcut | Conflict |
|:---------|:---------|
| Ctrl+B | tmux prefix (press twice to send) |
| Ctrl+A | GNU screen prefix |
| Ctrl+Z | Unix process suspend (SIGTSTP) |

---

## Vim Mode Interaction

- **Vim mode** handles input at the text level (cursor movement, modes, motions)
- **Keybindings** handle actions at the component level (toggle todos, submit, etc.)
- Escape in vim mode switches INSERT → NORMAL; it does not trigger `chat:cancel`
- Most Ctrl+key shortcuts pass through vim mode to the keybinding system
- In vim NORMAL mode, `?` shows the help menu (vim behavior)

---

## Validation

Run `/doctor` to see any keybinding warnings. Claude Code validates:
- Parse errors (invalid JSON or structure)
- Invalid context names
- Reserved shortcut conflicts
- Terminal multiplexer conflicts
- Duplicate bindings in the same context
# Fast Mode

> Get faster Opus 4.6 responses by toggling fast mode in Claude Code.

> **Research Preview:** This feature, pricing, and availability may change based on feedback.

Fast mode is a high-speed configuration for Claude Opus 4.6 — 2.5x faster at a higher cost per token. Toggle it on with `/fast` when you need speed (rapid iteration, live debugging), and off when cost matters more than latency.

Fast mode is not a different model. It uses the same Opus 4.6 with a different API configuration that prioritizes speed over cost efficiency — identical quality, just faster responses.

---

## Toggle Fast Mode

- Type `/fast` and press Tab to toggle on or off
- Or set `"fastMode": true` in your [user settings](settings.md)

Fast mode persists across sessions. For best cost efficiency, enable it at the start of a session rather than switching mid-conversation (switching mid-conversation charges the full uncached input token price for the entire context at the fast mode rate).

**When fast mode is active:**
- Claude Code automatically switches to Opus 4.6 if you're on a different model
- A `↯` icon appears next to the prompt

---

## Pricing

| Mode | Input (MTok) | Output (MTok) |
|:-----|:-------------|:--------------|
| Fast mode on Opus 4.6 (<200K) | $30 | $150 |
| Fast mode on Opus 4.6 (>200K) | $60 | $225 |

Fast mode is compatible with the 1M token extended context window.

> Fast mode usage is billed to extra usage directly — it does not count against your plan's included usage.

---

## When to Use Fast Mode

**Use fast mode for:**
- Rapid iteration on code changes
- Live debugging sessions
- Time-sensitive work with tight deadlines

**Use standard mode for:**
- Long autonomous tasks where speed matters less
- Batch processing or CI/CD pipelines
- Cost-sensitive workloads

### Fast Mode vs. Effort Level

| Setting | Effect |
|:--------|:-------|
| **Fast mode** | Same quality, lower latency, higher cost |
| **Lower effort level** | Less thinking time, faster, potentially lower quality on complex tasks |

You can combine both: fast mode with a lower [effort level](model-config.md#adjust-effort-level) for maximum speed on straightforward tasks.

---

## Requirements

- **Not available on third-party providers** — Amazon Bedrock, Google Vertex AI, and Microsoft Azure Foundry are not supported. Available through Anthropic Console API and Claude subscription plans.
- **Extra usage must be enabled** — allows billing beyond your plan's included usage
  - Individual: enable in [Console billing settings](https://platform.claude.com/settings/organization/billing)
  - Teams/Enterprise: an admin must enable extra usage for the organization
- **Admin enablement for Teams/Enterprise** — fast mode is disabled by default; an admin must explicitly enable it

> If your admin hasn't enabled fast mode, `/fast` will show: "Fast mode has been disabled by your organization."

### Enable Fast Mode for Your Organization

Admins can enable fast mode in:
- **Console** (API customers): [Claude Code preferences](https://platform.claude.com/claude-code/preferences)
- **Claude AI** (Teams and Enterprise): [Admin Settings → Claude Code](https://claude.ai/admin-settings/claude-code)

---

## Rate Limits

Fast mode has separate rate limits from standard Opus 4.6. When you hit the fast mode rate limit or run out of extra usage credits:

1. Fast mode automatically falls back to standard Opus 4.6
2. The `↯` icon turns gray to indicate cooldown
3. You continue working at standard speed and pricing
4. Fast mode re-enables automatically when the cooldown expires

Run `/fast` to disable fast mode manually instead of waiting.