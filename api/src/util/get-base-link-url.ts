export const getBaseLinkUrl = () =>
	process.env.ENV === 'DEV'
		? 'http://localhost:3000'
		: 'https://dashboard.matmaster.app'
