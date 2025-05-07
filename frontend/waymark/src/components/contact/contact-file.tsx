"use client"

import type React from "react"
import { useState, type FormEvent } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import emailjs from "@emailjs/browser"

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatusMessage(null) // Clear previous messages

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
        "t7IrVcDAy0yW_PFpt",
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
    <div className="w-full bg-white p-6 rounded-md border border-gray-200 shadow-sm">
      <h2 className="text-xl font-medium text-center mb-6">Contact Us</h2>
      {statusMessage && (
        <div
          className={`rounded p-2 text-center font-medium mb-4 transition-all duration-300 ${
            statusMessage.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label htmlFor="firstName" className="block font-medium text-center">
              First Name
            </label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="border-gray-300 h-10"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="block font-medium text-center">
              Last Name
            </label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="border-gray-300 h-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block font-medium text-center">
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
            className="border-gray-300 h-10"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="block font-medium text-center">
            Phone Number
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="border-gray-300 h-10"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="block font-medium text-center">
            Message
          </label>
          <Textarea
            id="message"
            name="message"
            placeholder="Write your message"
            value={formData.message}
            onChange={handleChange}
            required
            className="min-h-[150px] border-gray-300 resize-none"
          />
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            className="px-10 bg-white hover:bg-gray-100 text-black border border-gray-300 py-2 text-base font-normal"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Send
                <Send className="h-4 w-4" />
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
