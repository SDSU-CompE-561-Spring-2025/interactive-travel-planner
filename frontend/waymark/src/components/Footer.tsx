'use client';

import Logo from '@/components/Logo';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LogIn, UserRoundPlus } from 'lucide-react';
import { ThemeSwitcherButton } from '@/components/ThemeSwitcherButton';
import UserButton from '@/components/UserButton';

const navList = [
	{
		label: 'Create account',
		link: '/sign-up',
	},
	{
		label: 'About us',
		link: '/about-us',
	},
	{
		label: 'Jobs',
		link: '/jobs',
	},
	{
		label: 'privacy policy',
		link: '/privacy-policy',
	},
    {
		label: 'Contact us',
		link: '/contact',
	},
    {
		label: 'How the site works',
		link: '/logistics',
	},
];

function Footer() {
	return (
		<div className={'hidden border-separate border-b bg-background md:block h-64 justify-center'}>
			<nav className={'container flex items-center justify-between px-8'}>
				<div className={'flex h-[80px] min-h-[60px] items-center gap-x-4'}>
					<div className="flex h-full gap-12 text-sm font-medium text-muted-foreground">
					{navList.map((item) => (
							<FooterItem
								key={item.label}
								link={item.link}
								label={item.label}
							/>
						))}
					</div>
				</div>
			</nav>
		</div>
	);
}

interface FooterItemProps {
	link: string;
	label: string;
	clickCallBack?: () => void;
}

function FooterItem({ link, label, clickCallBack }: FooterItemProps) {
	const pathname = usePathname();
	const isActive = pathname === link;
	return (
		<>
			<div className="relative flex items-center">
				<Link
					href={link}
					className={cn(
						buttonVariants({ variant: 'ghost' }),
						'w-full justify-start text-lg text-muted-foreground hover:text-foreground',
						isActive && 'text-amber-300'
					)}
					onClick={() => {
						if (clickCallBack) clickCallBack();
					}}
				>
					{label}
				</Link>
				{isActive && (
					<div className="absolute -bottom-[2px] left-1/2 hidden h-[5px] w-[80%] -translate-x-1/2 rounded-xl bg-amber-500 md:block" />
				)}
			</div>
		</>
	);
}

export default Footer;
