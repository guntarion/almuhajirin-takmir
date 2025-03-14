'use client';
// src/components/auth/LoginForm.tsx

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { LoginFormData } from '../../lib/types/auth';

const loginSchema = z.object({
  emailOrUsername: z.string().min(1, 'Email/Username harus diisi'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  rememberMe: z.boolean(),
});

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    emailOrUsername: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Validate form data
      loginSchema.parse(formData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
        return;
      }
    }

    setLoading(true);

    try {
      const result = await signIn('credentials', {
        emailOrUsername: formData.emailOrUsername,
        password: formData.password,
        redirect: false,
        callbackUrl: '/home',
        rememberMe: formData.rememberMe,
      });

      if (result?.error) {
        setError(result.error === 'CredentialsSignin' ? 'Email/Username atau Password salah' : 'Terjadi kesalahan. Silakan coba lagi.');
        return;
      }

      // Redirect to callback URL or default path
      router.push(result?.url || '/home');
      router.refresh();
    } catch (error) {
      console.error('Login error:', error);
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>Login Al-Muhajirin</h2>
        </div>
        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          {error && (
            <div className='rounded-md bg-red-50 p-4'>
              <div className='text-sm text-red-700'>{error}</div>
            </div>
          )}
          <div className='rounded-md shadow-sm -space-y-px'>
            <div>
              <label htmlFor='emailOrUsername' className='sr-only'>
                Email atau Username
              </label>
              <input
                id='emailOrUsername'
                name='emailOrUsername'
                type='text'
                required
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm'
                placeholder='Email atau Username'
                value={formData.emailOrUsername}
                onChange={(e) => setFormData({ ...formData, emailOrUsername: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor='password' className='sr-only'>
                Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                required
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm'
                placeholder='Password'
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <input
                id='remember-me'
                name='remember-me'
                type='checkbox'
                className='h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded'
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
              />
              <label htmlFor='remember-me' className='ml-2 block text-sm text-gray-900'>
                Ingat saya
              </label>
            </div>

            <div className='text-sm'>
              <a href='#' className='font-medium text-emerald-600 hover:text-emerald-500'>
                Lupa password?
              </a>
            </div>
          </div>

          <div>
            <button
              type='submit'
              disabled={loading}
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#3cc3c7] hover:bg-[#2b8aa0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? (
                <div className='flex items-center'>
                  <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  Loading...
                </div>
              ) : (
                'Login'
              )}
            </button>
          </div>

          <div className='text-center mt-4'>
            <p className='text-sm text-gray-600'>
              Belum punya akun?{' '}
              <a href='/auth/register' className='font-medium text-emerald-600 hover:text-emerald-500'>
                Daftar
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
