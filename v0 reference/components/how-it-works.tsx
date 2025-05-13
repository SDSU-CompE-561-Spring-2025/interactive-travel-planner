import { Calendar, Map, Share2, Sparkles } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: <Sparkles className="h-10 w-10 text-primary" />,
      title: "Create",
      description: "Start with a blank canvas or use one of our templates to create your perfect itinerary.",
    },
    {
      icon: <Map className="h-10 w-10 text-secondary" />,
      title: "Plan",
      description: "Add destinations, activities, accommodations, and transportation to your itinerary.",
    },
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: "Organize",
      description: "Arrange your activities by day and time, and add notes and reminders.",
    },
    {
      icon: <Share2 className="h-10 w-10 text-accent" />,
      title: "Share",
      description: "Share your itinerary with travel companions or export it for offline use.",
    },
  ]

  return (
    <section className="bg-muted/50 py-16 md:py-24">
      <div className="container">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
          <p className="mt-4 text-muted-foreground">Plan your trip in four simple steps</p>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-background shadow-sm">
                {step.icon}
              </div>
              <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
