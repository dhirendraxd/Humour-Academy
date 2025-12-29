# Ramay Humour Academy

A comprehensive platform for comedy and soft skills education, featuring curriculum management, faculty coordination, and student enrollment systems.

## 🚀 Quick Start

Get up and running in 5 minutes! See [QUICKSTART.md](./QUICKSTART.md) for step-by-step instructions.

```bash
# Automated setup (recommended)
bash setup.sh
bash start.sh

# Visit http://localhost:5173
```

## About the Project

**Ramay Humour Academy** is an educational platform designed to teach comedic principles as trainable mechanics. The platform transforms intangible qualities like charisma, wit, and presence into structured, teachable skills through:

- **4 Core Programs**: Emotional Intelligence & Wit, Public Speaking & Presence, Adaptive Leadership, Advanced Satire & Strategy
- **Module-Based Learning**: Each program consists of multiple phases taught by certified faculty
- **Cohort Management**: Flexible scheduling with capacity management and enrollment tracking
- **Role-Based Access**: Board of Directors (BOD), Faculty/Architects, and Students with distinct dashboards

## Getting Started

### Prerequisites
- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- PHP 8.3+
- Composer
- MySQL 8.0+

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/dhirendraxd/Humour-Academy.git
   cd Humour-Academy
   ```

2. **Install frontend dependencies:**
   ```sh
   npm install
   ```

3. **Set up the backend:**
   ```sh
   cd backend
   composer install
   cp .env.example .env
   ```

4. **Configure database credentials in `.env`:**
   ```
   DB_DATABASE=ramay_humour_academy
   DB_USERNAME=root
   DB_PASSWORD=your_password
   ```

5. **Run migrations and seed data:**
   ```sh
   php artisan migrate
   php artisan db:seed
   ```

6. **Start both servers:**
   ```sh
   # Terminal 1 - Backend (from project root)
   cd backend && php artisan serve
   
   # Terminal 2 - Frontend (from project root)
   npm run dev
   ```

The application will be available at `http://localhost:5173` (frontend) and `http://localhost:8000` (backend API).

## Architecture & Key Features

### Frontend Architecture
- **Vite** - Fast build tool and dev server
- **React + TypeScript** - Component-based UI with type safety
- **shadcn-ui** - High-quality component library
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization for dashboards

### Backend Architecture
- **Laravel 12** - Modern PHP framework
- **Laravel Sanctum** - API token authentication
- **MySQL 8.0** - Relational database
- **RESTful API** - Clean endpoint architecture

### Core Features

#### BOD (Board of Directors) Dashboard
- Program (curriculum) creation and management
- Faculty recruitment and approval workflow
- Global cohort oversight
- Academy-wide analytics and metrics
- System-level controls

#### Faculty/Architect Dashboard
- Module assignment and scheduling
- Student enrollment management
- Assessment and grading interface
- Event hosting capabilities
- Material distribution

#### Student Dashboard
- Course browsing and enrollment
- Progress tracking
- Material access
- Assessment submission

## Project Structure

```
ramay-humour-academy/
├── src/                          # Frontend React application
│   ├── components/               # Reusable UI components
│   │   ├── BODDashboard.tsx      # Board administration
│   │   ├── FacultyDashboard.tsx  # Faculty management
│   │   ├── StudentDashboard.tsx  # Student interface
│   │   └── ...other components
│   ├── pages/                    # Page components
│   ├── lib/                      # Utilities and API services
│   ├── hooks/                    # Custom React hooks
│   └── data/                     # Mock data for development
├── backend/                      # Laravel application
│   ├── app/
│   │   ├── Http/Controllers/     # API endpoints
│   │   │   ├── CohortController.php
│   │   │   ├── CurriculumController.php
│   │   │   ├── ModuleController.php
│   │   │   ├── RecruitmentController.php
│   │   │   ├── AnalyticsController.php
│   │   │   └── ...other controllers
│   │   └── Models/               # Database models
│   ├── database/
│   │   ├── migrations/           # Schema migrations
│   │   └── seeders/              # Database seeding
│   ├── routes/
│   │   └── api.php               # API routes
│   └── SETUP_GUIDE.md            # Backend setup instructions
└── README.md                     # This file
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user (protected)

### Curriculum Management
- `GET /curriculums` - List all programs
- `POST /curriculums` - Create program (BOD only)
- `PUT /curriculums/{id}` - Update program (BOD only)
- `DELETE /curriculums/{id}` - Delete program (BOD only)

### Module Management
- `GET /modules` - List modules
- `GET /modules/{id}` - Get module details
- `POST /modules` - Create module (BOD only)
- `PUT /modules/{id}` - Update module (BOD only)

### Cohort Management
- `GET /cohorts` - List cohorts
- `POST /cohorts` - Create cohort
- `PUT /cohorts/{id}` - Update cohort

### Faculty & Recruitment
- `GET /faculty` - List faculty and profiles
- `POST /recruitment/apply` - Submit faculty application
- `GET /recruitment/applications` - View applications (BOD only)
- `PUT /recruitment/applications/{id}` - Approve/reject applications (BOD only)

### Analytics
- `GET /analytics/dashboard` - Board metrics
- `GET /analytics/enrollment-trends` - Enrollment data
- `GET /analytics/program-distribution` - Program distribution stats

For full API documentation, see [backend/API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md)

## 📋 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Get started in 5 minutes
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Fix common issues
- **[backend/SETUP_GUIDE.md](./backend/SETUP_GUIDE.md)** - Detailed backend setup
- **[backend/API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md)** - Complete API reference

## 🔧 Helper Scripts

### `setup.sh` - Automated Setup
Handles everything: frontend deps, backend deps, database setup, migrations, seeding.

```bash
bash setup.sh
```

### `start.sh` - Start Both Servers
Launches frontend (port 5173) and backend (port 8000) simultaneously.

```bash
bash start.sh
```

## Security & Sanitization

- Backend input is sanitized via global middleware to trim, remove control characters, and strip HTML from most fields. A safe subset of tags is allowed for common rich-text fields (e.g., `content`, `description`, `body`).
- Strict security headers (CSP, frame-ancestors, MIME sniffing protections, referrer policy) are applied globally. CSP is relaxed in local development for the Vite dev server.
- Frontend provides a `sanitizeHTML()` helper in [src/lib/sanitize.ts](src/lib/sanitize.ts) for any user-provided HTML. Always sanitize before using `dangerouslySetInnerHTML`.

Recommended:
- Validate inputs in controllers/request objects and avoid raw SQL; prefer Eloquent/Query Builder.
- Do not render unsanitized user HTML. Use `sanitizeHTML()` if needed.
- Keep dependencies updated and run `npm audit fix`/`composer update` periodically.

## Development

### Frontend Development
```sh
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run linter
```

### Backend Development
```sh
cd backend
php artisan serve              # Start server
php artisan tinker             # Interactive shell
php artisan migrate            # Run migrations
php artisan db:seed            # Seed database
php artisan make:controller    # Generate controller
```

## Database Schema

Key models and their relationships:
- **User** - Stores users (students, faculty, BOD)
- **Curriculum** - Educational programs
- **Module** - Individual program phases
- **Cohort** - Class batches for modules
- **Enrollment** - Student registrations
- **TeacherApplication** - Faculty recruitment
- **Assessment** - Graded tasks
- **Material** - Course content

## Default Credentials (Development)

After running migrations and seeding:

| Role | Email | Password |
|------|-------|----------|
| BOD | bod@academy.com | password123 |
| Faculty | faculty@academy.com | password123 |
| Student | student@academy.com | password123 |

**Note**: Change these credentials in production.

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes and commit: `git commit -am 'Add feature'`
3. Push to the branch: `git push origin feature/your-feature`
4. Submit a pull request

## License

This project is proprietary and confidential.

## Support

For issues, questions, or feature requests, please refer to the project documentation or contact the development team.
