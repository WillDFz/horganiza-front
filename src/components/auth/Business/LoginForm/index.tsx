'use client';
import { TextField, CircularProgress, Link, IconButton, InputAdornment } from '@mui/material'
import { useAuth } from '@/contexts/auth-context';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { DEMO_BUSINESS_SLUG, DEMO_EMAIL, DEMO_PASSWORD } from '@/mocks/constants';
import DemoModeBanner, { isDemoMode } from '@/components/auth/DemoModeBanner';

const LoginForm = () => {

    const { login, loading } = useAuth();
    const [email, setEmail] = useState(isDemoMode ? DEMO_EMAIL : '');
    const [password, setPassword] = useState(isDemoMode ? DEMO_PASSWORD : '');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await login(email, password);
            if (response) {
                router.push('/dashboard');
            }
        } catch (error) {
            console.error(error);
        }
    }
    
    return (
        <div className='w-full max-w-xs xl:max-w-sm bg-white p-8 rounded-lg shadow-md'>
            <div>
                <div className='flex justify-center items-center mb-4'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/logo.png" alt="Logo" className='w-40 object-contain' />
                </div>
                <DemoModeBanner>
                    <p className="mt-1">
                        Email: <span className="font-mono">{DEMO_EMAIL}</span>
                    </p>
                    <p>
                        Senha: <span className="font-mono">{DEMO_PASSWORD}</span>
                    </p>
                    <p className="mt-2">
                        Página pública:{' '}
                        <Link href={`/business/${DEMO_BUSINESS_SLUG}`} underline="hover">
                            /business/{DEMO_BUSINESS_SLUG}
                        </Link>
                    </p>
                </DemoModeBanner>
                <form className='flex flex-col gap-4 w-full' onSubmit={handleSubmit}>

                    <TextField
                        label="Email"
                        type="email"
                        name="email"
                        id="email"
                        variant="outlined"
                        size='small'
                        autoComplete='email'
                        fullWidth
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Senha"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        id="password"
                        variant="outlined"
                        size='small'
                        autoComplete='current-password'
                        fullWidth
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                    <button className='bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors' type="submit" data-testid="login-submit-button">
                        {loading ? <CircularProgress size={20} /> : 'Entrar'}
                    </button>
                    <div className='flex justify-center items-center'>
                        <Link href="/auth/register">
                            Cadastre-se
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginForm
