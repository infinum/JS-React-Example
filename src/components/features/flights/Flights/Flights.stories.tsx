import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Flights } from './Flights';

export default {
	title: 'UI/features/Flights',
	component: Flights,
} as ComponentMeta<typeof Flights>;

const Template: ComponentStory<typeof Flights> = (args) => <Flights {...args} />;

export const Basic = Template.bind({});
Basic.args = {
	/* the args you need here will depend on your component */
};
