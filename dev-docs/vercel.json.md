# Static Configuration with `vercel.json`

*Last updated December 19, 2025*

The `vercel.json` file lets you configure and override the default behavior of Vercel from within your project.

This file should be created in your project's root directory and allows you to set:

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

---

## Schema Autocomplete

To add autocompletion, type checking, and schema validation to your `vercel.json` file, add the following to the top of your file:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json"
}
```

---

## `buildCommand`

**Type:** `string | null`

The `buildCommand` property can be used to override the Build Command in the Project Settings dashboard, and the build script from the `package.json` file for a given deployment. For more information on the default behavior of the Build Command, visit the Configure a Build - Build Command section.

> This value overrides the Build Command in Project Settings.

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "next build"
}
```

---

## `bunVersion`

> The Bun runtime is available in Beta on all plans.

**Type:** `string`  
**Value:** `"1.x"`

The `bunVersion` property configures your project to use the Bun runtime instead of Node.js. When set, all Vercel Functions and Routing Middleware not using the Edge runtime will run using the specified Bun version.

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "bunVersion": "1.x"
}
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

To learn more about using Bun with Vercel Functions, see the Bun runtime documentation.

---

## `cleanUrls`

**Type:** `boolean`  
**Default:** `false`

When set to `true`, all HTML files and Vercel functions will have their extension removed. When visiting a path that ends with the extension, a `308` response will redirect the client to the extensionless path.

For example, a static file named `about.html` will be served when visiting the `/about` path. Visiting `/about.html` will redirect to `/about`.

Similarly, a Vercel Function named `api/user.go` will be served when visiting `/api/user`. Visiting `/api/user.go` will redirect to `/api/user`.

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "cleanUrls": true
}
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

| Property   | Required | Description |
|------------|----------|-------------|
| `path`     | Yes      | The path to invoke when the cron job is triggered. Must start with `/`. |
| `schedule` | Yes      | The cron schedule expression to use for the cron job. |

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "crons": [
    {
      "path": "/api/every-minute",
      "schedule": "* * * * *"
    },
    {
      "path": "/api/every-hour",
      "schedule": "0 * * * *"
    },
    {
      "path": "/api/every-day",
      "schedule": "0 0 * * *"
    }
  ]
}
```

---

## `devCommand`

**Type:** `string | null`

> This value overrides the Development Command in Project Settings.

The `devCommand` property can be used to override the Development Command in the Project Settings dashboard. For more information on the default behavior of the Development Command, visit the Configure a Build - Development Command section.

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "devCommand": "next dev"
}
```

---

## `fluid`

**Type:** `boolean | null`

> This value allows you to enable Fluid compute programmatically.

The `fluid` property allows you to test Fluid compute on a per-deployment or per custom environment basis when using branch tracking, without needing to enable Fluid in production.

> As of April 23, 2025, Fluid compute is enabled by default for new projects.

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "fluid": true
}
```

---

## `framework`

**Type:** `string | null`

> This value overrides the Framework in Project Settings.

The `framework` property can be used to override the Framework Preset in the Project Settings dashboard. The value must be a valid framework slug. To select "Other" as the Framework Preset, use `null`.

**Available framework slugs:**

`nextjs`, `nuxtjs`, `svelte`, `create-react-app`, `gatsby`, `remix`, `react-router`, `solidstart`, `sveltekit`, `blitzjs`, `astro`, `hexo`, `eleventy`, `docusaurus-2`, `docusaurus`, `preact`, `solidstart-1`, `dojo`, `ember`, `vue`, `scully`, `ionic-angular`, `angular`, `polymer`, `sveltekit-1`, `ionic-react`, `gridsome`, `umijs`, `sapper`, `saber`, `stencil`, `redwoodjs`, `hugo`, `jekyll`, `brunch`, `middleman`, `zola`, `hydrogen`, `vite`, `tanstack-start`, `vitepress`, `vuepress`, `parcel`, `fastapi`, `flask`, `fasthtml`, `sanity-v3`, `sanity`, `storybook`, `nitro`, `hono`, `express`, `h3`, `koa`, `nestjs`, `elysia`, `fastify`, `xmcp`

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs"
}
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

| Property                | Required | Description |
|-------------------------|----------|-------------|
| `runtime`               | Optional | The npm package name of a Runtime, including its version. |
| `memory`                | Optional | Cannot be set in `vercel.json` with Fluid compute enabled. Set it in the Functions tab instead. |
| `maxDuration`           | Optional | An integer defining how long your Vercel Function should be allowed to run on every request in seconds. |
| `supportsCancellation`  | Optional | A boolean defining whether your Vercel Function should support request cancellation. Node.js runtime only. |
| `includeFiles`          | Optional | A glob pattern to match files that should be included in your Vercel Function. Not supported in Next.js. |
| `excludeFiles`          | Optional | A glob pattern to match files that should be excluded from your Vercel Function. Not supported in Next.js. |
| `regions`               | Optional | An array of region identifiers specifying where this specific function should be deployed. |
| `functionFailoverRegions` | Optional | An array of region identifiers specifying passive failover regions. Enterprise only. |

By default, no configuration is needed to deploy Vercel functions. For all officially supported runtimes, create an `api` directory at the root of your project and place your functions inside.

> The `functions` property cannot be used in combination with `builds`.

When deployed, each Vercel Function receives the following defaults:

- **Memory:** 1024 MB (1 GB)
- **Maximum Duration:** 10s default — 60s (Hobby), 300s (Pro), 900s (Enterprise)

### Functions with Vercel Functions

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "functions": {
    "api/test.js": {
      "memory": 3009,
      "maxDuration": 30
    },
    "api/*.js": {
      "memory": 3009,
      "maxDuration": 30
    }
  }
}
```

### Functions with ISR

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "functions": {
    "pages/blog/[hello].tsx": {
      "memory": 1024
    },
    "src/pages/isr/**/*": {
      "maxDuration": 10
    }
  }
}
```

### Per-Function Regions and `functionFailoverRegions`

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "regions": ["iad1"],
  "functions": {
    "api/eu-data.js": {
      "regions": ["cdg1"],
      "functionFailoverRegions": ["lhr1"]
    },
    "api/us-data.js": {
      "regions": ["sfo1", "iad1"],
      "functionFailoverRegions": ["pdx1"]
    }
  }
}
```

In the example above, `api/eu-data.js` runs in Paris (`cdg1`) with London (`lhr1`) as a failover, while `api/us-data.js` runs in San Francisco (`sfo1`) and Washington, D.C. (`iad1`) with Portland (`pdx1`) as a failover.

### Using Unsupported Runtimes

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "functions": {
    "api/test.php": {
      "runtime": "vercel-php@0.5.2"
    }
  }
}
```

---

## `headers`

**Type:** Array of `header` objects

### Header Object Definition

| Property  | Description |
|-----------|-------------|
| `source`  | A pattern that matches each incoming pathname (excluding querystring). |
| `headers` | A non-empty array of `key`/`value` pairs representing each response header. |
| `has`     | An optional array of `has` objects for conditional path matching based on the **presence** of specified properties. |
| `missing` | An optional array of `missing` objects for conditional path matching based on the **absence** of specified properties. |

### Header `has` / `missing` Object Definition

| Property | Type | Description |
|----------|------|-------------|
| `type`   | String | Must be `header`, `cookie`, `host`, or `query`. |
| `key`    | String | The key from the selected type to match against. |
| `value`  | String, Object, or undefined | The value to check for. If `undefined`, any value will match. |

If `value` is an object, it supports:

| Condition | Type | Description |
|-----------|------|-------------|
| `eq`  | String | Check for equality |
| `neq` | String | Check for inequality |
| `inc` | `Array<String>` | Check for inclusion |
| `ninc` | `Array<String>` | Check for non-inclusion |
| `pre` | String | Check for prefix |
| `suf` | String | Check for suffix |
| `re`  | String | Check for regex match |
| `gt`  | Number | Greater than |
| `gte` | Number | Greater than or equal to |
| `lt`  | Number | Less than |
| `lte` | Number | Less than or equal to |

### Example

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "headers": [
    {
      "source": "/service-worker.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    },
    {
      "source": "/:path*",
      "has": [
        {
          "type": "query",
          "key": "authorized"
        }
      ],
      "headers": [
        {
          "key": "x-authorized",
          "value": "true"
        }
      ]
    }
  ]
}
```

### Expressive Value Object Example

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "headers": [
    {
      "source": "/:path*",
      "has": [
        {
          "type": "header",
          "key": "X-Custom-Header",
          "value": {
            "pre": "valid",
            "suf": "value"
          }
        }
      ],
      "headers": [
        {
          "key": "x-authorized",
          "value": "true"
        }
      ]
    }
  ]
}
```

---

## `ignoreCommand`

**Type:** `string | null`

> This value overrides the Ignored Build Step in Project Settings.

When the command exits with code `1`, the build will continue. When it exits with `0`, the build is ignored.

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "ignoreCommand": "git diff --quiet HEAD^ HEAD ./"
}
```

---

## `installCommand`

**Type:** `string | null`

> This value overrides the Install Command in Project Settings.

An empty string value will cause the Install Command to be skipped.

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "installCommand": "npm install"
}
```

---

## `images`

The `images` property defines the behavior of Vercel's native Image Optimization API, which allows on-demand optimization of images at runtime.

**Type:** Object

### Value Definition

| Property                  | Required | Description |
|---------------------------|----------|-------------|
| `sizes`                   | Yes      | Array of allowed image widths. |
| `localPatterns`           | No       | Allow-list of local image paths. |
| `remotePatterns`          | No       | Allow-list of external domains. |
| `minimumCacheTTL`         | No       | Cache duration in seconds for optimized images. |
| `qualities`               | No       | Array of allowed image qualities. |
| `formats`                 | No       | Supported output formats: `"image/avif"` and/or `"image/webp"`. |
| `dangerouslyAllowSVG`     | No       | Allow SVG input URLs. Disabled by default for security. |
| `contentSecurityPolicy`   | No       | Specifies the Content Security Policy for optimized images. |
| `contentDispositionType`  | No       | `"inline"` or `"attachment"`. |

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "images": {
    "sizes": [256, 640, 1080, 2048, 3840],
    "localPatterns": [
      {
        "pathname": "^/assets/.*$",
        "search": ""
      }
    ],
    "remotePatterns": [
      {
        "protocol": "https",
        "hostname": "example.com",
        "port": "",
        "pathname": "^/account123/.*$",
        "search": "?v=1"
      }
    ],
    "minimumCacheTTL": 60,
    "qualities": [25, 50, 75],
    "formats": ["image/webp"],
    "dangerouslyAllowSVG": false,
    "contentSecurityPolicy": "script-src 'none'; frame-src 'none'; sandbox;",
    "contentDispositionType": "inline"
  }
}
```

---

## `outputDirectory`

**Type:** `string | null`

> This value overrides the Output Directory in Project Settings.

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "outputDirectory": "build"
}
```

---

## `public`

**Type:** `boolean`  
**Default:** `false`

When set to `true`, both the source view and logs view will be publicly accessible.

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "public": true
}
```

---

## `redirects`

**Type:** Array of `redirect` objects

> **Warning:** Some redirects and rewrites configurations can accidentally become gateways for semantic attacks. See the Enhancing Security for Redirects and Rewrites guide.

### Redirect Object Definition

| Property     | Description |
|--------------|-------------|
| `source`     | A pattern that matches each incoming pathname (excluding querystring). |
| `destination`| A location destination defined as an absolute pathname or external URL. |
| `permanent`  | Optional boolean. `true` = 308, `false` = 307. Default: `true`. |
| `statusCode` | Optional integer for a custom status code. Cannot be used with `permanent`. |
| `has`        | Optional array for conditional redirects based on the **presence** of specified properties. |
| `missing`    | Optional array for conditional redirects based on the **absence** of specified properties. |

### Redirect `has` / `missing` Object Definition

| Property | Type | Description |
|----------|------|-------------|
| `type`   | String | `header`, `cookie`, `host`, or `query`. |
| `key`    | String | The key from the selected type to match against. |
| `value`  | String, Object, or undefined | The value to check for. |

### Examples

**Temporary redirect (307):**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "redirects": [
    { "source": "/me", "destination": "/profile.html", "permanent": false }
  ]
}
```

**Permanent redirect (308):**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "redirects": [
    { "source": "/me", "destination": "/profile.html", "permanent": true }
  ]
}
```

**Custom status code (301):**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "redirects": [
    { "source": "/user", "destination": "/api/user", "statusCode": 301 }
  ]
}
```

**External redirect:**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "redirects": [
    {
      "source": "/view-source",
      "destination": "https://github.com/vercel/vercel"
    }
  ]
}
```

**Wildcard redirect:**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "redirects": [
    {
      "source": "/blog/:path*",
      "destination": "/news/:path*"
    }
  ]
}
```

**Regex redirect:**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "redirects": [
    {
      "source": "/post/:path(\\d{1,})",
      "destination": "/news/:path*"
    }
  ]
}
```

**Conditional redirect based on header:**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "redirects": [
    {
      "source": "/:path((?!uk/).*)",
      "has": [
        {
          "type": "header",
          "key": "x-vercel-ip-country",
          "value": "GB"
        }
      ],
      "destination": "/uk/:path*",
      "permanent": false
    }
  ]
}
```

> **Note:** Using `has` does not yet work locally with `vercel dev`, but works when deployed.

---

## `bulkRedirectsPath`

**Type:** `string` (path to a file or folder)

The `bulkRedirectsPath` property can be used to import many thousands of redirects per project. These redirects do not support wildcard or header matching.

CSV, JSON, and JSONL file formats are supported. The redirect files can be generated at build time as long as they end up in the specified location.

> **Note:** Bulk redirects do not work locally with `vercel dev`.

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

| Field                | Type    | Required | Description |
|----------------------|---------|----------|-------------|
| `source`             | string  | Yes      | Absolute path matching each incoming pathname. Max 2048 characters. |
| `destination`        | string  | Yes      | Absolute pathname or external URL. Max 2048 characters. |
| `permanent`          | boolean | No       | `true` = 308, `false` = 307. Default: `false`. |
| `statusCode`         | integer | No       | Exact status code: 301, 302, 303, 307, or 308. |
| `caseSensitive`      | boolean | No       | Toggle case-sensitive path matching. Default: `false`. |
| `preserveQueryParams`| boolean | No       | Toggle whether to preserve the query string. Default: `false`. |

> In CSV format, all boolean values can be `t` (true) or `f` (false) for space efficiency.

---

## `regions`

**Type:** Array of region identifier strings  
**Default:** `["iad1"]`

> This value overrides the Vercel Function Region in Project Settings.

You can define the regions where your Vercel functions are executed. Pro and Enterprise users can deploy to multiple regions. Hobby plans can select any single region.

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "regions": ["sfo1"]
}
```

You can also set regions on individual functions using the [`functions`](#functions) property to override the project-level default.

---

## `functionFailoverRegions`

> Setting failover regions for Vercel functions is available on Enterprise plans.

**Type:** Array of region identifier strings

Set this property to specify the region to which a Vercel Function should fallback when the default region(s) are unavailable.

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "functionFailoverRegions": ["iad1", "sfo1"]
}
```

Vercel always attempts to invoke the function in the primary region first. If all primary regions are unavailable, Vercel automatically fails over to the regions specified in `functionFailoverRegions`, selecting the geographically closest region to the request. The order of the regions in `functionFailoverRegions` does not matter.

You can also set `functionFailoverRegions` on individual functions using the [`functions`](#functions) property to override the project-level default.

---

## `rewrites`

**Type:** Array of `rewrite` objects

> **Warning:** Some rewrites configurations can accidentally become gateways for semantic attacks. See the Enhancing Security for Redirects and Rewrites guide.

> If `cleanUrls` is set to `true`, do not include file extensions in the `source` or `destination` path.

### Rewrite Object Definition

| Property     | Description |
|--------------|-------------|
| `source`     | A pattern that matches each incoming pathname (excluding querystring). |
| `destination`| A location destination defined as an absolute pathname or external URL. |
| `has`        | Optional array for conditional rewrites based on the **presence** of specified properties. |
| `missing`    | Optional array for conditional rewrites based on the **absence** of specified properties. |

### Examples

**Basic rewrite:**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    { "source": "/about", "destination": "/about-our-company.html" }
  ]
}
```

**SPA fallback:**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Path parameters:**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    { "source": "/resize/:width/:height", "destination": "/api/sharp" }
  ]
}
```

**Wildcard proxy:**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    {
      "source": "/proxy/:match*",
      "destination": "https://example.com/:match*"
    }
  ]
}
```

**Conditional rewrite based on header:**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    {
      "source": "/:path((?!uk/).*)",
      "has": [
        {
          "type": "header",
          "key": "x-vercel-ip-country",
          "value": "GB"
        }
      ],
      "destination": "/uk/:path*"
    }
  ]
}
```

**Conditional rewrite based on missing cookie:**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    {
      "source": "/dashboard",
      "missing": [
        {
          "type": "cookie",
          "key": "auth_token"
        }
      ],
      "destination": "/login"
    }
  ]
}
```

> **Note:** The `source` property should NOT be a file, as the filesystem takes precedence before rewrites are applied. Using `has` does not yet work locally with `vercel dev`.

---

## `trailingSlash`

**Type:** `boolean`  
**Default:** `undefined`

### `false`

Visiting a path that ends with a forward slash will respond with a `308` redirect to the path without the trailing slash.

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "trailingSlash": false
}
```

### `true`

Visiting a path that does not end with a forward slash will respond with a `308` redirect to the path with a trailing slash. Paths with a file extension (e.g. `/styles.css`) will not be redirected.

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "trailingSlash": true
}
```

### `undefined`

Both `/about` and `/about/` will serve the same content without redirecting. This is not recommended as it could lead to search engines indexing duplicate content.

---

## Legacy Properties

Legacy properties are still supported for backwards compatibility, but are deprecated.

### `name`

Deprecated in favor of Project Linking.

**Type:** `string`

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "name": "example-app"
}
```

### `version`

**Type:** `number`  
**Valid values:** `1`, `2`

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "version": 2
}
```

### `alias`

Deprecated. Assign custom domains in Project Settings instead.

**Type:** `Array | string`  
**Limit:** Maximum of 64 aliases in the array.

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "alias": ["my-domain.com", "my-alias"]
}
```

### `scope`

Deprecated in favor of Project Linking.

**Type:** `string`

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "scope": "my-team"
}
```

> Deployments made through Git will ignore the `scope` property.

### `env`

> We recommend against using this property. Define environment variables in Project Settings instead.

**Type:** Object of string keys and values.

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "env": {
    "MY_KEY": "this is the value",
    "SECRET": "@my-secret-name"
  }
}
```

### `build.env`

> We recommend against using this property. Define environment variables in Project Settings instead.

**Type:** Object of string keys and values inside the `build` object.

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "env": {
    "MY_KEY": "this is the value",
    "SECRET": "@my-secret-name"
  }
}
```

### `builds`

> We recommend against using this property. Use the [`functions`](#functions) property instead.

**Type:** Array of `build` objects.

| Property | Description |
|----------|-------------|
| `src`    | A glob expression or pathname. Can include `*` and `**`. |
| `use`    | An npm module to be installed by the build process. |
| `config` | Optional object with arbitrary metadata for the Builder. |

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "builds": [
    { "src": "*.html", "use": "@vercel/static" },
    { "src": "*.py", "use": "@vercel/python" },
    { "src": "*.js", "use": "@vercel/node" }
  ]
}
```

> When at least one `builds` item is specified, only the outputs of the build processes will be included in the deployment. This is why static files must be explicitly allowlisted with `@vercel/static`.

### `routes`

> We recommend using `cleanUrls`, `trailingSlash`, `redirects`, `rewrites`, and/or `headers` instead. See the [upgrading routes](#upgrading-legacy-routes) section.

**Type:** Array of `route` objects.

#### Route Object Definition

| Property   | Description |
|------------|-------------|
| `src`      | A PCRE-compatible regular expression that matches each incoming pathname (excluding querystring). |
| `methods`  | A set of HTTP method types. If omitted, all methods match. |
| `dest`     | A destination pathname or full URL, with capture groups as `$1`, `$2`… |
| `headers`  | A set of headers to apply for responses. |
| `status`   | A status code to respond with. |
| `continue` | If `true`, routing continues even when `src` is matched. |
| `has`      | Optional array for conditional matching based on presence. |
| `missing`  | Optional array for conditional matching based on absence. |
| `mitigate` | Optional object with `action`: `"challenge"` or `"deny"`. |
| `transforms` | Optional array of transform objects for request/response manipulation. |

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "routes": [
    {
      "src": "/redirect",
      "status": 308,
      "headers": { "Location": "https://example.com/" }
    },
    {
      "src": "/custom-page",
      "headers": { "cache-control": "s-maxage=1000" },
      "dest": "/index.html"
    },
    { "src": "/api", "dest": "/my-api.js" },
    { "src": "/users", "methods": ["POST"], "dest": "/users-api.js" },
    { "src": "/users/(?<id>[^/]*)", "dest": "/users-api.js?id=$id" },
    { "src": "/legacy", "status": 404 },
    { "src": "/.*", "dest": "https://my-old-site.com" }
  ]
}
```

#### Transform Object Definition

| Property | Type | Description |
|----------|------|-------------|
| `type`   | String | `request.query`, `request.headers`, or `response.headers`. |
| `op`     | String | `append`, `set`, or `delete`. |
| `target` | Object | An object with a `key` property (string or object). |
| `args`   | String, `String[]`, or undefined | The value for the target according to `op`. |

**Transform examples:**

Delete a header from request and response:

```json
{
  "routes": [
    {
      "src": "/home",
      "transforms": [
        { "type": "request.headers", "op": "delete", "target": { "key": "x-custom-header" } },
        { "type": "response.headers", "op": "delete", "target": { "key": "x-custom-header" } }
      ]
    }
  ]
}
```

Set a query parameter:

```json
{
  "routes": [
    {
      "src": "/home",
      "transforms": [
        { "type": "request.query", "op": "set", "target": { "key": "theme" }, "args": "dark" }
      ]
    }
  ]
}
```

Append multiple values to a header:

```json
{
  "routes": [
    {
      "src": "/home",
      "transforms": [
        {
          "type": "request.headers",
          "op": "append",
          "target": { "key": "x-content-type-options" },
          "args": ["nosniff", "no-sniff"]
        }
      ]
    }
  ]
}
```

Delete headers matching a prefix:

```json
{
  "routes": [
    {
      "src": "/home",
      "transforms": [
        {
          "type": "request.headers",
          "op": "delete",
          "target": { "key": { "pre": "x-react-router-" } }
        }
      ]
    }
  ]
}
```

---

## Upgrading Legacy Routes

### Route Parameters

**Legacy:**

```json
{
  "routes": [{ "src": "/product/(?<id>[^/]+)", "dest": "/api/product?id=$id" }]
}
```

**Modern:**

```json
{
  "rewrites": [{ "source": "/product/:id", "destination": "/api/product" }]
}
```

### Redirects

**Legacy:**

```json
{
  "routes": [
    {
      "src": "/posts/(.*)",
      "headers": { "Location": "/blog/$1" },
      "status": 307
    }
  ]
}
```

**Modern:**

```json
{
  "redirects": [
    { "source": "/posts/:id", "destination": "/blog/:id", "permanent": false }
  ]
}
```

### SPA Fallback

**Legacy:**

```json
{
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

**Modern:**

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Headers

**Legacy:**

```json
{
  "routes": [
    {
      "src": "/favicon.ico",
      "headers": { "Cache-Control": "public, max-age=3600" },
      "continue": true
    },
    {
      "src": "/assets/(.*)",
      "headers": { "Cache-Control": "public, max-age=31556952, immutable" },
      "continue": true
    }
  ]
}
```

**Modern:**

```json
{
  "headers": [
    {
      "source": "/favicon.ico",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=3600" }]
    },
    {
      "source": "/assets/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31556952, immutable" }]
    }
  ]
}
```

### Pattern Matching

**Legacy** (dots must be escaped):

```json
{
  "routes": [{ "src": "/atom\\.xml", "dest": "/api/rss" }]
}
```

**Modern** (dots are not special characters):

```json
{
  "rewrites": [{ "source": "/atom.xml", "destination": "/api/rss" }]
}
```

### Negative Lookahead

**Legacy:**

```json
{
  "routes": [{ "src": "/(?!maintenance)", "dest": "/maintenance" }]
}
```

**Modern:**

```json
{
  "rewrites": [
    { "source": "/((?!maintenance).*)", "destination": "/maintenance" }
  ]
}
```

### Case Sensitivity

With `routes`, the `src` property is case-insensitive, which can lead to duplicate content. With `rewrites`, `redirects`, and `headers`, the `source` property is case-sensitive, preventing accidental duplicate content.