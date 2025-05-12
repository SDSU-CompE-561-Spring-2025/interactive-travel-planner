import Link from 'next/link';
import Image from 'next/image';

function Logo() {
	return (
		<Link href="/" className="flex items-center gap-2">
			<Image
				src="/favicon.ico"
				alt="WayMark Logo"
				width={36}
				height={36}
				className="object-contain"
			/>
			<p className="bg-gradient-to-r from-amber-200 to-green-500 bg-clip-text text-3xl leading-tight text-transparent">
				WayMark
			</p>
		</Link>
	);
}

export default Logo;
