import Link from 'next/link';
import Image from 'next/image';

function Logo() {
	return (
		<Link href="/" className="flex items-center gap-3">
			<Image
				src="/favicon.ico"
				alt="Waymark Logo"
				width={40}
				height={40}
				className="object-contain"
				priority
			/>
			<span className="font-bold text-xl text-[#377C68]">
				Waymark
			</span>
		</Link>
	);
}

export default Logo;
