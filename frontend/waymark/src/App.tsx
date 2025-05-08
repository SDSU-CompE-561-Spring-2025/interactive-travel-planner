import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterForm from '@/components/RegisterForm';
import LoginForm from '@/components/LoginForm';

export const App: React.FC = () => (
    <BrowserRouter>
        <Routes>
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login"    element={<LoginForm />} />
        {/* other routes */}
        </Routes>
    </BrowserRouter>
);
