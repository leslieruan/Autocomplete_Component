# MusicFinder Autocomplete Component

This project is an autocomplete search component designed to help users quickly find artists, albums, or songs by typing keywords. The component is developed as a part of a React-based frontend application, utilizing MUI's `Autocomplete` component to deliver a smooth and intuitive search experience.

## Project Overview

- **Frontend:** React (with MUI for UI components)
- **Backend:** Node.js with Express
- **Database:** MongoDB Atlas
- **Containerization:** Docker (monorepo setup for frontend and backend in a single repository)
- **Additional Tools:** JSONLint for data correction, CORS for cross-origin support, and JSON processing for data cleaning.

The component features a responsive UI with grid-based search result displays, clickable cards for detailed information, and a search history function for user convenience.

## Table of Contents

- [MusicFinder Autocomplete Component](#musicfinder-autocomplete-component)
  - [Project Overview](#project-overview)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Project Structure](#project-structure)
    - [Directory and File Explanations](#directory-and-file-explanations)
  - [Tech Stack](#tech-stack)
  - [Setup Instructions](#setup-instructions)
    - [Prerequisites](#prerequisites)
    - [Usage](#usage)
    - [API Endpoints](#api-endpoints)
    - [Access the App](#access-the-app)
    - [Troubleshooting](#troubleshooting)


## Features
1. **Autocomplete Search:** 
   - Real-time suggestions appear as the user types in the search bar. Suggestions are based on matching artist names, albums, and songs, with up to 10 results displayed to avoid long lists.
   - Separate dropdown menu to filter by search type (e.g., Artist, Album, Song).

2. **Search Result Display:**
   - Results are displayed in a responsive grid layout, where each card shows relevant information ( album name, artist name, song name).
   - Clicking on a card reveals more detailed information about the selected artist, album, or song.

3. **Search History:**
   - The component maintains a search history, displaying recent searches when the user clicks on the search input.
   - Each history item can be clicked to re-trigger a search for that term.

4. **Advanced Matching Logic:**
   - Supports word-splitting, order-independent matching, and exact matching for improved user experience.
   - Handles spaces in input gracefully, allowing for partial or non-sequential matches.

5. **Backend API:**
   - Node.js and Express backend with a MongoDB Atlas database to store and retrieve music data.
   - JSON data cleanup and validation performed on the backend to ensure data integrity.

6. **Containerized with Docker:**
   - The frontend and backend are both containerized. Ports are mapped as follows:
     - Frontend: Host port `3001` -> Container port `3000`
     - Backend: Host port `5001` -> Container port `5001`
   - Communication within the Docker network uses container names, while external requests from the host machine utilize `localhost`.

## Project Structure

### Directory and File Explanations

- **build/**: Contains the compiled frontend assets ready for production.
- **node_modules/**: Stores all dependencies required for both frontend and backend, based on `package.json`.
- **public/**: Holds static assets and `index.html` that serve as the base for the React application.

- **server/**: Contains backend-related files:
  - **.env**: Stores environment variables like MongoDB connection string, used to separate sensitive information from code.
  - **data.json**: Raw data file containing initial music data to be imported into MongoDB Atlas.
  - **db.js**: Establishes and manages the MongoDB connection.
  - **Dockerfile**: Dockerfile to build the backend container.
  - **importData.js**: Script to import `data.json` into MongoDB Atlas.
  - **server.js**: Entry point of the backend server, where the Express app and API routes are configured.

- **src/**: Contains the React frontend components and styles:
  - **AlbumInfo.js, ArtistInfo.js, SongInfo.js**: Display components for showing detailed information about albums, artists, and songs, respectively.
  - **App.css**: Global styles for the app.
  - **App.js**: Root React component, setting up the main layout and routing if applicable.
  - **Dockerfile**: Dockerfile to build the frontend container.
  - **Footer.js, NavBar.js**: Common layout components for navigation and footer.
  - **SearchDropdown.js**: The main autocomplete component using MUI’s Autocomplete for real-time search suggestions.
  - **SearchHistory.js**: Displays a list of recent search history items.
  - **SearchInput.js**: Handles user input in the main search field.
  - **SearchTypeSelect.js**: Dropdown for selecting the search type (e.g., Artist, Album, Song).

- **.gitignore**: Specifies files to be ignored by Git.
- **docker-compose.yml**: Defines and manages both frontend and backend containers, specifying environment variables and network configurations.
- **package-lock.json**: Lockfile that records the exact versions of installed dependencies for consistent installations.
- **package.json**: Lists project dependencies and scripts for development and production builds.
- **README.md**: Documentation for project setup, structure, and usage instructions.

## Tech Stack

- **Frontend**: React, Material-UI (MUI) for component styling.
- **Backend**: Node.js, Express for server and routing.
- **Database**: MongoDB Atlas for cloud-hosted database storage.
- **Containerization**: Docker and Docker Compose for running the frontend and backend in isolated containers.

## Setup Instructions

### Prerequisites

- Node.js (>=20.x)
- Docker and Docker Compose
- MongoDB Atlas account 

1. Clone the Repository

```bash
git clone https://github.com/leslieruan/Autocomplete_Component.git
cd autocomplete_components
```

2. Install dependencies for both frontend and backend:
```bash
npm install
cd server
npm install
```
3. Set up environment variables:
Create a `.env` file in the server directory with the following:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```
4. Start the development servers:
   For backend:
```bash
cd server
node server.js
```
  For frontend:
```bash
# In another terminal
cd autocomplete_components
npm start
```
5. Docker Setup (Optional)
To run the application using Docker:
```bash
# It may take some time
docker-compose up --build
```
It should be available at http://localhost:3001.

###  Usage
1. Select the search type (Artist, Album, or Song) from the dropdown to filter suggestions.
2. Start typing in the search bar, and matching items will appear in the dropdown.
3. Select an item from the dropdown to view detailed information.
4. Search History: Recently searched items are displayed in a history section for quick access.

### API Endpoints

- `GET /api/artists` - Get music data
  
### Access the App

Frontend: http://localhost:3001
Backend API: http://localhost:5001/api/artists

###  Troubleshooting
CORS Issues: If you encounter CORS errors, ensure cors is enabled in the backend server.js.
Invalid JSON Data: Make sure your JSON data is valid before importing. Use jsonlint to validate and fix any issues.


