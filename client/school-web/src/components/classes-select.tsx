import { Center, Loader, MultiSelect, MultiSelectProps, Text } from '@mantine/core'
import React, { useContext } from 'react'
import { schoolContext } from '../data/school-provider'
import { trpc } from '../utils/trpc'

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
		const { id: schoolId } = useContext(schoolContext)
		const { data, isLoading, isError } = trpc.useQuery([
			'school.classes.all.get',
			{ schoolId },
		])

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
