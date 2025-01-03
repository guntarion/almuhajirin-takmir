# Update History

## 2024-01-15

- Fixed ESLint and TypeScript errors in auth utilities:

  - Removed unused import of GetServerSidePropsContext from src/lib/utils/auth.ts
  - Added AuthSession type definition to src/lib/types/auth.ts

- Fixed auth page routing to match middleware configuration:
  - Moved login page from src/app/(auth)/login to src/app/auth/login
  - Moved register page from src/app/(auth)/register to src/app/auth/register
  - Removed src/app/(auth) directory as it's no longer needed
  - Updated import paths in both pages to correctly reference components
