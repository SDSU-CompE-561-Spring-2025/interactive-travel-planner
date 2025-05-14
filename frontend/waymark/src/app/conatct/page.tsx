"use client"

import type React from "react"
import { useState, type FormEvent } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Send, X } from "lucide-react"
import emailjs from "@emailjs/browser"

export default function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [statusMessage, setStatusMessage] = useState<{
        type: "success" | "error"
        text: string
    } | null>(null)

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
    })

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setStatusMessage(null)

        try {
        await emailjs.send(
            "service_yplhit1",
            "template_afcjkpn",
            {
            from_name: `${formData.firstName} ${formData.lastName}`,
            from_email: formData.email,
            phone: formData.phone,
            message: formData.message,
            },
            "t7IrVcDAy0yW_PFpt"
        )

        setStatusMessage({
            type: "success",
            text: "Message sent! We'll get back to you as soon as possible.",
        })

        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            message: "",
        })
        } catch (error) {
        console.error("Error sending email:", error)
        setStatusMessage({
            type: "error",
            text: "There was a problem sending your message. Please try again.",
        })
        } finally {
        setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-2xl w-full space-y-8 bg-white p-8 sm:p-10 rounded-xl shadow-2xl relative">
            {/* Status Message Popup - Moved above the header div structure */}
            {statusMessage && (
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-11/12 md:w-4/5 z-20"> {/* Adjusted top, increased z-index just in case */}
                <div
                className={`rounded-lg p-4 text-sm font-medium border flex items-center justify-between shadow-lg ${
                    statusMessage.type === "success"
                    ? "bg-green-50 border-green-300 text-green-700"
                    : "bg-red-50 border-red-300 text-red-700"
                }`}
                >
                <span className="flex-grow text-center">{statusMessage.text}</span>
                <button
                    onClick={() => setStatusMessage(null)}
                    className="ml-3 p-1 rounded-full hover:bg-black/10 transition-colors"
                    aria-label="Close notification"
                >
                    <X size={18} />
                </button>
                </div>
            </div>
            )}

            <div>
            <h2 className="mt-2 text-center text-2xl font-semibold text-gray-900 tracking-tight"> {/* Reduced title size */}
                Contact Us
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
                We'd love to hear from you! Please fill out the form below.
            </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">
                    First Name
                </label>
                <Input
                    id="firstName"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="bg-gray-50 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                />
                </div>
                <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Last Name
                </label>
                <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="bg-gray-50 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                />
                </div>
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
                </label>
                <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-gray-50 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone Number
                </label>
                <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="bg-gray-50 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
                Message
                </label>
                <Textarea
                id="message"
                name="message"
                placeholder="Write your message"
                value={formData.message}
                onChange={handleChange}
                required
                className="min-h-[150px] bg-gray-50 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150 ease-in-out transform hover:scale-105"
            >
                {isSubmitting ? (
                <span className="text-sm flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                </span>
                ) : (
                <>
                    <span className="text-base">Send</span>
                    <Send className="ml-2 h-5 w-5" />
                </>
                )}
            </Button>
            </form>
        </div>
        </div>
    )
}
