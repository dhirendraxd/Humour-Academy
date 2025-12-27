# Quick Start Guide

Get Ramay Humour Academy running in 5 minutes!

## Prerequisites

- Node.js 16+ and npm
- PHP 8.3+
- Composer
- MySQL 8.0+

## Automatic Setup (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/dhirendraxd/Humour-Academy.git
cd Humour-Academy

# 2. Run the automated setup script
bash setup.sh

# 3. Update database credentials in backend/.env if needed

# 4. Start both servers
bash start.sh
```

Then visit: **http://localhost:5173**

## Manual Setup

### Backend Setup

```bash
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env
# DB_DATABASE=ramay_humour_academy
# DB_USERNAME=root
# DB_PASSWORD=your_password

# Run migrations and seed
php artisan migrate --seed

# Start server (runs on port 8000)
php artisan serve
```

### Frontend Setup

```bash
# From project root
npm install
npm run dev
```

Frontend runs on **http://localhost:5173**

## Login Credentials

Use any of these accounts to test different features:

| Role | Email | Password |
|------|-------|----------|
| 👨‍💼 Board Member | bod@academy.com | password123 |
| 👨‍🏫 Faculty 1 | sarah@academy.com | password123 |
| 👨‍🏫 Faculty 2 | james@academy.com | password123 |
| 👨‍🎓 Student 1 | alex@student.com | password123 |
| 👨‍🎓 Student 2 | emma@student.com | password123 |
| 👨‍🎓 Student 3 | marcus@student.com | password123 |

## What to Try

### As Board Member (bod@academy.com)
- 📊 View Academy Overview and analytics
- 📚 Create new programs and manage curriculum
- 👥 Review faculty applications
- 📅 Manage global cohorts

### As Faculty (sarah@academy.com)
- 📖 View assigned modules
- 👨‍🎓 Manage student enrollments
- ✅ Grade assignments
- 📋 Create assessments

### As Student (alex@student.com)
- 🎓 Browse and enroll in courses
- 📚 Access course materials
- 📊 Track progress
- 📝 Submit assessments

## Troubleshooting

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for:
- Port already in use errors
- Database connection issues
- API not responding
- CORS errors
- And more!

## Common Commands

```bash
# Frontend
npm run dev       # Start dev server
npm run build     # Build for production
npm run lint      # Lint code

# Backend
cd backend
php artisan serve              # Start server
php artisan tinker             # Interactive shell
php artisan migrate:fresh --seed  # Reset database
php artisan logs              # View recent logs
```

## Project Structure

```
Humour-Academy/
├── src/                 # React frontend
├── backend/             # Laravel API
├── README.md            # Project overview
├── TROUBLESHOOTING.md   # Debugging guide
├── QUICKSTART.md        # This file
├── setup.sh             # Automated setup
└── start.sh             # Start both servers
```

## Support

- 📖 Read [README.md](./README.md) for full documentation
- 🐛 Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues
- 📚 See [backend/API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md) for API details
- 💬 Review logs when something doesn't work

## What's Next?

- Explore the dashboards with different user roles
- Check out the API endpoints using cURL or Postman
- Review the component structure in `src/components/`
- Extend the platform with your own features!

---

**Questions?** Check the TROUBLESHOOTING.md file first! 🔍
