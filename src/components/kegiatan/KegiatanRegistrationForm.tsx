'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface KegiatanRegistrationFormProps {
  kegiatanId: string;
}

export default function KegiatanRegistrationForm({ kegiatanId }: KegiatanRegistrationFormProps) {
  const [role, setRole] = useState<'PARTICIPANT' | 'ORGANIZER'>('PARTICIPANT');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      console.log(`Registering for event ${kegiatanId} as ${role}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('Pendaftaran berhasil!');
    } catch (error) {
      console.error('Error registering:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex gap-4'>
        <Button variant={role === 'PARTICIPANT' ? 'default' : 'outline'} onClick={() => setRole('PARTICIPANT')}>
          Peserta
        </Button>
        <Button variant={role === 'ORGANIZER' ? 'default' : 'outline'} onClick={() => setRole('ORGANIZER')}>
          Panitia
        </Button>
      </div>
      <Button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? 'Mendaftar...' : 'Daftar Sekarang'}
      </Button>
    </div>
  );
}
