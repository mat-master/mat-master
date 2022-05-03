import type { MembershipInterval, SchoolMembershipsPostBody } from '@common/types'
import { validator } from '@common/util'
import { yupResolver } from '@hookform/resolvers/yup'
import {
	Center,
	Grid,
	InputWrapper,
	Loader,
	NumberInput,
	Select,
	Text,
	TextInput,
} from '@mantine/core'
import type React from 'react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { CurrencyDollar as PriceIcon } from 'tabler-icons-react'
import { createMembership, getMembership } from '../data/memberships'
import getErrorMessage from '../utils/get-error-message'
import ClassesSelect from './classes-select'
import type { FormProps } from './form'
import Form from './form'

export type MembershipFormProps = Omit<FormProps, 'onSubmit'> & {
	defaultValues?: SchoolMembershipsPostBody
	onSubmit?: (
		e: React.FormEvent<HTMLFormElement>,
		values: SchoolMembershipsPostBody
	) => void
}

const INTERVALS: MembershipInterval[] = ['day', 'week', 'month', 'year']

export const MembershipForm: React.FC<MembershipFormProps> = ({
	defaultValues,
	onSubmit,
	...props
}) => {
	const form = useForm<SchoolMembershipsPostBody>({
		mode: 'onBlur',
		resolver: yupResolver(validator.api.schoolMembershipsPostSchema),
		defaultValues: {
			name: '',
			classes: [],
			...defaultValues,
		},
	})

	const { isDirty, isValid } = form.formState
	const [globalError, setGlobalError] = useState<string>()

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) =>
		form.handleSubmit(
			async (values) => onSubmit && (await onSubmit(e, values)),
			(error) => setGlobalError(getErrorMessage(error))
		)(e)

	return (
		<Form
			canSubmit={isDirty && isValid}
			error={globalError}
			{...props}
			onSubmit={handleSubmit}
		>
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
						min={0}
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
							render={({ field }) => <NumberInput min={0} {...field} />}
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

export type RemoteMembershipFormProps = FormProps & {
	id?: string
}

export const RemoteMembershipForm: React.FC<RemoteMembershipFormProps> = ({
	id,
	onSubmit,
	...props
}) => {
	const queryKey = ['memberships', { id }] as const
	const { data, isLoading, isError, error } = useQuery(
		queryKey,
		() => getMembership(id!),
		{ enabled: !!id }
	)

	const queryClient = useQueryClient()
	const { mutateAsync } = useMutation(
		queryKey,
		(values: SchoolMembershipsPostBody) => {
			if (!id) return createMembership(values)
			throw 'Unimplemented'
		},
		{ onSuccess: () => queryClient.invalidateQueries(queryKey[0]) }
	)

	if (isLoading || isError) {
		return (
			<Center>
				{isLoading && <Loader />}
				{isError && <Text color='red'>{getErrorMessage(error)}</Text>}
			</Center>
		)
	}

	return (
		<MembershipForm
			{...props}
			// TODO: add default values
			onSubmit={async (e, values) => {
				await mutateAsync(values)
				onSubmit && (await onSubmit(e))
			}}
		/>
	)
}
