import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RegisterForm } from '@/components/RegisterForm';
import { SignInForm } from '@/components/SignInForm';

export const App: React.FC = () => (
    <BrowserRouter>
        <Routes>
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login"    element={<SignInForm />} />
        {/* other routes */}
        </Routes>
    </BrowserRouter>
);
