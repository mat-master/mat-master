const validateEmail = (email: unknown) => {
	if (typeof email !== 'string') return 'must be a string';
	if (!/^\w+@\w+\.\w+$/.test(email)) return 'incorrectly formatted';
};

export default validateEmail;
