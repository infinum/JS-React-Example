import React, { FC } from 'react';
import { Box, Button, Heading, HTMLChakraProps, Spacer, Text, ThemingProps } from '@chakra-ui/react';
import { Card } from '@atoms/Card/Card';

interface IBannerProps extends HTMLChakraProps<'div'>, ThemingProps {
	title?: string;
	description?: string;
	actionLabel?: string;
	onActionClick(): void;
}

export const Banner: FC<IBannerProps> = ({ title, description, actionLabel, onActionClick, ...rest }) => {
	return (
		<Card display="flex" alignItems="center" {...rest}>
			<Box p="2">
				<Heading size="md">{title}</Heading>
				<Text color="gray.500">{description}</Text>
			</Box>
			<Spacer />
			<Box>
				<Button colorScheme="blue" variant="outline" mr="2" onClick={onActionClick}>
					{actionLabel}
				</Button>
			</Box>
		</Card>
	);
};
