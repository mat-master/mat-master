import type { SchoolMembershipsPostBody } from '@common/types'
import { validator } from '@common/util'
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
import { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { CurrencyDollar as PriceIcon } from 'tabler-icons-react'
import { getClasses } from '../data/classes'
import { createMembership, getMemberships } from '../data/memberships'

const MembershipEditModal: React.FC<ModalProps & { membershipId?: string }> = ({
	membershipId,
	...props
}) => {
	const queryClient = useQueryClient()
	const { mutateAsync } = useMutation((data: SchoolMembershipsPostBody) => {
		queryClient.invalidateQueries('memberships')
		if (membershipId) throw 'Unimplemented'
		return createMembership({ ...data, interval: 'month', intervalCount: 1 })
	})

	const form = useForm<SchoolMembershipsPostBody>({
		resolver: yupResolver(validator.api.schoolMembershipsPostSchema),
	})

	const handleClose = () => {
		props.onClose()
		form.reset()
		form.clearErrors()
	}

	const handleSubmit = async (values: SchoolMembershipsPostBody) => {
		await mutateAsync(values)
		handleClose()
	}

	const { data: memberships, isLoading: membershipLoading } = useQuery(
		'memberships',
		getMemberships,
		{ enabled: !!membershipId }
	)
	const membership = useMemo(() => {
		const membership = memberships?.find(({ id }) => id === membershipId)
		if (membership)
			form.reset({ ...membership, classes: membership.classes.map(({ id }) => id.toString()) })
		return membership
	}, [memberships, membershipId])

	const { data: classes, isLoading: classesLoading } = useQuery('classes', getClasses)
	const classOptions = useMemo(
		() => classes?.map(({ id, name }) => ({ value: id.toString(), label: name })) ?? [],
		[classes]
	)

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
								value={field.value.map((snowflake) => snowflake.toString())}
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
						<Button type='submit' loading={form.formState.isSubmitting}>
							{membershipId ? 'Save' : 'Create'}
						</Button>
					</Group>
				</Group>
			</form>
		</Modal>
	)
}

export default MembershipEditModal
