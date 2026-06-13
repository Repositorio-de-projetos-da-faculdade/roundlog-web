# RoundLog PWA — Dockerfile dev/demo
#
# Next.js 14 em modo dev. `sharp` (gerador de ícones) é nativo, então
# precisa libc6-compat no Alpine.
FROM node:20-alpine

# Sharp precisa de libc6-compat no Alpine
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
