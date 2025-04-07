import { ExampleComponent } from '@infinum/ui/components/example';
import Image from 'next/image';

export default function HomePage() {
	return (
		<div className="flex h-screen flex-col items-center justify-center space-y-4">
			<div className="flex flex-col">
				<Image src="/assets/images/logo.png" alt="Infinum logo" width={180} height={38} priority />
				<ExampleComponent className="text-center" text={`Welcome to ${process.env.NEXT_PUBLIC_WEB_APP_NAME}`} />
			</div>
		</div>
	);
}

export const dynamic = 'force-dynamic';
