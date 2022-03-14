// Uses the url to get the schools Id
const getSchoolId = () => /schools\/\d+/.exec(window.location.pathname)?.at(0)?.split('/')[1]

export default getSchoolId
