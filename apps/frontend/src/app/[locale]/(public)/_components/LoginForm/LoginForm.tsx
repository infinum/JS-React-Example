'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@infinum/ui/components/button';
import { Label } from '@infinum/ui/components/label';
import { Input } from '@infinum/ui/components/input';

export const LoginForm = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		const res = await signIn('credentials', {
			redirect: false,
			email,
			password,
		});

		if (res?.error) {
			setError(res.error);
		} else {
			router.push('/');
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div>
				<Label htmlFor="email">Email</Label>
				<Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
			</div>

			<div>
				<Label htmlFor="password">Password</Label>
				<Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
			</div>

			{error && (
				<p className="text-sm text-red-500" data-testid="login-error">
					{error}
				</p>
			)}

			<Button type="submit">Sign in</Button>
		</form>
	);
};
