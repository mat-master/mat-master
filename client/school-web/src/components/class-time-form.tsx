import { Select, SimpleGrid } from '@mantine/core'
import { DatePicker, TimeInput } from '@mantine/dates'
import { classTimeSchema } from '@mat-master/common'
import React, { useState } from 'react'
import { Controller } from 'react-hook-form'
import { z } from 'zod'
import {
	ENGLISH_ORDINALS,
	ordinalSuffixed,
	WEEKDAYS,
} from '../utils/get-english-schedule'
import Form, { FormWrapperProps } from './form'

const classFormDataSchema = classTimeSchema.omit({ id: true, classId: true })

export type ClassTimeFormData = z.infer<typeof classFormDataSchema>
export type ClassTimeFormProps = FormWrapperProps<ClassTimeFormData>

const ClassTimeForm: React.FC<ClassTimeFormProps> = (props) => (
	<Form<ClassTimeFormData>
		{...props}
		schema={classFormDataSchema}
		defaultValues={{ scheduleStart: new Date(), duration: 3600 }}
		child={({ form }) => {
			const scheduleStart = form.watch('scheduleStart')
			const weekday = scheduleStart.getDay()
			const date = scheduleStart.getDate()
			const weekI = Math.floor(date / 7)

			const [endTime, setEndTime] = useState<Date>()

			return (
				<>
					<Controller
						name='scheduleStart'
						control={form.control}
						defaultValue={scheduleStart}
						render={({ field, fieldState }) => (
							<DatePicker
								label='Schedule Starts'
								error={fieldState.error?.message}
								clearable={false}
								{...field}
							/>
						)}
					/>

					<SimpleGrid cols={2}>
						<Controller
							control={form.control}
							name='startTime'
							render={({ field, fieldState }) => (
								<TimeInput
									label='Class Starts'
									error={fieldState.error?.message}
									format='12'
									{...field}
									onChange={(value) => {
										field.onChange(value)
										const duration = form.getValues('duration')
										setEndTime(new Date(value.getTime() + duration * 1000))
									}}
								/>
							)}
						/>

						<Controller
							control={form.control}
							name='duration'
							render={({ field, fieldState }) => (
								<TimeInput
									label='Class Ends'
									error={fieldState.error?.message}
									format='12'
									{...field}
									value={endTime}
									onChange={(value) => {
										const startTime = form.getValues('startTime')
										const duration = Math.round(
											Math.max(60, (value.getTime() - startTime.getTime()) / 1000)
										)

										setEndTime(value <= startTime ? new Date(startTime) : value)
										field.onChange(duration)
									}}
								/>
							)}
						/>
					</SimpleGrid>

					<Select
						label='Repeats'
						defaultValue=''
						data={[
							{ label: 'Never', value: '' },
							{
								label: `Weekly on ${WEEKDAYS[weekday]}s`,
								value: 'day',
							},
							{
								label: `Monthly on the ${ENGLISH_ORDINALS[weekI]} ${WEEKDAYS[weekday]}`,
								value: 'week,day',
							},
							{
								label: `Monthly on the ${ordinalSuffixed(date)}`,
								value: 'date',
							},
						]}
						onChange={(value) => {
							const set = value?.split(',') || []
							form.setValue('repeatWeek', set.includes('week') ? weekI : undefined)
							form.setValue('repeatDay', set.includes('day') ? weekday : undefined)
							form.setValue('repeatDate', set.includes('date') ? date : undefined)
						}}
					/>

					<Controller
						control={form.control}
						name='scheduleEnd'
						render={({ field, fieldState }) => (
							<DatePicker
								label='Schedule Ends'
								error={fieldState.error?.message}
								placeholder='Never'
								{...field}
							/>
						)}
					/>
				</>
			)
		}}
	/>
)

export default ClassTimeForm
