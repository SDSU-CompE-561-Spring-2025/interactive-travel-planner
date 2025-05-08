'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { API_URL } from '@/lib/constants'

export default function ProfilePage() {
    const { userID } = useParams()            // grabs the [id]
    const [username, setUsername] = useState<string>('')

    useEffect(() => {
        async function loadMe() {
        const token = localStorage.getItem('accessToken')
        if (!token) return
        const res = await fetch(`${API_URL}/auth/users/${userID}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()     // { id, username, email, … }
        setUsername(data.username)
        }
        loadMe()
    }, [userID])

    return (
        <div className="p-4">
        <h1 className="text-2xl font-bold">Welcome, {username}!</h1>
        </div>
    )
}


/*
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProfileForm, type ProfileFormValues } from '@/components/profile-form'

// Use the environment variable to point to your FastAPI backend
const API_URL = process.env.NEXT_PUBLIC_API_URL!

interface User {
    name: string
    email: string
    bio: string
    location: string
    avatar: string | null
    socialLinks: {
        instagram?: string
        twitter?: string
        facebook?: string
    }
    }

    export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null)
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('jwt')
        if (!token) {
        router.push('/login')
        return
        }

        fetch(`${API_URL}/users/me`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
        })
        .then((res) => {
            if (!res.ok) throw new Error('not logged in')
            return res.json()
        })
        .then((data: User) => setUser(data))
        .catch(() => {
            localStorage.removeItem('jwt')
            router.push('/login')
        })
    }, [router])

    if (!user) return <p>Loading…</p>

    function handleSubmit(values: ProfileFormValues) {
        const token = localStorage.getItem('jwt')
        return fetch(`${API_URL}/users/me`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(values)
        }).then(() => router.refresh())
    }

    return (
        <ProfileForm
        user={{ ...user, avatar: user.avatar ?? undefined }}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        onAvatarChange={(file) => {
            // Optionally implement avatar upload logic here
        }}
        />
    )
}
*/
