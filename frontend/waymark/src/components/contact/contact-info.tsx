import type React from "react"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function ContactInfo() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Contact Information</h2>
        <p className="text-muted-foreground">
          Have questions or need assistance? Reach out to us using any of the methods below.
        </p>
      </div>

      <div className="space-y-4">
        <ContactInfoItem
          icon={<MapPin className="h-5 w-5" />}
          title="Our Location"
          content="123 Business Avenue, Suite 500, San Francisco, CA 94107"
        />

        <ContactInfoItem icon={<Phone className="h-5 w-5" />} title="Phone Number" content="+1 (555) 123-4567" />

        <ContactInfoItem icon={<Mail className="h-5 w-5" />} title="Email Address" content="contact@yourcompany.com" />

        <ContactInfoItem
          icon={<Clock className="h-5 w-5" />}
          title="Business Hours"
          content="Monday - Friday: 9AM - 5PM PST"
        />
      </div>

      <div className="pt-4">
        <h3 className="text-lg font-medium mb-2">Connect With Us</h3>
        <div className="flex space-x-4">
          <SocialIcon name="Twitter" />
          <SocialIcon name="LinkedIn" />
          <SocialIcon name="Facebook" />
          <SocialIcon name="Instagram" />
        </div>
      </div>
    </div>
  )
}

function ContactInfoItem({
  icon,
  title,
  content,
}: {
  icon: React.ReactNode
  title: string
  content: string
}) {
  return (
    <div className="flex items-start">
      <div className="mt-1 bg-primary/10 p-2 rounded-full">{icon}</div>
      <div className="ml-4">
        <h3 className="font-medium">{title}</h3>
        <p className="text-muted-foreground">{content}</p>
      </div>
    </div>
  )
}

function SocialIcon({ name }: { name: string }) {
  return (
    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition cursor-pointer">
      <span className="sr-only">{name}</span>
      <div className="h-5 w-5" />
    </div>
  )
}
