export const privateErrors = async <T>(fn: () => Promise<T>) => {
	try {
		return await fn()
	} catch (error) {
		console.log(`internal server error: ${error}`)
		throw 'An unknown error ocurred'
	}
}