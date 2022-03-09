import { randomId, useListState } from '@mantine/hooks'
import React, { useCallback, useState } from 'react'
import * as yup from 'yup'

export interface RemoteResource {
	id: string
}

export const remoteResourceSchema: yup.SchemaOf<RemoteResource> = yup.object({
	id: yup.string().required('Required'),
})

export type ResourceData<T extends RemoteResource> = Omit<T, 'id'>

export interface ResourceContext<T extends RemoteResource, S extends RemoteResource> {
	items: T[] | null
	summaries: S[] | null
	getSummaries: () => Promise<S[]>
	create: (data: ResourceData<T>) => Promise<void>
	get: (id: string) => Promise<T>
	update: (id: string, data: Partial<ResourceData<T>>) => Promise<void>
	remove: (id: string) => Promise<void>
}

export const createResourceContext = <T extends RemoteResource, S extends RemoteResource>() => {
	const defaultHandler = () => {
		throw Error('unimplemented')
	}

	return React.createContext<ResourceContext<T, S>>({
		items: [],
		summaries: [],
		getSummaries: defaultHandler,
		create: defaultHandler,
		get: defaultHandler,
		update: defaultHandler,
		remove: defaultHandler,
	})
}

export interface ResourceProviderProps<T extends RemoteResource, S extends RemoteResource> {
	context: React.Context<ResourceContext<T, S>>
	children: React.ReactNode
	defaultItems?: T[]
	defaultSummaries?: S[]
	mergeItem?: (base: T, data: Partial<ResourceData<T>>) => T | Promise<T>
	summarizeItem?: (item: T) => S | Promise<S>
}

const ResourceProvider = <T extends RemoteResource, S extends RemoteResource>({
	context,
	children,
	defaultItems,
	defaultSummaries,
	mergeItem,
	summarizeItem,
}: ResourceProviderProps<T, S>) => {
	const [items, itemHandlers] = useListState<T>(defaultItems)
	const [summaries, summariesHandlers] = useListState<S>(defaultSummaries)
	const [summariesLoaded, setSummariesLoaded] = useState(!!defaultSummaries)

	const getSummaries = useCallback(async () => {
		if (summariesLoaded) return summaries

		// TODO: connect remote data source
		throw Error('remote data source not implemented')
	}, [summariesLoaded, summaries])

	const create = useCallback(async (data: ResourceData<T>) => {
		const item = { id: randomId(), ...data } as T
		itemHandlers.append(item)

		if (summarizeItem) {
			const summary = await summarizeItem(item)
			summariesHandlers.append(summary)
		}

		// TODO: connect remote data source
		// TODO: create item summary
	}, [])

	const get = useCallback(
		async (id: string) => {
			const local = items.find((item) => item.id === id)
			if (local) return local

			// TODO: connect remote data source
			throw Error('remote data source not implemented')
		},
		[items]
	)

	const update = useCallback(async (id: string, data: Partial<ResourceData<T>>) => {
		const itemIndex = items.findIndex((item) => item.id === id)
		const newItem = mergeItem
			? await mergeItem(items[itemIndex], data)
			: { ...items[itemIndex], ...data }

		itemHandlers.setItem(itemIndex, newItem)

		if (summarizeItem) {
			const summaryIndex = summaries.findIndex((summary) => summary.id === id)
			const summary = await summarizeItem(newItem)
			summariesHandlers.setItem(summaryIndex, summary)
		}
	}, [])

	const remove = useCallback(
		async (id: string) => {
			itemHandlers.remove(items.findIndex((item) => item.id === id))
			summariesHandlers.remove(summaries.findIndex((summary) => summary.id === id))

			// TODO: connect remote data source
		},
		[items, summaries]
	)

	return (
		<context.Provider
			value={{
				items,
				summaries: summariesLoaded ? summaries : null,
				getSummaries,
				create,
				get,
				update,
				remove,
			}}
		>
			{children}
		</context.Provider>
	)
}

export default ResourceProvider
