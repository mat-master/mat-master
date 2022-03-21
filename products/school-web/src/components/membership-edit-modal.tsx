import { yupResolver } from '@hookform/resolvers/yup'
import {
	Button,
	Group,
	LoadingOverlay,
	Modal,
	ModalProps,
	MultiSelect,
	NumberInput,
	TextInput,
	Title,
} from '@mantine/core'
import type React from 'react'
import { useContext, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { CurrencyDollar as PriceIcon } from 'tabler-icons-react'
import * as yup from 'yup'
import { getClasses } from '../data/classes'
import { createMembership } from '../data/memberships'
import type { Membership } from '../data/memberships-context'
import membershipsContext from '../data/memberships-context'
import type { ResourceData } from '../data/resource-provider'
import usePromise from '../hooks/use-promise'

type MembershipData = ResourceData<Membership>

const membershipDataSchema: yup.SchemaOf<MembershipData> = yup.object({
	name: yup.string().required(),
	classes: yup.array().of(yup.string().required()).required(),
	price: yup.number().min(0).required(),
})

const MembershipEditModal: React.FC<ModalProps & { membershipId?: string }> = ({
	membershipId,
	...props
}) => {
	const membershipsSrc = useContext(membershipsContext)
	const queryClient = useQueryClient()
	const { mutateAsync, isLoading: mutationWorking } = useMutation((data: MembershipData) => {
		queryClient.invalidateQueries('memberships')
		if (membershipId) throw 'Unimplemented'
		return createMembership({ ...data, interval: 'month', intervalCount: 1 })
	})

	const form = useForm<MembershipData>({ resolver: yupResolver(membershipDataSchema) })

	const handleClose = () => {
		props.onClose()
		form.reset()
		form.clearErrors()
	}

	const handleSubmit = async (values: MembershipData) => {
		await mutateAsync(values)
		handleClose()
	}

	const { data: classes, isLoading: classesLoading } = useQuery('classes', getClasses)
	const classOptions = useMemo(
		() => classes?.map(({ id, name }) => ({ value: id.toString(), label: name })) ?? [],
		[classes]
	)

	const { loading: membershipLoading, value: membership } = usePromise(async () => {
		if (!membershipId) return
		const membership = await membershipsSrc.get(membershipId)
		form.reset(membership)
		return membership
	}, [membershipId])

	return (
		<Modal
			title={<Title order={3}>{membership?.name ?? 'New Membership'}</Title>}
			{...props}
			onClose={handleClose}
		>
			<LoadingOverlay visible={membershipLoading || classesLoading} radius='sm' />

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
								icon={<PriceIcon size={16} />}
								error={fieldState.error?.message}
								hideControls
								{...field}
							/>
						)}
					/>
					<Group position='right'>
						<Button type='submit' loading={mutationWorking}>
							{membershipId ? 'Save' : 'Create'}
						</Button>
					</Group>
				</Group>
			</form>
		</Modal>
	)
}

export default MembershipEditModal
