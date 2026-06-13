# RoundLog Web — Dockerfile dev/demo
#
# Next.js 14 em modo dev (next dev). Bind mount do compose dá hot reload,
# que é o que faz sentido pra estudo/demo. Build de produção é mais leve
# em runtime mas demora ~5-15 min e não é necessário aqui.
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
