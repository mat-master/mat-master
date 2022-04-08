import type { SchoolPostBody } from '@common/types'
import { validator } from '@common/util'
import { yupResolver } from '@hookform/resolvers/yup'
import { Group, Modal, ModalProps, TextInput, Title } from '@mantine/core'
import type React from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { createSchool } from '../data/schools'
import ModalActions from './modal-actions'

const SchoolModal: React.FC<ModalProps> = (props) => {
	const mutation = useMutation(createSchool)
	const form = useForm<SchoolPostBody>({
		resolver: yupResolver(validator.api.schoolPostSchema),
	})

	const handleSubmit = (data: SchoolPostBody) => {
		mutation.mutate(data)
		props.onClose()
	}

	return (
		<Modal title={<Title order={3}>New School</Title>} {...props}>
			<form onSubmit={form.handleSubmit(handleSubmit)}>
				<Group direction='column' grow>
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
				</Group>

				<ModalActions primaryLabel='Create' />
			</form>
		</Modal>
	)
}

export default SchoolModal
