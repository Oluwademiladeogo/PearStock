# webclient

WebClient is the Next.js-based web application component of the PearStock inventory management system. It provides a responsive and intuitive interface for users to manage inventory, track products, and monitor stock levels from any browser.

## Table of Contents

- Requirements
- Installation
- Configuration
- Running the App
- Features
- Project Structure
- Building for Production
- Troubleshooting

## Requirements

Before installing the web client, ensure you have the following prerequisites:

- Node.js (Version 16.x or later)
- npm (Version 8.x or later) or Yarn (Version 1.22.x or later)
- Git
- pearserver running on port 8000

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Oluwademiladeogo/PearStock.git
cd PearStock/webclient
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up Environment Variables

Copy the example environment file to create your own:

```bash
cp .env.example .env
```

Then edit `.env` to configure your environment variables:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Configuration

### API Configuration

The app connects to the backend API. Ensure the API URL is correctly set in your `.env` file:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

You can also update the API configuration in `utils/api.tsx` if needed.

## Running the App

### Development Mode

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### With Docker

If you prefer using Docker:

```bash
docker build -t pearstock-webclient .
docker run -p 3000:3000 pearstock-webclient
```

## Features

WebClient offers the following features:

- **User Authentication**: Secure login, logout, and password recovery
- **Dashboard**: Overview of inventory statistics and key metrics
- **Product Management**: Add, edit, delete, and filter products
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark Mode Support**: Toggle between light and dark themes for comfortable viewing
- **Search Functionality**: Quickly find products with search and filter options
- **Data Visualization**: Charts and graphs for inventory analytics
- **Secure API Integration**: JWT-based authentication for API requests

## Project Structure

```
webclient/
├── components/       # Reusable React components
├── data/            # Static data and dummy data for development
├── hooks/           # Custom React hooks
├── pages/           # Next.js pages
│   ├── dashboard.tsx
│   ├── login.tsx
│   ├── logout.tsx
│   ├── products.tsx
│   └── forgot-password.tsx
├── public/          # Static assets
├── src/             # Source files
├── styles/          # CSS and styling files
├── utils/           # Utility functions
│   └── api.tsx      # API configuration and helpers
├── .env.example     # Example environment variables
├── next.config.ts   # Next.js configuration
├── package.json     # Project dependencies
└── README.md        # This documentation
```

## Building for Production

### Standard Build

```bash
npm run build
# or
yarn build
```

To start the production server:

```bash
npm start
# or
yarn start
```

#### Build Failures

- Clear Next.js cache:
  ```bash
  rm -rf .next
  ```

- Verify dependencies are installed correctly:
  ```bash
  npm install
  ```

#### API Connection Issues

- Check if the API server is running
- Verify the API URL in `.env` is correct
- Check browser console for CORS errors

#### Authentication Problems

- Clear browser cookies and local storage
- Ensure your JWT token is valid
- Check if your user account has the correct permissions

### Browser Compatibility

WebClient is optimized for:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest version)

---

Built with ❤️ by Demilade.