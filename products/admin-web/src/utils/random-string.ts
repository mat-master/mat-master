const randomString = (len: number) =>
	Math.random()
		.toString(36)
		.slice(2, len + 2);

export default randomString;
