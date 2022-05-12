const filterUpdated = <T extends {}>(initialValue: T, currentValue: T) =>
	Object.fromEntries(
		Object.entries(currentValue).filter(
			([key, value]) => initialValue[key as keyof T] != value
		)
	) as Partial<T>

export default filterUpdated
