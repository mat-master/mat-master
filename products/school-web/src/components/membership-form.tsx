import type { SchoolMembershipsPostBody } from '@common/types'
import { validator } from '@common/util'
import { yupResolver } from '@hookform/resolvers/yup'
import { NumberInput, TextInput } from '@mantine/core'
import type React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import { CurrencyDollar as PriceIcon } from 'tabler-icons-react'
import { createMembership, getMembership } from '../data/memberships'
import ClassesSelect from './classes-select'
import Form, { FormProps } from './form'

export type MembershipFormProps = FormProps & {
	id?: string
}

const MembershipForm: React.FC<MembershipFormProps> = ({
	id,
	onSubmit,
	...props
}) => {
	const form = useForm<SchoolMembershipsPostBody>({
		defaultValues: { interval: 'month', intervalCount: 1 },
		resolver: yupResolver(validator.api.schoolMembershipsPostSchema),
	})

	const { isLoading } = useQuery(['memberships', id], () => getMembership(id!), {
		enabled: !!id,
		onSuccess: form.reset,
	})

	const { mutateAsync } = useMutation(
		['memberships', id],
		(values: SchoolMembershipsPostBody) => {
			if (!id) return createMembership(values)
			throw 'Unimplemented'
		}
	)

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
		await form.handleSubmit((values) => mutateAsync(values))(e)
		onSubmit && onSubmit(e)
	}

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
		</Form>
	)
}

export default MembershipForm
