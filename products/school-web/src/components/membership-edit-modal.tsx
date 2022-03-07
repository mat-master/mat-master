import {
	Group,
	LoadingOverlay,
	Modal,
	MultiSelect,
	NumberInput,
	Select,
	TextInput,
	Title,
} from '@mantine/core'
import { useNotifications } from '@mantine/notifications'
import { useFormik } from 'formik'
import type React from 'react'
import { useContext } from 'react'
import { DollarSign } from 'react-feather'
import * as yup from 'yup'
import classesContext from '../data/classes-context'
import type { Membership } from '../data/memberships-context'
import membershipsContext from '../data/memberships-context'
import type { ResourceData } from '../data/resource-provider'
import usePromise from '../hooks/use-promise'
import setRemoteResource from '../utils/set-remote-resource'
import ModalActions from './modal-actions'

export interface MembershipEditModalProps {
	open: boolean
	onClose: VoidFunction
	membershipId?: string
}

type MembershipData = ResourceData<Membership>

const membershipSchema: yup.SchemaOf<MembershipData> = yup.object({
	name: yup.string().required('Required'),
	classes: yup
		.array()
		.of(yup.string().required('Required'))
		.min(1, 'You must select at least one class')
		.required('Required'),
	price: yup.number().min(0).required('Required'),
})

const MembershipEditModal: React.FC<MembershipEditModalProps> = ({
	open,
	onClose,
	membershipId,
}) => {
	const membershipsSrc = useContext(membershipsContext)
	const classesSrc = useContext(classesContext)
	const notifications = useNotifications()

	const form = useFormik<MembershipData>({
		initialValues: { name: '', classes: [], price: 0 },
		validateOnBlur: false,
		validateOnChange: false,
		validationSchema: membershipSchema,
		onSubmit: async (values) => {
			onClose()
			form.resetForm()
			setRemoteResource(membershipsSrc, {
				id: membershipId,
				data: values,
				resourceLabel: values.name,
				notifications,
			})
		},
	})

	const { loading: classesLoading, value: classOptions } = usePromise(async () => {
		const summaries = await classesSrc.getSummaries()
		return summaries.map(({ id, name }) => ({ value: id, label: name }))
	}, [classesSrc.summaries])

	const { loading: membershipLoading, value: membership } = usePromise(async () => {
		if (!membershipId) return form.resetForm()
		const membership = await membershipsSrc.get(membershipId)
		form.setValues(membership)
		return membership
	}, [membershipId])

	return (
		<Modal
			opened={open}
			onClose={onClose}
			title={<Title order={3}>{membership?.name ?? 'New Membership'}</Title>}
		>
			<LoadingOverlay visible={classesLoading || membershipLoading} radius='sm' />

			<form onSubmit={form.handleSubmit}>
				<Group direction='column' spacing='sm' grow>
					<TextInput
						id='name'
						label='Name'
						value={form.values.name}
						onChange={form.handleChange}
						onBlur={form.handleBlur}
						error={form.errors.name}
					/>
					<MultiSelect
						id='classes'
						label='Classes'
						value={form.values.classes}
						data={classOptions ?? []}
						onChange={(value) => form.setFieldValue('classes', value)}
						onBlur={form.handleBlur}
						error={form.errors.classes}
					/>
					<NumberInput
						id='price'
						label='Price'
						value={form.values.price}
						onChange={(value) => form.setFieldValue('price', value)}
						onBlur={form.handleBlur}
						error={form.errors.price}
						icon={<DollarSign size={16} />}
						hideControls
					/>
					<Select
						id='billingPeriod'
						label='Billing Period'
						data={['Every Two Weeks', 'Monthly']}
					/>
				</Group>

				<ModalActions primaryLabel='Save' secondaryAction={onClose} secondaryLabel='Cancel' />
			</form>
		</Modal>
	)
}

export default MembershipEditModal
