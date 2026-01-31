import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import Logo from '@/components/ui/Logo';

const loginSchema = z.object({
    email: z.string().email('Alamat email tidak valid'),
    password: z.string().min(8, 'Password minimal 8 karakter'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        setError(null);
        try {
            console.log('Logging in with:', data);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            navigate('/');
        } catch {
            setError('Email atau password salah. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-md w-full space-y-8 bg-white p-8 md:p-12 border-t-4 border-main-500 shadow-2xl">
                <div className="text-center">
                    <Link to="/" className="inline-block transform hover:scale-105 transition-transform duration-300">
                        <Logo className="h-10 w-auto justify-center" />
                    </Link>
                    <h2 className="mt-8 text-4xl font-serif font-bold text-gray-900 tracking-tight uppercase">
                        Sign In
                    </h2>
                    <p className="mt-3 text-sm font-medium text-gray-500 tracking-wide uppercase">
                        Welcome back, please enter your details
                    </p>
                </div>

                {error && (
                    <Alert variant="error" title="Auth Failure">
                        {error}
                    </Alert>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div className="relative">
                            <Input
                                label="Email Address"
                                placeholder="you@example.com"
                                type="email"
                                {...register('email')}
                                error={errors.email?.message}
                                className="pl-12"
                            />
                            <Mail className="absolute left-4 top-[3.2rem] h-5 w-5 text-gray-400" />
                        </div>

                        <div className="relative">
                            <Input
                                label="Password"
                                placeholder="••••••••"
                                type={showPassword ? 'text' : 'password'}
                                {...register('password')}
                                error={errors.password?.message}
                                className="pl-12 pr-12"
                            />
                            <Lock className="absolute left-4 top-[3.2rem] h-5 w-5 text-gray-400" />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-[3.2rem] text-gray-400 hover:text-main-500 transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-main-600 focus:ring-main-500 border-gray-300 rounded-none cursor-pointer"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm font-bold text-gray-900 uppercase cursor-pointer">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <Link
                                to="/forgot-password"
                                className="font-bold text-main-500 hover:text-main-600 uppercase tracking-wider"
                            >
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-14 text-lg font-bold rounded-none uppercase tracking-widest"
                        disabled={isLoading}
                    >
                        {isLoading ? 'SIGNING IN...' : (
                            <span className="flex items-center gap-2">
                                <LogIn className="h-5 w-5" /> Sign In
                            </span>
                        )}
                    </Button>
                </form>

                <div className="pt-8 border-t border-gray-100">
                    <p className="text-center text-sm font-medium text-gray-600 tracking-wide uppercase">
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="font-black text-main-500 hover:text-main-600 transition-colors underline underline-offset-4"
                        >
                            Start free today
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
