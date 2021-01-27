import {
	VStack,
	Heading,
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionIcon,
	AccordionPanel,
	Text,
	Icon,
} from '@chakra-ui/react';
import { useEffect, useState, memo } from 'react';
import { GrMultiple, GrCheckbox } from 'react-icons/gr';
import { config } from '@datx/jsonapi';
import { cache } from 'swr';
import { CacheKeyWrapper, Wrapper } from './elements';
import { isDataKey } from './utils';

if (typeof window !== 'undefined') {
	window['__SWR_CACHE__'] = cache;
}

interface ICacheKeyProps {
	cacheKey?: string;
}

const CacheKey = memo<ICacheKeyProps>(({ cacheKey }) => {
	const query = cacheKey.replace(config.baseUrl, '');
	const [resource, params] = query.split('?');
	const isMany = !resource.includes('/');
	const response = cache.get(cacheKey);

	console.log(response.data[0]);

	return (
		<CacheKeyWrapper>
			<Text>
				<Icon as={isMany ? GrMultiple : GrCheckbox} display="inline-block" mr={2} />
				{resource}
			</Text>
			<Text>{params}</Text>
		</CacheKeyWrapper>
	);
});

export const DatxDevTools = () => {
	const [keys, setKeys] = useState(() => cache.keys().filter(isDataKey));

	useEffect(() => {
		const unsubscribe = cache.subscribe(() => {
			setKeys(cache.keys().filter(isDataKey));
		});

		return () => {
			unsubscribe();
		};
	}, []);

	return (
		<Wrapper>
			<Accordion allowMultiple allowToggle defaultIndex={0} size="xs">
				<AccordionItem border="0">
					<AccordionButton>
						<Heading as="div" size="sm" flex="1" textAlign="left">
							Cache
						</Heading>
						<AccordionIcon />
					</AccordionButton>
					<AccordionPanel>
						<VStack align="stretch" spacing={1}>
							{keys.map((key) => (
								<CacheKey key={key} cacheKey={key} />
							))}
						</VStack>
					</AccordionPanel>
				</AccordionItem>
			</Accordion>
		</Wrapper>
	);
};
