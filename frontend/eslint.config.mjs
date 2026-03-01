import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextCoreWebVitals,
  ...nextTypescript,
  prettier,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "public/**", "src/generated/**"]),
  // Turn off React Compiler rules — eslint-config-next v16 enables eslint-plugin-react-hooks
  // v7 which adds React Compiler lint rules. This codebase does not use the React Compiler,
  // so these rules produce false positives for legitimate patterns.
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
      "react-hooks/refs": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "react-hooks/immutability": "off",
      "react-hooks/incompatible-library": "off",
    },
  },
]);

export default eslintConfig;
