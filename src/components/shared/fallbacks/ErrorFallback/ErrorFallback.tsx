import { BugsnagErrorBoundary } from '@bugsnag/plugin-react';
import { Button, Center, Text, VStack } from '@chakra-ui/react';
import { ComponentType, FC, Validator } from 'react';

export type ErrorFallbackProps = BugsnagErrorBoundary['propTypes']['FallbackComponent'] extends Validator<
	ComponentType<infer T>
>
	? T
	: never;

export const ErrorFallback: FC<ErrorFallbackProps> = ({ error, clearError }) => {
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
