# PearServer

PearServer is the Django-based backend component of the PearStock inventory management system. It provides RESTful APIs to manage inventory data, handle user authentication, and serve as the central data hub for both the WebClient and PearMobile applications.

## Table of Contents

- Requirements
- Installation
- Configuration
- Running the Server
- API Documentation
- Project Structure
- Database
- Testing
- Deployment
- Troubleshooting

## Requirements

Before installing PearServer, ensure you have the following prerequisites:

- Python 3.9 or later
- pip (Python package manager)
- Git
- Virtual environment tool (virtualenv or venv or pipenv), mine is venv

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Oluwademiladeogo/PearStock.git
cd PearStock/pearserver
```

### 2. Create and Activate Virtual Environment

```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Set up Environment Variables

Create a `.env` file in the root directory:

```
DEBUG=True
SECRET_KEY=your_secret_key_here
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

## Configuration

### Database Configuration

Configure your database in `settings.py` or through environment variables:

### CORS Configuration

Make sure CORS is properly configured to allow requests from your frontend:

```python
CORS_ALLOWED_ORIGINS = [
    "http://frontend",  # WebClient development server
    "http://pearmobile",  # PearMobile development server
]
```

## Running the Server

### Apply Migrations

```bash
python manage.py migrate
```

### Run Development Server

```bash
python manage.py runserver
```

The server will be available at [http://localhost:8000](http://localhost:8000)

### OR Run with Docker

```bash
docker build -t pearserver .
docker run -p 8000:8000 pearserver
```

## API Documentation

The API documentation is available at the Swagger endpoint:

- Swagger UI: [http://localhost:8000/swagger/](http://localhost:8000/swagger/)

This interactive documentation allows you to:
- Explore available endpoints
- View request/response formats
- Test API calls directly from the browser
- Download OpenAPI specification


## Project Structure

```
pearserver/
├── manage.py               # Django management script
├── pearproject/            # Main Django project directory
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py         # Project settings
│   ├── urls.py             # Main URL configuration
│   └── wsgi.py             # WSGI configuration
├── api/                    # API application
│   ├── __init__.py
│   ├── admin.py            # Admin interface
│   ├── apps.py
│   ├── models.py           # Database models
│   ├── serializers.py      # API serializers
│   ├── tests.py            # Tests
│   ├── urls.py             # API routes
│   └── views.py            # API views
├── static/                 # Static files
├── templates/              # Template files
├── requirements.txt        # Dependencies
└── README.md               # This documentation
```

## Database

PearServer uses SQLite by default, but can be configured to use other databases.

### Database Schema

The main models include:
- `User` - Extended user model
- `Product` - Product information

### Migrations

After making model changes:

```bash
python manage.py makemigrations
python manage.py migrate
```

## Testing

### Running Tests

```bash
python manage.py test
```

## Deployment

### Production Settings

For production deployment, ensure:
1. `DEBUG=False` in your environment
2. Configure a proper `SECRET_KEY`
3. Set appropriate `ALLOWED_HOSTS`
4. Use HTTPS

### Gunicorn and Nginx

For production deployment with Gunicorn and Nginx:

```bash
gunicorn pearproject.wsgi:application --bind 0.0.0.0:8000
```

### Docker Deployment

Build and run with Docker Compose:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Common Issues

#### Database Connection Problems
- Verify database credentials
- Check database service is running
- Ensure your database user has appropriate permissions

#### Migration Issues
- Try resetting migrations if you encounter problems:
  ```bash
  python manage.py migrate --fake-initial
  ```

#### API Authentication Errors
- Verify your JWT token is valid and not expired
- Check user permissions and groups

---

Built with ❤️ by Demilade.

