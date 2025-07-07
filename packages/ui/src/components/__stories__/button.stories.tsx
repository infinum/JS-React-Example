import { Button } from '@infinum/ui/components/button';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { fn } from 'storybook/test';

const meta = {
	title: 'UI/Button',
	component: Button,
	args: {
		onClick: fn(),
		children: 'Button',
	},
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
		},
		size: {
			control: 'select',
			options: ['default', 'sm', 'lg', 'icon'],
		},
		asChild: {
			control: 'boolean',
		},
	},
	parameters: {
		design: {
			type: 'figma',
			url: 'https://www.figma.com/design/bwBwsZo0o7Prr9eDrjyfny/-shadcn-ui---Design-System--Community-?node-id=13-1070&t=fUo7MQx7BMzqBTo3-0',
		},
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story showcasing the default variant
export const Default: Story = {
	render: (args) => <Button {...args} />,
};

// Story-specific variants
export const Destructive: Story = {
	args: {
		variant: 'destructive',
	},
	render: (args) => <Button {...args} />,
};

export const Outline: Story = {
	args: {
		variant: 'outline',
	},
	render: (args) => <Button {...args} />,
};

export const Sizes: Story = {
	render: (args) => (
		<div className="flex items-center gap-4">
			<Button {...args} size="sm">
				Small
			</Button>
			<Button {...args} size="default">
				Default
			</Button>
			<Button {...args} size="lg">
				Large
			</Button>
			<Button {...args} size="icon">
				⚡
			</Button>
		</div>
	),
};
