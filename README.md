# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/6e435454-3717-41a2-a2d6-76dd6d5493bd

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/6e435454-3717-41a2-a2d6-76dd6d5493bd) and start prompting.

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

**Frontend:**
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

**Backend:**
- Laravel 12
- PHP 8.3
- MySQL 8.0
- Laravel Sanctum (API Authentication)

## Backend Setup

The project includes a Laravel backend for authentication and API services.

### Prerequisites
- PHP 8.3+
- Composer
- MySQL 8.0+

### Quick Start

1. **Navigate to backend directory:**
   ```sh
   cd backend
   ```

2. **Configure database:**
   - Create MySQL database: `ramay_humour_academy`
   - Update `.env` file with your database credentials

3. **Run migrations:**
   ```sh
   php artisan migrate
   ```

4. **Start Laravel server:**
   ```sh
   php artisan serve
   ```

5. **In a new terminal, start the frontend:**
   ```sh
   npm run dev
   ```

For detailed setup instructions, see [backend/SETUP_GUIDE.md](./backend/SETUP_GUIDE.md)

For API documentation, see [backend/API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/6e435454-3717-41a2-a2d6-76dd6d5493bd) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
