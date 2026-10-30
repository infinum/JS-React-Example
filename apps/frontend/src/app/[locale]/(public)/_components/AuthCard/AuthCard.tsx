import { Card, CardContent, CardHeader, CardTitle } from '@infinum/ui/components/card';
import { PropsWithChildren } from 'react';

export type AuthCardProps = PropsWithChildren;

export const AuthCard = ({ children }: AuthCardProps) => (
	<div className="flex min-h-screen items-center justify-center p-4">
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>Sign in</CardTitle>
			</CardHeader>
			<CardContent>{children}</CardContent>
		</Card>
	</div>
);
