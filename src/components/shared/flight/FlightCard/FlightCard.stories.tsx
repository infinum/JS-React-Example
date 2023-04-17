import { ComponentMeta, ComponentStory } from '@storybook/react';

import { FlightCard, FlightCardFallback } from './FlightCard';
import { flightFactory } from '__mocks__/factories';

export default {
	title: 'UI/shared/flight/FlightCard',
	component: FlightCard,
} as ComponentMeta<typeof FlightCard>;

const Template: ComponentStory<typeof FlightCard> = (args) => <FlightCard {...args} />;

export const Basic = Template.bind({});
Basic.args = {
	flight: flightFactory(),
};
