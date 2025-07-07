import '@testing-library/jest-dom';

const useRouter = jest.spyOn(require('next/router'), 'useRouter');

const locale = 'en';

useRouter.mockImplementationOnce(() => ({
	query: { locale: locale },
}));
