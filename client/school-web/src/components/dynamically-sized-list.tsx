import { Badge, createStyles, Skeleton } from '@mantine/core'
import { useDebouncedValue, useElementSize } from '@mantine/hooks'
import React, { useLayoutEffect, useRef, useState } from 'react'
import { useQueries } from 'react-query'

export interface DynamicallySizedListProps<TId, TData> {
	itemIds: TId[]
	estimatedItemWidth: number // px
	fetchItemData: (id: TId) => TData | Promise<TData>
	itemComponent: React.FC<TData>
	estimateWeight?: number
}

const useStyles = createStyles(() => ({
	skeleton: {
		width: '100%',
		height: '100%',
		overflow: 'hidden',
	},
	content: {
		width: 'min-content',
		display: 'grid',
		gridTemplateColumns: 'min-content min-content',
		alignItems: 'center',
		justifyContent: 'start',
		gap: 8,
	},
	list: {
		width: 'min-content',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-start',
		gap: 4,
	},
}))

const DynamicallySizedList = <TId, TData>({
	itemIds,
	estimatedItemWidth,
	fetchItemData,
	itemComponent: ItemComponent,
	estimateWeight = 2,
}: DynamicallySizedListProps<TId, TData>) => {
	const [count, setCount] = useState(0)
	const visibleItemIds = itemIds.slice(0, count)
	const queries = useQueries(
		visibleItemIds.map((id) => ({
			queryKey: [id],
			queryFn: () => fetchItemData(id),
		}))
	)

	// if any of the queries are loading, the entire component is in a loading state
	const isLoading = queries.some(({ isLoading }) => isLoading)
	const items = queries.map(
		({ data }, i) => data && <ItemComponent key={i} {...data} />
	)

	const skeleton = useElementSize<HTMLDivElement>()
	const content = useElementSize<HTMLDivElement>()
	const listRef = useRef<HTMLDivElement>(null)

	const [availableWidth] = useDebouncedValue(skeleton.width, 60)
	const [contentWidth] = useDebouncedValue(content.width, 60)
	const previousAvailableWidth = useRef(availableWidth)
	const settled = useRef(false)

	useLayoutEffect(() => {
		if (isLoading || !listRef.current) return
		const availableWidth = skeleton.ref.current.clientWidth
		const contentWidth = content.ref.current.clientWidth
		const unusedWidth = availableWidth - contentWidth

		if (
			unusedWidth > 0 &&
			// after the list has settled only check if more items are needed
			// if the amount of available width had increased
			(!settled.current || availableWidth > previousAvailableWidth.current)
		) {
			// the weighted average of the known item widths and the initial estimate
			const averageItemWidth = count
				? (contentWidth / count) * (count / (count + estimateWeight)) +
				  estimatedItemWidth * (estimateWeight / (count + estimateWeight))
				: estimatedItemWidth

			const adjustment = Math.round(unusedWidth / averageItemWidth)
			const newCount = Math.min(itemIds.length, count + adjustment)
			newCount === count ? (settled.current = true) : setCount(newCount)

			// if the content overflows take items out of the list one by one
			// until the content doesn't overflow
		} else if (unusedWidth < 0) {
			const removedNodes: ChildNode[] = []
			while (
				listRef.current.hasChildNodes() &&
				content.ref.current.clientWidth > availableWidth
			) {
				removedNodes.push(listRef.current.removeChild(listRef.current.lastChild!))
			}

			// put the dom back the way it was so that react doesn't get confused
			listRef.current.append(...removedNodes)
			setCount(count - removedNodes.length)
			settled.current = true
		}

		previousAvailableWidth.current = availableWidth
	}, [contentWidth, availableWidth])

	const { classes } = useStyles()
	const unShownItemCount = itemIds.length - count

	return (
		<Skeleton ref={skeleton.ref} visible={isLoading} className={classes.skeleton}>
			<div ref={content.ref} className={classes.content}>
				<div ref={listRef} className={classes.list}>
					{items}
				</div>

				{unShownItemCount > 0 && <Badge>+{unShownItemCount}</Badge>}
			</div>
		</Skeleton>
	)
}

export default DynamicallySizedList
