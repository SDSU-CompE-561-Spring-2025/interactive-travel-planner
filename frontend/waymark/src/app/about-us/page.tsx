'use client';

import Image from 'next/image';

const team = [
  {
    name: 'Ethan Quach',
    role: 'Authenticator',
    desc: 'Loves one-bag travel and hotkeys',
    img: '/etan.png',
  },
  {
    name: 'Kohki Kita',
    role: 'UX Designer',
    desc: 'Coffee snob with a thing for airports',
    img: '/kookie.png',
  },
  {
    name: 'Micah Davis',
    role: 'Backend Engineer',
    desc: 'Hiker, biker, database whisperer',
    img: '/mog.jpg',
  },
  {
    name: 'Riley McGregor',
    role: 'Product Manager',
    desc: 'Obsessed with planes',
    img: '/ryry.png',
  },
  {
    name: 'Rojin Osman',
    role: 'Frontend Engineer',
    desc: 'Animates everything, even spreadsheets',
    img: '/brickjin.png',
  },
  {
    name: 'Tri & Ugur',
    role: 'Community & Support',
    desc: 'Answers faster than your group chat',
    img: '/placeholder-user.jpg',
  },
];

export default function AboutUsPage() {
  return (
    <div className="min-h-screen flex justify-center px-4 pt-10">
      <div className="max-w-5xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">About Us</h1>

        <p className="text-lg text-gray-700 mb-8 text-center">
          We don't know what we're doing we're just guessing and checking.
        </p>

        <section className="mt-4">
            <h2 className="text-2xl font-semibold mb-6 text-center">Meet the Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
                {team.map((member, index) => (
                <div key={index} className="space-y-3 min-h-[220px] flex flex-col items-center justify-start">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden shadow">
                    <Image
                        src={member.img}
                        alt={member.name}
                        fill
                        className="object-cover"
                    />
                    </div>
                    <div className="font-semibold text-base">{member.name}</div>
                    <div className="text-sm text-gray-600">{member.role}</div>
                    <div className="text-sm text-gray-500">{member.desc}</div>
                </div>
                ))}
            </div>
            </section>


        <footer className="mt-16 text-center text-sm text-gray-500">
          Built thanks to the efforts of our mentors: Tri and Ugur
        </footer>
      </div>
    </div>
  );
}
