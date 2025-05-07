import React from 'react';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

function UserButton() {
	return (
		<div>
			<a href="/profile/[userId]">
				<Button
					variant={'ghost'}
					size={'icon'}
				>
					<User />
				</Button>
			</a>
		</div>
	);
}

export default UserButton;
