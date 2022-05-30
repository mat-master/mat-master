import { ActionIcon, Menu } from '@mantine/core';
import type React from 'react';
import { Dots as MenuIcon, Pencil as EditIcon, Trash as DeleteIcon } from 'tabler-icons-react'

export interface ItemMenuProps {
	onEdit?: VoidFunction
	onDelete?: VoidFunction
}

const ItemMenu: React.FC<ItemMenuProps> = ({ onEdit, onDelete }) => {
	return (
		<Menu
			control={
				<ActionIcon>
					<MenuIcon size={16} />
				</ActionIcon>
			}
		>
			<Menu.Item icon={<EditIcon size={16} />} onClick={onEdit}>
				Edit
			</Menu.Item>
			<Menu.Item icon={<DeleteIcon size={16} />} onClick={onDelete} color='red'>
				Delete
			</Menu.Item>
		</Menu>
	)
}

export default ItemMenu;
