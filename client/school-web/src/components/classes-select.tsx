import { Center, Loader, MultiSelect, MultiSelectProps, Text } from '@mantine/core'
import React, { useContext } from 'react'
import getSchoolId from '../utils/get-school-id'
import { trpc } from '../utils/trpc'
import { RemoteClassForm } from './class-form'
import { modalsCtx } from './modals-context'

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
		const modals = useContext(modalsCtx)
		const schoolId = getSchoolId()!
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
				searchable
				creatable={true}
				getCreateLabel={(query) => `+ Create ${query ?? 'new class'}`}
				onCreate={(query) =>
					modals.push({
						title: 'New Class',
						children: <RemoteClassForm />,
					})
				}
			/>
		)
	}
)

export default ClassesSelect
