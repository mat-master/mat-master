import { Grid, InputWrapper, NumberInput, Select, TextInput } from '@mantine/core'
import { createSchoolMembershipParamsSchema, Snowflake } from '@mat-master/api'
import type React from 'react'
import { useContext } from 'react'
import { Controller } from 'react-hook-form'
import { CurrencyDollar as PriceIcon } from 'tabler-icons-react'
import { z } from 'zod'
import { trpcClient } from '..'
import { schoolContext } from '../data/school-provider'
import ClassesSelect from './classes-select'
import type { FormWrapperProps } from './form'
import Form from './form'
import type { DeepPartial, RemoteFormWrapperProps } from './remote-form'
import RemoteForm from './remote-form'

export const membershipFormDataSchema = createSchoolMembershipParamsSchema.omit({
	schoolId: true,
})

export type MembershipFormData = z.infer<typeof membershipFormDataSchema>
export type MembershipFormProps = FormWrapperProps<MembershipFormData>

const INTERVALS = ['day', 'week', 'month', 'year']

export const MembershipForm: React.FC<MembershipFormProps> = (props) => (
	<Form<MembershipFormData>
		{...props}
		schema={membershipFormDataSchema}
		child={({ form }) => {
			const { errors } = form.formState

			return (
				<>
					<TextInput
						label='Name'
						error={errors.name?.message}
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
				</>
			)
		}}
	/>
)

export type RemoteMembershipFormProps = RemoteFormWrapperProps<MembershipFormData> & {
	id?: Snowflake
}

type x = DeepPartial<MembershipFormData>

export const RemoteMembershipForm: React.FC<RemoteMembershipFormProps> = ({
	id,
	...props
}) => {
	const { id: schoolId } = useContext(schoolContext)
	return (
		<RemoteForm<MembershipFormData>
			{...props}
			queryKey={['memberships', { id }]}
			getResource={
				id
					? () => trpcClient.query('school.memberships.get', { id, schoolId })
					: undefined
			}
			createResource={
				id
					? undefined
					: (data) =>
							trpcClient.mutation('school.memberships.create', {
								schoolId,
								...data,
							})
			}
			updateResource={
				id
					? (data) =>
							trpcClient.mutation('school.memberships.update', {
								id,
								schoolId,
								...data,
							})
					: undefined
			}
			child={MembershipForm}
		/>
	)
}
