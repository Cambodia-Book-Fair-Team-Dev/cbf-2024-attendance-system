# Cambodia Book Fair 2024 Volunteer Attendance System

This system was built for the Cambodia Book Fair 2024 to manage volunteer attendance.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
<!-- - [Contributing](#contributing) -->
- [License](#license)

## Introduction
The Cambodia Book Fair 2024 Volunteer Attendance System is designed to streamline the process of managing volunteer attendance. It provides an easy-to-use interface for tracking volunteer check-ins, check-outs, and meal statuses.

## Features
- Volunteer check-in and check-out tracking
- Meal status tracking
- Attendance data visualization
- Volunteer details management
- Scan for check-in, check-out, and meal status

## Installation
To get started with the project, follow these steps:

1. Clone the repository:
  ```bash
  git clone https://github.com/yourusername/cbf2024-frontend.git
  cd cbf2024-frontend
  ```

2. Install dependencies:
  ```bash
  npm install
  ```

3. Start the development server:
  ```bash
  npm run dev
  ```

4. For hosting the development server:
  ```bash
  npm run dev -- --host
  ```

## Usage
Once the development server is running, you can access the application at `http://localhost:3000`. The main features include:

- **Attendance Dashboard**: View and manage volunteer attendance records.
- **Scan for Check-in/Check-out/Meal**: Use scanning functionality to quickly check in, check out, or update meal status for volunteers.

## Project Structure
The project structure is as follows:
```
cbf2024-frontend/
├── public/
├── src/
│   ├── Components/
│   ├── Pages/
│   ├── Provider/
│   ├── api/
│   ├── assets/
│   ├── styles/
│   ├── App.tsx
│   ├── index.tsx
│   └── ...
├── package.json
└── README.md
```

<!-- ## Contributing
We welcome contributions to improve the system. To contribute, follow these steps:

1. Fork the repository.
2. Create a new branch:
  ```bash
  git checkout -b feature/your-feature-name
  ```
3. Make your changes and commit them:
  ```bash
  git commit -m "Add your message here"
  ```
4. Push to the branch:
  ```bash
  git push origin feature/your-feature-name
  ```
5. Create a pull request. -->

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.