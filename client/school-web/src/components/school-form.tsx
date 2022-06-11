import { TextInput } from '@mantine/core'
import type React from 'react'
import { z } from 'zod'
import { trpcClient } from '..'
import Form, { FormWrapperProps } from './form'
import type { RemoteFormWrapperProps } from './remote-form'
import RemoteForm from './remote-form'

export const schoolFormDataSchema = z.object({
	name: z.string(),
	address: z.object({
		city: z.string(),
		state: z.string().length(2),
		line1: z.string(),
		line2: z.string(),
		postalCode: z.string().length(5),
	}),
})

export type SchoolFormData = z.infer<typeof schoolFormDataSchema>
export type SchoolFormProps = FormWrapperProps<SchoolFormData>

export const SchoolForm: React.FC<SchoolFormProps> = (props) => (
	<Form<SchoolFormData>
		{...props}
		schema={schoolFormDataSchema}
		child={({ form }) => {
			return (
				<>
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
				</>
			)
		}}
	/>
)

export type RemoteSchoolFormProps = RemoteFormWrapperProps<SchoolFormData>

export const RemoteSchoolForm: React.FC<RemoteSchoolFormProps> = (props) => (
	<RemoteForm<SchoolFormData>
		{...props}
		queryKey={['schools', { id: 'new' }]}
		createResource={(data) => trpcClient.mutation('school.create', data)}
		child={SchoolForm}
	/>
)
