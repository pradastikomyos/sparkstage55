import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import Logo from '@/components/ui/Logo';

const registerSchema = z.object({
    name: z.string().min(3, 'Nama minimal 3 karakter'),
    email: z.string().email('Alamat email tidak valid'),
    password: z.string().min(8, 'Password minimal 8 karakter'),
    password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
    message: "Password tidak cocok",
    path: ["password_confirmation"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setIsLoading(true);
        setError(null);
        try {
            console.log('Registering with:', data);
            await new Promise(resolve => setTimeout(resolve, 2000));
            navigate('/login');
        } catch {
            setError('Pendaftaran gagal. Email mungkin sudah terdaftar.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-xl w-full space-y-8 bg-white p-8 md:p-12 border-t-4 border-main-500 shadow-2xl my-10">
                <div className="text-center">
                    <Link to="/" className="inline-block transform hover:scale-105 transition-transform duration-300">
                        <Logo className="h-10 w-auto justify-center" />
                    </Link>
                    <h2 className="mt-8 text-4xl font-serif font-bold text-gray-900 tracking-tight uppercase">
                        Join the Club
                    </h2>
                    <p className="mt-3 text-sm font-medium text-gray-500 tracking-wide uppercase">
                        Create an account to start your journey
                    </p>
                </div>

                {error && (
                    <Alert variant="error" title="Registration Error">
                        {error}
                    </Alert>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div className="relative">
                            <Input
                                label="Full Name"
                                placeholder="John Doe"
                                {...register('name')}
                                error={errors.name?.message}
                                className="pl-12"
                            />
                            <User className="absolute left-4 top-[3.2rem] h-5 w-5 text-gray-400" />
                        </div>

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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <Input
                                    label="Password"
                                    placeholder="••••••••"
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password')}
                                    error={errors.password?.message}
                                    className="pl-12"
                                />
                                <Lock className="absolute left-4 top-[3.2rem] h-5 w-5 text-gray-400" />
                            </div>

                            <div className="relative">
                                <Input
                                    label="Confirm Password"
                                    placeholder="••••••••"
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password_confirmation')}
                                    error={errors.password_confirmation?.message}
                                    className="pl-12"
                                />
                                <Lock className="absolute left-4 top-[3.2rem] h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        <div className="flex justify-end p-0">
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-xs font-bold text-gray-500 hover:text-main-500 flex items-center gap-1 uppercase tracking-widest transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                {showPassword ? "Hide Passwords" : "Show Passwords"}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    required
                                    className="h-4 w-4 text-main-600 focus:ring-main-500 border-gray-300 rounded-none cursor-pointer"
                                />
                            </div>
                            <div className="ml-3 text-xs">
                                <label htmlFor="terms" className="font-medium text-gray-600 uppercase leading-none">
                                    I agree to the <Link to="/terms" className="text-main-500 font-black hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-main-500 font-black hover:underline">Privacy Policy</Link>
                                </label>
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-14 text-lg font-bold rounded-none uppercase tracking-widest"
                        disabled={isLoading}
                    >
                        {isLoading ? 'CREATING ACCOUNT...' : (
                            <span className="flex items-center gap-2">
                                <UserPlus className="h-5 w-5" /> Join Now
                            </span>
                        )}
                    </Button>
                </form>

                <div className="pt-8 border-t border-gray-100">
                    <p className="text-center text-sm font-medium text-gray-600 tracking-wide uppercase">
                        Already a member?{' '}
                        <Link
                            to="/login"
                            className="font-black text-main-500 hover:text-main-600 transition-colors underline underline-offset-4"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>

                {/* Benefits section */}
                <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-50">
                    {[
                        'Exclusive Drops',
                        'Fast Checkout',
                        'Reward Points'
                    ].map((text) => (
                        <div key={text} className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-tighter">
                            <CheckCircle2 className="h-3 w-3 text-main-500" />
                            {text}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Register;
