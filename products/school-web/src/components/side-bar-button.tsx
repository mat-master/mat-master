import { Button, ButtonProps } from '@mantine/core'
import type React from 'react'

const SideBarButton = <C extends React.ElementType = 'button'>(props: ButtonProps<C>) => (
	<Button<C>
		fullWidth
		color='gray'
		variant='subtle'
		styles={(theme) => ({
			root: { paddingRight: 72, color: theme.colors.gray[7] },
			inner: { justifyContent: 'start' },
		})}
		{...(props as any)}
	/>
)

export default SideBarButton
