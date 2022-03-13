import { yupResolver } from '@hookform/resolvers/yup'
import {
	Group,
	LoadingOverlay,
	Modal,
	ModalProps,
	MultiSelect,
	NumberInput,
	TextInput,
	Title,
} from '@mantine/core'
import { useNotifications } from '@mantine/notifications'
import type React from 'react'
import { useContext, useEffect } from 'react'
import { DollarSign } from 'react-feather'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import classesContext from '../data/classes-context'
import type { Membership } from '../data/memberships-context'
import membershipsContext from '../data/memberships-context'
import type { ResourceData } from '../data/resource-provider'
import usePromise from '../hooks/use-promise'
import setRemoteResource from '../utils/set-remote-resource'
import ModalActions from './modal-actions'

type MembershipData = ResourceData<Membership>

const membershipDataSchema: yup.SchemaOf<MembershipData> = yup.object({
	name: yup.string().required(),
	classes: yup.array().of(yup.string().required()).required(),
	price: yup.number().min(0).required(),
})

const defaultMembershipData: MembershipData = {
	name: '',
	classes: [],
	price: 0,
}

const MembershipEditModal: React.FC<ModalProps & { membershipId?: string }> = ({
	membershipId,
	...props
}) => {
	const membershipsSrc = useContext(membershipsContext)
	const classesSrc = useContext(classesContext)
	const notifications = useNotifications()

	const form = useForm<MembershipData>({
		defaultValues: defaultMembershipData,
		resolver: yupResolver(membershipDataSchema),
	})

	const handleSubmit = (values: MembershipData) => {
		props.onClose()
		setRemoteResource(membershipsSrc, {
			id: membershipId,
			data: values,
			resourceLabel: values.name,
			notifications,
		})
	}

	useEffect(() => {
		!props.opened && form.reset(defaultMembershipData)
	}, [props.opened])

	const { loading: classesLoading, value: classOptions } = usePromise(async () => {
		const summaries = await classesSrc.getSummaries()
		return summaries.map(({ id, name }) => ({ value: id, label: name }))
	}, [classesSrc.summaries])

	const { loading: membershipLoading, value: membership } = usePromise(async () => {
		if (!membershipId) return
		const membership = await membershipsSrc.get(membershipId)
		form.reset(membership)
		return membership
	}, [membershipId])

	return (
		<Modal title={<Title order={3}>{membership?.name ?? 'New Membership'}</Title>} {...props}>
			<LoadingOverlay visible={classesLoading || membershipLoading} radius='sm' />

			<form onSubmit={form.handleSubmit(handleSubmit)}>
				<Group direction='column' spacing='sm' grow>
					<TextInput
						label='Name'
						error={form.formState.errors.name?.message}
						{...form.register('name')}
					/>
					<Controller
						name='classes'
						control={form.control}
						render={({ field, fieldState }) => (
							<MultiSelect
								label='Classes'
								data={classOptions ?? []}
								error={fieldState.error?.message}
								{...field}
							/>
						)}
					/>
					<Controller
						name='price'
						control={form.control}
						render={({ field, fieldState }) => (
							<NumberInput
								label='Price'
								icon={<DollarSign size={16} />}
								error={fieldState.error?.message}
								hideControls
								{...field}
							/>
						)}
					/>
				</Group>

				<ModalActions
					primaryLabel='Save'
					secondaryAction={props.onClose}
					secondaryLabel='Cancel'
				/>
			</form>
		</Modal>
	)
}

export default MembershipEditModal
