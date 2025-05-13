import { Calendar, Map, Share2, Sparkles } from "lucide-react"

export function HowItWorks() {
    const steps = [
        {
        icon: <Sparkles className="h-10 w-10 text-primary" />,
        title: "Start Your Trip",
        description: "Create a new trip, upload a cover image or pick a color, and set your travel dates.",
        },
        {
        icon: <Map className="h-10 w-10 text-secondary" />,
        title: "Plan Together",
        description: "Invite friends and collaborate in real time. Add destinations, activities, and notes as a team.",
        },
        {
        icon: <Calendar className="h-10 w-10 text-primary" />,
        title: "Organize & Personalize",
        description: "Arrange your itinerary by day, add details, and customize with images, colors, and reminders.",
        },
        {
        icon: <Share2 className="h-10 w-10 text-accent" />,
        title: "Share & Go",
        description: "Share your trip with collaborators or export your plans for offline use. Enjoy your adventure!",
        },
    ]

    return (
        <section className="bg-[#e6f3ec] w-full px-4 md:px-8 py-16 md:py-24 text-sm shadow-sm">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
                <p className="mt-4 text-muted-foreground">Plan your trip in four simple steps</p>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {steps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full" style={{ backgroundColor: '#ffedd5' }}>
                            {step.icon}
                        </div>
                        <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
                        <p className="mt-2 text-muted-foreground">{step.description}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}
