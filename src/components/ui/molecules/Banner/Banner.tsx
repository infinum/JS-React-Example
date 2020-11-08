import React, { FC } from 'react';
import { Box, Button, ChakraProps, Heading, Spacer, Text } from '@chakra-ui/core';
import { Card } from '@ui/atoms/Card/Card';

interface IBannerProps extends ChakraProps {
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
