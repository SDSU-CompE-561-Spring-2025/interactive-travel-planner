"use client"

import Image from "next/image"

const team = [
  {
    name: "Ethan Quach",
    role: "Tweak",
    desc: "GYM GYM GYM",
    img: "https://i.postimg.cc/rpvRtMgD/image.png",
  },
  {
    name: "Kohki Kita",
    role: "UX Designer",
    desc: "I love databases",
    img: "https://i.postimg.cc/kGy2Z8CS/image.png",
  },
  {
    name: "Micah Davis",
    role: "Backend Engineer",
    desc: "please get me out of here",
    img: "https://i.postimg.cc/Sx1MkWM7/image.png",
  },
  {
    name: "Riley McGregor",
    role: "Product Manager",
    desc: "Oh by the way, I'm a pilot",
    img: "https://i.postimg.cc/gJJkg5Jv/Screenshot-2025-05-14-122241.png",
  },
  {
    name: "Rojin Osman",
    role: "Frontend Engineer",
    desc: "Miss Leader",
    img: "https://i.postimg.cc/fLmtcpgB/image.png",
  },
  {
    name: "Tri & Ugur",
    role: "Community & Support",
    desc: "Answers faster than your group chat",
    img: "https://i.postimg.cc/j5bg40Sj/image.png",
  },
]

export default function AboutUsPage() {
  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#f3eee5] pt-8">
      <div className="w-full max-w-5xl px-4">
        {/* Header */}
        <div className="text-center" style={{ marginBottom: '5rem' }}>
          <h1 className="text-4xl font-bold mb-4 text-gray-800">About Us</h1>
        </div>

        {/* Team Section */}
        <section className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {team.map((member, index) => (
              <div key={index} className="flex flex-col items-center">
                {/* Circular image container */}
                <div className="relative w-32 h-32 mb-4">
                  {/* Background circle with border */}
                  <div className="absolute inset-0 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-2xl font-medium">
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Image */}
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <img
                      src={member.img}
                      alt={`Photo of ${member.name}`}
                      width={128}
                      height={128}
                      className="team-member-image rounded-full"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
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
