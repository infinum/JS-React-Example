'use client';

import { Locale, usePathname, useRouter } from '@/lib/i18n';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@infinum/ui/components/select';
import { useSearchParams } from 'next/navigation';
import { ReactNode, useTransition } from 'react';

export interface LocaleSwitcherSelectProps {
	children: ReactNode;
	defaultValue: string;
	label: string;
}

export const LocaleSwitcherSelect = ({ children, defaultValue, label }: LocaleSwitcherSelectProps) => {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const pathname = usePathname();
	const params = useSearchParams();

	function onSelectChange(locale: Locale) {
		startTransition(() => {
			router.replace(
				// @ts-expect-error -- TypeScript will validate that only known `params`
				// are used in combination with a given `pathname`. Since the two will
				// always match for the current route, we can skip runtime checks.
				{ pathname, params },
				{ locale }
			);
			router.refresh();
		});
	}

	return (
		<Select defaultValue={defaultValue} disabled={isPending} onValueChange={onSelectChange}>
			<SelectTrigger defaultValue="en" className="w-44">
				<SelectValue placeholder="Select a locale" className="text-foreground" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>{label}</SelectLabel>
					{children}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
};
