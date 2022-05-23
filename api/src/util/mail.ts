import type { School } from '@common/types'
import sgmail from '@sendgrid/mail'
import * as jwt from 'jsonwebtoken'
sgmail.setApiKey(process.env.SENDGRID_API_KEY as string)

export const sendVerification = async (
	id: bigint,
	email: string,
	firstName: string,
	lastName: string
) => {
	// Create Verify JWT that expires in 15 minutes
	const verifyToken = jwt.sign(
		{ id: id.toString() },
		process.env.JWT_SECRET as string,
		{ expiresIn: '15m' }
	)
	const msg: sgmail.MailDataRequired = {
		to: email,
		from: 'nate19522@gmail.com',
		templateId: 'd-e51a013f84ba4eda81f2d3ba6b26bb1b',
		dynamicTemplateData: {
			name: `${firstName} ${lastName}`,
			link: `https://dashboard.matmaster.app/verify?token=${verifyToken}`,
		},
	}
	await sgmail.send(msg)
}

export const sendInvite = (email: string, school: School) =>
	sgmail.send({
		to: email,
		from: 'nate19522@gmail.com',
		templateId: 'd-26d3bca19b444abeb601e17f65182197',
		dynamicTemplateData: {
			schoolName: school.name,
			link: `https://dashboard.matmaster.app/accept-invite?school=${school.id}`,
		},
	})
