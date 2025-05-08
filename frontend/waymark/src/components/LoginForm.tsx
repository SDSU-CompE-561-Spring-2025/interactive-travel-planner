'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { API_URL } from '@/lib/constants'
import { useUserStore } from '@/store/userStore'

const schema = z.object({
	username: z.string().min(3),
	email: z.string().email(),
	password: z.string().min(8),
})

type FormData = z.infer<typeof schema>

export default function SignupForm() {
	const router = useRouter()
	const form = useForm<FormData>({ resolver: zodResolver(schema) })

	async function onSubmit(data: FormData) {
		// ✅ Register the user
		const registerRes = await fetch(`${API_URL}/auth/register`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		})

		if (!registerRes.ok) {
			toast.error('Signup failed')
			return
		}

		// ✅ Login the new user
		const loginRes = await fetch(`${API_URL}/auth/token`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({
				username: data.username,
				password: data.password,
			}).toString(),
		})

		if (!loginRes.ok) {
			toast.error('Login failed after signup')
			return
		}

		const { access_token } = await loginRes.json()
		localStorage.setItem('accessToken', access_token)

		// ✅ Fetch user info
		const meRes = await fetch(`${API_URL}/auth/me`, {
			headers: { Authorization: `Bearer ${access_token}` },
		})

		if (!meRes.ok) {
			toast.error('Could not fetch profile after signup')
			return
		}

		const me = await meRes.json()
		useUserStore.getState().setUser(me)

		router.push(`/profile/${me.id}`)
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField name="username" control={form.control} render={({ field }) => (
					<FormItem>
						<FormLabel>Username</FormLabel>
						<FormControl><Input {...field} /></FormControl>
						<FormMessage />
					</FormItem>
				)} />
				<FormField name="email" control={form.control} render={({ field }) => (
					<FormItem>
						<FormLabel>Email</FormLabel>
						<FormControl><Input type="email" {...field} /></FormControl>
						<FormMessage />
					</FormItem>
				)} />
				<FormField name="password" control={form.control} render={({ field }) => (
					<FormItem>
						<FormLabel>Password</FormLabel>
						<FormControl><Input type="password" {...field} /></FormControl>
						<FormMessage />
					</FormItem>
				)} />
				<Button type="submit">Sign Up</Button>
			</form>
		</Form>
	)
}



/*
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { API_URL } from '@/lib/constants';

const formSchema = z.object({
	username: z.string().min(2, {
		message: 'Username must be at least 2 characters.',
	}),
	password: z.string().min(3, {
		message: 'Password must be at least 3 characters.',
	}),
});

export default function ProfileForm() {
	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: '',
			password: '',
		},
	});

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
		const data = values;

		const response = await fetch(`${API_URL}/auth/token`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams(data).toString(),
		});

		if (response.ok) {
			const result = await response.json();
			// toast('Everything went wrong');
			localStorage.setItem('accessToken', result.access_token);

			toast.error('Error');
			setTimeout(() => {
				window.location.href = '/';
			}, 2000);
			return true;
		}
		throw new Error('Invalid Credentials');
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-8"
			>
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input
									placeholder="compe"
									{...field}
								/>
							</FormControl>
							<FormDescription>This is your public display name.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input
									type={'password'}
									placeholder="password"
									{...field}
								/>
							</FormControl>
							<FormDescription>This is the password field.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}


*/


/*'use client';

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

// Zod schema for form validation
const loginSchema = z.object({
	username: z
		.string()
		.min(3, { message: 'Username must be at least 3 characters long' }),
	password: z
		.string()
		.min(3, { message: 'Password must be at least 8 characters long' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Simulated server action (in a real app, this would be in a separate file)
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
		console.log(result);
		return { success: true, token: result.access_token };
	}

	throw new Error('Invalid credentials');
}

export default function LoginForm() {
	const [isLoading, setIsLoading] = useState(false);
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
				// Save the token to localStorage
				localStorage.setItem('jwt', result.token)
				toast({
					title: 'Login Successful',
					description: 'You have been successfully logged in.',
				});
				window.location.href = '/';
			}
		} catch (error) {
			toast({
				title: 'Login Failed',
				description: 'Invalid username or password.',
				variant: 'destructive',
			});
			console.log(error);
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
							<Input
								id="username"
								{...register('username')}
							/>
							{errors.username && (
								<p className="text-sm text-red-500">
									{errors.username.message}
								</p>
							)}
						</div>
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								{...register('password')}
							/>
							{errors.password && (
								<p className="text-sm text-red-500">
									{errors.password.message}
								</p>
							)}
						</div>
					</div>
					<CardFooter className="flex justify-between mt-4 px-0">
						<Button
							type="submit"
							disabled={isLoading}
						>
							{isLoading ? 'Logging in...' : 'Login'}
						</Button>
					</CardFooter>
				</form>
			</CardContent>
		</Card>
	);
}
*/
