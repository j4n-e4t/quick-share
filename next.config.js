/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

function getEnv() {
  if (process.env.RUNTIME_ENV === "docker") {
    return "standalone";
  } else {
    return "export";
  }
}

/** @type {import("next").NextConfig} */
const config = {
  output: getEnv(),
};

export default config;
