# FreeLance Project

## Overview
This project automates user profile and authentication flows using Playwright. It includes modular page objects, JSON-based test data, and reusable test utilities.

## Folder Structure
```
/FreeLance
│
├── Resources/
│   └── profileData.json         # Test data for profiles, logins, etc.
│
├── pages/
│   └── ProfilePage.js           # Page Object Model for profile-related actions
│
├── tests/
│   ├── Smoke.spec.js            # Main Playwright test suite
│   └── resources/
│       └── file_example_JPG_1MB.jpg  # Sample file for upload tests
│
├── README.md                    # Project documentation
├── package.json                 # Project dependencies and scripts
└── playwright.config.js         # Playwright configuration
```

## Getting Started

### Prerequisites
- Node.js (LTS recommended, v18–21 for best compatibility)
- npm
- Playwright (`npm install -D @playwright/test`)

### Setup
1. Clone the repository.
2. Install dependencies:
    ```sh
    npm install
    ```
3. Run tests:
    ```sh
    npx playwright test
    ```

### Test Data
- All test data is managed in `Resources/profileData.json`.
- Update or extend this file to add new test scenarios.

### Key Features
- **Page Object Model** for maintainable test code.
- **JSON-driven tests** for easy data management.
- **Reusable utilities** for login, profile update, password change, and file upload.

## Contributing
- Fork the repo and submit a pull request.
- Keep code modular and data-driven.

## Troubleshooting
- If you encounter issues with dependencies (e.g., `robotjs`), ensure Node.js version compatibility.
- For Playwright script execution errors, check your PowerShell execution policy:
  ```sh
  Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
  ```

## License
MIT