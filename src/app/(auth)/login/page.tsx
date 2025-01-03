// src/app/(auth)/login/page.tsx

import { Metadata } from 'next';
import LoginForm from '../../../components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Login - Al-Muhajirin Takmir',
  description: 'Login ke aplikasi tracking aktivitas Al-Muhajirin',
};

export default function LoginPage() {
  return (
    <main>
      <LoginForm />
    </main>
  );
}
