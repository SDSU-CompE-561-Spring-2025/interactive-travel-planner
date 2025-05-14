'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, UserPlus } from 'lucide-react';
import AuthContext from '@/app/context/AuthContext';
import { toast } from 'react-hot-toast';

export function UserMenu() {
    const { user, logout, isAuthenticated } = useContext(AuthContext);
    const router = useRouter();

    const handleLogout = () => {
        logout();
        toast.success('Successfully logged out!');
    };

    if (isAuthenticated && user) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-12 w-12 rounded-full p-0">
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-semibold">
                            {user.username?.[0]?.toUpperCase() || <User className="h-6 w-6" />}
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.username}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                Logged in
                            </p>
                        </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                        className="text-red-600 focus:text-red-600 cursor-pointer"
                        onClick={handleLogout}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-12 w-12 rounded-full p-0">
                    <User className="h-6 w-6 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
                <DropdownMenuItem asChild>
                    <Link href="/login" className="w-full cursor-pointer flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Sign In
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/register" className="w-full cursor-pointer flex items-center">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Create Account
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
} 