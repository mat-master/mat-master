import type { MembershipInterval, SchoolMembershipsPostBody } from '@common/types'
import { validator } from '@common/util'
import { Grid, InputWrapper, NumberInput, Select, TextInput } from '@mantine/core'
import type React from 'react'
import { Controller } from 'react-hook-form'
import { CurrencyDollar as PriceIcon } from 'tabler-icons-react'
import { createMembership, getMembership } from '../data/memberships'
import ClassesSelect from './classes-select'
import type { FormWrapperProps } from './form'
import Form from './form'
import type { RemoteFormWrapperProps } from './remote-form'
import RemoteForm from './remote-form'

export type MembershipFormProps = FormWrapperProps<SchoolMembershipsPostBody>

const INTERVALS: MembershipInterval[] = ['day', 'week', 'month', 'year']

export const MembershipForm: React.FC<MembershipFormProps> = (props) => (
	<Form<SchoolMembershipsPostBody>
		{...props}
		schema={validator.api.schoolMembershipsPostSchema}
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

export type RemoteMembershipFormProps =
	RemoteFormWrapperProps<SchoolMembershipsPostBody> & {
		id?: string
	}

export const RemoteMembershipForm: React.FC<RemoteMembershipFormProps> = ({
	id,
	...props
}) => (
	<RemoteForm<SchoolMembershipsPostBody>
		{...props}
		queryKey={['memberships', { id }]}
		getResource={id ? () => getMembership(id) : undefined}
		createResource={id ? undefined : createMembership}
		updateResource={id ? () => {} : undefined}
		child={MembershipForm}
	/>
)