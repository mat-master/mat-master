import { Center, Loader, Text } from '@mantine/core'
import type {
	DeepPartial,
	FieldValues,
	SubmitHandler,
	UnpackNestedValue,
} from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import filterUpdated from '../utils/filter-updated'
import getErrorMessage from '../utils/get-error-message'
import type { FormWrapperProps } from './form'

export type RemoteFormProps<T extends FieldValues> = FormWrapperProps<T> & {
	queryKey: [string, Record<string, any>]
	getResource?: () => Promise<T>
	createResource?: SubmitHandler<T>
	updateResource?: SubmitHandler<DeepPartial<T>>
	child: React.FC<FormWrapperProps<T>>
}

export type RemoteFormWrapperProps<T extends FieldValues> = Omit<
	RemoteFormProps<T>,
	'child' | 'queryKey'
> &
	Partial<Pick<RemoteFormProps<T>, 'queryKey'>>

const RemoteForm = <T extends FieldValues>({
	queryKey,
	getResource,
	createResource,
	updateResource,
	child: Child,
	onSubmit,
	defaultValues,
	...props
}: RemoteFormProps<T>) => {
	const {
		data: remoteData,
		isLoading,
		isError: isQueryError,
		error: queryError,
	} = useQuery(queryKey, () => getResource && getResource(), {
		initialData: defaultValues as T,
		enabled: !!getResource && true,
	})

	const queryClient = useQueryClient()
	const {
		mutateAsync,
		isError: isMutationError,
		error: mutationError,
	} = useMutation(
		queryKey,
		async (data: UnpackNestedValue<T>) => {
			console.log('mutating resource')
			createResource && (await createResource(data))
			updateResource &&
				(await updateResource(
					filterUpdated(remoteData ?? {}, data) as UnpackNestedValue<DeepPartial<T>>
				))
		},
		{ onSuccess: () => queryClient.invalidateQueries(queryKey) }
	)

	if (isLoading || (isQueryError && getResource)) {
		return (
			<Center>
				{isLoading && <Loader />}
				{isQueryError && getResource && (
					<Text color='red'>{getErrorMessage(queryError)}</Text>
				)}
			</Center>
		)
	}

	return (
		<Child
			error={isMutationError ? getErrorMessage(mutationError) : undefined}
			{...props}
			defaultValues={remoteData}
			onSubmit={async (data) => {
				await mutateAsync(data)
				onSubmit && (await onSubmit(data))
			}}
		/>
	)
}

export default RemoteForm
