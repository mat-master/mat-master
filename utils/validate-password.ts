const validatePassword = (password: unknown) => {
	if (typeof password !== 'string') return 'must be a string';
	if (password.length < 8) return 'must be longer than 8 characters';
	if (!/\d/g.test(password)) return 'must contain at least one number';
	if (!/[A-Z]/g.test(password)) return 'must contain at least one cpital letter';
	if (!/[!"#$%&'()*+,\-./:;<=>?@[\\\]\^_`{|}~]/g.test(password))
		return 'must contain at least one special character';
};

export default validatePassword;
