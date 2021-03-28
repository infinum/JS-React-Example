import { chakra } from '@chakra-ui/system';

export const StyledWrapper = chakra('div', {
	baseStyle: { position: 'fixed', bottom: 0, right: 6, boxShadow: 'lg', display: 'flex', flexDirection: 'column' },
});

export const StyledMessagesList = chakra('div', {
	baseStyle: { bg: 'gray.50' },
});

export const StyledActions = chakra('div', {
	baseStyle: { bg: 'white', display: 'flex', p: 2 },
});
