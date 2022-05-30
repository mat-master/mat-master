import { useDebouncedValue } from '@mantine/hooks'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const useSearchTerm = (
	queryKey: string = 'search'
): [string, string, React.Dispatch<React.SetStateAction<string>>] => {
	const [value, setValue] = useState('')
	const [queryParams, setQueryParams] = useSearchParams()
	const [debouncedValue] = useDebouncedValue(value, 200)

	useEffect(() => setValue(queryParams.get(queryKey) ?? ''), [])
	useEffect(() => {
		value ? queryParams.set(queryKey, value) : queryParams.delete(queryKey)
		setQueryParams(queryParams)
	}, [debouncedValue])

	return [value, debouncedValue, setValue]
}

export default useSearchTerm
