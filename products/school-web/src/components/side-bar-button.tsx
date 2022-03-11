import { Button, ButtonProps } from '@mantine/core'
import type React from 'react'

const SideBarButton = (props: ButtonProps<any>) => (
	<Button
		fullWidth
		color='gray'
		variant='subtle'
		styles={(theme) => ({
			root: { paddingRight: 72, color: theme.colors.gray[7] },
			inner: { justifyContent: 'start' },
		})}
		{...props}
	/>
)

export default SideBarButton
