import React, { useEffect } from 'react'
import { useParams } from 'react-router'

export interface School {
	id: string
	name: string
}

export interface SchoolContext {
	id?: string
	name?: string
}

export const schoolContext = React.createContext<SchoolContext>({})

const SchoolProvider: React.FC = ({ children }) => {
	const { school } = useParams()
	useEffect(() => {
		// TODO: Get school data
	}, [school])
	console.log(school)

	return (
		<schoolContext.Provider value={{ name: 'Fountain Hills Martial Arts', id: school }}>
			{children}
		</schoolContext.Provider>
	)
}

export default SchoolProvider
