'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface KegiatanRegistrationFormProps {
  kegiatanId: string;
}

export default function KegiatanRegistrationForm({ kegiatanId }: KegiatanRegistrationFormProps) {
  const [isRegistered, setIsRegistered] = useState(false); // Track registration status
  const [isConfirmed, setIsConfirmed] = useState(false); // Track participation confirmation status
  const [showCancelRegistrationField, setShowCancelRegistrationField] = useState(false); // Show/hide cancel registration text field
  const [showCancelConfirmationField, setShowCancelConfirmationField] = useState(false); // Show/hide cancel confirmation text field
  const [cancelRegistrationInput, setCancelRegistrationInput] = useState(''); // Input for cancel registration
  const [cancelConfirmationInput, setCancelConfirmationInput] = useState(''); // Input for cancel confirmation
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state

  const handleRegister = () => {
    if (isRegistered) {
      setShowCancelRegistrationField(true); // Show text field for canceling registration
    } else {
      // Simulate registration
      setIsRegistered(true);
      console.log('Pendaftaran berhasil!');
    }
  };

  const handleConfirmParticipation = () => {
    if (isConfirmed) {
      setShowCancelConfirmationField(true); // Show text field for canceling confirmation
    } else {
      // Simulate confirmation
      setIsConfirmed(true);
      console.log('Partisipasi dikonfirmasi!');
    }
  };

  const handleCancelRegistration = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call for canceling registration
      console.log(`Membatalkan pendaftaran untuk kegiatan ${kegiatanId} dengan catatan: ${cancelRegistrationInput}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsRegistered(false);
      setShowCancelRegistrationField(false);
      setCancelRegistrationInput('');
      alert('Pendaftaran dibatalkan!');
    } catch (error) {
      console.error('Error during cancellation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelConfirmation = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call for canceling confirmation
      console.log(`Membatalkan partisipasi untuk kegiatan ${kegiatanId} dengan catatan: ${cancelConfirmationInput}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsConfirmed(false);
      setShowCancelConfirmationField(false);
      setCancelConfirmationInput('');
      alert('Partisipasi dibatalkan!');
    } catch (error) {
      console.error('Error during cancellation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='space-y-4'>
      {/* Mendaftar Section */}
      <div className='flex items-center gap-2'>
        <Button onClick={handleRegister} variant={isRegistered ? 'destructive' : 'default'} disabled={isSubmitting}>
          {isRegistered ? 'Batalkan Pendaftaran' : 'Mendaftar'}
        </Button>
        {showCancelRegistrationField && (
          <>
            <Input
              placeholder='Masukkan alasan pembatalan (opsional)'
              value={cancelRegistrationInput}
              onChange={(e) => setCancelRegistrationInput(e.target.value)}
              className='flex-1'
            />
            <Button onClick={handleCancelRegistration} disabled={isSubmitting}>
              {isSubmitting ? 'Mengirim...' : 'Kirim'}
            </Button>
          </>
        )}
      </div>

      {/* Konfirmasi Partisipasi Section */}
      <div className='flex items-center gap-2'>
        <Button onClick={handleConfirmParticipation} variant={isConfirmed ? 'destructive' : 'default'} disabled={isSubmitting}>
          {isConfirmed ? 'Batalkan Partisipasi' : 'Konfirmasi Partisipasi'}
        </Button>
        {showCancelConfirmationField && (
          <>
            <Input
              placeholder='Masukkan alasan pembatalan (opsional)'
              value={cancelConfirmationInput}
              onChange={(e) => setCancelConfirmationInput(e.target.value)}
              className='flex-1'
            />
            <Button onClick={handleCancelConfirmation} disabled={isSubmitting}>
              {isSubmitting ? 'Mengirim...' : 'Kirim'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
