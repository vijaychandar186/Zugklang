# Programmatic Configuration with `vercel.ts`

_Last updated December 19, 2025_

The `vercel.ts` file lets you configure and override the default behavior of Vercel from within your project. Unlike `vercel.json`, which is static, `vercel.ts` executes at build time, which lets you dynamically generate configuration. For example, you can fetch content from APIs, use environment variables to conditionally set routes, or compute configuration values based on your project structure.

---

## Getting Started

### Requirements

> Use only one configuration file: `vercel.ts` **or** `vercel.json`.

You can have any sort of code in your `vercel.ts` file, but the final set of rules and configuration properties must be in a `config` struct export. Use the same property names as `vercel.json` in your `config` export. For `rewrites`, `redirects`, `headers`, and `transforms`, prefer the helper functions from `routes`:

```ts
export const config: VercelConfig = {
  buildCommand: "npm run build",
  cleanUrls: true,
  trailingSlash: false,
  // See the sections below for all available options
};
```

To migrate from `vercel.json`, copy its contents into your `config` export, then add new capabilities as needed.

### Install `@vercel/config`

Install the NPM package to get access to types and helpers:

```sh
pnpm i @vercel/config
```

Create a `vercel.ts` in your project root and export a typed config. The example below shows how to configure build commands, framework settings, routing rules (rewrites and redirects), and headers:

> You can also use `vercel.js`, `vercel.mjs`, `vercel.cjs`, or `vercel.mts` to create this configuration file.

```ts
import { routes, deploymentEnv, type VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  buildCommand: "npm run build",
  framework: "nextjs",

  rewrites: [
    routes.rewrite("/api/(.*)", "https://backend.api.example.com/$1"),
    routes.rewrite("/(.*)", "https://api.example.com/$1", {
      requestHeaders: {
        authorization: `Bearer ${deploymentEnv("API_TOKEN")}`,
      },
    }),
    routes.rewrite(
      "/users/:userId/posts/:postId",
      "https://api.example.com/users/$1/posts/$2",
      ({ userId, postId }) => ({
        requestHeaders: {
          "x-user-id": userId,
          "x-post-id": postId,
          authorization: `Bearer ${deploymentEnv("API_KEY")}`,
        },
      }),
    ),
  ],

  redirects: [routes.redirect("/old-docs", "/docs", { permanent: true })],

  headers: [
    routes.cacheControl("/static/(.*)", {
      public: true,
      maxAge: "1 week",
      immutable: true,
    }),
  ],

  crons: [{ path: "/api/cleanup", schedule: "0 0 * * *" }],
};
```

---

## Migrating from `vercel.json`

To migrate from an existing `vercel.json`, paste its contents into a `config` export in a new `vercel.ts` file:

```ts
export const config = {
  buildCommand: "pnpm run generate-config",
  outputDirectory: ".next",
  headers: [
    {
      source: "/(.*)\\.(js|css|jpg|jpeg|gif|png|svg|txt|ttf|woff2|webmanifest)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=2592000, s-maxage=2592000",
        },
      ],
    },
  ],
};
```

Then install the `@vercel/config` package and enhance your configuration:

```ts
import { routes, type VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  buildCommand: "pnpm run generate-config",
  outputDirectory: `.${process.env.framework}`,
  headers: [
    routes.cacheControl(
      "/(.*)\\.(js|css|jpg|jpeg|gif|png|svg|txt|ttf|woff2|webmanifest)",
      {
        public: true,
        maxAge: "30days",
        sMaxAge: "30days",
      },
    ),
  ],
};
```

---

## Config Export Options

- [`buildCommand`](#buildcommand)
- [`bunVersion`](#bunversion)
- [`cleanUrls`](#cleanurls)
- [`crons`](#crons)
- [`devCommand`](#devcommand)
- [`fluid`](#fluid)
- [`framework`](#framework)
- [`functions`](#functions)
- [`headers`](#headers)
- [`ignoreCommand`](#ignorecommand)
- [`images`](#images)
- [`installCommand`](#installcommand)
- [`outputDirectory`](#outputdirectory)
- [`public`](#public)
- [`redirects`](#redirects)
- [`bulkRedirectsPath`](#bulkredirectspath)
- [`regions`](#regions)
- [`functionFailoverRegions`](#functionfailoverregions)
- [`rewrites`](#rewrites)
- [`trailingSlash`](#trailingslash)
- [Legacy](#legacy-properties)

---

## Schema Autocomplete

Via the types imported from the `@vercel/config` package, autocomplete for all config properties and helpers are automatically available in `vercel.ts`.

```ts
import { routes, type VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  rewrites: [routes.rewrite("/about", "/about-our-company.html")],
  // add more properties here
};
```

---

## `buildCommand`

**Type:** `string | null`

> This value overrides the Build Command in Project Settings.

The `buildCommand` property can be used to override the Build Command in the Project Settings dashboard, and the build script from the `package.json` file for a given deployment.

```ts
import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  buildCommand: "next build",
};
```

---

## `bunVersion`

> The Bun runtime is available in Beta on all plans.

**Type:** `string`  
**Value:** `"1.x"`

The `bunVersion` property configures your project to use the Bun runtime instead of Node.js. When set, all Vercel Functions and Routing Middleware not using the Edge runtime will run using the specified Bun version.

```ts
import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  bunVersion: "1.x",
};
```

Vercel manages the Bun minor and patch versions automatically. `1.x` is the only valid value currently.

When using Next.js with ISR (Incremental Static Regeneration), you must also update your build and dev commands in `package.json`:

```json
{
  "scripts": {
    "dev": "bun run --bun next dev",
    "build": "bun run --bun next build"
  }
}
```

---

## `cleanUrls`

**Type:** `boolean`  
**Default:** `false`

When set to `true`, all HTML files and Vercel functions will have their extension removed. When visiting a path that ends with the extension, a `308` response will redirect the client to the extensionless path.

For example, a static file named `about.html` will be served when visiting the `/about` path. Visiting `/about.html` will redirect to `/about`.

Similarly, a Vercel Function named `api/user.go` will be served when visiting `/api/user`. Visiting `/api/user.go` will redirect to `/api/user`.

```ts
import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  cleanUrls: true,
};
```

> **Note:** If you are using Next.js and running `vercel dev`, you will get a 404 error when visiting a route configured with `cleanUrls` locally. It does however work fine when deployed to Vercel.

---

## `crons`

Used to configure cron jobs for the production deployment of a project.

**Type:** Array of `cron` objects

**Limits:**

- A maximum string length of `512` for the `path` value
- A maximum string length of `256` for the `schedule` value

### Cron Object Definition

| Property   | Required | Description                                                             |
| ---------- | -------- | ----------------------------------------------------------------------- |
| `path`     | Yes      | The path to invoke when the cron job is triggered. Must start with `/`. |
| `schedule` | Yes      | The cron schedule expression to use for the cron job.                   |

```ts
import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  crons: [
    {
      path: "/api/every-minute",
      schedule: "* * * * *",
    },
    {
      path: "/api/every-hour",
      schedule: "0 * * * *",
    },
    {
      path: "/api/every-day",
      schedule: "0 0 * * *",
    },
  ],
};
```

---

## `devCommand`

**Type:** `string | null`

> This value overrides the Development Command in Project Settings.

The `devCommand` property can be used to override the Development Command in the Project Settings dashboard.

```ts
import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  devCommand: "next dev",
};
```

---

## `fluid`

**Type:** `boolean | null`

> This value allows you to enable Fluid compute programmatically.

The `fluid` property allows you to test Fluid compute on a per-deployment or per custom environment basis when using branch tracking, without needing to enable Fluid in production.

> As of April 23, 2025, Fluid compute is enabled by default for new projects.

```ts
import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  fluid: true,
};
```

---

## `framework`

**Type:** `string | null`

> This value overrides the Framework in Project Settings.

The `framework` property can be used to override the Framework Preset in the Project Settings dashboard. The value must be a valid framework slug. To select "Other" as the Framework Preset, use `null`.

**Available framework slugs:**

`nextjs`, `nuxtjs`, `svelte`, `create-react-app`, `gatsby`, `remix`, `react-router`, `solidstart`, `sveltekit`, `blitzjs`, `astro`, `hexo`, `eleventy`, `docusaurus-2`, `docusaurus`, `preact`, `solidstart-1`, `dojo`, `ember`, `vue`, `scully`, `ionic-angular`, `angular`, `polymer`, `sveltekit-1`, `ionic-react`, `gridsome`, `umijs`, `sapper`, `saber`, `stencil`, `redwoodjs`, `hugo`, `jekyll`, `brunch`, `middleman`, `zola`, `hydrogen`, `vite`, `tanstack-start`, `vitepress`, `vuepress`, `parcel`, `fastapi`, `flask`, `fasthtml`, `sanity-v3`, `sanity`, `storybook`, `nitro`, `hono`, `express`, `h3`, `koa`, `nestjs`, `elysia`, `fastify`, `xmcp`

```ts
import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  framework: "nextjs",
};
```

---

## `functions`

**Type:** Object of key `string` and value `object`

### Key Definition

A glob pattern that matches the paths of the Vercel functions you would like to customize:

- `api/*.js` — matches one level (e.g. `api/hello.js` but not `api/hello/world.js`)
- `api/**/*.ts` — matches all levels (`api/hello.ts` and `api/hello/world.ts`)
- `src/pages/**/*` — matches all functions from `src/pages`
- `api/test.js`

### Value Definition

| Property                  | Required | Description                                                                                                |
| ------------------------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| `runtime`                 | Optional | The npm package name of a Runtime, including its version.                                                  |
| `memory`                  | Optional | Cannot be set in `vercel.ts` with Fluid compute enabled. Set it in the Functions tab instead.              |
| `maxDuration`             | Optional | An integer defining how long your Vercel Function should be allowed to run on every request in seconds.    |
| `supportsCancellation`    | Optional | A boolean defining whether your Vercel Function should support request cancellation. Node.js runtime only. |
| `includeFiles`            | Optional | A glob pattern to match files that should be included in your Vercel Function. Not supported in Next.js.   |
| `excludeFiles`            | Optional | A glob pattern to match files that should be excluded from your Vercel Function. Not supported in Next.js. |
| `regions`                 | Optional | An array of region identifiers specifying where this specific function should be deployed.                 |
| `functionFailoverRegions` | Optional | An array of region identifiers specifying passive failover regions. Enterprise only.                       |

By default, no configuration is needed to deploy Vercel functions. For all officially supported runtimes, create an `api` directory at the root of your project and place your functions inside.

> The `functions` property cannot be used in combination with `builds`.

When deployed, each Vercel Function receives the following defaults:

- **Memory:** 1024 MB (1 GB)
- **Maximum Duration:** 10s default — 60s (Hobby), 300s (Pro), 900s (Enterprise)

### Functions with Vercel Functions

```ts
import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  functions: {
    "api/test.js": {
      memory: 3009,
      maxDuration: 30,
    },
    "api/*.js": {
      memory: 3009,
      maxDuration: 30,
    },
  },
};
```

### Functions with ISR

```ts
import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  functions: {
    "pages/blog/[hello].tsx": {
      memory: 1024,
    },
    "src/pages/isr/**/*": {
      maxDuration: 10,
    },
  },
};
```

### Per-Function Regions and `functionFailoverRegions`

```ts
import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  regions: ["iad1"],
  functions: {
    "api/eu-data.js": {
      regions: ["cdg1"],
      functionFailoverRegions: ["lhr1"],
    },
    "api/us-data.js": {
      regions: ["sfo1", "iad1"],
      functionFailoverRegions: ["pdx1"],
    },
  },
};
```

In the example above, `api/eu-data.js` runs in Paris (`cdg1`) with London (`lhr1`) as a failover, while `api/us-data.js` runs in San Francisco (`sfo1`) and Washington, D.C. (`iad1`) with Portland (`pdx1`) as a failover.

### Using Unsupported Runtimes

```ts
import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  functions: {
    "api/test.php": {
      runtime: "vercel-php@0.5.2",
    },
  },
};
```

---

## `headers`

**Type:** Array of `header` objects

### Header Object Definition

| Property  | Description                                                                                                            |
| --------- | ---------------------------------------------------------------------------------------------------------------------- |
| `source`  | A pattern that matches each incoming pathname (excluding querystring).                                                 |
| `headers` | A non-empty array of `key`/`value` pairs representing each response header.                                            |
| `has`     | An optional array of `has` objects for conditional path matching based on the **presence** of specified properties.    |
| `missing` | An optional array of `missing` objects for conditional path matching based on the **absence** of specified properties. |

### Header `has` / `missing` Object Definition

| Property | Type                         | Description                                                   |
| -------- | ---------------------------- | ------------------------------------------------------------- |
| `type`   | String                       | Must be `header`, `cookie`, `host`, or `query`.               |
| `key`    | String                       | The key from the selected type to match against.              |
| `value`  | String, Object, or undefined | The value to check for. If `undefined`, any value will match. |

If `value` is an object, it supports:

| Condition | Type            | Description              |
| --------- | --------------- | ------------------------ |
| `eq`      | String          | Check for equality       |
| `neq`     | String          | Check for inequality     |
| `inc`     | `Array<String>` | Check for inclusion      |
| `ninc`    | `Array<String>` | Check for non-inclusion  |
| `pre`     | String          | Check for prefix         |
| `suf`     | String          | Check for suffix         |
| `re`      | String          | Check for regex match    |
| `gt`      | Number          | Greater than             |
| `gte`     | Number          | Greater than or equal to |
| `lt`      | Number          | Less than                |
| `lte`     | Number          | Less than or equal to    |

### Example

```ts
import { routes, type VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  headers: [
    routes.header("/service-worker.js", [
      { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
    ]),
    routes.header("/(.*)", [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-XSS-Protection", value: "1; mode=block" },
    ]),
    routes.header("/:path*", [{ key: "x-authorized", value: "true" }], {
      has: [{ type: "query", key: "authorized" }],
    }),
  ],
};
```

### Expressive Value Object Example

```ts
import { routes, type VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  headers: [
    routes.header("/:path*", [{ key: "x-authorized", value: "true" }], {
      has: [
        {
          type: "header",
          key: "X-Custom-Header",
          value: { pre: "valid", suf: "value" },
        },
      ],
    }),
  ],
};
```

---

## `ignoreCommand`

**Type:** `string | null`

> This value overrides the Ignored Build Step in Project Settings.

When the command exits with code `1`, the build will continue. When it exits with `0`, the build is ignored.

```ts
import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  ignoreCommand: "git diff --quiet HEAD^ HEAD ./",
};
```

---

## `installCommand`

**Type:** `string | null`

> This value overrides the Install Command in Project Settings.

An empty string value will cause the Install Command to be skipped.

```ts
import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  installCommand: "npm install",
};
```

---

## `images`

The `images` property defines the behavior of Vercel's native Image Optimization API, which allows on-demand optimization of images at runtime.

**Type:** Object

### Value Definition

| Property                 | Required | Description                                                     |
| ------------------------ | -------- | --------------------------------------------------------------- |
| `sizes`                  | Yes      | Array of allowed image widths.                                  |
| `localPatterns`          | No       | Allow-list of local image paths.                                |
| `remotePatterns`         | No       | Allow-list of external domains.                                 |
| `minimumCacheTTL`        | No       | Cache duration in seconds for optimized images.                 |
| `qualities`              | No       | Array of allowed image qualities.                               |
| `formats`                | No       | Supported output formats: `"image/avif"` and/or `"image/webp"`. |
| `dangerouslyAllowSVG`    | No       | Allow SVG input URLs. Disabled by default for security.         |
| `contentSecurityPolicy`  | No       | Specifies the Content Security Policy for optimized images.     |
| `contentDispositionType` | No       | `"inline"` or `"attachment"`.                                   |

```ts
import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  images: {
    sizes: [256, 640, 1080, 2048, 3840],
    localPatterns: [
      {
        pathname: "^/assets/.*$",
        search: "",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
        port: "",
        pathname: "^/account123/.*$",
        search: "?v=1",
      },
    ],
    minimumCacheTTL: 60,
    qualities: [25, 50, 75],
    formats: ["image/webp"],
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "script-src 'none'; frame-src 'none'; sandbox;",
    contentDispositionType: "inline",
  },
};
```

---

## `outputDirectory`

**Type:** `string | null`

> This value overrides the Output Directory in Project Settings.

```ts
import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  outputDirectory: "build",
};
```

---

## `public`

**Type:** `boolean`  
**Default:** `false`

When set to `true`, both the source view and logs view will be publicly accessible.

```ts
import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  public: true,
};
```

---

## `redirects`

**Type:** Array of `redirect` objects

> **Warning:** Some redirects and rewrites configurations can accidentally become gateways for semantic attacks. See the Enhancing Security for Redirects and Rewrites guide.

### Redirect Object Definition

| Property      | Description                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------- |
| `source`      | A pattern that matches each incoming pathname (excluding querystring).                      |
| `destination` | A location destination defined as an absolute pathname or external URL.                     |
| `permanent`   | Optional boolean. `true` = 308, `false` = 307. Default: `true`.                             |
| `statusCode`  | Optional integer for a custom status code. Cannot be used with `permanent`.                 |
| `has`         | Optional array for conditional redirects based on the **presence** of specified properties. |
| `missing`     | Optional array for conditional redirects based on the **absence** of specified properties.  |

### Examples

**Temporary redirect (307):**

```ts
import { routes, type VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  redirects: [routes.redirect("/me", "/profile.html", { permanent: false })],
};
```

**Permanent redirect (308):**

```ts
import { routes, type VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  redirects: [routes.redirect("/me", "/profile.html", { permanent: true })],
};
```

**Custom status code (301):**

```ts
import { routes, type VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  redirects: [routes.redirect("/user", "/api/user", { statusCode: 301 })],
};
```

**External redirect:**

```ts
import { routes, type VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  redirects: [
    routes.redirect("/view-source", "https://github.com/vercel/vercel"),
  ],
};
```

**Wildcard redirect:**

```ts
import { routes, type VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  redirects: [routes.redirect("/blog/:path*", "/news/:path*")],
};
```

**Regex redirect:**

```ts
import { routes, type VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  redirects: [routes.redirect("/post/:path(\\d{1,})", "/news/:path*")],
};
```

**Conditional redirect based on header:**

```ts
import { routes, type VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  redirects: [
    routes.redirect("/:path((?!uk/).*)", "/uk/:path*", {
      has: [
        {
          type: "header",
          key: "x-vercel-ip-country",
          value: "GB",
        },
      ],
      permanent: false,
    }),
  ],
};
```

> **Note:** Using `has` does not yet work locally with `vercel dev`, but works when deployed.

**Expressive value object redirect:**

```ts
import { routes, type VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  redirects: [
    routes.redirect("/start", "/end", {
      has: [
        {
          type: "header",
          key: "X-Custom-Header",
          value: { pre: "valid", suf: "value" },
        },
      ],
    }),
  ],
};
```

---

## `bulkRedirectsPath`

**Type:** `string` (path to a file or folder)

The `bulkRedirectsPath` property can be used to import many thousands of redirects per project. These redirects do not support wildcard or header matching.

CSV, JSON, and JSONL file formats are supported. Redirect files can be generated at build time as long as they end up in the specified location.

> **Note:** Bulk redirects do not work locally with `vercel dev`.

```ts
import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  bulkRedirectsPath: "redirects.csv",
};
```

### CSV Format

```csv
source,destination,permanent
/source/path,/destination/path,true
/source/path-2,https://destination-site.com/destination/path,true
```

### JSON Format

```json
[
  {
    "source": "/source/path",
    "destination": "/destination/path",
    "permanent": true
  },
  {
    "source": "/source/path-2",
    "destination": "https://destination-site.com/destination/path",
    "permanent": true
  }
]
```

### JSONL Format

```jsonl
{"source": "/source/path", "destination": "/destination/path", "permanent": true}
{"source": "/source/path-2", "destination": "https://destination-site.com/destination/path", "permanent": true}
```

### Bulk Redirect Field Definition

| Field                 | Type    | Required | Description                                                         |
| --------------------- | ------- | -------- | ------------------------------------------------------------------- |
| `source`              | string  | Yes      | Absolute path matching each incoming pathname. Max 2048 characters. |
| `destination`         | string  | Yes      | Absolute pathname or external URL. Max 2048 characters.             |
| `permanent`           | boolean | No       | `true` = 308, `false` = 307. Default: `false`.                      |
| `statusCode`          | integer | No       | Exact status code: 301, 302, 303, 307, or 308.                      |
| `caseSensitive`       | boolean | No       | Toggle case-sensitive path matching. Default: `false`.              |
| `preserveQueryParams` | boolean | No       | Toggle whether to preserve the query string. Default: `false`.      |

> In CSV format, all boolean values can be `t` (true) or `f` (false) for space efficiency.

---

## `regions`

**Type:** Array of region identifier strings  
**Default:** `["iad1"]`

> This value overrides the Vercel Function Region in Project Settings.

You can define the regions where your Vercel functions are executed. Pro and Enterprise users can deploy to multiple regions. Hobby plans can select any single region.

```ts
import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  regions: ["sfo1"],
};
```

You can also set regions on individual functions using the [`functions`](#functions) property to override the project-level default.

---

## `functionFailoverRegions`

> Setting failover regions for Vercel functions is available on Enterprise plans.

**Type:** Array of region identifier strings

Set this property to specify the region to which a Vercel Function should fallback when the default region(s) are unavailable.

```ts
import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  functionFailoverRegions: ["iad1", "sfo1"],
};
```

Vercel always attempts to invoke the function in the primary region first. If all primary regions are unavailable, Vercel automatically fails over to the regions specified in `functionFailoverRegions`, selecting the geographically closest region to the request. The order of the regions in `functionFailoverRegions` does not matter.

You can also set `functionFailoverRegions` on individual functions using the [`functions`](#functions) property to override the project-level default.

---

## `rewrites`

**Type:** Array of `rewrite` objects

> **Warning:** Some rewrites configurations can accidentally become gateways for semantic attacks. See the Enhancing Security for Redirects and Rewrites guide.

> If `cleanUrls` is set to `true`, do not include file extensions in the `source` or `destination` path.

### Rewrite Object Definition

| Property      | Description                                                                                |
| ------------- | ------------------------------------------------------------------------------------------ |
| `source`      | A pattern that matches each incoming pathname (excluding querystring).                     |
| `destination` | A location destination defined as an absolute pathname or external URL.                    |
| `has`         | Optional array for conditional rewrites based on the **presence** of specified properties. |
| `missing`     | Optional array for conditional rewrites based on the **absence** of specified properties.  |

### Examples

**Basic rewrite:**

```ts
import { routes, type VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  rewrites: [routes.rewrite("/about", "/about-our-company.html")],
};
```

**SPA fallback:**

```ts
import { routes, type VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  rewrites: [routes.rewrite("/(.*)", "/index.html")],
};
```

**Path parameters:**

```ts
import { routes, type VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  rewrites: [routes.rewrite("/resize/:width/:height", "/api/sharp")],
};
```

**Wildcard proxy:**

```ts
import { routes, type VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  rewrites: [routes.rewrite("/proxy/:match*", "https://example.com/:match*")],
};
```

**Conditional rewrite based on header:**

```ts
import { routes, type VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  rewrites: [
    routes.rewrite("/:path((?!uk/).*)", "/uk/:path*", {
      has: [
        {
          type: "header",
          key: "x-vercel-ip-country",
          value: "GB",
        },
      ],
    }),
  ],
};
```

**Conditional rewrite based on missing cookie:**

```ts
import { routes, type VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  rewrites: [
    routes.rewrite("/dashboard", "/login", {
      missing: [
        {
          type: "cookie",
          key: "auth_token",
        },
      ],
    }),
  ],
};
```

**Expressive value object rewrite:**

```ts
import { routes, type VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  rewrites: [
    routes.rewrite("/start", "/end", {
      has: [
        {
          type: "header",
          key: "X-Custom-Header",
          value: { pre: "valid", suf: "value" },
        },
      ],
    }),
  ],
};
```

> **Note:** The `source` property should NOT be a file, as the filesystem takes precedence before rewrites are applied. Using `has` does not yet work locally with `vercel dev`.

---

## `trailingSlash`

**Type:** `boolean`  
**Default:** `undefined`

### `false`

Visiting a path that ends with a forward slash will respond with a `308` redirect to the path without the trailing slash.

```ts
import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  trailingSlash: false,
};
```

### `true`

Visiting a path that does not end with a forward slash will respond with a `308` redirect to the path with a trailing slash. Paths with a file extension (e.g. `/styles.css`) will not be redirected.

```ts
import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  trailingSlash: true,
};
```

### `undefined`

Both `/about` and `/about/` will serve the same content without redirecting. This is not recommended as it could lead to search engines indexing duplicate content.

---

## Legacy Properties

Legacy properties like `routes` and `builds` are still supported in `vercel.ts` for backwards compatibility, but are deprecated. We recommend using the helper-based options above (`rewrites`, `redirects`, `headers`) for type safety and better developer experience.

For details on legacy properties, see the legacy section of the static configuration reference.
