const validateEmail = (email: unknown) => {
	if (typeof email !== 'string') return false
	return /^\S+@\S+\.\S+$/.test(email)
}

export default validateEmail
