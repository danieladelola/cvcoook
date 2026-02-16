# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

### Self-hosted Deployment (Docker / Coolify)

This project includes full Docker support and is configured for deployment on [Coolify](https://coolify.io/).

#### Quick Start with Coolify:

1. Connect your Git repository to Coolify
2. Create a new application pointing to this repository
3. Coolify will automatically detect the Dockerfile and build configuration
4. Set required environment variables (see `.env.example`)
5. Deploy!

#### Local Docker Testing:

```sh
# Build the Docker image
docker build -t vuracv:latest .

# Run with docker-compose (includes PostgreSQL)
docker-compose up -d

# Or run manually with your own database
docker run -d \
  --name vuracv \
  -p 3000:3000 \
  -e DATABASE_URL="postgres://user:pass@host/db" \
  -e JWT_SECRET="your-secret-key" \
  -e NODE_ENV=production \
  vuracv:latest
```

See [DEPLOY.md](./DEPLOY.md) for detailed deployment instructions, environment variables, and troubleshooting.

#### Supported Deployment Platforms:
- ✅ Coolify (recommended for self-hosted)
- ✅ Docker (any Docker-compatible host)
- ✅ Docker Compose (local development/testing)
- ✅ Kubernetes (with Docker image)

#### Features for Production:
- Multi-stage Docker build for minimal image size
- Health checks configured
- Graceful shutdown handling
- PostgreSQL database integration
- JWT authentication
- Automatic migrations on startup

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
