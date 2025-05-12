"use client";

import { useContext } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import AuthContext from '../app/context/AuthContext';
import { Button, buttonVariants } from '@/components/ui/button';
import { ThemeSwitcherButton } from '@/components/ThemeSwitcherButton';
import UserButton from '@/components/UserButton';
import { LogOut, UserRoundPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from './Logo';

interface NavbarItemProps {
	link: string;
	label: string;
	clickCallBack?: () => void;
}

const Navbar = () => {
	const { user, logout } = useContext(AuthContext);
	const router = useRouter();

	return (
		<nav className="bg-white shadow-lg">
			<div className="max-w-7xl mx-auto px-4">
				<div className="flex justify-between h-16">
					<div className="flex items-center">
						<Logo />
					</div>
					<div className="flex items-center space-x-4">
						{user ? (
							<>
								<Link href="/" className="text-gray-600 hover:text-gray-900">
									Home
								</Link>
								<Button
									onClick={logout}
									variant="ghost"
									size="icon"
								>
									<LogOut />
								</Button>
							</>
						) : (
							<>
								<Link href="/login" className="text-gray-600 hover:text-gray-900">
									<Button
										variant="ghost"
										size="icon"
									>
										<UserRoundPlus />
									</Button>
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};

function NavbarItem({ link, label, clickCallBack }: NavbarItemProps) {
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

export default Navbar;




/*
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
		label: 'New Trip',
		link: '/new-trip',
	},
	{
		label: 'My Itinerary',
		link: '/planner',
	},
];

function Navbar() {
	return (
		<div className={'hidden border-separate border-b bg-background md:block'}>
			<nav className={'container flex items-center justify-between px-8'}>
				<div className={'flex h-[80px] min-h-[60px] items-center gap-x-4'}>
					<Logo />
					<div className="flex h-full gap-5">
					{navList.map((item) => (
							<NavbarItem
								key={item.label}
								link={item.link}
								label={item.label}
							/>
						))}
					</div>
				</div>
				<div className={'flex items-center gap-3'}>
					<Link href={'/sign-in'}>
						<Button
							variant={'ghost'}
							size={'icon'}
						>
							<LogIn />
						</Button>
					</Link>
					<Link href={'/login'}>
						<Button
							variant={'ghost'}
							size={'icon'}
						>
							<UserRoundPlus />
						</Button>
					</Link>
					<ThemeSwitcherButton />
					<UserButton />
				</div>
			</nav>
		</div>
	);
}

interface NavbarItemProps {
	link: string;
	label: string;
	clickCallBack?: () => void;
}

function NavbarItem({ link, label, clickCallBack }: NavbarItemProps) {
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

export default Navbar;
*/
