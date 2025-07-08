import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';

import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
	CardAction,
} from '@infinum/ui/components/card';

const meta = {
	title: 'UI/Card',
	component: Card,
	parameters: {
		design: {
			type: 'figma',
			url: 'https://www.figma.com/design/bwBwsZo0o7Prr9eDrjyfny/-shadcn-ui---Design-System--Community-?node-id=13-1246&t=fUo7MQx7BMzqBTo3-0',
		},
	},
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// Simple card with basic content
export const Default: Story = {
	render: () => (
		<Card className="w-96">
			<CardHeader>
				<CardTitle>Card Title</CardTitle>
				<CardDescription>This is a description of the card content.</CardDescription>
			</CardHeader>
			<CardContent>
				<p className="text-sm">Card content goes here. This can include any type of content you need.</p>
			</CardContent>
		</Card>
	),
};

// Card with action button
export const WithAction: Story = {
	render: () => (
		<Card className="w-96">
			<CardHeader>
				<CardTitle>Project Overview</CardTitle>
				<CardDescription>View your project statistics and metrics.</CardDescription>
				<CardAction>
					<button
						onClick={fn()}
						className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 py-1.5 text-sm"
					>
						View Details
					</button>
				</CardAction>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<div className="text-2xl font-bold">24</div>
						<div className="text-muted-foreground text-xs">Active Projects</div>
					</div>
					<div>
						<div className="text-2xl font-bold">1,234</div>
						<div className="text-muted-foreground text-xs">Total Users</div>
					</div>
				</div>
			</CardContent>
		</Card>
	),
};

// Card with footer
export const WithFooter: Story = {
	render: () => (
		<Card className="w-96">
			<CardHeader>
				<CardTitle>Settings</CardTitle>
				<CardDescription>Manage your account preferences and settings.</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-sm">Email notifications</span>
						<input type="checkbox" defaultChecked />
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm">Push notifications</span>
						<input type="checkbox" />
					</div>
				</div>
			</CardContent>
			<CardFooter>
				<button
					onClick={fn()}
					className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm"
				>
					Save Changes
				</button>
			</CardFooter>
		</Card>
	),
};

// Complete card with all components
export const Complete: Story = {
	render: () => (
		<Card className="w-96">
			<CardHeader>
				<CardTitle>Team Member</CardTitle>
				<CardDescription>John Doe - Senior Developer</CardDescription>
				<CardAction>
					<button onClick={fn()} className="hover:bg-accent rounded-md border px-3 py-1.5 text-sm">
						Edit
					</button>
				</CardAction>
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					<div className="flex items-center gap-3">
						<div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
							<span className="text-sm font-medium">JD</span>
						</div>
						<div>
							<p className="text-sm font-medium">john.doe@company.com</p>
							<p className="text-muted-foreground text-xs">Joined March 2023</p>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-3 text-sm">
						<div>
							<span className="text-muted-foreground">Projects:</span> 8
						</div>
						<div>
							<span className="text-muted-foreground">Role:</span> Admin
						</div>
					</div>
				</div>
			</CardContent>
			<CardFooter>
				<div className="flex gap-2">
					<button
						onClick={fn()}
						className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 py-1.5 text-sm"
					>
						Message
					</button>
					<button onClick={fn()} className="hover:bg-accent rounded-md border px-3 py-1.5 text-sm">
						View Profile
					</button>
				</div>
			</CardFooter>
		</Card>
	),
};

// Multiple cards layout
export const MultipleCards: Story = {
	render: () => (
		<div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 lg:grid-cols-3">
			<Card>
				<CardHeader>
					<CardTitle>Analytics</CardTitle>
					<CardDescription>Track your website performance</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">98.5%</div>
					<div className="text-muted-foreground text-xs">Uptime this month</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Revenue</CardTitle>
					<CardDescription>Monthly revenue overview</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">$12,345</div>
					<div className="text-xs text-green-600">+12% from last month</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Users</CardTitle>
					<CardDescription>Active user count</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">2,345</div>
					<div className="text-xs text-blue-600">+5% from last week</div>
				</CardContent>
			</Card>
		</div>
	),
};
