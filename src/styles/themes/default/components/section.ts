const variants = {
	normal: {
		bg: 'transparent',
	},
	dimmed: {
		bg: 'gray.50',
		borderTop: '1px solid',
		borderTopColor: 'gray.200',
		borderBottom: '1px solid',
		borderBottomColor: 'gray.200',
	},
};

const defaultProps = {
	variant: 'normal',
};

export default {
	variants,
	defaultProps,
};
