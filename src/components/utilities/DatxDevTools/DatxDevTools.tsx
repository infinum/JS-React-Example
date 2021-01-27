import { Button, chakra, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { cache } from 'swr';

const Wrapper = chakra('div', {
	baseStyle: {
		position: 'absolute',
		top: 2,
		right: 2,
		bg: 'white',
		border: 'solid',
		minW: 100,
		minH: 100,
	},
});

export const DatxDevTools = () => {
	const [data, setData] = useState(() => cache.keys());

	useEffect(() => {
		console.log(cache, data);
		const unsubscribe = cache.subscribe(() => {
			setData(cache.keys());
		});

		return () => {
			unsubscribe();
		};
	}, [data]);

	return (
		<Wrapper>
			<VStack>
				{data.map((key) => (
					<Button key={key}>{key}</Button>
				))}
			</VStack>{' '}
		</Wrapper>
	);
};
