import type { MembershipInterval, SchoolMembershipsPostBody } from '@common/types'
import { validator } from '@common/util'
import { yupResolver } from '@hookform/resolvers/yup'
import { Grid, InputWrapper, NumberInput, Select, TextInput } from '@mantine/core'
import type React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { CurrencyDollar as PriceIcon } from 'tabler-icons-react'
import { createMembership, getMembership } from '../data/memberships'
import ClassesSelect from './classes-select'
import Form, { FormProps } from './form'

export type MembershipFormProps = FormProps & {
	id?: string
}

const INTERVALS: MembershipInterval[] = ['day', 'week', 'month', 'year']

const MembershipForm: React.FC<MembershipFormProps> = ({
	id,
	onSubmit,
	...props
}) => {
	const form = useForm<SchoolMembershipsPostBody>({
		defaultValues: { interval: 'month', intervalCount: 1 },
		resolver: yupResolver(validator.api.schoolMembershipsPostSchema),
	})

	const queryKey = ['memberships', { id }] as const
	const { isLoading } = useQuery(queryKey, () => getMembership(id!), {
		enabled: !!id,
		onSuccess: form.reset,
	})

	const queryClient = useQueryClient()
	const { mutateAsync } = useMutation(
		queryKey,
		(values: SchoolMembershipsPostBody) => {
			if (!id) return createMembership(values)
			throw 'Unimplemented'
		},
		{ onSuccess: () => queryClient.invalidateQueries(queryKey[0]) }
	)

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) =>
		form.handleSubmit(async (values) => {
			await mutateAsync(values)
			onSubmit && (await onSubmit(e))
		})(e)

	return (
		<Form loading={isLoading} {...props} onSubmit={handleSubmit}>
			<TextInput
				label='Name'
				error={form.formState.errors.name?.message}
				{...form.register('name')}
			/>
			<Controller
				name='classes'
				control={form.control}
				render={({ field, fieldState }) => (
					<ClassesSelect
						{...field}
						label='Classes'
						error={fieldState.error?.message}
						value={field.value?.map((id) => id.toString())}
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
			<InputWrapper label='Billing Interval'>
				<Grid columns={4} grow>
					<Grid.Col span={1}>
						<Controller
							name='intervalCount'
							control={form.control}
							render={({ field }) => <NumberInput {...field} hideControls />}
						/>
					</Grid.Col>
					<Grid.Col span={3}>
						<Controller
							name='interval'
							control={form.control}
							render={({ field }) => <Select data={INTERVALS} {...field} />}
						/>
					</Grid.Col>
				</Grid>
			</InputWrapper>
		</Form>
	)
}

export default MembershipForm
