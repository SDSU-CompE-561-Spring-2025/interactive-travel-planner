import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RegistorForm } from from '@/components/RegistorForm';
import { SignInForm } from '@/components/SignInForm';

export const App: React.FC = () => (
    <BrowserRouter>
        <Routes>
        <Route path="/register" element={<RegistorForm />} />
        <Route path="/login"    element={<SignInForm />} />
        {/* other routes */}
        </Routes>
    </BrowserRouter>
);
