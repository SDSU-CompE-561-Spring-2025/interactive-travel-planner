"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProfileForm, type ProfileFormValues } from "@/components/profile-form"

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
        fetch("/api/users/me")
        .then((res) => {
            if (!res.ok) throw new Error("not logged in")
            return res.json()
        })
        .then((data: User) => setUser(data))
        .catch(() => router.push("/login"))
    }, [])

    if (!user) return <p>Loading…</p>

    function handleSubmit(values: ProfileFormValues) {
        return fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        }).then(() => router.refresh())
    }

    return (
        <ProfileForm
        user={{ ...user, avatar: user.avatar ?? undefined }}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        onAvatarChange={(file) => {
        }}
        />
    )
}
