import type { SchoolPostBody } from '@common/types'
import { validator } from '@common/util'
import { yupResolver } from '@hookform/resolvers/yup'
import { TextInput } from '@mantine/core'
import type React from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { createSchool } from '../data/schools'
import Form, { FormProps } from './form'

const SchoolForm: React.FC<FormProps> = ({ onSubmit, ...props }) => {
	const form = useForm<SchoolPostBody>({
		resolver: yupResolver(validator.api.schoolPostSchema),
	})

	const queryKey = 'schools'
	const queryClient = useQueryClient()
	const { mutateAsync } = useMutation(queryKey, createSchool, {
		onSuccess: () => queryClient.invalidateQueries(queryKey),
	})

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) =>
		form.handleSubmit(async (values) => {
			await mutateAsync(values)
			onSubmit && (await onSubmit(e))
		})(e)

	return (
		<Form {...props} onSubmit={handleSubmit}>
			<TextInput
				label='Name'
				error={form.formState.errors.name?.message}
				{...form.register('name')}
			/>
			<TextInput
				label='City'
				error={form.formState.errors.address?.city?.message}
				{...form.register('address.city')}
			/>
			<TextInput
				label='State'
				error={form.formState.errors.address?.state?.message}
				{...form.register('address.state')}
			/>
			<TextInput
				label='Line 1'
				error={form.formState.errors.address?.line1?.message}
				{...form.register('address.line1')}
			/>
			<TextInput
				label='Line 2'
				error={form.formState.errors.address?.line2?.message}
				{...form.register('address.line2')}
			/>
			<TextInput
				label='Postal Code'
				error={form.formState.errors.address?.postalCode?.message}
				{...form.register('address.postalCode')}
			/>
		</Form>
	)
}

export default SchoolForm