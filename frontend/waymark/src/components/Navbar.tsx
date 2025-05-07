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
		label: 'My Trip',
		link: '/trips',
	},
	{
		label: 'Planner',
		link: '/planner',
	},
	{
		label: 'sign in',
		link: '/sign-in',
	},
	{
		label: 'profile',
		link: '/profile/userID',
	},

];

function Navbar() {
	return (
		<div className="w-full border-separate border-b bg-background">
			<div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
				<nav className="flex h-16 items-center justify-between">
					<div className="flex items-center">
						<div className="flex-shrink-0">
							<Logo />
						</div>
						<div className="ml-6 hidden md:flex md:space-x-8">
							{navList.map((item) => (
								<NavbarItem
									key={item.label}
									link={item.link}
									label={item.label}
								/>
							))}
						</div>
					</div>
					<div className="flex items-center space-x-4">
						<Link href={'/sign-in'}>
							<Button
								variant={'ghost'}
								size={'icon'}
								className="flex items-center justify-center"
							>
								<LogIn className="h-5 w-5" />
							</Button>
						</Link>
						<Link href={'/sign-up'}>
							<Button
								variant={'ghost'}
								size={'icon'}
								className="flex items-center justify-center"
							>
								<UserRoundPlus className="h-5 w-5" />
							</Button>
						</Link>
						<ThemeSwitcherButton />
						<Link href={'/profile/userID'}>
							<Button
								variant={'ghost'}
								size={'icon'}
								className="flex items-center justify-center"
							>
								<UserButton />
							</Button>
						</Link>
					</div>
				</nav>
			</div>
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
		<div className="relative flex items-center">
			<Link
				href={link}
				className={cn(
					buttonVariants({ variant: 'ghost' }),
					'py-2 text-base font-medium text-muted-foreground hover:text-foreground',
					isActive && 'text-amber-300'
				)}
				onClick={() => {
					if (clickCallBack) clickCallBack();
				}}
			>
				{label}
			</Link>
			{isActive && (
				<div className="absolute -bottom-[2px] left-1/2 h-[3px] w-full -translate-x-1/2 rounded-xl bg-amber-500" />
			)}
		</div>
	);
}

export default Navbar;
