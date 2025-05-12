"use client"

import Image from "next/image"

const team = [
  {
    name: "Ethan Quach",
    role: "Fullstack Developer",
    desc: "Loves one-bag travel and hotkeys",
    img: "/etan.png",
  },
  {
    name: "c",
    role: "UX Designer",
    desc: "Coffee snob with a thing for airports",
    img: "/kookie.png",
  },
  {
    name: "q",
    role: "Backend Engineer",
    desc: "Hiker, biker, database whisperer",
    img: "/mog.jpg",
  },
  {
    name: "c",
    role: "Product Manager",
    desc: "Obsessed with clean roadmaps",
    img: "/ryry.png",
  },
  {
    name: "n",
    role: "Frontend Engineer",
    desc: "Animates everything, even spreadsheets",
    img: "/placeholder-user.jpg",
  },
  {
    name: "Maya L.",
    role: "Community & Support",
    desc: "Answers faster than your group chat",
    img: "/placeholder-user.jpg",
  },
]

export default function AboutUsPage() {
  return (
    <div className="flex flex-col items-center w-full bg-white pt-8">
      <div className="w-full max-w-5xl px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">About Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We don't know what we're doing — we're just guessing and checking.
          </p>
        </div>

        {/* Team Section */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-8 text-center text-gray-800">Meet the Team</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {team.map((member, index) => (
              <div key={index} className="flex flex-col items-center">
                {/* Simple circular image container */}
                <div className="w-32 h-32 mb-4 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                  {/* Fallback for image loading issues */}
                  <div className="absolute flex items-center justify-center text-gray-400 text-xl">
                    {member.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Image with object-cover and position center */}
                  <Image
                    src={member.img || "/placeholder.svg"}
                    alt={`Photo of ${member.name}`}
                    width={96}
                    height={96}
                    className="min-w-full min-h-full object-cover"
                    style={{ objectPosition: "center" }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                </div>

                {/* Member Info */}
                <h3 className="font-semibold text-gray-800 text-center">{member.name}</h3>
                <p className="text-sm font-medium text-gray-600 mb-1 text-center">{member.role}</p>
                <p className="text-sm text-gray-500 text-center">{member.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 mb-8 text-center">
          <p className="text-sm text-gray-500">Built remotely across continents with ☕, code, and curiosity.</p>
        </footer>
      </div>
    </div>
  )
}
