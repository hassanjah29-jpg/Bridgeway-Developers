# Bridgeway Developers — backend container (for Fly.io / any Docker host)
FROM node:22-alpine

WORKDIR /app

# Install production dependencies first (better layer caching)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy the rest of the app
COPY . .

# Runtime state + uploads are stored on a persistent volume mounted at /data
ENV NODE_ENV=production \
    PORT=8080 \
    STATE_DIR=/data \
    UPLOAD_DIR=/data/uploads

EXPOSE 8080

CMD ["npm", "start"]
