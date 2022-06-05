const getErrorMessage = (error: unknown) => {
	if (typeof error === 'string') return error
	if (typeof error === 'object' && typeof (error as any)?.message === 'string')
		return (error as any).message
	return 'An unknown error ocurred'
}

export default getErrorMessage
