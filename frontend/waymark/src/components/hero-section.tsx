'use client';

import Link from 'next/link';
import { MapPin, Calendar, PlusCircle, Search, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function HeroSection() {
    return (
        <section className="relative w-full min-h-screen overflow-hidden bg-[#fff8f0] hero-pattern py-24">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-[#f3a034]/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-[#4ba46c]/10 rounded-full blur-3xl" />
            </div>

            {/* Content container */}
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col space-y-12"
                    >
                        <div className="space-y-6">
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#377c68]"
                            >
                                Plan your perfect trip,
                                <br />
                                <span className="text-[#f3a034] shine-effect inline-block">effortlessly</span>
                            </motion.h1>
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="max-w-xl text-lg text-[#377c68]/80 sm:text-xl"
                            >
                                Create detailed travel itineraries, organize activities, and share your plans with friends and family.
                            </motion.p>
                        </div>

                        {/* Buttons */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Link href="/new-trip" className="btn-primary group flex items-center gap-2">
                                <PlusCircle className="h-5 w-5" />
                                Create New Itinerary
                                <ArrowRight className="h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                            </Link>
                        </motion.div>

                        {/* Input row */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="rounded-xl border-2 border-[#4ba46c]/20 bg-[#ffffff]/80 backdrop-blur-sm p-6 shadow-lg card-hover"
                        >
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="relative flex-1 group">
                                    <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-[#4ba46c] transition-colors group-hover:text-[#f3a034]" />
                                    <input className="input-primary w-full" placeholder="Where do you want to go?" />
                                </div>
                                <div className="relative flex-1 group">
                                    <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-[#4ba46c] transition-colors group-hover:text-[#f3a034]" />
                                    <input className="input-primary w-full" placeholder="When are you traveling?" />
                                </div>
                                <button className="btn-secondary flex items-center gap-2">
                                    <Search className="h-5 w-5" />
                                    Search
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Side - Map image and overlays */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="relative hidden lg:block"
                    >
                        {/* Label Card */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 1 }}
                            className="absolute -right-25 top-1/2 -translate-y-1/2 rotate-12 rounded-xl bg-[#ffffff]/90 p-4 shadow-lg backdrop-blur-sm dark:bg-black/80 border border-[#4ba46c]/20 card-hover"
                        >
                            <div className="space-y-3">
                                {['Paris', 'Rome', 'Barcelona'].map((city, index) => (
                                    <motion.div 
                                        key={city}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                                        className="flex items-center gap-2"
                                    >
                                        <div className="h-3 w-3 rounded-full bg-[#f3a034]" />
                                        <span className="text-sm font-medium text-[#377c68]">{city}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Date tag */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 1.2 }}
                            className="absolute -right-0 bottom-16 -rotate-6 rounded-xl bg-[#ffffff]/90 p-4 shadow-lg backdrop-blur-sm dark:bg-black/80 border border-[#4ba46c]/20 card-hover"
                        >
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-[#f3a034]" />
                                <span className="text-sm font-medium text-[#377c68]">June 10 – June 24, 2024</span>
                            </div>
                        </motion.div>

                        {/* Map image */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.6 }}
                            className="relative h-[500px] w-full overflow-hidden rounded-2xl top-10 left-25"
                        >
                            <img
                                src="https://i.postimg.cc/sgSKy8dp/Adobe-Express-file.png"
                                alt="World Map"
                                width={800}
                                height={700}
                                className="w-full h-full object-cover rounded-xl shadow-xl floating-animation"
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
