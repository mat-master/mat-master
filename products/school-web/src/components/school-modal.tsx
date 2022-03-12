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
		defaultValues: {
			address: {
				city: 'Fountain Hills',
				state: 'AZ',
				line1: '15823 E Chicory Dr',
				postalCode: '85268',
			},
		},
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
						{...form.register('name')}
						error={form.formState.errors.name?.message}
					/>
				</Group>

				<ModalActions primaryLabel='Create' />
			</form>
		</Modal>
	)
}

export default SchoolModal
