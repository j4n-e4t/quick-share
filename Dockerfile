FROM node:slim AS base

FROM base as deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV RUNTIME_ENV=docker
ENV SKIP_ENV_VALIDATION=true
RUN corepack enable pnpm && pnpm run build

FROM gcr.io/distroless/nodejs20
WORKDIR /app
COPY ./public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
HEALTHCHECK CMD curl --fail http://localhost:3000 || exit 1 
CMD ["server.js"]