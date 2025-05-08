'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { API_URL } from '@/lib/constants';
import { Eye, EyeOff } from 'lucide-react'; // 👁 Icons for toggle

const loginSchema = z.object({
	username: z.string().min(3),
	password: z.string().min(8),
});

type LoginFormValues = z.infer<typeof loginSchema>;

async function loginUser(data: LoginFormValues) {
	const response = await fetch(`${API_URL}/auth/token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams(data).toString(),
	});

	if (response.ok) {
		const result = await response.json();
		return { success: true, token: result.access_token };
	}

	throw new Error('Invalid credentials');
}

export function LoginForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [serverError, setServerError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const { toast } = useToast();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data: LoginFormValues) => {
		setIsLoading(true);
		try {
			const result = await loginUser(data);
			if (result.success) {
				localStorage.setItem('accessToken', result.token);
				setServerError(null);
				toast({
					title: 'Login Successful',
					description: 'You have been successfully logged in.',
				});
				window.location.href = '/';
			}
		} catch (error) {
			setServerError('Invalid username or password.');
			toast({
				title: 'Login Failed',
				description: 'Invalid username or password.',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className="w-[350px]">
			<CardHeader>
				<CardTitle>Login</CardTitle>
				<CardDescription>
					Enter your credentials to access your account.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="grid w-full items-center gap-4">
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="username">Username</Label>
							<Input id="username" {...register('username')} />
							{errors.username && (
								<p className="text-sm text-red-500">
									{errors.username.message}
								</p>
							)}
						</div>
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="password">Password</Label>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? 'text' : 'password'}
									{...register('password')}
								/>
								<button
									type="button"
									className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
									onClick={() => setShowPassword((prev) => !prev)}
									tabIndex={-1}
								>
									{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
								</button>
							</div>
							{errors.password && (
								<p className="text-sm text-red-500">
									{errors.password.message}
								</p>
							)}
						</div>
					</div>

					{serverError && (
						<p className="text-sm text-red-500 text-center mt-3">
							{serverError}
						</p>
					)}

					<CardFooter className="flex justify-between mt-4 px-0">
						<Button type="submit" disabled={isLoading} className="w-full">
							{isLoading ? 'Logging in...' : 'Login'}
						</Button>
					</CardFooter>
				</form>
			</CardContent>
		</Card>
	);
}
