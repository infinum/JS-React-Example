'use client';

import { Button } from '@infinum/ui/components/button';
import { Input } from '@infinum/ui/components/input';
import { Label } from '@infinum/ui/components/label';
import { signIn } from 'next-auth/react';
import { useLocale } from 'next-intl';
import React, { useState } from 'react';

export const LoginForm = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const locale = useLocale();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		const res = await signIn('credentials', {
			redirect: true,
			email,
			password,
			callbackUrl: `/${locale}`,
		});

		if (res?.error) {
			setError(res.error);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div>
				<Label htmlFor="email">EMail</Label>
				<Input
					id="email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					autoComplete="email"
					required
				/>
			</div>

			<div>
				<Label htmlFor="password">Password</Label>
				<Input
					id="password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					autoComplete="current-password"
					required
				/>
			</div>

			{error && <p className="text-sm text-red-500">{error}</p>}

			<Button type="submit">Sign in</Button>
		</form>
	);
};
