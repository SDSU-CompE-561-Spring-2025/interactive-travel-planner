// import { reducer } from './../../hooks/use-toast'; // Removed as the module does not exist or is unused
import { RegisterFormValues } from '@/hooks/useRegisterForm';
import { API_URL } from '../constants';

export async function registerUser(data: RegisterFormValues) {
	console.log('data', data);
	const submissionData = {
		username: data.username,
		email: data.email,
		password: data.password,
	};
	const response = await fetch(`${API_URL}/users/register`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(submissionData),
	});

	if (response.ok) {
		const result = await response.json();
		return { success: true, data: result };
	}

	throw new Error('Failed to register user');
}
