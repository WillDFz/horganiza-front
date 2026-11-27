import { TextField, CircularProgress, Link } from '@mui/material'
import { useAuth } from '@/contexts/auth-context';
import { useState } from 'react';
import { RegisterInfo } from '@/types/api/auth.types';
import { useRouter } from 'next/navigation';
import { formatPhoneBR, stripPhoneDigits } from '@/utils/formatters/phoneBr';

const RegisterForm = () => {

  const { register, loading } = useAuth();

  const router = useRouter();

  const [userData, setUserData] = useState<RegisterInfo>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmed_email: false,
  });

  const [confirmPassword, setConfirmPassword] = useState('');


  const validateConfirmPassword = () => {
    if (!userData.password || !confirmPassword) {
      return true;
    }
    return userData.password === confirmPassword;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await register(userData);
    if (response) {
      router.push('/dashboard');
    }
  };

  return (
    <div className='w-full max-w-xs xl:max-w-sm bg-white p-8 rounded-lg shadow-md'>
      <div>
        <div className='flex justify-center items-center mb-4'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="Logo" className='w-40 object-contain' />
        </div>
      </div>
      <form className='flex flex-col gap-4 w-full' onSubmit={handleSubmit}>
        <TextField
          label="Nome"
          type="text"
          name="name"
          id="name"
          variant="outlined"
          size='small'
          fullWidth
          required
          value={userData.name}
          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
        />
        <TextField
          label="Email"
          type="email"
          name="email"
          id="email"
          variant="outlined"
          size='small'
          fullWidth
          required
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })} />
        <TextField
          label="Telefone"
          type="tel"
          name="phone"
          id="phone"
          variant="outlined"
          size='small'
          fullWidth
          required
          slotProps={{
            htmlInput: {
              inputMode: 'numeric',
              autoComplete: 'tel-national',
            },
          }}
          placeholder="(11) 98765-4321"
          value={formatPhoneBR(userData.phone)}
          onChange={(e) =>
            setUserData({ ...userData, phone: stripPhoneDigits(e.target.value) })
          }
        />
        <TextField
          label="Senha"
          type="password" name="password"
          id="password" variant="outlined" size='small'
          fullWidth
          required
          value={userData.password}
          onChange={(e) => setUserData({ ...userData, password: e.target.value })} />
        <TextField
          label="Confirmar Senha"
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          variant="outlined"
          size='small'
          fullWidth
          error={!validateConfirmPassword()}
          helperText={!validateConfirmPassword() ? 'As senhas não coincidem' : ''}
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)} />

        <button className='flex justify-center items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors' type="submit" data-testid="register-submit-button">
          {loading ? <CircularProgress size={20} /> : 'Cadastrar'}
        </button>
        <div className='flex justify-center items-center'>
          <Link href="/auth/login">
            Já tem uma conta? Entre
          </Link>
        </div>
      </form>
    </div>
  )
};

export default RegisterForm;
