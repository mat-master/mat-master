import type { SchoolPostBody } from '@common/types'
import { validator } from '@common/util'
import { TextInput } from '@mantine/core'
import type React from 'react'
import { createSchool } from '../data/schools'
import Form, { FormWrapperProps } from './form'
import type { RemoteFormWrapperProps } from './remote-form'
import RemoteForm from './remote-form'

export type SchoolFormProps = FormWrapperProps<SchoolPostBody>

export const SchoolForm: React.FC<SchoolFormProps> = (props) => (
	<Form
		{...props}
		schema={validator.api.schoolPostSchema}
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

export type RemoteSchoolFormProps = RemoteFormWrapperProps<SchoolPostBody>

const RemoteSchoolForm: React.FC<RemoteSchoolFormProps> = (props) => (
	<RemoteForm<SchoolPostBody>
		{...props}
		queryKey={['schools', { id: 'new' }]}
		createResource={createSchool}
		child={SchoolForm}
	/>
)

export default RemoteSchoolForm
