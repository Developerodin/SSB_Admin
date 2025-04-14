"use client"
import Seo from '@/shared/layout-components/seo/seo'
import Link from 'next/link';
import React, { Fragment, useState } from 'react'
import { Base_url } from '@/app/api/config/BaseUrl';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Signinbasic = () => {
    const [passwordshow1, setpasswordshow1] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post(`${Base_url}/admin/login`, {
                email,
                password
            });
               console.log("Response Data=>>>",response.data)
            if (response.data) {
                // Save token to localStorage
                localStorage.setItem('Admin token', response.data.token);
                localStorage.setItem('AdminDetails', JSON.stringify(response.data.admin));
                // Redirect to tables page
                router.push('/tables/users');
            }
        } catch (error: any) {
            setError(error.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <Fragment>
            <Seo title={"Sign In"} />
            <div className="min-h-screen w-full relative flex items-center justify-center">
                {/* Background with filters */}
                <div className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: "url('/assets/images/login-bg.jpg')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        filter: 'saturate(0.8) brightness(0.7)',
                    }}>
                </div>
                
                {/* Overlay for better card blend */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/40 to-black/60 backdrop-blur-[8px] z-1"></div>

                <div className="w-full relative z-10" style={{maxWidth: '500px', padding: '60px'}}>
                    {/* Add gradient border container */}
                    <div className="relative gradient-border-container rounded-[32px]">
                        {/* Animated gradient border */}
                        <div className="absolute inset-0 rounded-[32px] gradient-border"></div>
                        
                        {/* Main card content */}
                        <div className="bg-[#1e1e1e]/80 backdrop-blur-sm rounded-[32px] p-8 relative z-10 transition-all duration-300 hover:shadow-2xl"
                             style={{
                                 boxShadow: '20px 20px 60px rgba(0, 0, 0, 0.3), -20px -20px 60px rgba(255, 255, 255, 0.05)'
                             }}>
                            {/* Logo */}
                            <div className="flex justify-center mb-8">
                                <div className="w-12 h-12 rounded-full bg-[#1e1e1e] flex items-center justify-center"
                                     style={{
                                         boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.2), -8px -8px 16px rgba(255, 255, 255, 0.05)'
                                     }}>
                                    <img src="../../../assets/images/brand-logos/desktop-logo.png" alt="logo" className="h-6 w-6"/>
                                </div>
                            </div>

                            {/* Title */}
                            <h2 className="text-2xl text-white text-center mb-8">Hi There!</h2>

                            {/* Error message */}
                            {error && (
                                <div className="mb-4 p-3 bg-red-500/20 text-red-400 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Form */}
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <input
                                        type="email"
                                        className="w-full bg-[#1e1e1e]/50 text-white px-4 py-3 rounded-2xl focus:outline-none transition-shadow duration-300"
                                        style={{
                                            boxShadow: 'inset 5px 5px 10px rgba(0, 0, 0, 0.2), inset -5px -5px 10px rgba(255, 255, 255, 0.05)'
                                        }}
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <input
                                        type={passwordshow1 ? 'text' : 'password'}
                                        className="w-full bg-[#1e1e1e]/50 text-white px-4 py-3 rounded-2xl focus:outline-none transition-shadow duration-300"
                                        style={{
                                            boxShadow: 'inset 5px 5px 10px rgba(0, 0, 0, 0.2), inset -5px -5px 10px rgba(255, 255, 255, 0.05)'
                                        }}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setpasswordshow1(!passwordshow1)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                                    >
                                        <i className={`${passwordshow1 ? 'ri-eye-line' : 'ri-eye-off-line'}`}></i>
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-[#1e1e1e]/80 text-white py-3 rounded-2xl transition-all duration-300 hover:shadow-lg hover:transform hover:scale-[1.02]"
                                    style={{
                                        boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.2), -5px -5px 10px rgba(255, 255, 255, 0.05)'
                                    }}
                                >
                                    Sign in
                                </button>
                            </form>

                            <div className="text-center mt-6">
                                <p className="text-sm text-gray-400">
                                    <Link href="/signup" className="text-white ml-1 hover:text-gray-200 transition-colors duration-300">Forgot Password?</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add these styles to your existing style tag */}
            <style jsx>{`
                .gradient-border-container {
                    position: relative;
                    padding: 1px; /* This creates space for the gradient border */
                }

                .gradient-border {
                    background: linear-gradient(
                        45deg,
                        rgba(255, 255, 255, 0.1),
                        rgba(255, 255, 255, 0.2),
                        rgba(255, 255, 255, 0.1),
                        rgba(255, 255, 255, 0.05)
                    );
                    filter: blur(1px);
                    opacity: 0.5;
                    animation: borderRotate 4s linear infinite;
                }

                @keyframes borderRotate {
                    0% {
                        filter: blur(1px) hue-rotate(0deg);
                    }
                    100% {
                        filter: blur(1px) hue-rotate(360deg);
                    }
                }
            `}</style>
        </Fragment>
    )
}

export default Signinbasic