import Title from "@/components/Title"
import Navbar from "@/components/Navbar";

<Navbar></Navbar>


export default function SignInPage () {
    return (
        <Title
            title="Sign In Page"
            subtitle="Please Sign In"
        />
    );
}

/*
import { useUserStore } from '@/store/userStore';

export async function login(username: string, password: string) {
    // Step 1: Get token
    const tokenRes = await fetch('/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username,
        password,
      }),
    });
  
    if (!tokenRes.ok) {
      throw new Error('Login failed');
    }
  
    const { access_token } = await tokenRes.json();
  
    // Step 2: Get user info using the token
    const userRes = await fetch('/auth/users/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
  
    if (!userRes.ok) {
      throw new Error('Failed to fetch user info');
    }
  
    const user = await userRes.json();
  
    // Step 3: Save to Zustand store
    useUserStore.getState().setUser(user, access_token);
  }
