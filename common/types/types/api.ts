// Auth

interface SignupPostBody {
  firstName: string,
  lastName: string,
  email: string,
  password: string
}

// Schools

interface SchoolPostBody {
  name: string,
  address: Address
}

interface SchoolClassesPostBody {
  name: string,
}

interface SchoolInvitesPostBody {
  email: string
}

interface SchoolInvitesDeleteBody {
  email: string
}