import { chakra } from '@chakra-ui/system';

export const StyledWrapper = chakra('div', {
	baseStyle: { position: 'fixed', bottom: 0, right: 6, boxShadow: 'lg', display: 'flex', flexDirection: 'column' },
});

export const StyledMessagesList = chakra('div', {
	baseStyle: { bg: 'gray.50', p: 2, minH: 0, overflow: 'auto' },
});

export const StyledActions = chakra('div', {
	baseStyle: { bg: 'white', display: 'flex', p: 2 },
});

export const StyledMessage = chakra('div', {
	baseStyle: { bg: 'white', p: 2, border: `1px solid`, borderColor: 'gray.200', whiteSpace: 'pre', borderRadius: 'xl' },
});
