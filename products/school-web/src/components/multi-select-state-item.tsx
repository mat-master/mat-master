import { Group, Skeleton, Text } from '@mantine/core'
import React from 'react'

interface MultiSelectStateItemProps extends React.ComponentPropsWithRef<'div'> {
	state?: 'loading' | 'error' | 'empty'
	resourceLabel: string
}

const MultiSelectStateItem = React.forwardRef<HTMLDivElement, MultiSelectStateItemProps>(
	({ state, resourceLabel, ...props }, ref) => (
		<div ref={ref} {...props}>
			<Group direction='column' spacing='sm'>
				{state === 'loading' &&
					Array(3)
						.fill(undefined)
						.map((_, i) => <Skeleton key={i}>loading</Skeleton>)}

				{state === 'empty' && (
					<Text color='dimmed'>{`You don't have any ${resourceLabel} yet`}</Text>
				)}

				{state === 'error' && (
					<Text color='red'>{`Something went wrong getting your ${resourceLabel}`}</Text>
				)}
			</Group>
		</div>
	)
)

export default MultiSelectStateItem
