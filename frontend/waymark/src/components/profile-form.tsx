"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const profileFormSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    bio: z.string().max(160, {
        message: "Bio must not be longer than 160 characters.",
    }),
    location: z.string().min(2, {
        message: "Location must be at least 2 characters.",
    }),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    facebook: z.string().optional(),
    })

    type ProfileFormValues = z.infer<typeof profileFormSchema>

    interface ProfileFormProps {
    user: any
    onSubmit: (values: ProfileFormValues) => void
    onCancel: () => void
    }

    export function ProfileForm({ user, onSubmit, onCancel }: ProfileFormProps) {
    const [avatar, setAvatar] = useState(user.avatar)

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
        name: user.name,
        email: user.email,
        bio: user.bio,
        location: user.location,
        instagram: user.socialLinks.instagram,
        twitter: user.socialLinks.twitter,
        facebook: user.socialLinks.facebook,
        },
        mode: "onChange",
    })

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
        // In a real app, this would upload the file to a server
        // For now, we'll just create a local URL
        const url = URL.createObjectURL(file)
        setAvatar(url)
        }
    }

    return (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col items-center">
            <Avatar className="h-24 w-24">
                <AvatarImage src={avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="mt-4">
                <Input id="avatar" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("avatar")?.click()}
                >
                Change Avatar
                </Button>
            </div>
            </div>

            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                    <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                    <Input placeholder="Your email" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                    <Textarea placeholder="Tell us about yourself" className="resize-none" {...field} />
                </FormControl>
                <FormDescription>
                    Share a bit about yourself and your travel interests.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                    <Input placeholder="City, Country" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <div className="space-y-4">
            <h3 className="text-lg font-medium">Social Links</h3>
            <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                    <div className="flex items-center">
                        <span className="mr-2 text-sm text-muted-foreground">@</span>
                        <Input placeholder="username" {...field} />
                    </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Twitter</FormLabel>
                    <FormControl>
                    <div className="flex items-center">
                        <span className="mr-2 text-sm text-muted-foreground">@</span>
                        <Input placeholder="username" {...field} />
                    </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Facebook</FormLabel>
                    <FormControl>
                    <Input placeholder="username or profile URL" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            </div>

            <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
            </div>
        </form>
        </Form>
    )
}
