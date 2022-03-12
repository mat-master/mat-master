import { useQuery } from 'react-query'
import { useParams } from 'react-router'
import { getSchool } from '../data/schools'

const useSchool = () => {
	const { school } = useParams()
	if (!school) throw Error('use school hook relys on a school route parameter')
	return useQuery(`school:${school}`, () => getSchool(school))
}

export default useSchool
