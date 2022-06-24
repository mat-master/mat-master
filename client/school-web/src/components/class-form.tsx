import { ActionIcon, Group, InputWrapper, Text, TextInput } from '@mantine/core'
import { Snowflake } from '@mat-master/api'
import { classTimeSchema } from '@mat-master/common'
import type React from 'react'
import { useContext } from 'react'
import { Controller } from 'react-hook-form'
import {
	CircleMinus as RemoveIcon,
	CirclePlus as AddIcon,
} from 'tabler-icons-react'
import { z } from 'zod'
import { getEnglishSchedule } from '../utils/get-english-schedule'
import getSchoolId from '../utils/get-school-id'
import ClassTimeForm from './class-time-form'
import Form, { FormWrapperProps } from './form'
import { modalsCtx } from './modals-context'
import RemoteForm, { RemoteFormWrapperProps } from './remote-form'

const classFormDataSchema = z.object({
	name: z.string().min(1, 'required'),
	schedule: classTimeSchema.omit({ id: true, classId: true }).array(),
})

export type ClassFormData = z.infer<typeof classFormDataSchema>
export type ClassFormProps = FormWrapperProps<ClassFormData>

export const ClassForm: React.FC<ClassFormProps> = (props) => (
	<Form<ClassFormData>
		{...props}
		schema={classFormDataSchema}
		defaultValues={{
			schedule: [],
		}}
		child={({ form }) => {
			const { errors } = form.formState
			const modals = useContext(modalsCtx)

			return (
				<>
					<TextInput
						label='Name'
						{...form.register('name')}
						error={errors.name?.message}
					/>

					<InputWrapper label='Class Times'>
						<Controller
							control={form.control}
							name='schedule'
							render={({ field }) => {
								return (
									<ul style={{ padding: 0, margin: 0, listStyleType: 'none' }}>
										{field.value.map((time, i) => (
											<li key={i}>
												<Group
													spacing='xs'
													style={{
														display: 'inline-flex',
														width: '100%',
													}}
												>
													<ActionIcon key='delete' variant='hover' color='red'>
														<RemoveIcon size={18} />
													</ActionIcon>
													<Text style={{ marginRight: 'auto' }}>
														{getEnglishSchedule(time)}
													</Text>
												</Group>
											</li>
										))}

										<li>
											<Group spacing='xs'>
												<ActionIcon
													variant='hover'
													onClick={() => {
														modals.push({
															title: 'New Class Time',
															children: (
																<ClassTimeForm
																	onSubmit={(value) => {
																		field.onChange([...field.value, value])
																		modals.pop()
																	}}
																/>
															),
														})
													}}
												>
													<AddIcon size={18} />
												</ActionIcon>
												<Text color='dimmed'>New Class Time</Text>
											</Group>
										</li>
									</ul>
								)
							}}
						/>
					</InputWrapper>
				</>
			)
		}}
	/>
)

export type RemoteClassFormProps = RemoteFormWrapperProps<ClassFormData> & {
	id?: Snowflake
}

export const RemoteClassForm: React.FC<RemoteClassFormProps> = ({
	id,
	...props
}) => {
	const schoolId = getSchoolId()!
	return (
		<RemoteForm<ClassFormData>
			{...props}
			queryKey={['classes', { id }]}
			// getResource={
			// 	id
			// 		? () => trpcClient.query('school.classes.get', { id, schoolId })
			// 		: undefined
			// }
			// createResource={
			// 	id
			// 		? undefined
			// 		: (data) =>
			// 				trpcClient.mutation('school.classes.create', { schoolId, ...data })
			// }
			// updateResource={
			// 	id
			// 		? (data) =>
			// 				trpcClient.mutation('school.classes.update', {
			// 					id,
			// 					schoolId,
			// 					...data,
			// 				})
			// 		: undefined
			// }
			child={ClassForm}
		/>
	)
}
