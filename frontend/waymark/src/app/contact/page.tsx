import ContactForm from "@/components/contact/contact-file"
import Title from "@/components/Title"

export default function ContactPage() {
    return (
        <div className="flex flex-col items-center justify-center gap-4 p-4 md:p-8 lg:p-16 text-sm">
            <ContactForm />
            <div className="text-center text-gray-500 mt-4">
                <p>If you have any questions, feel free to reach out!</p>
                <p>We look forward to hearing from you.</p>
            </div>
        </div>
    );
}
