import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/CodeBlock";
import { Terminal } from "lucide-react";

export const metadata = {
  title: "Deployment Guide - XandNodes Documentation",
  description: "Deploy XandNodes to production on various platforms",
};

export default function DeploymentPage() {
  return (
    <div className="space-y-8">
      <div>
        <Badge variant="outline" className="mb-4">Platform</Badge>
        <h1 className="text-4xl font-bold mb-4">Deployment Guide</h1>
        <p className="text-xl text-muted-foreground">
          Deploy XandNodes to production on Vercel, Docker, or customized Linux infrastructure
        </p>
      </div>

      <div className="bg-muted rounded-lg p-6 border border-border">
        <h3 className="font-semibold mb-2">Before You Deploy</h3>
        <p className="text-sm text-muted-foreground">
          Ensure you have completed local development setup and testing. See the <a href="/docs/guides/quick-start" className="text-primary hover:underline">Quick Start Guide</a> first.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Docker Deployment</h2>
        <p className="mb-4">The recommended method for production deployments.</p>

        <h3 className="text-lg font-semibold mb-3">Step 1: Create Dockerfile</h3>
        <p className="mb-3 text-sm text-muted-foreground">Create a <code className="bg-muted px-2 py-1 rounded">Dockerfile</code> in the project root:</p>
        <CodeBlock
          code={`FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables
ENV NEXT_PUBLIC_APP_VERSION=1.0.0
ENV NODE_ENV=production

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]`}
          language="dockerfile"
          title="Dockerfile"
        />

        <h3 className="text-lg font-semibold mb-3">Step 2: Build and Run</h3>
        <CodeBlock
          code={`# Build the image\ndocker build -t xandnodes .\n\n# Run the container\ndocker run -p 3000:3000 \\\n  -e NEXT_PUBLIC_APP_VERSION=1.0.0 \\\n  xandnodes`}
          language="bash"
          title="Docker Build & Run"
        />

        <h3 className="text-lg font-semibold mb-3">Step 3: Docker Compose (Optional)</h3>
        <p className="mb-3 text-sm text-muted-foreground">Create <code className="bg-muted px-2 py-1 rounded">docker-compose.yml</code>:</p>
        <CodeBlock
          code={`version: '3.8'\nservices:\n  xandnodes:\n    build: .\n    ports:\n      - "3000:3000"\n    environment:\n      - NEXT_PUBLIC_APP_VERSION=1.0.0\n      - NODE_ENV=production\n    restart: unless-stopped`}
          language="yaml"
          title="docker-compose.yml"
        />
        <CodeBlock
          code={`docker-compose up -d`}
          language="bash"
          title="Terminal"
        />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4 text-primary">Vercel Deployment</h2>
        <p className="mb-4">Vercel is the optimal platform for XandNodes, offering the best performance for Next.js 14 Speed and App Router stability.</p>

        <h3 className="text-lg font-semibold mb-3">Option 1: Vercel Dashboard</h3>
        <ol className="space-y-4 text-muted-foreground mb-6">
          <li className="flex gap-4">
            <span className="font-bold text-primary italic">1.</span>
            <div>
              <p className="text-foreground font-semibold">Connect Repository</p>
              <p className="text-sm">Log in to <a href="https://vercel.com" target="_blank" rel="noreferrer" className="underline hover:text-primary">vercel.com</a> and click "Add New Project". Select your <code>XandNodes</code> GitHub repository.</p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-primary italic">2.</span>
            <div>
              <p className="text-foreground font-semibold">Configure Settings</p>
              <p className="text-sm">Vercel automatically detects Next.js. Ensure the "Build Command" is <code>npm run build</code> and "Output Directory" is <code>.next</code>.</p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-primary italic">3.</span>
            <div>
              <p className="text-foreground font-semibold">Environment Setup</p>
              <p className="text-sm">Add any necessary variables in the project settings. Note: <code>XandNodes</code> uses hardcoded pRPC seeds for decentralization, so minimal setup is required.</p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-primary italic">4.</span>
            <div>
              <p className="text-foreground font-semibold">Deploy</p>
              <p className="text-sm">Click "Deploy". Every future push to your <code>main</code> branch will trigger a production build automatically.</p>
            </div>
          </li>
        </ol>

        <h3 className="text-lg font-semibold mb-3">Option 2: Vercel CLI</h3>
        <CodeBlock
          code={`npm i -g vercel\nvercel login\nvercel --prod`}
          language="bash"
          title="Vercel CLI"
        />

        <p className="text-sm text-muted-foreground mb-4">
          Vercel benefits: Instant Edge Network propagation, automatic SSL, and sub-second cold starts for the pNode dashboard.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Custom VPS/Server Deployment</h2>
        <p className="mb-4">Deploy on any Linux server with Node.js.</p>

        <h3 className="text-lg font-semibold mb-3">Prerequisites</h3>
        <ul className="space-y-1 text-muted-foreground mb-6">
          <li>• Ubuntu 20.04+ or similar Linux distribution</li>
          <li>• Node.js 20+ installed</li>
          <li>• Nginx or Apache for reverse proxy</li>
          <li>• PM2 for process management</li>
        </ul>

        <h3 className="text-lg font-semibold mb-3">Deployment Steps</h3>
        <CodeBlock
          code={`# 1. Clone and build\ngit clone https://github.com/Dairus01/XandNodes.git\ncd xandnodes\nnpm install\nnpm run build\n\n# 2. Install PM2\nnpm install -g pm2\n\n# 3. Start with PM2\npm2 start npm --name "xandnodes" -- start\n\n# 4. Set up PM2 to start on boot\npm2 startup\npm2 save\n\n# 5. Check status\npm2 status`}
          language="bash"
          title="VPS Setup"
          showLineNumbers
        />

        <h3 className="text-lg font-semibold mb-3">Nginx Configuration</h3>
        <p className="mb-3 text-sm text-muted-foreground">Create <code className="bg-muted px-2 py-1 rounded">/etc/nginx/sites-available/xandnodes</code>:</p>
        <CodeBlock
          code={`server {\n    listen 80;\n    server_name your-domain.com;\n\n    location / {\n        proxy_pass http://localhost:3000;\n        proxy_http_version 1.1;\n        proxy_set_header Upgrade $http_upgrade;\n        proxy_set_header Connection 'upgrade';\n        proxy_set_header Host $host;\n        proxy_cache_bypass $http_upgrade;\n    }\n}`}
          language="nginx"
          title="Nginx Config"
          showLineNumbers
        />
        <CodeBlock
          code={`# Enable site\nsudo ln -s /etc/nginx/sites-available/xandnodes /etc/nginx/sites-enabled/\nsudo nginx -t\nsudo systemctl reload nginx`}
          language="bash"
          title="Nginx Activation"
        />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Environment Variables</h2>
        <p className="mb-4">Configuration options for all deployment methods:</p>
        <div className="space-y-3">
          <div className="border-l-4 border-primary pl-4">
            <p className="font-mono text-sm mb-1">NEXT_PUBLIC_APP_VERSION</p>
            <p className="text-sm text-muted-foreground">Version number displayed in UI (default: 1.0.0)</p>
          </div>
          <div className="border-l-4 border-muted-foreground pl-4">
            <p className="font-mono text-sm mb-1">NODE_ENV</p>
            <p className="text-sm text-muted-foreground">Set to "production" for production builds (auto-set by most platforms)</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Post-Deployment Checklist</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <span>Verify dashboard loads and shows network data</span>
          </li>
          <li className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <span>Test node search and filtering</span>
          </li>
          <li className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <span>Confirm data export (CSV/JSON) works</span>
          </li>
          <li className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <span>Check mobile responsiveness</span>
          </li>
          <li className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <span>Verify HTTPS is enabled (if custom domain)</span>
          </li>
          <li className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <span>Monitor performance (should load in 6-7 seconds)</span>
          </li>
        </ul>
      </div>

      <div className="bg-muted rounded-lg p-6 border border-border">
        <h3 className="font-semibold mb-3">Production Best Practices</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Use Vercel Edge Cache or a Global CDN for static assets</li>
          <li>• Enable compression (gzip/brotli)</li>
          <li>• Set up monitoring and error tracking</li>
          <li>• Configure automated backups</li>
          <li>• Use environment-specific configurations</li>
          <li>• Keep dependencies up to date</li>
        </ul>
      </div>
    </div>
  );
}
