import { Star } from "lucide-react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "New York, USA",
      content:
        "TravelPlan made organizing our family trip to Europe so much easier. We could plan each day and share the itinerary with everyone in our group.",
      rating: 5,
    },
    {
      name: "David Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Toronto, Canada",
      content:
        "As a solo traveler, I love how I can keep track of all my bookings and activities in one place. The timeline view is especially helpful.",
      rating: 5,
    },
    {
      name: "Maria Garcia",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Barcelona, Spain",
      content:
        "We used TravelPlan for our honeymoon and it helped us create the perfect balance of activities and relaxation time.",
      rating: 4,
    },
  ]

  return (
    <section className="container py-16 md:py-24">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">What Our Users Say</h2>
        <p className="mt-4 text-muted-foreground">
          Join thousands of happy travelers who plan their trips with TravelPlan
        </p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <Card key={index}>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex mb-2">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < testimonial.rating ? "fill-amber-400 text-amber-400" : "text-muted"}`}
                    />
                  ))}
              </div>
              <p className="text-muted-foreground">{testimonial.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
