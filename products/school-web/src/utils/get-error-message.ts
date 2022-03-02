const getErrorMessage = (error: unknown) =>
	error instanceof Error
		? error.message
		: typeof error === 'string'
		? error
		: 'An unknown error occurred';

export default getErrorMessage;
