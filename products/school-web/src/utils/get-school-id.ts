// Uses the url to get the schools Id
const getSchoolId = () => {
	const id = /schools\/\d+/.exec(window.location.pathname)?.at(0)?.split('/')[1]
	if (!id) throw Error("Error getting the current school's id")
	return id
}

export default getSchoolId
