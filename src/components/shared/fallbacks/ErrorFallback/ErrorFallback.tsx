import { Button, Center, Text, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';

export interface IErrorFallbackProps {
	error: Error;
	info: React.ErrorInfo;
	clearError: () => void;
}

export const ErrorFallback: FC<IErrorFallbackProps> = ({ error, clearError }) => {
	return (
		<Center h="full">
			<VStack>
				<Text w={{ base: '100%', md: '80%' }} textAlign="center">
					Something went wrong! Please try again.
				</Text>

				<Text w={{ base: '100%', md: '80%' }} textAlign="center" fontStyle="italic">
					{error.message}
				</Text>

				<Button h="40px" onClick={clearError}>
					Retry
				</Button>
			</VStack>
		</Center>
	);
};
