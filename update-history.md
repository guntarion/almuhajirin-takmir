## [2024-01-03] Fixed JWT parsing error in middleware

- Installed jsonwebtoken package
- Updated middleware.ts to:
  - Handle both development and production cookie names
  - Attempt JWT decode first, then JSON parse if needed
  - Add comprehensive token validation
  - Improve error handling and logging
  - Validate token structure including role field
