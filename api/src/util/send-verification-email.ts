import sgmail from '@sendgrid/mail'
import jwt from 'jsonwebtoken'

export const sendVerificationEmail = async (
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
