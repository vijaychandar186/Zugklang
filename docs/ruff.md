# Ruff Documentation

> An extremely fast Python linter and code formatter, written in Rust.

---

## Table of Contents

1. [Overview](#overview)
2. [Installing Ruff](#installing-ruff)
3. [Tutorial](#tutorial)
4. [The Ruff Linter](#the-ruff-linter)
5. [The Ruff Formatter](#the-ruff-formatter)
6. [Editor Integration](#editor-integration)
7. [Configuring Ruff](#configuring-ruff)
8. [Preview Mode](#preview-mode)
9. [Rules Reference](#rules-reference)
10. [Settings Reference](#settings-reference)
11. [Versioning](#versioning)
12. [Integrations](#integrations)

---

## Overview

Ruff aims to be orders of magnitude faster than alternative tools while integrating more functionality behind a single, common interface. It can replace Flake8 (plus dozens of plugins), Black, isort, pydocstyle, pyupgrade, autoflake, and more — all while executing tens or hundreds of times faster.

**Key features:**

- ⚡️ 10–100x faster than existing linters (like Flake8) and formatters (like Black)
- 🐍 Installable via pip
- 🛠️ `pyproject.toml` support
- 🤝 Python 3.14 compatibility
- ⚖️ Drop-in parity with Flake8, isort, and Black
- 📦 Built-in caching to avoid re-analyzing unchanged files
- 🔧 Fix support for automatic error correction (e.g., removing unused imports)
- 📏 Over 800 built-in rules with native re-implementations of popular Flake8 plugins
- ⌨️ First-party editor integrations for VS Code and more
- 🌎 Monorepo-friendly with hierarchical and cascading configuration

Ruff is backed by [Astral](https://astral.sh), the creators of `uv` and `ty`, and is used in major open-source projects including Apache Airflow, FastAPI, Hugging Face, Pandas, and SciPy.

---

## Installing Ruff

Ruff is available as `ruff` on PyPI. You can invoke it directly with `uvx` or install it via several package managers.

### Quick Invocation (no install)

```sh
uvx ruff check   # Lint all files in the current directory
uvx ruff format  # Format all files in the current directory
```

### Installation

```sh
# Recommended: install with uv
uv tool install ruff@latest

# Add to a specific project
uv add --dev ruff

# With pip
pip install ruff

# With pipx
pipx install ruff
```

### Standalone Installers (v0.5.0+)

```sh
# macOS and Linux
curl -LsSf https://astral.sh/ruff/install.sh | sh

# Windows
powershell -c "irm https://astral.sh/ruff/install.ps1 | iex"

# Specific version
curl -LsSf https://astral.sh/ruff/0.5.0/install.sh | sh
```

### Other Package Managers

```sh
brew install ruff                        # Homebrew (macOS/Linux)
conda install -c conda-forge ruff        # Conda
pkgx install ruff                        # pkgx
pacman -S ruff                           # Arch Linux
apk add ruff                             # Alpine Linux
sudo zypper install python3-ruff         # openSUSE Tumbleweed
```

### Docker

```sh
docker run -v .:/io --rm ghcr.io/astral-sh/ruff check
docker run -v .:/io --rm ghcr.io/astral-sh/ruff:0.3.0 check

# Podman on SELinux
docker run -v .:/io:Z --rm ghcr.io/astral-sh/ruff check
```

### Basic Usage

```sh
ruff check   # Lint all files in the current directory
ruff format  # Format all files in the current directory
```

---

## Tutorial

### Getting Started

Initialize a project and add Ruff:

```sh
uv init --lib numbers
uv add --dev ruff
```

Run the linter:

```sh
uv run ruff check
```

Automatically fix issues:

```sh
uv run ruff check --fix
```

Run the formatter:

```sh
uv run ruff format
```

Check a specific file:

```sh
uv run ruff check src/numbers/calculate.py
```

### Configuration

Ruff looks for the first `pyproject.toml`, `ruff.toml`, or `.ruff.toml` file in the file's directory or any parent directory.

```toml
# pyproject.toml
[tool.ruff]
line-length = 79

[tool.ruff.lint]
extend-select = ["E501"]
```

Specify your minimum Python version:

```toml
[project]
requires-python = ">=3.10"

[tool.ruff]
line-length = 79

[tool.ruff.lint]
extend-select = ["E501"]
```

### Rule Selection

```toml
[tool.ruff.lint]
extend-select = [
  "UP",  # pyupgrade
  "D",   # pydocstyle
]

[tool.ruff.lint.pydocstyle]
convention = "google"
```

### Ignoring Errors

**Single line:**

```python
x = 1  # noqa: F841
i = 1  # noqa: E741, F841
x = 1  # noqa  # ignore all violations
```

**Entire file:**

```python
# ruff: noqa: UP035
from typing import Iterable
```

**Block-level:**

```python
# ruff: disable[E501]
VALUE_1 = "Lorem ipsum dolor sit amet ..."
VALUE_2 = "Lorem ipsum dolor sit amet ..."
# ruff: enable[E501]
```

### Adding Rules to an Existing Codebase

Automatically add `# noqa` directives to all existing violations before enforcing a new rule:

```sh
uv run ruff check --select UP035 --add-noqa .
```

### Pre-commit Integration

```yaml
- repo: https://github.com/astral-sh/ruff-pre-commit
  rev: v0.15.4
  hooks:
    - id: ruff-check # Run the linter
    - id: ruff-format # Run the formatter
```

---

## The Ruff Linter

### `ruff check` Commands

```sh
ruff check                  # Lint files in the current directory
ruff check --fix            # Lint and fix any fixable errors
ruff check --watch          # Lint and re-lint on file changes
ruff check path/to/code/    # Lint files in a specific path
```

### Rule Selection

Rule codes consist of a 1–3 letter prefix followed by three digits (e.g., `F401`). The prefix indicates the source (e.g., `F` for Pyflakes, `E` for pycodestyle).

```toml
[tool.ruff.lint]
select = ["E", "F"]
ignore = ["F401"]
```

**Recommended rule set:**

```toml
[tool.ruff.lint]
select = [
    "E",    # pycodestyle
    "F",    # Pyflakes
    "UP",   # pyupgrade
    "B",    # flake8-bugbear
    "SIM",  # flake8-simplify
    "I",    # isort
]
```

**Tips:**

- Prefer `lint.select` over `lint.extend-select` to keep your rule set explicit.
- Use `ALL` with discretion — it will implicitly enable new rules on upgrade.
- Start small (`["E", "F"]`) and add rule categories incrementally.

### Fixes

```sh
ruff check --fix           # Apply safe fixes only
ruff check --unsafe-fixes  # Also apply unsafe fixes
```

**Safe fixes** preserve runtime behavior. **Unsafe fixes** may change behavior, remove comments, or alter exception types. Ruff applies only safe fixes by default.

Adjust fix safety per rule:

```toml
[tool.ruff.lint]
extend-safe-fixes = ["F601"]    # Promote to safe
extend-unsafe-fixes = ["UP034"] # Demote to unsafe
```

### Disabling Fixes

```toml
[tool.ruff.lint]
fixable = ["ALL"]
unfixable = ["F401"]  # Never auto-fix unused imports
```

### Error Suppression

**Per-file ignores:**

```toml
[tool.ruff.lint.per-file-ignores]
"__init__.py" = ["E402"]
"**/{tests,docs,tools}/*" = ["E402"]
```

**Detecting unused suppressions:**

```sh
ruff check /path/to/file.py --extend-select RUF100
ruff check /path/to/file.py --extend-select RUF100 --fix
```

**Auto-add noqa directives:**

```sh
ruff check /path/to/file.py --add-noqa
```

### Exit Codes

| Code | Meaning                                                                     |
| ---- | --------------------------------------------------------------------------- |
| `0`  | No violations found, or all violations were auto-fixed                      |
| `1`  | Violations were found                                                       |
| `2`  | Ruff terminated abnormally (invalid config, CLI options, or internal error) |

Flags: `--exit-zero` (always exit 0), `--exit-non-zero-on-fix` (exit 1 even if all fixed).

---

## The Ruff Formatter

The Ruff formatter is designed as a drop-in replacement for Black, with an emphasis on performance and direct integration with Ruff's linter.

### `ruff format` Commands

```sh
ruff format                   # Format all files in the current directory
ruff format path/to/code/     # Format all files in a directory
ruff format path/to/file.py   # Format a single file
ruff format --check           # Check without writing; exit non-zero if changes needed
```

### Configuration

```toml
[tool.ruff]
line-length = 100

[tool.ruff.format]
quote-style = "single"
indent-style = "tab"
docstring-code-format = true
```

### Docstring Formatting

Ruff can auto-format Python code examples in docstrings. Recognized formats:

- Python doctest format
- CommonMark fenced code blocks (`python`, `py`, `python3`, `py3`)
- reStructuredText literal blocks
- reStructuredText `code-block` and `sourcecode` directives

```toml
[tool.ruff.format]
docstring-code-format = true
docstring-code-line-length = 20  # or "dynamic" (default)
```

### Markdown Code Formatting _(Preview only)_

Format Python code blocks in `.md` files:

```sh
ruff format --preview --check docs/
ruff format --preview --check docs/*.md
```

To include Markdown files by default:

```toml
[tool.ruff]
extend-include = ["*.md"]
```

### Format Suppression

```python
# fmt: off
not_formatted = 3
also_not_formatted = 4
# fmt: on

a = [1, 2, 3, 4, 5]  # fmt: skip
```

### Conflicting Lint Rules

When using the formatter, avoid enabling these lint rules as they may conflict:

`W191`, `E111`, `E114`, `E117`, `D206`, `D300`, `Q000`, `Q001`, `Q002`, `Q003`, `Q004`, `COM812`, `COM819`, `ISC002`

Also avoid these isort settings with non-default values: `force-single-line`, `force-wrap-aliases`, `lines-after-imports`, `lines-between-types`, `split-on-trailing-comma`.

### Sorting Imports

The formatter does not sort imports. Run both steps explicitly:

```sh
ruff check --select I --fix
ruff format
```

### Exit Codes (`ruff format`)

| Code | Meaning                                                            |
| ---- | ------------------------------------------------------------------ |
| `0`  | Terminated successfully                                            |
| `1`  | Files were formatted and `--exit-non-zero-on-format` was specified |
| `2`  | Abnormal termination                                               |

For `ruff format --check`: `0` = no changes needed, `1` = changes would be made.

---

## Editor Integration

Ruff provides a built-in Language Server Protocol (LSP) implementation via `ruff server`, written in Rust. It replaced the older `ruff-lsp` Python-based server (stabilized in v0.5.3).

**Features:**

- Real-time diagnostic highlighting
- Dynamic config refresh on `pyproject.toml` / `ruff.toml` changes
- Full document and range formatting
- Code actions (quick fixes, noqa suppression, organize imports)
- Hover documentation for noqa codes
- Full Jupyter Notebook support

### VS Code

Install the [Ruff extension](https://marketplace.visualstudio.com/items?itemName=charliermarsh.ruff) from the VS Code Marketplace (v2024.32.0+).

Auto-fix and organize imports on save:

```json
{
  "[python]": {
    "editor.codeActionsOnSave": {
      "source.fixAll.ruff": "explicit",
      "source.organizeImports.ruff": "explicit"
    }
  }
}
```

### Neovim

```lua
require('lspconfig').ruff.setup({
  init_options = {
    settings = {
      -- Ruff language server settings go here
    }
  }
})
```

Disable hover in favor of Pyright:

```lua
vim.api.nvim_create_autocmd("LspAttach", {
  callback = function(args)
    local client = vim.lsp.get_client_by_id(args.data.client_id)
    if client and client.name == 'ruff' then
      client.server_capabilities.hoverProvider = false
    end
  end,
})
```

### Vim

```vim
if executable('ruff')
    au User lsp_setup call lsp#register_server({
        \ 'name': 'ruff',
        \ 'cmd': {server_info->['ruff', 'server']},
        \ 'allowlist': ['python'],
        \ 'workspace_config': {},
        \ })
endif
```

### Helix

In `languages.toml`:

```toml
[language-server.ruff]
command = "ruff"
args = ["server"]

[[language]]
name = "python"
language-servers = ["ruff"]
auto-format = true

[language-server.ruff.config.settings]
lineLength = 80

[language-server.ruff.config.settings.lint]
select = ["E4", "E7"]
```

### Zed

In `settings.json`:

```json
{
  "lsp": {
    "ruff": {
      "initialization_options": {
        "settings": {
          "lineLength": 80,
          "lint": {
            "extendSelect": ["I"]
          }
        }
      }
    }
  }
}
```

### Emacs

```elisp
(with-eval-after-load 'eglot
  (add-to-list 'eglot-server-programs
               '(python-base-mode . ("ruff" "server"))))
(add-hook 'python-base-mode-hook
          (lambda ()
            (eglot-ensure)
            (add-hook 'after-save-hook 'eglot-format nil t)))
```

### Other Editors

| Editor       | Method                                                             |
| ------------ | ------------------------------------------------------------------ |
| PyCharm      | Built-in support (v2025.3+) via _Settings → Python → Tools → Ruff_ |
| Kate         | LSP Client plugin with manual server config                        |
| Sublime Text | LSP + LSP-ruff package                                             |
| TextMate     | `textmate2-ruff-linter` bundle                                     |

---

## Configuring Ruff

Ruff can be configured via `pyproject.toml`, `ruff.toml`, or `.ruff.toml`. Priority order (highest to lowest): `.ruff.toml` → `ruff.toml` → `pyproject.toml`.

### Default Configuration

```toml
# ruff.toml
line-length = 88
indent-width = 4
target-version = "py39"

[lint]
select = ["E4", "E7", "E9", "F"]
ignore = []
fixable = ["ALL"]
unfixable = []
dummy-variable-rgx = "^(_+|(_+[a-zA-Z0-9_]*[a-zA-Z0-9]+?))$"

[format]
quote-style = "double"
indent-style = "space"
skip-magic-trailing-comma = false
line-ending = "auto"
docstring-code-format = false
docstring-code-line-length = "dynamic"
```

### Example Configuration

```toml
[lint]
select = ["E4", "E7", "E9", "F", "B"]
ignore = ["E501"]
unfixable = ["B"]

[lint.per-file-ignores]
"__init__.py" = ["E402"]
"**/{tests,docs,tools}/*" = ["E402"]

[format]
quote-style = "single"
```

### Hierarchical Configuration

Ruff uses the "closest" config file in the directory hierarchy. To inherit settings from a parent config:

```toml
# ruff.toml
extend = "../ruff.toml"
line-length = 100
```

### Inferring Python Version

If `target-version` is not set, Ruff falls back to the `requires-python` field in `pyproject.toml`.

### File Discovery

By default, Ruff discovers `*.py`, `*.pyi`, `*.ipynb`, and `pyproject.toml` files.

```toml
# Only include specific paths
include = ["pyproject.toml", "src/**/*.py", "scripts/**/*.py"]

# Exclude additional paths
extend-exclude = ["*.ipynb"]
```

Exclude files from formatting only (still linted):

```toml
[format]
exclude = ["*.pyi"]
```

### Jupyter Notebook Support

```toml
# Lint only, skip formatting
[format]
exclude = ["*.ipynb"]

# Format only, skip linting
[lint]
exclude = ["*.ipynb"]

# Per-notebook rule ignores
[lint.per-file-ignores]
"*.ipynb" = ["T20"]
```

### CLI Usage

```sh
ruff check path/to/code/ --select F401 --select F403 --quiet
ruff check path/to/file --config path/to/ruff.toml
ruff check path/to/file --config "lint.dummy-variable-rgx = '__.*'"
```

### Shell Autocompletion

```sh
# Bash
echo 'eval "$(ruff generate-shell-completion bash)"' >> ~/.bashrc

# Zsh, fish, elvish, PowerShell also supported
ruff generate-shell-completion <SHELL>
```

---

## Preview Mode

Ruff includes an opt-in preview mode to provide an opportunity for community feedback and increase confidence that changes are a net-benefit before enabling them for everyone.

Preview mode enables a collection of unstable features such as new lint rules and fixes, formatter style changes, interface updates, and more. Warnings about deprecated features may turn into errors when using preview mode.

**Enabling preview mode does not on its own enable all preview rules.**

### Enabling Preview Mode

Preview mode can be enabled with the `--preview` flag on the CLI or by setting `preview = true` in your Ruff configuration file.

Preview mode can be configured separately for linting and formatting.

To enable preview lint rules without preview style formatting:

```toml
# pyproject.toml
[tool.ruff.lint]
preview = true
```

To enable preview style formatting without enabling any preview lint rules:

```toml
# pyproject.toml
[tool.ruff.format]
preview = true
```

### Using Rules in Preview

If a rule is marked as preview, it can only be selected if preview mode is enabled. For example, consider a hypothetical rule `HYP001`. Even with `select = ["ALL"]` or a category prefix, preview rules are excluded unless `preview = true`.

However, it would be enabled in any of the above cases if you enabled preview mode:

```toml
[tool.ruff.lint]
extend-select = ["HYP"]
preview = true  # required to activate preview rules
```

### Selecting Single Preview Rules

When preview mode is enabled, selecting rule categories or prefixes will include all preview rules that match. If you'd prefer to opt in to each preview rule individually:

```toml
[tool.ruff.lint]
preview = true
explicit-preview-rules = true
```

In this configuration, `--select` with `ALL`, `HYP`, `HYP0`, or `HYP00` would not enable `HYP001`. Each preview rule will need to be selected with its exact code: for example, `--select ALL,HYP001`.

If preview mode is not enabled, this setting has no effect.

### Deprecated Rules

When preview mode is enabled, deprecated rules will be disabled. If a deprecated rule is selected explicitly, an error will be raised. Deprecated rules will not be included if selected via a rule category or prefix.

---

## Rules Reference

Ruff supports over 900 lint rules, many of which are inspired by popular tools like Flake8, isort, pyupgrade, and others. Regardless of the rule's origin, Ruff re-implements every rule in Rust as a first-party feature.

By default, Ruff enables Flake8's `F` rules, along with a subset of the `E` rules, omitting any stylistic rules that overlap with the use of a formatter, like `ruff format` or Black.

### Legend

| Icon | Meaning                                          |
| ---- | ------------------------------------------------ |
| 🧪   | Unstable — rule is in "preview"                  |
| ⚠️   | Deprecated — will be removed in a future release |
| ❌   | Removed — documentation only                     |
| 🛠️   | Auto-fixable via `--fix`                         |

All rules not marked as preview, deprecated, or removed are **stable**.

---

### Airflow (AIR)

| Code        | Name                                     | Message                                                         |
| ----------- | ---------------------------------------- | --------------------------------------------------------------- |
| AIR001      | airflow-variable-name-task-id-mismatch   | Task variable name should match the task_id: "{task_id}"        |
| AIR002      | airflow-dag-no-schedule-argument         | DAG or @dag should have an explicit schedule argument           |
| AIR301 🛠️   | airflow3-removal                         | {deprecated} is removed in Airflow 3.0                          |
| AIR302 🛠️   | airflow3-moved-to-provider               | {deprecated} is moved into {provider} provider in Airflow 3.0   |
| AIR303 🧪   | airflow3-incompatible-function-signature | {function_name} signature is changed in Airflow 3.0             |
| AIR311 🛠️   | airflow3-suggested-update                | {deprecated} is removed in Airflow 3.0; still works temporarily |
| AIR312 🛠️   | airflow3-suggested-to-move-to-provider   | {deprecated} is deprecated and moved into {provider}            |
| AIR321 🧪🛠️ | airflow31-moved                          | {deprecated} is moved in Airflow 3.1                            |

### eradicate (ERA)

| Code   | Name               | Message                  |
| ------ | ------------------ | ------------------------ |
| ERA001 | commented-out-code | Found commented-out code |

### FastAPI (FAST)

| Code       | Name                              | Message                                                                          |
| ---------- | --------------------------------- | -------------------------------------------------------------------------------- |
| FAST001 🛠️ | fast-api-redundant-response-model | FastAPI route with redundant response_model argument                             |
| FAST002 🛠️ | fast-api-non-annotated-dependency | FastAPI dependency without Annotated                                             |
| FAST003 🛠️ | fast-api-unused-path-parameter    | Parameter {arg_name} appears in route path, but not in {function_name} signature |

### flake8-2020 (YTT)

| Code   | Name                           | Message                                              |
| ------ | ------------------------------ | ---------------------------------------------------- |
| YTT101 | sys-version-slice3             | sys.version[:3] referenced, use sys.version_info     |
| YTT102 | sys-version2                   | sys.version[2] referenced, use sys.version_info      |
| YTT103 | sys-version-cmp-str3           | sys.version compared to string, use sys.version_info |
| YTT201 | sys-version-info0-eq3          | sys.version_info[0] == 3 referenced, use >=          |
| YTT202 | six-py3                        | six.PY3 referenced, use not six.PY2                  |
| YTT203 | sys-version-info1-cmp-int      | sys.version_info[1] compared to integer              |
| YTT204 | sys-version-info-minor-cmp-int | sys.version_info.minor compared to integer           |
| YTT301 | sys-version0                   | sys.version[0] referenced, use sys.version_info      |
| YTT302 | sys-version-cmp-str10          | sys.version compared to string, use sys.version_info |
| YTT303 | sys-version-slice1             | sys.version[:1] referenced, use sys.version_info     |

### flake8-annotations (ANN)

| Code      | Name                                             | Message                                                             |
| --------- | ------------------------------------------------ | ------------------------------------------------------------------- |
| ANN001    | missing-type-function-argument                   | Missing type annotation for function argument {name}                |
| ANN002    | missing-type-args                                | Missing type annotation for \*{name}                                |
| ANN003    | missing-type-kwargs                              | Missing type annotation for \*\*{name}                              |
| ANN101 ❌ | missing-type-self                                | Missing type annotation for {name} in method                        |
| ANN102 ❌ | missing-type-cls                                 | Missing type annotation for {name} in classmethod                   |
| ANN201 🛠️ | missing-return-type-undocumented-public-function | Missing return type annotation for public function {name}           |
| ANN202 🛠️ | missing-return-type-private-function             | Missing return type annotation for private function {name}          |
| ANN204 🛠️ | missing-return-type-special-method               | Missing return type annotation for special method {name}            |
| ANN205 🛠️ | missing-return-type-static-method                | Missing return type annotation for staticmethod {name}              |
| ANN206 🛠️ | missing-return-type-class-method                 | Missing return type annotation for classmethod {name}               |
| ANN401    | any-type                                         | Dynamically typed expressions (typing.Any) are disallowed in {name} |

### flake8-async (ASYNC)

| Code        | Name                                       | Message                                                               |
| ----------- | ------------------------------------------ | --------------------------------------------------------------------- |
| ASYNC100    | cancel-scope-no-checkpoint                 | A with context does not contain any await statements                  |
| ASYNC105 🛠️ | trio-sync-call                             | Call to {method_name} is not immediately awaited                      |
| ASYNC109    | async-function-with-timeout                | Async function definition with a timeout parameter                    |
| ASYNC110    | async-busy-wait                            | Use Event instead of awaiting sleep in a while loop                   |
| ASYNC115 🛠️ | async-zero-sleep                           | Use lowlevel.checkpoint() instead of sleep(0)                         |
| ASYNC116 🛠️ | long-sleep-not-forever                     | sleep() with >24 hour interval should usually be sleep_forever()      |
| ASYNC210    | blocking-http-call-in-async-function       | Async functions should not call blocking HTTP methods                 |
| ASYNC212    | blocking-http-call-httpx-in-async-function | Blocking httpx method in async context                                |
| ASYNC220    | create-subprocess-in-async-function        | Async functions should not create subprocesses with blocking methods  |
| ASYNC221    | run-process-in-async-function              | Async functions should not run processes with blocking methods        |
| ASYNC222    | wait-for-process-in-async-function         | Async functions should not wait on processes with blocking methods    |
| ASYNC230    | blocking-open-call-in-async-function       | Async functions should not open files with blocking methods like open |
| ASYNC240    | blocking-path-method-in-async-function     | Async functions should not use path library methods                   |
| ASYNC250    | blocking-input-in-async-function           | Blocking call to input() in async context                             |
| ASYNC251    | blocking-sleep-in-async-function           | Async functions should not call time.sleep                            |

### flake8-bandit (S)

| Code | Name                            | Message                                                                   |
| ---- | ------------------------------- | ------------------------------------------------------------------------- |
| S101 | assert                          | Use of assert detected                                                    |
| S102 | exec-builtin                    | Use of exec detected                                                      |
| S103 | bad-file-permissions            | os.chmod setting a permissive mask on file or directory                   |
| S104 | hardcoded-bind-all-interfaces   | Possible binding to all interfaces                                        |
| S105 | hardcoded-password-string       | Possible hardcoded password assigned to: "{}"                             |
| S106 | hardcoded-password-func-arg     | Possible hardcoded password assigned to argument                          |
| S107 | hardcoded-password-default      | Possible hardcoded password assigned to function default                  |
| S108 | hardcoded-temp-file             | Probable insecure usage of temporary file or directory                    |
| S110 | try-except-pass                 | try-except-pass detected, consider logging the exception                  |
| S112 | try-except-continue             | try-except-continue detected, consider logging the exception              |
| S113 | request-without-timeout         | Probable use of call without timeout                                      |
| S201 | flask-debug-true                | Use of debug=True in Flask app detected                                   |
| S301 | suspicious-pickle-usage         | pickle can be unsafe when deserializing untrusted data                    |
| S307 | suspicious-eval-usage           | Use of possibly insecure function; consider ast.literal_eval              |
| S324 | hashlib-insecure-hash-function  | Probable use of insecure hash functions                                   |
| S501 | request-with-no-cert-validation | Probable use of call with verify=False                                    |
| S506 | unsafe-yaml-load                | Probable use of unsafe loader with yaml.load                              |
| S507 | ssh-no-host-key-verification    | Paramiko call with policy set to automatically trust the unknown host key |
| S608 | hardcoded-sql-expression        | Possible SQL injection via string-based query construction                |
| S701 | jinja2-autoescape-false         | Using jinja2 templates with autoescape=False is dangerous                 |
| S702 | mako-templates                  | Mako templates allow HTML/JavaScript rendering by default                 |

### flake8-blind-except (BLE)

| Code   | Name         | Message                              |
| ------ | ------------ | ------------------------------------ |
| BLE001 | blind-except | Do not catch blind exception: {name} |

### flake8-boolean-trap (FBT)

| Code   | Name                                      | Message                                                    |
| ------ | ----------------------------------------- | ---------------------------------------------------------- |
| FBT001 | boolean-type-hint-positional-argument     | Boolean-typed positional argument in function definition   |
| FBT002 | boolean-default-value-positional-argument | Boolean default positional argument in function definition |
| FBT003 | boolean-positional-value-in-call          | Boolean positional value in function call                  |

### flake8-bugbear (B)

| Code    | Name                                        | Message                                                                        |
| ------- | ------------------------------------------- | ------------------------------------------------------------------------------ |
| B002    | unary-prefix-increment-decrement            | Python does not support the unary prefix increment operator (++)               |
| B004 🛠️ | unreliable-callable-check                   | Using hasattr(x, "**call**") to test if x is callable is unreliable            |
| B005    | strip-with-multi-characters                 | Using .strip() with multi-character strings is misleading                      |
| B006 🛠️ | mutable-argument-default                    | Do not use mutable data structures for argument defaults                       |
| B007 🛠️ | unused-loop-control-variable                | Loop control variable {name} not used within loop body                         |
| B008    | function-call-in-default-argument           | Do not perform function call {name} in argument defaults                       |
| B009 🛠️ | get-attr-with-constant                      | Do not call getattr with a constant attribute value                            |
| B010 🛠️ | set-attr-with-constant                      | Do not call setattr with a constant attribute value                            |
| B011 🛠️ | assert-false                                | Do not assert False, raise AssertionError()                                    |
| B012    | jump-statement-in-finally                   | {name} inside finally blocks cause exceptions to be silenced                   |
| B013 🛠️ | redundant-tuple-in-exception-handler        | A length-one tuple literal is redundant in exception handlers                  |
| B014 🛠️ | duplicate-handler-exception                 | Exception handler with duplicate exception: {name}                             |
| B017    | assert-raises-exception                     | Do not assert blind exception                                                  |
| B019    | cached-instance-method                      | lru_cache/cache on methods can lead to memory leaks                            |
| B023    | function-uses-loop-variable                 | Function definition does not bind loop variable {name}                         |
| B024    | abstract-base-class-without-abstract-method | {name} is an abstract base class with no abstract methods                      |
| B027    | empty-method-without-abstract-decorator     | {name} is an empty method in an abstract base class without abstract decorator |
| B028 🛠️ | no-explicit-stacklevel                      | No explicit stacklevel keyword argument found                                  |
| B033 🛠️ | duplicate-value                             | Sets should not contain duplicate item {value}                                 |
| B904    | raise-without-from-inside-except            | raise exceptions with raise ... from err                                       |
| B905 🛠️ | zip-without-explicit-strict                 | zip() without an explicit strict= parameter                                    |
| B901 🧪 | return-in-generator                         | Using yield and return in a generator can lead to confusing behavior           |
| B903 🧪 | class-as-data-structure                     | Class could be dataclass or namedtuple                                         |
| B909 🧪 | loop-iterator-mutation                      | Mutation to loop iterable {name} during iteration                              |
| B911    | batched-without-explicit-strict             | itertools.batched() without an explicit strict parameter                       |
| B912 🛠️ | map-without-explicit-strict                 | map() without an explicit strict= parameter                                    |

### flake8-builtins (A)

| Code | Name                              | Message                                                |
| ---- | --------------------------------- | ------------------------------------------------------ |
| A001 | builtin-variable-shadowing        | Variable {name} is shadowing a Python builtin          |
| A002 | builtin-argument-shadowing        | Function argument {name} is shadowing a Python builtin |
| A003 | builtin-attribute-shadowing       | Python builtin is shadowed by class attribute {name}   |
| A004 | builtin-import-shadowing          | Import {name} is shadowing a Python builtin            |
| A005 | stdlib-module-shadowing           | Module {name} shadows a Python standard-library module |
| A006 | builtin-lambda-argument-shadowing | Lambda argument {name} is shadowing a Python builtin   |

### flake8-commas (COM)

| Code      | Name                         | Message                                 |
| --------- | ---------------------------- | --------------------------------------- |
| COM812 🛠️ | missing-trailing-comma       | Trailing comma missing                  |
| COM818    | trailing-comma-on-bare-tuple | Trailing comma on bare tuple prohibited |
| COM819 🛠️ | prohibited-trailing-comma    | Trailing comma prohibited               |

### flake8-comprehensions (C4)

| Code    | Name                                        | Message                                                          |
| ------- | ------------------------------------------- | ---------------------------------------------------------------- |
| C400 🛠️ | unnecessary-generator-list                  | Unnecessary generator (rewrite using list())                     |
| C401 🛠️ | unnecessary-generator-set                   | Unnecessary generator (rewrite using set())                      |
| C402 🛠️ | unnecessary-generator-dict                  | Unnecessary generator (rewrite as a dict comprehension)          |
| C403 🛠️ | unnecessary-list-comprehension-set          | Unnecessary list comprehension (rewrite as a set comprehension)  |
| C404 🛠️ | unnecessary-list-comprehension-dict         | Unnecessary list comprehension (rewrite as a dict comprehension) |
| C405 🛠️ | unnecessary-literal-set                     | Unnecessary {kind} literal (rewrite as a set literal)            |
| C406 🛠️ | unnecessary-literal-dict                    | Unnecessary dict literal (rewrite as a dict literal)             |
| C408 🛠️ | unnecessary-collection-call                 | Unnecessary {kind}() call (rewrite as a literal)                 |
| C409 🛠️ | unnecessary-literal-within-tuple-call       | Unnecessary list literal passed to tuple()                       |
| C410 🛠️ | unnecessary-literal-within-list-call        | Unnecessary list literal passed to list()                        |
| C411 🛠️ | unnecessary-list-call                       | Unnecessary list() call                                          |
| C413 🛠️ | unnecessary-call-around-sorted              | Unnecessary {func}() call around sorted()                        |
| C414 🛠️ | unnecessary-double-cast-or-process          | Unnecessary {inner}() call within {outer}()                      |
| C415    | unnecessary-subscript-reversal              | Unnecessary subscript reversal of iterable within {func}()       |
| C416 🛠️ | unnecessary-comprehension                   | Unnecessary {kind} comprehension (rewrite using {kind}())        |
| C417 🛠️ | unnecessary-map                             | Unnecessary map() usage                                          |
| C418 🛠️ | unnecessary-literal-within-dict-call        | Unnecessary dict passed to dict()                                |
| C419 🛠️ | unnecessary-comprehension-in-call           | Unnecessary list comprehension                                   |
| C420 🛠️ | unnecessary-dict-comprehension-for-iterable | Unnecessary dict comprehension; use dict.fromkeys instead        |

### flake8-copyright (CPY)

| Code      | Name                     | Message                                 |
| --------- | ------------------------ | --------------------------------------- |
| CPY001 🧪 | missing-copyright-notice | Missing copyright notice at top of file |

### flake8-datetimez (DTZ)

| Code   | Name                                | Message                                                         |
| ------ | ----------------------------------- | --------------------------------------------------------------- |
| DTZ001 | call-datetime-without-tzinfo        | datetime.datetime() called without a tzinfo argument            |
| DTZ002 | call-datetime-today                 | datetime.datetime.today() used                                  |
| DTZ003 | call-datetime-utcnow                | datetime.datetime.utcnow() used                                 |
| DTZ004 | call-datetime-utcfromtimestamp      | datetime.datetime.utcfromtimestamp() used                       |
| DTZ005 | call-datetime-now-without-tzinfo    | datetime.datetime.now() called without a tz argument            |
| DTZ006 | call-datetime-fromtimestamp         | datetime.datetime.fromtimestamp() called without a tz argument  |
| DTZ007 | call-datetime-strptime-without-zone | Naive datetime constructed using strptime() without %z          |
| DTZ011 | call-date-today                     | datetime.date.today() used                                      |
| DTZ012 | call-date-fromtimestamp             | datetime.date.fromtimestamp() used                              |
| DTZ901 | datetime-min-max                    | Use of datetime.datetime.{min_max} without timezone information |

### flake8-debugger (T10)

| Code | Name     | Message                  |
| ---- | -------- | ------------------------ |
| T100 | debugger | Trace found: {name} used |

### flake8-django (DJ)

| Code  | Name                                   | Message                                                                                |
| ----- | -------------------------------------- | -------------------------------------------------------------------------------------- |
| DJ001 | django-nullable-model-string-field     | Avoid using null=True on string-based fields such as {field_name}                      |
| DJ003 | django-locals-in-render-function       | Avoid passing locals() as context to a render function                                 |
| DJ006 | django-exclude-with-model-form         | Do not use exclude with ModelForm, use fields instead                                  |
| DJ007 | django-all-with-model-form             | Do not use **all** with ModelForm, use fields instead                                  |
| DJ008 | django-model-without-dunder-str        | Model does not define **str** method                                                   |
| DJ012 | django-unordered-body-content-in-model | Order of model's inner classes, methods, and fields does not follow Django Style Guide |
| DJ013 | django-non-leading-receiver-decorator  | @receiver decorator must be on top of all the other decorators                         |

### flake8-errmsg (EM)

| Code     | Name                    | Message                                                                      |
| -------- | ----------------------- | ---------------------------------------------------------------------------- |
| EM101 🛠️ | raw-string-in-exception | Exception must not use a string literal, assign to variable first            |
| EM102 🛠️ | f-string-in-exception   | Exception must not use an f-string literal, assign to variable first         |
| EM103 🛠️ | dot-format-in-exception | Exception must not use a .format() string directly, assign to variable first |

### flake8-executable (EXE)

| Code      | Name                            | Message                                          |
| --------- | ------------------------------- | ------------------------------------------------ |
| EXE001    | shebang-not-executable          | Shebang is present but file is not executable    |
| EXE002    | shebang-missing-executable-file | The file is executable but no shebang is present |
| EXE003    | shebang-missing-python          | Shebang should contain python, pytest, or uv run |
| EXE004 🛠️ | shebang-leading-whitespace      | Avoid whitespace before shebang                  |
| EXE005    | shebang-not-first-line          | Shebang should be at the beginning of the file   |

### flake8-fixme (FIX)

| Code   | Name                | Message                                           |
| ------ | ------------------- | ------------------------------------------------- |
| FIX001 | line-contains-fixme | Line contains FIXME, consider resolving the issue |
| FIX002 | line-contains-todo  | Line contains TODO, consider resolving the issue  |
| FIX003 | line-contains-xxx   | Line contains XXX, consider resolving the issue   |
| FIX004 | line-contains-hack  | Line contains HACK, consider resolving the issue  |

### flake8-future-annotations (FA)

| Code     | Name                              | Message                                                       |
| -------- | --------------------------------- | ------------------------------------------------------------- |
| FA100 🛠️ | future-rewritable-type-annotation | Add from **future** import annotations to simplify {name}     |
| FA102 🛠️ | future-required-type-annotation   | Missing from **future** import annotations, but uses {reason} |

### flake8-implicit-str-concat (ISC)

| Code        | Name                                                | Message                                                          |
| ----------- | --------------------------------------------------- | ---------------------------------------------------------------- |
| ISC001 🛠️   | single-line-implicit-string-concatenation           | Implicitly concatenated string literals on one line              |
| ISC002      | multi-line-implicit-string-concatenation            | Implicitly concatenated string literals over multiple lines      |
| ISC003 🛠️   | explicit-string-concatenation                       | Explicitly concatenated string should be implicitly concatenated |
| ISC004 🧪🛠️ | implicit-string-concatenation-in-collection-literal | Unparenthesized implicit string concatenation in collection      |

### flake8-import-conventions (ICN)

| Code      | Name                        | Message                                             |
| --------- | --------------------------- | --------------------------------------------------- |
| ICN001 🛠️ | unconventional-import-alias | {name} should be imported as {asname}               |
| ICN002    | banned-import-alias         | {name} should not be imported as {asname}           |
| ICN003    | banned-import-from          | Members of {name} should not be imported explicitly |

### flake8-logging (LOG)

| Code        | Name                                 | Message                                        |
| ----------- | ------------------------------------ | ---------------------------------------------- |
| LOG001 🛠️   | direct-logger-instantiation          | Use logging.getLogger() to instantiate loggers |
| LOG002 🛠️   | invalid-get-logger-argument          | Use **name** with logging.getLogger()          |
| LOG004 🧪🛠️ | log-exception-outside-except-handler | .exception() call outside exception handlers   |
| LOG007      | exception-without-exc-info           | Use of logging.exception with falsy exc_info   |
| LOG009 🛠️   | undocumented-warn                    | Use of undocumented logging.WARN constant      |
| LOG014 🛠️   | exc-info-outside-except-handler      | exc_info= outside exception handlers           |
| LOG015      | root-logger-call                     | {}() call on root logger                       |

### flake8-logging-format (G)

| Code    | Name                       | Message                                                                      |
| ------- | -------------------------- | ---------------------------------------------------------------------------- |
| G001    | logging-string-format      | Logging statement uses str.format                                            |
| G002    | logging-percent-format     | Logging statement uses %                                                     |
| G003    | logging-string-concat      | Logging statement uses +                                                     |
| G004 🛠️ | logging-f-string           | Logging statement uses f-string                                              |
| G010 🛠️ | logging-warn               | Logging statement uses warn instead of warning                               |
| G101    | logging-extra-attr-clash   | Logging statement uses an extra field that clashes with a LogRecord field    |
| G201    | logging-exc-info           | Logging .exception(...) should be used instead of .error(..., exc_info=True) |
| G202    | logging-redundant-exc-info | Logging statement has redundant exc_info                                     |

### flake8-no-pep420 (INP)

| Code   | Name                       | Message                                                                       |
| ------ | -------------------------- | ----------------------------------------------------------------------------- |
| INP001 | implicit-namespace-package | File {filename} is part of an implicit namespace package. Add an **init**.py. |

### flake8-pie (PIE)

| Code      | Name                             | Message                                      |
| --------- | -------------------------------- | -------------------------------------------- |
| PIE790 🛠️ | unnecessary-placeholder          | Unnecessary pass statement                   |
| PIE794 🛠️ | duplicate-class-field-definition | Class field {name} is defined multiple times |
| PIE796    | non-unique-enums                 | Enum contains duplicate value: {value}       |
| PIE800 🛠️ | unnecessary-spread               | Unnecessary spread \*\*                      |
| PIE804 🛠️ | unnecessary-dict-kwargs          | Unnecessary dict kwargs                      |
| PIE807 🛠️ | reimplemented-container-builtin  | Prefer {container} over useless lambda       |
| PIE808 🛠️ | unnecessary-range-start          | Unnecessary start argument in range          |
| PIE810 🛠️ | multiple-starts-ends-with        | Call {attr} once with a tuple                |

### flake8-print (T20)

| Code    | Name    | Message      |
| ------- | ------- | ------------ |
| T201 🛠️ | print   | print found  |
| T203 🛠️ | p-print | pprint found |

### flake8-pytest-style (PT)

| Code     | Name                                       | Message                                                                        |
| -------- | ------------------------------------------ | ------------------------------------------------------------------------------ |
| PT001 🛠️ | pytest-fixture-incorrect-parentheses-style | Use @pytest.fixture{expected} over @pytest.fixture{actual}                     |
| PT002    | pytest-fixture-positional-args             | Configuration for fixture {function} specified via positional args, use kwargs |
| PT003 🛠️ | pytest-extraneous-scope-function           | scope='function' is implied in @pytest.fixture()                               |
| PT006 🛠️ | pytest-parametrize-names-wrong-type        | Wrong type passed to first argument of pytest.mark.parametrize                 |
| PT007 🛠️ | pytest-parametrize-values-wrong-type       | Wrong values type in pytest.mark.parametrize                                   |
| PT008    | pytest-patch-with-lambda                   | Use return_value= instead of patching with lambda                              |
| PT009 🛠️ | pytest-unittest-assertion                  | Use a regular assert instead of unittest-style {assertion}                     |
| PT011    | pytest-raises-too-broad                    | pytest.raises({exception}) is too broad, set the match parameter               |
| PT012    | pytest-raises-with-multiple-statements     | pytest.raises() block should contain a single simple statement                 |
| PT015    | pytest-assert-always-false                 | Assertion always fails, replace with pytest.fail()                             |
| PT017    | pytest-assert-in-except                    | Found assertion on exception {name} in except block, use pytest.raises()       |
| PT018 🛠️ | pytest-composite-assertion                 | Assertion should be broken down into multiple parts                            |
| PT022 🛠️ | pytest-useless-yield-fixture               | No teardown in fixture {name}, use return instead of yield                     |
| PT023 🛠️ | pytest-incorrect-mark-parentheses-style    | Use @pytest.mark.{mark_name}{expected_parens}                                  |
| PT024 🛠️ | pytest-unnecessary-asyncio-mark-on-fixture | pytest.mark.asyncio is unnecessary for fixtures                                |
| PT025 🛠️ | pytest-erroneous-use-fixtures-on-fixture   | pytest.mark.usefixtures has no effect on fixtures                              |
| PT026 🛠️ | pytest-use-fixtures-without-parameters     | Useless pytest.mark.usefixtures without parameters                             |
| PT027 🛠️ | pytest-unittest-raises-assertion           | Use pytest.raises instead of unittest-style {assertion}                        |
| PT029 🧪 | pytest-warns-without-warning               | Set the expected warning in pytest.warns()                                     |
| PT030    | pytest-warns-too-broad                     | pytest.warns({warning}) is too broad                                           |
| PT031    | pytest-warns-with-multiple-statements      | pytest.warns() block should contain a single simple statement                  |

### flake8-quotes (Q)

| Code    | Name                        | Message                                                  |
| ------- | --------------------------- | -------------------------------------------------------- |
| Q000 🛠️ | bad-quotes-inline-string    | Single quotes found but double quotes preferred          |
| Q001 🛠️ | bad-quotes-multiline-string | Single quote multiline found but double quotes preferred |
| Q002 🛠️ | bad-quotes-docstring        | Single quote docstring found but double quotes preferred |
| Q003 🛠️ | avoidable-escaped-quote     | Change outer quotes to avoid escaping inner quotes       |
| Q004 🛠️ | unnecessary-escaped-quote   | Unnecessary escape on inner quote character              |

### flake8-raise (RSE)

| Code      | Name                                 | Message                                     |
| --------- | ------------------------------------ | ------------------------------------------- |
| RSE102 🛠️ | unnecessary-paren-on-raise-exception | Unnecessary parentheses on raised exception |

### flake8-return (RET)

| Code      | Name                      | Message                                                                  |
| --------- | ------------------------- | ------------------------------------------------------------------------ |
| RET501 🛠️ | unnecessary-return-none   | Do not explicitly return None if it is the only possible return value    |
| RET502 🛠️ | implicit-return-value     | Do not implicitly return None in function able to return non-None value  |
| RET503 🛠️ | implicit-return           | Missing explicit return at end of function able to return non-None value |
| RET504 🛠️ | unnecessary-assign        | Unnecessary assignment to {name} before return statement                 |
| RET505 🛠️ | superfluous-else-return   | Unnecessary {branch} after return statement                              |
| RET506 🛠️ | superfluous-else-raise    | Unnecessary {branch} after raise statement                               |
| RET507 🛠️ | superfluous-else-continue | Unnecessary {branch} after continue statement                            |
| RET508 🛠️ | superfluous-else-break    | Unnecessary {branch} after break statement                               |

### flake8-self (SLF)

| Code   | Name                  | Message                           |
| ------ | --------------------- | --------------------------------- |
| SLF001 | private-member-access | Private member accessed: {access} |

### flake8-simplify (SIM)

| Code      | Name                                | Message                                                             |
| --------- | ----------------------------------- | ------------------------------------------------------------------- |
| SIM101 🛠️ | duplicate-isinstance-call           | Multiple isinstance calls for {name}, merge into a single call      |
| SIM102 🛠️ | collapsible-if                      | Use a single if statement instead of nested if statements           |
| SIM103 🛠️ | needless-bool                       | Return the condition {condition} directly                           |
| SIM105 🛠️ | suppressible-exception              | Use contextlib.suppress({exception}) instead of try-except-pass     |
| SIM107    | return-in-try-except-finally        | Don't use return in try-except and finally                          |
| SIM108 🛠️ | if-else-block-instead-of-if-exp     | Use ternary operator {contents} instead of if-else-block            |
| SIM109 🛠️ | compare-with-tuple                  | Use {replacement} instead of multiple equality comparisons          |
| SIM110 🛠️ | reimplemented-builtin               | Use {replacement} instead of for loop                               |
| SIM112 🛠️ | uncapitalized-environment-variables | Use capitalized environment variable {expected} instead of {actual} |
| SIM113    | enumerate-for-loop                  | Use enumerate() for index variable {index} in for loop              |
| SIM114 🛠️ | if-with-same-arms                   | Combine if branches using logical or operator                       |
| SIM115    | open-file-with-context-handler      | Use a context manager for opening files                             |
| SIM117 🛠️ | multiple-with-statements            | Use a single with statement with multiple contexts                  |
| SIM118 🛠️ | in-dict-keys                        | Use key {operator} dict instead of key {operator} dict.keys()       |
| SIM201 🛠️ | negate-equal-op                     | Use {left} != {right} instead of not {left} == {right}              |
| SIM202 🛠️ | negate-not-equal-op                 | Use {left} == {right} instead of not {left} != {right}              |
| SIM208 🛠️ | double-negation                     | Use {expr} instead of not (not {expr})                              |
| SIM300 🛠️ | yoda-conditions                     | Yoda condition detected                                             |
| SIM401 🛠️ | if-else-block-instead-of-dict-get   | Use {contents} instead of an if block                               |
| SIM905 🛠️ | split-static-string                 | Consider using a list literal instead of str.{}                     |
| SIM910 🛠️ | dict-get-with-none-default          | Use {expected} instead of {actual}                                  |
| SIM911 🛠️ | zip-dict-keys-and-values            | Use {expected} instead of {actual}                                  |

### flake8-slots (SLOT)

| Code    | Name                            | Message                                                 |
| ------- | ------------------------------- | ------------------------------------------------------- |
| SLOT000 | no-slots-in-str-subclass        | Subclasses of str should define **slots**               |
| SLOT001 | no-slots-in-tuple-subclass      | Subclasses of tuple should define **slots**             |
| SLOT002 | no-slots-in-namedtuple-subclass | Subclasses of {namedtuple_kind} should define **slots** |

### flake8-tidy-imports (TID)

| Code      | Name                        | Message                                                           |
| --------- | --------------------------- | ----------------------------------------------------------------- |
| TID251    | banned-api                  | {name} is banned: {message}                                       |
| TID252 🛠️ | relative-imports            | Prefer absolute imports over relative imports from parent modules |
| TID253    | banned-module-level-imports | {name} is banned at the module level                              |

### flake8-todos (TD)

| Code     | Name                           | Message                                           |
| -------- | ------------------------------ | ------------------------------------------------- |
| TD001    | invalid-todo-tag               | Invalid TODO tag: {tag}                           |
| TD002    | missing-todo-author            | Missing author in TODO                            |
| TD003    | missing-todo-link              | Missing issue link for this TODO                  |
| TD004    | missing-todo-colon             | Missing colon in TODO                             |
| TD005    | missing-todo-description       | Missing issue description after TODO              |
| TD006 🛠️ | invalid-todo-capitalization    | Invalid TODO capitalization: {tag} should be TODO |
| TD007    | missing-space-after-todo-colon | Missing space after colon in TODO                 |

### flake8-type-checking (TC)

| Code       | Name                                  | Message                                                    |
| ---------- | ------------------------------------- | ---------------------------------------------------------- |
| TC001 🛠️   | typing-only-first-party-import        | Move application import {} into a type-checking block      |
| TC002 🛠️   | typing-only-third-party-import        | Move third-party import {} into a type-checking block      |
| TC003 🛠️   | typing-only-standard-library-import   | Move standard library import {} into a type-checking block |
| TC004 🛠️   | runtime-import-in-type-checking-block | Move import {qualified_name} out of type-checking block    |
| TC005 🛠️   | empty-type-checking-block             | Found empty type-checking block                            |
| TC006 🛠️   | runtime-cast-value                    | Add quotes to type expression in typing.cast()             |
| TC007 🛠️   | unquoted-type-alias                   | Add quotes to type alias                                   |
| TC008 🧪🛠️ | quoted-type-alias                     | Remove quotes from type alias                              |
| TC010      | runtime-string-union                  | Invalid string member in X \| Y-style union type           |

### flake8-unused-arguments (ARG)

| Code   | Name                          | Message                               |
| ------ | ----------------------------- | ------------------------------------- |
| ARG001 | unused-function-argument      | Unused function argument: {name}      |
| ARG002 | unused-method-argument        | Unused method argument: {name}        |
| ARG003 | unused-class-method-argument  | Unused class method argument: {name}  |
| ARG004 | unused-static-method-argument | Unused static method argument: {name} |
| ARG005 | unused-lambda-argument        | Unused lambda argument: {name}        |

### flake8-use-pathlib (PTH)

| Code      | Name                               | Message                                                      |
| --------- | ---------------------------------- | ------------------------------------------------------------ |
| PTH100 🛠️ | os-path-abspath                    | os.path.abspath() should be replaced by Path.resolve()       |
| PTH101 🛠️ | os-chmod                           | os.chmod() should be replaced by Path.chmod()                |
| PTH102 🛠️ | os-mkdir                           | os.mkdir() should be replaced by Path.mkdir()                |
| PTH103 🛠️ | os-makedirs                        | os.makedirs() should be replaced by Path.mkdir(parents=True) |
| PTH104 🛠️ | os-rename                          | os.rename() should be replaced by Path.rename()              |
| PTH107 🛠️ | os-remove                          | os.remove() should be replaced by Path.unlink()              |
| PTH109 🛠️ | os-getcwd                          | os.getcwd() should be replaced by Path.cwd()                 |
| PTH110 🛠️ | os-path-exists                     | os.path.exists() should be replaced by Path.exists()         |
| PTH112 🛠️ | os-path-isdir                      | os.path.isdir() should be replaced by Path.is_dir()          |
| PTH113 🛠️ | os-path-isfile                     | os.path.isfile() should be replaced by Path.is_file()        |
| PTH119 🛠️ | os-path-basename                   | os.path.basename() should be replaced by Path.name           |
| PTH120 🛠️ | os-path-dirname                    | os.path.dirname() should be replaced by Path.parent          |
| PTH123 🛠️ | builtin-open                       | open() should be replaced by Path.open()                     |
| PTH201 🛠️ | path-constructor-current-directory | Do not pass the current directory explicitly to Path         |
| PTH207    | glob                               | Replace {function} with Path.glob or Path.rglob              |
| PTH208    | os-listdir                         | Use pathlib.Path.iterdir() instead                           |

### flynt (FLY)

| Code      | Name                    | Message                                      |
| --------- | ----------------------- | -------------------------------------------- |
| FLY002 🛠️ | static-join-to-f-string | Consider {expression} instead of string join |

### isort (I)

| Code    | Name                    | Message                                   |
| ------- | ----------------------- | ----------------------------------------- |
| I001 🛠️ | unsorted-imports        | Import block is un-sorted or un-formatted |
| I002 🛠️ | missing-required-import | Missing required import: {name}           |

### mccabe (C90)

| Code | Name              | Message                                                 |
| ---- | ----------------- | ------------------------------------------------------- |
| C901 | complex-structure | {name} is too complex ({complexity} > {max_complexity}) |

### NumPy (NPY)

| Code      | Name                        | Message                                                              |
| --------- | --------------------------- | -------------------------------------------------------------------- |
| NPY001 🛠️ | numpy-deprecated-type-alias | Type alias np.{type_name} is deprecated, replace with builtin type   |
| NPY002    | numpy-legacy-random         | Replace legacy np.random.{method_name} call with np.random.Generator |
| NPY003 🛠️ | numpy-deprecated-function   | np.{existing} is deprecated; use np.{replacement} instead            |
| NPY201 🛠️ | numpy2-deprecation          | np.{existing} will be removed in NumPy 2.0                           |

### pandas-vet (PD)

| Code     | Name                                 | Message                                                                      |
| -------- | ------------------------------------ | ---------------------------------------------------------------------------- |
| PD002 🛠️ | pandas-use-of-inplace-argument       | inplace=True should be avoided; it has inconsistent behavior                 |
| PD003    | pandas-use-of-dot-is-null            | .isna is preferred to .isnull                                                |
| PD004    | pandas-use-of-dot-not-null           | .notna is preferred to .notnull                                              |
| PD007    | pandas-use-of-dot-ix                 | .ix is deprecated; use more explicit .loc or .iloc                           |
| PD008    | pandas-use-of-dot-at                 | Use .loc instead of .at                                                      |
| PD009    | pandas-use-of-dot-iat                | Use .iloc instead of .iat                                                    |
| PD011    | pandas-use-of-dot-values             | Use .to_numpy() instead of .values                                           |
| PD015    | pandas-use-of-pd-merge               | Use .merge method instead of pd.merge function                               |
| PD101    | pandas-nunique-constant-series-check | Using series.nunique() for checking that a series is constant is inefficient |
| PD901 ❌ | pandas-df-variable-name              | Avoid using the generic variable name df for DataFrames                      |

### pep8-naming (N)

| Code    | Name                                         | Message                                                    |
| ------- | -------------------------------------------- | ---------------------------------------------------------- |
| N801    | invalid-class-name                           | Class name {name} should use CapWords convention           |
| N802    | invalid-function-name                        | Function name {name} should be lowercase                   |
| N803    | invalid-argument-name                        | Argument name {name} should be lowercase                   |
| N804 🛠️ | invalid-first-argument-name-for-class-method | First argument of a class method should be named cls       |
| N805 🛠️ | invalid-first-argument-name-for-method       | First argument of a method should be named self            |
| N806    | non-lowercase-variable-in-function           | Variable {name} in function should be lowercase            |
| N807    | dunder-function-name                         | Function name should not start and end with \_\_           |
| N811    | constant-imported-as-non-constant            | Constant {name} imported as non-constant {asname}          |
| N812    | lowercase-imported-as-non-lowercase          | Lowercase {name} imported as non-lowercase {asname}        |
| N813    | camelcase-imported-as-lowercase              | Camelcase {name} imported as lowercase {asname}            |
| N814    | camelcase-imported-as-constant               | Camelcase {name} imported as constant {asname}             |
| N815    | mixed-case-variable-in-class-scope           | Variable {name} in class scope should not be mixedCase     |
| N816    | mixed-case-variable-in-global-scope          | Variable {name} in global scope should not be mixedCase    |
| N817    | camelcase-imported-as-acronym                | CamelCase {name} imported as acronym {asname}              |
| N818    | error-suffix-on-exception-name               | Exception name {name} should be named with an Error suffix |
| N999    | invalid-module-name                          | Invalid module name: '{name}'                              |

### Perflint (PERF)

| Code       | Name                      | Message                                                          |
| ---------- | ------------------------- | ---------------------------------------------------------------- |
| PERF101 🛠️ | unnecessary-list-cast     | Do not cast an iterable to list before iterating over it         |
| PERF102 🛠️ | incorrect-dict-iterator   | When using only the {subset} of a dict use the {subset}() method |
| PERF203    | try-except-in-loop        | try-except within a loop incurs performance overhead             |
| PERF401 🛠️ | manual-list-comprehension | Use {message_str} to create a transformed list                   |
| PERF402    | manual-list-copy          | Use list or list.copy to create a copy of a list                 |
| PERF403 🛠️ | manual-dict-comprehension | Use a dictionary comprehension instead of {modifier} for-loop    |

### pycodestyle (E, W)

**Errors (E):**

| Code      | Name                                      | Message                                                                       |
| --------- | ----------------------------------------- | ----------------------------------------------------------------------------- |
| E101      | mixed-spaces-and-tabs                     | Indentation contains mixed spaces and tabs                                    |
| E111 🧪   | indentation-with-invalid-multiple         | Indentation is not a multiple of {indent_width}                               |
| E201 🧪🛠️ | whitespace-after-open-bracket             | Whitespace after '{symbol}'                                                   |
| E225 🧪🛠️ | missing-whitespace-around-operator        | Missing whitespace around operator                                            |
| E231 🧪🛠️ | missing-whitespace                        | Missing whitespace after {}                                                   |
| E301 🧪🛠️ | blank-line-between-methods                | Expected blank line, found 0                                                  |
| E302 🧪🛠️ | blank-lines-top-level                     | Expected {expected_blank_lines:?} blank lines                                 |
| E303 🧪🛠️ | too-many-blank-lines                      | Too many blank lines ({actual_blank_lines})                                   |
| E401 🛠️   | multiple-imports-on-one-line              | Multiple imports on one line                                                  |
| E402      | module-import-not-at-top-of-file          | Module level import not at top of cell                                        |
| E501      | line-too-long                             | Line too long ({width} > {limit})                                             |
| E701      | multiple-statements-on-one-line-colon     | Multiple statements on one line (colon)                                       |
| E702      | multiple-statements-on-one-line-semicolon | Multiple statements on one line (semicolon)                                   |
| E703 🛠️   | useless-semicolon                         | Statement ends with an unnecessary semicolon                                  |
| E711 🛠️   | none-comparison                           | Comparison to None should be cond is None                                     |
| E712 🛠️   | true-false-comparison                     | Avoid equality comparisons to True                                            |
| E713 🛠️   | not-in-test                               | Test for membership should be not in                                          |
| E714 🛠️   | not-is-test                               | Test for object identity should be is not                                     |
| E721      | type-comparison                           | Use is and is not for type comparisons, or isinstance() for isinstance checks |
| E722      | bare-except                               | Do not use bare except                                                        |
| E731 🛠️   | lambda-assignment                         | Do not assign a lambda expression, use a def                                  |
| E741      | ambiguous-variable-name                   | Ambiguous variable name: {name}                                               |
| E742      | ambiguous-class-name                      | Ambiguous class name: {name}                                                  |
| E743      | ambiguous-function-name                   | Ambiguous function name: {name}                                               |
| E999 ❌   | syntax-error                              | SyntaxError                                                                   |

**Warnings (W):**

| Code      | Name                             | Message                               |
| --------- | -------------------------------- | ------------------------------------- |
| W191      | tab-indentation                  | Indentation contains tabs             |
| W291 🛠️   | trailing-whitespace              | Trailing whitespace                   |
| W292 🛠️   | missing-newline-at-end-of-file   | No newline at end of file             |
| W293 🛠️   | blank-line-with-whitespace       | Blank line contains whitespace        |
| W391 🧪🛠️ | too-many-newlines-at-end-of-file | Too many newlines at end of {domain}  |
| W505      | doc-line-too-long                | Doc line too long ({width} > {limit}) |
| W605 🛠️   | invalid-escape-sequence          | Invalid escape sequence: \{ch}        |

### pydoclint (DOC)

| Code      | Name                           | Message                                                         |
| --------- | ------------------------------ | --------------------------------------------------------------- |
| DOC102 🧪 | docstring-extraneous-parameter | Documented parameter {id} is not in the function's signature    |
| DOC201 🧪 | docstring-missing-returns      | return is not documented in docstring                           |
| DOC202 🧪 | docstring-extraneous-returns   | Docstring should not have a returns section                     |
| DOC402 🧪 | docstring-missing-yields       | yield is not documented in docstring                            |
| DOC403 🧪 | docstring-extraneous-yields    | Docstring has a "Yields" section but the function doesn't yield |
| DOC501 🧪 | docstring-missing-exception    | Raised exception {id} missing from docstring                    |
| DOC502 🧪 | docstring-extraneous-exception | Raised exception is not explicitly raised: {id}                 |

### pydocstyle (D)

| Code    | Name                              | Message                                                    |
| ------- | --------------------------------- | ---------------------------------------------------------- |
| D100    | undocumented-public-module        | Missing docstring in public module                         |
| D101    | undocumented-public-class         | Missing docstring in public class                          |
| D102    | undocumented-public-method        | Missing docstring in public method                         |
| D103    | undocumented-public-function      | Missing docstring in public function                       |
| D104    | undocumented-public-package       | Missing docstring in public package                        |
| D105    | undocumented-magic-method         | Missing docstring in magic method                          |
| D106    | undocumented-public-nested-class  | Missing docstring in public nested class                   |
| D107    | undocumented-public-init          | Missing docstring in **init**                              |
| D200 🛠️ | unnecessary-multiline-docstring   | One-line docstring should fit on one line                  |
| D201 🛠️ | blank-line-before-function        | No blank lines allowed before function docstring           |
| D202 🛠️ | blank-line-after-function         | No blank lines allowed after function docstring            |
| D203 🛠️ | incorrect-blank-line-before-class | 1 blank line required before class docstring               |
| D205 🛠️ | missing-blank-line-after-summary  | 1 blank line required between summary line and description |
| D300 🛠️ | triple-single-quotes              | Use triple double quotes """                               |
| D400 🛠️ | missing-trailing-period           | First line should end with a period                        |
| D401    | non-imperative-mood               | First line of docstring should be in imperative mood       |
| D402    | signature-in-docstring            | First line should not be the function's signature          |
| D404    | docstring-starts-with-this        | First word of the docstring should not be "This"           |
| D419    | empty-docstring                   | Docstring is empty                                         |
| D420 🧪 | incorrect-section-order           | Section "{current}" appears after section "{previous}"     |

### Pyflakes (F)

| Code    | Name                                         | Message                                                         |
| ------- | -------------------------------------------- | --------------------------------------------------------------- |
| F401 🛠️ | unused-import                                | {name} imported but unused                                      |
| F402    | import-shadowed-by-loop-var                  | Import {name} from {row} shadowed by loop variable              |
| F403    | undefined-local-with-import-star             | from {name} import \* used; unable to detect undefined names    |
| F404    | late-future-import                           | from **future** imports must occur at the beginning of the file |
| F405    | undefined-local-with-import-star-usage       | {name} may be undefined, or defined from star imports           |
| F504 🛠️ | percent-format-extra-named-arguments         | %-format string has unused named argument(s)                    |
| F522 🛠️ | string-dot-format-extra-named-arguments      | .format call has unused named argument(s)                       |
| F523 🛠️ | string-dot-format-extra-positional-arguments | .format call has unused arguments at position(s)                |
| F524    | string-dot-format-missing-arguments          | .format call is missing argument(s) for placeholder(s)          |
| F541 🛠️ | f-string-missing-placeholders                | f-string without any placeholders                               |
| F601 🛠️ | multi-value-repeated-key-literal             | Dictionary key literal {name} repeated                          |
| F602 🛠️ | multi-value-repeated-key-variable            | Dictionary key {name} repeated                                  |
| F631    | assert-tuple                                 | Assert test is a non-empty tuple, which is always True          |
| F632 🛠️ | is-literal                                   | Use == to compare constant literals                             |
| F811 🛠️ | redefined-while-unused                       | Redefinition of unused {name}                                   |
| F821    | undefined-name                               | Undefined name {name}                                           |
| F822    | undefined-export                             | Undefined name {name} in **all**                                |
| F823    | undefined-local                              | Local variable {name} referenced before assignment              |
| F841 🛠️ | unused-variable                              | Local variable {name} is assigned to but never used             |
| F842    | unused-annotation                            | Local variable {name} is annotated but never used               |
| F901 🛠️ | raise-not-implemented                        | raise NotImplemented should be raise NotImplementedError        |

### pygrep-hooks (PGH)

| Code      | Name                | Message                                           |
| --------- | ------------------- | ------------------------------------------------- |
| PGH001 ❌ | eval                | No builtin eval() allowed                         |
| PGH003    | blanket-type-ignore | Use specific rule codes when ignoring type issues |
| PGH004 🛠️ | blanket-noqa        | Use specific rule codes when using noqa           |
| PGH005    | invalid-mock-access | Mock method should be called: {name}              |

### Pylint (PL) — Convention

| Code         | Name                           | Message                                                         |
| ------------ | ------------------------------ | --------------------------------------------------------------- |
| PLC0105      | type-name-incorrect-variance   | {kind} name "{param_name}" does not reflect its {variance}      |
| PLC0205      | single-string-slots            | Class **slots** should be a non-string iterable                 |
| PLC0206      | dict-index-missing-items       | Extracting value from dictionary without calling .items()       |
| PLC0207 🛠️   | missing-maxsplit-arg           | String is split more times than necessary                       |
| PLC0208 🛠️   | iteration-over-set             | Use a sequence type instead of a set when iterating over values |
| PLC0414 🛠️   | useless-import-alias           | Import alias does not rename original package                   |
| PLC0415      | import-outside-top-level       | import should be at the top-level of a file                     |
| PLC1802 🛠️   | len-test                       | len({expression}) used as condition without comparison          |
| PLC1901 🧪   | compare-to-empty-string        | {existing} can be simplified as an empty string is falsey       |
| PLC2401      | non-ascii-name                 | {kind} name {name} contains a non-ASCII character               |
| PLC2701 🧪   | import-private-name            | Private name import {name} from external module {module}        |
| PLC2801 🧪🛠️ | unnecessary-dunder-call        | Unnecessary dunder call to {method}                             |
| PLC3002      | unnecessary-direct-lambda-call | Lambda expression called directly                               |

### Pylint (PL) — Error

| Code         | Name                                | Message                                                                    |
| ------------ | ----------------------------------- | -------------------------------------------------------------------------- |
| PLE0100      | yield-in-init                       | **init** method is a generator                                             |
| PLE0101      | return-in-init                      | Explicit return in **init**                                                |
| PLE0115      | nonlocal-and-global                 | Name {name} is both nonlocal and global                                    |
| PLE0116      | continue-in-finally                 | continue not supported inside finally clause                               |
| PLE0117      | nonlocal-without-binding            | Nonlocal name {name} found without binding                                 |
| PLE0241 🛠️   | duplicate-bases                     | Duplicate base {base} for class {class}                                    |
| PLE0302      | unexpected-special-method-signature | The special method {} expects {}, {} {} given                              |
| PLE0304 🧪   | invalid-bool-return-type            | **bool** does not return bool                                              |
| PLE0604      | invalid-all-object                  | Invalid object in **all**, must contain only strings                       |
| PLE0605      | invalid-all-format                  | Invalid format for **all**, must be tuple or list                          |
| PLE0643      | potential-index-error               | Expression is likely to raise IndexError                                   |
| PLE0704      | misplaced-bare-raise                | Bare raise statement is not inside an exception handler                    |
| PLE1141 🧪🛠️ | dict-iter-missing-items             | Unpacking a dictionary in iteration without calling .items()               |
| PLE1142      | await-outside-async                 | await should be used within an async function                              |
| PLE1205      | logging-too-many-args               | Too many arguments for logging format string                               |
| PLE1206      | logging-too-few-args                | Not enough arguments for logging format string                             |
| PLE1310      | bad-str-strip-call                  | String {strip} call contains duplicate characters                          |
| PLE1519 🛠️   | singledispatch-method               | @singledispatch decorator should not be used on methods                    |
| PLE1520 🛠️   | singledispatchmethod-function       | @singledispatchmethod decorator should not be used on non-method functions |
| PLE1700      | yield-from-in-async-function        | yield from statement in async function; use async for instead              |
| PLE4703 🧪🛠️ | modified-iterating-set              | Iterated set {name} is modified within the for loop                        |

### Pylint (PL) — Refactor

| Code         | Name                          | Message                                                                  |
| ------------ | ----------------------------- | ------------------------------------------------------------------------ |
| PLR0124      | comparison-with-itself        | Name compared with itself                                                |
| PLR0133      | comparison-of-constant        | Two constants compared in a comparison                                   |
| PLR0202 🧪🛠️ | no-classmethod-decorator      | Class method defined without decorator                                   |
| PLR0203 🧪🛠️ | no-staticmethod-decorator     | Static method defined without decorator                                  |
| PLR0402 🛠️   | manual-from-import            | Use from {module} import {name} in lieu of alias                         |
| PLR0904 🧪   | too-many-public-methods       | Too many public methods ({methods} > {max_methods})                      |
| PLR0911      | too-many-return-statements    | Too many return statements ({returns} > {max_returns})                   |
| PLR0912      | too-many-branches             | Too many branches ({branches} > {max_branches})                          |
| PLR0913      | too-many-arguments            | Too many arguments in function definition ({c_args} > {max_args})        |
| PLR0914 🧪   | too-many-locals               | Too many local variables ({current_amount}/{max_amount})                 |
| PLR0915      | too-many-statements           | Too many statements ({statements} > {max_statements})                    |
| PLR0916 🧪   | too-many-boolean-expressions  | Too many Boolean expressions ({expressions} > {max_expressions})         |
| PLR0917 🧪   | too-many-positional-arguments | Too many positional arguments ({c_pos}/{max_pos})                        |
| PLR1702 🧪   | too-many-nested-blocks        | Too many nested blocks ({nested_blocks} > {max_nested_blocks})           |
| PLR1704      | redefined-argument-from-local | Redefining argument with the local name {name}                           |
| PLR1711 🛠️   | useless-return                | Useless return statement at end of function                              |
| PLR1712 🧪🛠️ | swap-with-temporary-variable  | Unnecessary temporary variable                                           |
| PLR1714 🛠️   | repeated-equality-comparison  | Consider merging multiple comparisons: {expression}                      |
| PLR1716 🛠️   | boolean-chained-comparison    | Contains chained boolean comparison that can be simplified               |
| PLR1722 🛠️   | sys-exit-alias                | Use sys.exit() instead of {name}                                         |
| PLR1730 🛠️   | if-stmt-min-max               | Replace if statement with {replacement}                                  |
| PLR1733 🛠️   | unnecessary-dict-index-lookup | Unnecessary lookup of dictionary value by key                            |
| PLR1736 🛠️   | unnecessary-list-index-lookup | List index lookup in enumerate() loop                                    |
| PLR2004      | magic-value-comparison        | Magic value used in comparison                                           |
| PLR2044 🛠️   | empty-comment                 | Line with empty comment                                                  |
| PLR5501 🛠️   | collapsible-else-if           | Use elif instead of else then if, to reduce indentation                  |
| PLR6104 🧪🛠️ | non-augmented-assignment      | Use {operator} to perform an augmented assignment directly               |
| PLR6201 🧪🛠️ | literal-membership            | Use a set literal when testing for membership                            |
| PLR6301 🧪   | no-self-use                   | Method {method_name} could be a function, class method, or static method |

### Pylint (PL) — Warning

| Code         | Name                         | Message                                                                     |
| ------------ | ---------------------------- | --------------------------------------------------------------------------- |
| PLW0108 🛠️   | unnecessary-lambda           | Lambda may be unnecessary; consider inlining inner function                 |
| PLW0120 🛠️   | useless-else-on-loop         | else clause on loop without a break statement                               |
| PLW0127      | self-assigning-variable      | Self-assignment of variable {name}                                          |
| PLW0128      | redeclared-assigned-name     | Redeclared variable {name} in assignment                                    |
| PLW0129      | assert-on-string-literal     | Asserting on an empty string literal will never pass                        |
| PLW0133 🛠️   | useless-exception-statement  | Missing raise statement on exception                                        |
| PLW0177      | nan-comparison               | Comparing against a NaN value; use math.isnan instead                       |
| PLW0244 🧪   | redefined-slots-in-subclass  | Slot {slot_name} redefined from base class {base}                           |
| PLW0245 🛠️   | super-without-brackets       | super call is missing parentheses                                           |
| PLW0406      | import-self                  | Module {name} imports itself                                                |
| PLW0602      | global-variable-not-assigned | Using global for {name} but no assignment is done                           |
| PLW0603      | global-statement             | Using the global statement to update {name} is discouraged                  |
| PLW0711      | binary-op-exception          | Exception to catch is the result of a binary and operation                  |
| PLW1501      | bad-open-mode                | {mode} is not a valid mode for open                                         |
| PLW1507 🛠️   | shallow-copy-environ         | Shallow copy of os.environ via copy.copy(os.environ)                        |
| PLW1510 🛠️   | subprocess-run-without-check | subprocess.run without explicit check argument                              |
| PLW1514 🧪🛠️ | unspecified-encoding         | {function_name} in text mode without explicit encoding argument             |
| PLW1641      | eq-without-hash              | Object does not implement **hash** method                                   |
| PLW2101      | useless-with-lock            | Threading lock directly created in with statement has no effect             |
| PLW2901      | redefined-loop-name          | Outer {outer_kind} variable {name} overwritten by inner {inner_kind} target |
| PLW3201 🧪   | bad-dunder-method-name       | Dunder method {name} has no special meaning in Python 3                     |
| PLW3301 🛠️   | nested-min-max               | Nested {func} calls can be flattened                                        |

### pyupgrade (UP)

| Code     | Name                           | Message                                                                |
| -------- | ------------------------------ | ---------------------------------------------------------------------- |
| UP001 🛠️ | useless-metaclass-type         | **metaclass** = type is implied                                        |
| UP003 🛠️ | type-of-primitive              | Use {} instead of type(...)                                            |
| UP004 🛠️ | useless-object-inheritance     | Class {name} inherits from object                                      |
| UP006 🛠️ | non-pep585-annotation          | Use {to} instead of {from} for type annotation                         |
| UP007 🛠️ | non-pep604-annotation-union    | Use X \| Y for type annotations                                        |
| UP008 🛠️ | super-call-with-parameters     | Use super() instead of super(**class**, self)                          |
| UP010 🛠️ | unnecessary-future-import      | Unnecessary **future** import for target Python version                |
| UP011 🛠️ | lru-cache-without-parameters   | Unnecessary parentheses to functools.lru_cache                         |
| UP015 🛠️ | redundant-open-modes           | Unnecessary mode argument                                              |
| UP017 🛠️ | datetime-timezone-utc          | Use datetime.UTC alias                                                 |
| UP018 🛠️ | native-literals                | Unnecessary {literal_type} call (rewrite as a literal)                 |
| UP024 🛠️ | os-error-alias                 | Replace aliased errors with OSError                                    |
| UP028 🛠️ | yield-in-for-loop              | Replace yield over for loop with yield from                            |
| UP032 🛠️ | f-string                       | Use f-string instead of format call                                    |
| UP033 🛠️ | lru-cache-with-maxsize-none    | Use @functools.cache instead of @functools.lru_cache(maxsize=None)     |
| UP034 🛠️ | extraneous-parentheses         | Avoid extraneous parentheses                                           |
| UP035 🛠️ | deprecated-import              | Import from {target} instead: {names}                                  |
| UP036 🛠️ | outdated-version-block         | Version block is outdated for minimum Python version                   |
| UP037 🛠️ | quoted-annotation              | Remove quotes from type annotation                                     |
| UP039 🛠️ | unnecessary-class-parentheses  | Unnecessary parentheses after class definition                         |
| UP040 🛠️ | non-pep695-type-alias          | Type alias {name} uses {type_alias_method} instead of the type keyword |
| UP041 🛠️ | timeout-error-alias            | Replace aliased errors with TimeoutError                               |
| UP042 🛠️ | replace-str-enum               | Class {name} inherits from both str and enum.Enum                      |
| UP043 🛠️ | unnecessary-default-type-args  | Unnecessary default type arguments                                     |
| UP045 🛠️ | non-pep604-annotation-optional | Use X \| None for type annotations                                     |
| UP046 🛠️ | non-pep695-generic-class       | Generic class {name} uses Generic subclass instead of type parameters  |
| UP047 🛠️ | non-pep695-generic-function    | Generic function {name} should use type parameters                     |
| UP049 🛠️ | private-type-parameter         | Generic {} uses private type parameters                                |
| UP050 🛠️ | useless-class-metaclass-type   | Class {name} uses metaclass=type, which is redundant                   |

### refurb (FURB)

| Code         | Name                             | Message                                                                    |
| ------------ | -------------------------------- | -------------------------------------------------------------------------- |
| FURB101 🧪🛠️ | read-whole-file                  | Path.open() followed by read() can be replaced by {filename}.{suggestion}  |
| FURB103 🧪🛠️ | write-whole-file                 | Path.open() followed by write() can be replaced by {filename}.{suggestion} |
| FURB105 🛠️   | print-empty-string               | Unnecessary empty string passed to print                                   |
| FURB110 🛠️   | if-exp-instead-of-or-operator    | Replace ternary if expression with or operator                             |
| FURB113 🧪🛠️ | repeated-append                  | Use {suggestion} instead of repeatedly calling {name}.append()             |
| FURB116 🛠️   | f-string-number-format           | Replace {function_name} call with {display}                                |
| FURB118 🧪🛠️ | reimplemented-operator           | Use operator.{operator} instead of defining a {target}                     |
| FURB129 🛠️   | readlines-in-for                 | Instead of calling readlines(), iterate over file object directly          |
| FURB132 🛠️   | check-and-remove-from-set        | Use {suggestion} instead of check and remove                               |
| FURB136 🛠️   | if-expr-min-max                  | Replace if expression with {min_max} call                                  |
| FURB157 🛠️   | verbose-decimal-constructor      | Verbose expression in Decimal constructor                                  |
| FURB161 🛠️   | bit-count                        | Use of bin({existing}).count('1')                                          |
| FURB162 🛠️   | fromisoformat-replace-z          | Unnecessary timezone replacement with zero offset                          |
| FURB163 🛠️   | redundant-log-base               | Prefer math.{log_function}({arg}) over math.log with a redundant base      |
| FURB168 🛠️   | isinstance-type-none             | Prefer is operator over isinstance to check if an object is None           |
| FURB169 🛠️   | type-none-comparison             | When checking against None, use {} instead of comparison with type(None)   |
| FURB171 🛠️   | single-item-membership-test      | Membership test against single-item container                              |
| FURB177 🛠️   | implicit-cwd                     | Prefer Path.cwd() over Path().resolve() for current-directory lookups      |
| FURB181 🛠️   | hashlib-digest-hex               | Use of hashlib's .digest().hex()                                           |
| FURB188 🛠️   | slice-to-remove-prefix-or-suffix | Prefer str.removeprefix() over conditionally replacing with slice          |
| FURB192 🧪🛠️ | sorted-min-max                   | Prefer min over sorted() to compute the minimum value in a sequence        |

### Ruff-specific (RUF)

| Code        | Name                                              | Message                                                                         |
| ----------- | ------------------------------------------------- | ------------------------------------------------------------------------------- |
| RUF001      | ambiguous-unicode-character-string                | String contains ambiguous {}. Did you mean {}?                                  |
| RUF002      | ambiguous-unicode-character-docstring             | Docstring contains ambiguous {}. Did you mean {}?                               |
| RUF003      | ambiguous-unicode-character-comment               | Comment contains ambiguous {}. Did you mean {}?                                 |
| RUF005 🛠️   | collection-literal-concatenation                  | Consider {expression} instead of concatenation                                  |
| RUF006      | asyncio-dangling-task                             | Store a reference to the return value of {expr}.{method}                        |
| RUF007 🛠️   | zip-instead-of-pairwise                           | Prefer itertools.pairwise() over zip() when iterating over successive pairs     |
| RUF008      | mutable-dataclass-default                         | Do not use mutable default values for dataclass attributes                      |
| RUF009      | function-call-in-dataclass-default-argument       | Do not perform function call {name} in dataclass defaults                       |
| RUF010 🛠️   | explicit-f-string-type-conversion                 | Use explicit conversion flag                                                    |
| RUF012      | mutable-class-default                             | Mutable default value for class attribute                                       |
| RUF013 🛠️   | implicit-optional                                 | PEP 484 prohibits implicit Optional                                             |
| RUF015 🛠️   | unnecessary-iterable-allocation-for-first-element | Prefer next({iterable}) over single element slice                               |
| RUF017 🛠️   | quadratic-list-summation                          | Avoid quadratic list summation                                                  |
| RUF018      | assignment-in-assert                              | Avoid assignment expressions in assert statements                               |
| RUF019 🛠️   | unnecessary-key-check                             | Unnecessary key check before dictionary access                                  |
| RUF020 🛠️   | never-union                                       | {never_like} \| T is equivalent to T                                            |
| RUF021 🛠️   | parenthesize-chained-operators                    | Parenthesize a and b expressions when chaining and and or together              |
| RUF022 🛠️   | unsorted-dunder-all                               | **all** is not sorted                                                           |
| RUF023 🛠️   | unsorted-dunder-slots                             | {}.**slots** is not sorted                                                      |
| RUF024 🛠️   | mutable-fromkeys-value                            | Do not pass mutable objects as values to dict.fromkeys                          |
| RUF026 🛠️   | default-factory-kwarg                             | default_factory is a positional-only argument to defaultdict                    |
| RUF027 🧪🛠️ | missing-f-string-syntax                           | Possible f-string without an f prefix                                           |
| RUF028 🛠️   | invalid-formatter-suppression-comment             | This suppression comment is invalid because {}                                  |
| RUF029 🧪   | unused-async                                      | Function {name} is declared async, but doesn't await or use async features      |
| RUF030 🛠️   | assert-with-print-message                         | print() call in assert statement is likely unintentional                        |
| RUF032 🛠️   | decimal-from-float-literal                        | Decimal() called with float literal argument                                    |
| RUF033 🛠️   | post-init-default                                 | **post_init** method with argument defaults                                     |
| RUF034      | useless-if-else                                   | Useless if-else condition                                                       |
| RUF036 🧪   | none-not-at-end-of-union                          | None not at the end of the type annotation                                      |
| RUF037 🛠️   | unnecessary-empty-iterable-within-deque-call      | Unnecessary empty iterable within a deque call                                  |
| RUF038 🧪🛠️ | redundant-bool-literal                            | Literal[True, False, ...] can be replaced with Literal[...] \| bool             |
| RUF039 🧪🛠️ | unraw-re-pattern                                  | First argument to {call} is not raw string                                      |
| RUF040      | invalid-assert-message-literal-argument           | Non-string literal used as assert message                                       |
| RUF041 🛠️   | unnecessary-nested-literal                        | Unnecessary nested Literal                                                      |
| RUF043      | pytest-raises-ambiguous-pattern                   | Pattern passed to match= contains metacharacters but is neither escaped nor raw |
| RUF046 🛠️   | unnecessary-cast-to-int                           | Value being cast to int is already an integer                                   |
| RUF047 🧪🛠️ | needless-else                                     | Empty else clause                                                               |
| RUF049      | dataclass-enum                                    | An enum class should not be decorated with @dataclass                           |
| RUF051 🛠️   | if-key-in-dict-del                                | Use pop instead of key in dict followed by del dict[key]                        |
| RUF052 🧪🛠️ | used-dummy-variable                               | Local dummy variable {} is accessed                                             |
| RUF053 🛠️   | class-with-mixed-type-vars                        | Class with type parameter list inherits from Generic                            |
| RUF055 🧪🛠️ | unnecessary-regular-expression                    | Plain string pattern passed to re function                                      |
| RUF056 🧪🛠️ | falsy-dict-get-fallback                           | Avoid providing a falsy fallback to dict.get() in boolean test positions        |
| RUF057 🛠️   | unnecessary-round                                 | Value being rounded is already an integer                                       |
| RUF058 🛠️   | starmap-zip                                       | itertools.starmap called on zip iterable                                        |
| RUF059 🛠️   | unused-unpacked-variable                          | Unpacked variable {name} is never used                                          |
| RUF060      | in-empty-collection                               | Unnecessary membership test on empty collection                                 |
| RUF061 🛠️   | legacy-form-pytest-raises                         | Use context-manager form of pytest.{}()                                         |
| RUF064 🛠️   | non-octal-permissions                             | Non-octal mode                                                                  |
| RUF066 🧪   | property-without-return                           | {name} is a property without a return statement                                 |
| RUF067 🧪   | non-empty-init-module                             | **init** module should not contain any code                                     |
| RUF068 🧪🛠️ | duplicate-entry-in-dunder-all                     | **all** contains duplicate entries                                              |
| RUF069 🧪   | float-equality-comparison                         | Unreliable floating point equality comparison                                   |
| RUF070 🧪🛠️ | unnecessary-assign-before-yield                   | Unnecessary assignment to {name} before yield from statement                    |
| RUF100 🛠️   | unused-noqa                                       | Unused {}                                                                       |
| RUF101 🛠️   | redirected-noqa                                   | {original} is a redirect to {target}                                            |
| RUF102 🛠️   | invalid-rule-code                                 | Invalid rule code in {}: {}                                                     |
| RUF103 🛠️   | invalid-suppression-comment                       | Invalid suppression comment: {msg}                                              |
| RUF104      | unmatched-suppression-comment                     | Suppression comment without matching #ruff:enable comment                       |
| RUF200      | invalid-pyproject-toml                            | Failed to parse pyproject.toml: {message}                                       |

### tryceratops (TRY)

| Code      | Name                          | Message                                                       |
| --------- | ----------------------------- | ------------------------------------------------------------- |
| TRY002    | raise-vanilla-class           | Create your own exception                                     |
| TRY003    | raise-vanilla-args            | Avoid specifying long messages outside the exception class    |
| TRY004    | type-check-without-type-error | Prefer TypeError exception for invalid type                   |
| TRY201 🛠️ | verbose-raise                 | Use raise without specifying exception name                   |
| TRY203    | useless-try-except            | Remove exception handler; error is immediately re-raised      |
| TRY300    | try-consider-else             | Consider moving this statement to an else block               |
| TRY301    | raise-within-try              | Abstract raise to an inner function                           |
| TRY400 🛠️ | error-instead-of-exception    | Use logging.exception instead of logging.error                |
| TRY401    | verbose-log-message           | Redundant exception object included in logging.exception call |

---

## Settings Reference

### Top-Level Settings

| Setting                   | Default          | Type                  | Description                                          |
| ------------------------- | ---------------- | --------------------- | ---------------------------------------------------- |
| `builtins`                | `[]`             | `list[str]`           | Additional builtins to treat as defined references   |
| `cache-dir`               | `".ruff_cache"`  | `str`                 | Path to the cache directory                          |
| `exclude`                 | _(standard set)_ | `list[str]`           | File patterns to exclude from linting and formatting |
| `extend`                  | `null`           | `str`                 | Path to a base config file to merge into this one    |
| `extend-exclude`          | `[]`             | `list[str]`           | Additional exclusion patterns                        |
| `extend-include`          | `[]`             | `list[str]`           | Additional inclusion patterns                        |
| `extension`               | `{}`             | `dict[str, Language]` | Map custom file extensions to known file types       |
| `fix`                     | `false`          | `bool`                | Enable fix behavior by default                       |
| `fix-only`                | `false`          | `bool`                | Fix without reporting unfixed violations             |
| `force-exclude`           | `false`          | `bool`                | Enforce exclusions even for explicitly-passed paths  |
| `include`                 | _(standard set)_ | `list[str]`           | File patterns to include when linting                |
| `indent-width`            | `4`              | `int`                 | Number of spaces per indentation level               |
| `line-length`             | `88`             | `int`                 | Maximum line length                                  |
| `namespace-packages`      | `[]`             | `list[str]`           | Directories to treat as namespace packages           |
| `output-format`           | `"full"`         | `str`                 | Violation message format style                       |
| `per-file-target-version` | `{}`             | `dict`                | Per-file Python version overrides                    |
| `preview`                 | `false`          | `bool`                | Enable preview mode                                  |
| `required-version`        | `null`           | `str`                 | Enforce a minimum Ruff version (PEP 440 specifier)   |
| `respect-gitignore`       | `true`           | `bool`                | Automatically exclude gitignored files               |
| `show-fixes`              | `false`          | `bool`                | Show an enumeration of all fixed violations          |
| `src`                     | `[".", "src"]`   | `list[str]`           | Directories to consider for first-party imports      |
| `target-version`          | `"py310"`        | `str`                 | Minimum Python version to target                     |
| `unsafe-fixes`            | `null`           | `bool`                | Enable unsafe fix application                        |

**`output-format` options:** `"full"` | `"concise"` | `"grouped"` | `"json"` | `"junit"` | `"github"` | `"gitlab"` | `"pylint"` | `"azure"`

**`target-version` options:** `"py37"` through `"py314"`

```toml
[tool.ruff]
line-length = 120
target-version = "py311"
src = ["src", "tests"]
```

### `[lint]` Settings

| Setting                   | Default                  | Type                 | Description                                             |
| ------------------------- | ------------------------ | -------------------- | ------------------------------------------------------- | ----------------------------------- |
| `select`                  | `["E4","E7","E9","F"]`   | `list[RuleSelector]` | Rules to enable                                         |
| `ignore`                  | `[]`                     | `list[RuleSelector]` | Rules to disable                                        |
| `extend-select`           | `[]`                     | `list[RuleSelector]` | Additional rules to enable                              |
| `fixable`                 | `["ALL"]`                | `list[RuleSelector]` | Rules eligible for auto-fix                             |
| `unfixable`               | `[]`                     | `list[RuleSelector]` | Rules ineligible for auto-fix                           |
| `extend-safe-fixes`       | `[]`                     | `list[RuleSelector]` | Rules whose unsafe fixes should be treated as safe      |
| `extend-unsafe-fixes`     | `[]`                     | `list[RuleSelector]` | Rules whose safe fixes should be treated as unsafe      |
| `per-file-ignores`        | `{}`                     | `dict`               | Per-file rule exclusions                                |
| `extend-per-file-ignores` | `{}`                     | `dict`               | Additional per-file exclusions                          |
| `dummy-variable-rgx`      | `"^(\_+                  | ...)"`               | `str`                                                   | Regex to identify "dummy" variables |
| `preview`                 | `false`                  | `bool`               | Enable unstable lint rules                              |
| `explicit-preview-rules`  | `false`                  | `bool`               | Require exact rule codes for preview rules              |
| `task-tags`               | `["TODO","FIXME","XXX"]` | `list[str]`          | Task comment tags to recognize                          |
| `logger-objects`          | `[]`                     | `list[str]`          | Objects treated as `logging.Logger` equivalents         |
| `typing-modules`          | `[]`                     | `list[str]`          | Modules treated as equivalent to `typing`               |
| `future-annotations`      | `false`                  | `bool`               | Allow rules to add `from __future__ import annotations` |

```toml
[tool.ruff.lint]
select = ["E", "F", "B", "I"]
ignore = ["E501"]
unfixable = ["F401"]

[tool.ruff.lint.per-file-ignores]
"__init__.py" = ["E402", "F401"]
"tests/**" = ["S101"]
```

### `[format]` Settings

| Setting                      | Default     | Type                                    | Description                                |
| ---------------------------- | ----------- | --------------------------------------- | ------------------------------------------ |
| `quote-style`                | `"double"`  | `"double" \| "single" \| "preserve"`    | Preferred quote character                  |
| `indent-style`               | `"space"`   | `"space" \| "tab"`                      | Spaces or tabs for indentation             |
| `line-ending`                | `"auto"`    | `"auto" \| "lf" \| "cr-lf" \| "native"` | Line ending character                      |
| `skip-magic-trailing-comma`  | `false`     | `bool`                                  | Ignore trailing commas as line-break hints |
| `docstring-code-format`      | `false`     | `bool`                                  | Format code snippets inside docstrings     |
| `docstring-code-line-length` | `"dynamic"` | `int \| "dynamic"`                      | Line length for docstring code snippets    |
| `preview`                    | `false`     | `bool`                                  | Enable unstable formatter style changes    |
| `exclude`                    | `[]`        | `list[str]`                             | Files to exclude from formatting only      |

```toml
[tool.ruff.format]
quote-style = "single"
indent-style = "space"
docstring-code-format = true
docstring-code-line-length = 88
```

### Plugin-Specific Settings

#### `[lint.isort]`

| Setting                      | Default      | Description                                              |
| ---------------------------- | ------------ | -------------------------------------------------------- |
| `force-single-line`          | `false`      | Force all from imports onto their own line               |
| `combine-as-imports`         | `false`      | Combine as imports on the same line                      |
| `lines-after-imports`        | `-1`         | Blank lines after import block (-1 = auto)               |
| `lines-between-types`        | `0`          | Blank lines between direct and from imports              |
| `known-first-party`          | `[]`         | Modules to treat as first-party                          |
| `known-third-party`          | `[]`         | Modules to treat as third-party                          |
| `required-imports`           | `[]`         | Import lines to add to all files                         |
| `section-order`              | _(standard)_ | Override section output order                            |
| `split-on-trailing-comma`    | `true`       | Never fold imports when trailing comma is present        |
| `case-sensitive`             | `false`      | Sort imports taking into account case sensitivity        |
| `detect-same-package`        | `true`       | Auto-detect imports from the same package as first-party |
| `force-sort-within-sections` | `false`      | Sort by module name regardless of import style           |

```toml
[tool.ruff.lint.isort]
known-first-party = ["mypackage"]
required-imports = ["from __future__ import annotations"]
```

#### `[lint.mccabe]`

```toml
[tool.ruff.lint.mccabe]
max-complexity = 10  # default
```

#### `[lint.pydocstyle]`

```toml
[tool.ruff.lint.pydocstyle]
convention = "google"  # or "numpy" or "pep257"
```

#### `[lint.pycodestyle]`

```toml
[tool.ruff.lint.pycodestyle]
max-doc-length = 88
ignore-overlong-task-comments = true
```

#### `[lint.flake8-bugbear]`

```toml
[tool.ruff.lint.flake8-bugbear]
extend-immutable-calls = ["fastapi.Depends", "fastapi.Query"]
```

#### `[lint.flake8-type-checking]`

```toml
[tool.ruff.lint.flake8-type-checking]
runtime-evaluated-base-classes = ["pydantic.BaseModel"]
quote-annotations = true
strict = false
```

#### `[lint.flake8-tidy-imports]`

```toml
[tool.ruff.lint.flake8-tidy-imports]
ban-relative-imports = "all"

[tool.ruff.lint.flake8-tidy-imports.banned-api]
"cgi".msg = "The cgi module is deprecated."
"typing.TypedDict".msg = "Use typing_extensions.TypedDict instead."
```

#### `[lint.pylint]`

```toml
[tool.ruff.lint.pylint]
max-args = 5
max-returns = 6
max-branches = 12
max-statements = 50
max-locals = 15
max-nested-blocks = 5
max-positional-args = 5
max-public-methods = 20
allow-magic-value-types = ["int", "str"]
```

#### `[lint.pep8-naming]`

```toml
[tool.ruff.lint.pep8-naming]
classmethod-decorators = ["pydantic.validator"]
ignore-names = ["setUp", "tearDown"]
```

#### `[lint.flake8-annotations]`

```toml
[tool.ruff.lint.flake8-annotations]
allow-star-arg-any = false
ignore-fully-untyped = false
mypy-init-return = false
suppress-dummy-args = false
suppress-none-returning = false
```

#### `[lint.flake8-bandit]`

```toml
[tool.ruff.lint.flake8-bandit]
check-typed-exception = false
hardcoded-tmp-directory = ["/tmp", "/var/tmp", "/dev/shm"]
```

#### `[lint.flake8-quotes]`

```toml
[tool.ruff.lint.flake8-quotes]
avoid-escape = true
docstring-quotes = "double"
inline-quotes = "double"
multiline-quotes = "double"
```

#### `[lint.pyflakes]`

```toml
[tool.ruff.lint.pyflakes]
allowed-unused-imports = ["hvplot.pandas"]  # modules with side effects on import
```

#### `[lint.pyupgrade]`

```toml
[tool.ruff.lint.pyupgrade]
keep-runtime-typing = false
```

---

## Versioning

Ruff uses a custom versioning scheme that uses the minor version number for breaking changes and the patch version number for bug fixes.

### Version Changes

**Minor version increases** will occur when:

- A deprecated option or feature is removed
- Configuration changes in a backwards incompatible way
- Support for a new file type is promoted to stable
- Support for an end-of-life Python version is dropped
- Linter: A rule is promoted to stable, or a stable rule's behavior is changed significantly
- Stable rules are added to or removed from the default set
- Formatter: The stable style changed

**Patch version increases** will occur when:

- Bugs are fixed
- A new configuration option is added in a backwards compatible way
- Support for a new Python version or file type is added in preview
- An option or feature is deprecated
- Linter: A rule is added in preview
- Formatter: Preview style changed

### Rule Stabilization

- New rules should always be added in preview mode
- New rules will remain in preview mode for at least one minor release before being promoted to stable
- Stable rule behaviors are not changed significantly in patch versions

### Fix Stabilization

Fixes have three applicability levels:

1. **Display** — Never applied, just displayed
2. **Unsafe** — Can be applied with explicit opt-in
3. **Safe** — Can be applied automatically

---

## Integrations

### GitHub Actions

```yaml
name: CI
on: push
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install ruff
      - name: Run Ruff
        run: ruff check --output-format=github .
```

Using `ruff-action`:

```yaml
name: Ruff
on: [push, pull_request]
jobs:
  ruff:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: astral-sh/ruff-action@v3
        with:
          version: 0.8.0
          args: check --select B
          src: "./src"
```

### GitLab CI/CD

```yaml
.base_ruff:
  stage: build
  interruptible: true
  image:
    name: ghcr.io/astral-sh/ruff:0.15.4-alpine
  before_script:
    - cd $CI_PROJECT_DIR
    - ruff --version

Ruff Check:
  extends: .base_ruff
  script:
    - ruff check --output-format=gitlab --output-file=code-quality-report.json
  artifacts:
    reports:
      codequality: $CI_PROJECT_DIR/code-quality-report.json

Ruff Format:
  extends: .base_ruff
  script:
    - ruff format --diff
```

### pre-commit

```yaml
- repo: https://github.com/astral-sh/ruff-pre-commit
  rev: v0.15.4
  hooks:
    - id: ruff-check
      args: [--fix]
    - id: ruff-format
```

To avoid running on Jupyter Notebooks:

```yaml
- repo: https://github.com/astral-sh/ruff-pre-commit
  rev: v0.15.4
  hooks:
    - id: ruff-check
      types_or: [python, pyi]
      args: [--fix]
    - id: ruff-format
      types_or: [python, pyi]
```

### Docker Images

Ruff provides a distroless Docker image including the `ruff` binary. Published tags:

- `ruff:latest`
- `ruff:{major}.{minor}.{patch}` — e.g., `ruff:0.6.6`
- `ruff:{major}.{minor}` — e.g., `ruff:0.6`

Base image variants:

- Alpine (`ruff:alpine`, `ruff:alpine3.20`)
- Debian Slim (`ruff:debian-slim`, `ruff:bookworm-slim`)
- Debian full (`ruff:debian`, `ruff:bookworm`)

---

_Ruff version 0.15.4 · [docs.astral.sh/ruff](https://docs.astral.sh/ruff) · [GitHub](https://github.com/astral-sh/ruff)_
