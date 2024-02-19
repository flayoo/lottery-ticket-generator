
# Lottery Ticket Generator

## Introduction
Welcome to the Lottery Ticket Generator, your go-to solution for generating lottery tickets with ease.

## Getting Started
To get started with our Lottery Ticket Generator, you will need to set up both the backend and frontend components of the application. Below are the instructions for setting up the environment and getting the application up and running.

### Prerequisites
- Node.js installed on your system
- Angular CLI installed for frontend development

### Backend Setup

 The backend of the app is built on Node.js and uses SQLite for database management. 

1.  **Clone the Repository**: Start by cloning the repository to your local machine using Git commands or by downloading the source code directly.
2.  **Install Dependencies**: Navigate to the backend directory in your terminal and run the following command to install the necessary Node.js dependencies:
```bash
npm install
```
3.  ***Initialize the Database****: Before running the application, you need to initialize the database to create the required tables. Run the `init-db.js` script with the following command:
 ```bash
node init-db.js
```
4. **Start the Backend Server**: Once the database is initialized, start the backend server by running:
 ```bash
 npm run dev
```
The backend server should now be up and running, listening for requests.
 ```bash
 http://localhost:3000
```

### Frontend Setup
The frontend of the app is developed using Angular. Follow these steps to set up and start the frontend:
1.  ***Install Angular Dependencies***: Run the following command to install the required Angular dependencies:
 ```bash
npm install
```
2.  **Start the Angular App**: Launch the Angular app by executing the following command:
 ```bash
npm run start
```
This command compiles the application and starts a development server. You can access the frontend of the app by navigating to `http://localhost:4200` in your web browser.


