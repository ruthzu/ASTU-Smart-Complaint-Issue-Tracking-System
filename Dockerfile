FROM node:20-alpine

WORKDIR /app



COPY package*.json ./

# Install ALL deps (including dev for build)
RUN npm install

# Copy Prisma schema and migrations before generate
COPY prisma ./prisma

# Generate Prisma client for correct platform
RUN npx prisma generate

# Copy rest of the source code
COPY . .

# Build project
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --omit=dev

EXPOSE 3000

CMD ["node", "dist/main.js"]