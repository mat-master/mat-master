const getInitials = (user: { firstName: string; lastName: string }) =>
	`${user.firstName[0]}${user.lastName[0]}`.toUpperCase()

export default getInitials
