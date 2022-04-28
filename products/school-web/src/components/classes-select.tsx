import { Center, Loader, MultiSelect, MultiSelectProps, Text } from '@mantine/core'
import React from 'react'
import { useQuery } from 'react-query'
import { getClasses } from '../data/classes'

export type ClassesSelectProps = Omit<MultiSelectProps, 'data'>

const loadingItem = React.forwardRef<HTMLDivElement>((_, ref) => (
	<Center ref={ref} style={{ padding: '12px 0' }}>
		<Loader />
	</Center>
))

const errorItem = React.forwardRef<HTMLDivElement>((_, ref) => (
	<div ref={ref} style={{ padding: '12px 0' }}>
		<Text color='red' align='center'>
			Something went wrong getting your classes
		</Text>
	</div>
))

const ClassesSelect = React.forwardRef<HTMLInputElement, ClassesSelectProps>(
	(props, ref) => {
		const { data, isLoading, isError } = useQuery('classes', getClasses)
		const options = data?.map(({ id, name }) => ({
			value: id.toString(),
			label: name,
		}))

		return (
			<MultiSelect
				ref={ref}
				{...props}
				data={options ?? ['state placeholder']}
				itemComponent={isLoading ? loadingItem : isError ? errorItem : undefined}
			/>
		)
	}
)

export default ClassesSelect
