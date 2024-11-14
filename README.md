# Blog App

This is a sample blog application written in Express.js for the African Girls Can Code Bootcamp Zimbabwe. It is heavily inspired by the [Django Girls tutorial](https://djangogirls.org/) but adapted for Express.js.

## Getting Started

### Prerequisites

Make sure you have Node.js and npm installed on your machine. You can download them from [here](https://nodejs.org/).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/blog-app.git
   cd blog-app
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the application, run:
   ```bash
   npm start
   ```

This will start the application in production mode. If you want to start the application in development mode with nodemon, which will automatically restart the server when you make changes, run:
   ```bash
   npm run dev
   ```

### Usage

Once the application is running, open your browser and go to `http://localhost:3000`. You should see the homepage of the blog application.

### Features

- User authentication (signup, login, logout)
- Create, read, update, and delete blog posts
- Flash messages for success and error notifications
- Responsive design using Tailwind CSS

### Folder Structure

- `models/`: Contains the Sequelize models for the application (e.g., User, Post)
- `routes/`: Contains the route definitions for the application (e.g., auth routes)
- `views/`: Contains the Handlebars templates for the application
- `config/`: Contains configuration files (e.g., database configuration)
- `middleware/`: Contains custom middleware functions for authentication

### Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request. We welcome all contributions!



