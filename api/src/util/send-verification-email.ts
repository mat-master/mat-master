import sgmail from '@sendgrid/mail'
import { getBaseLinkUrl } from './get-base-link-url'

export const sendVerificationEmail = (email: string, token: string) =>
	sgmail.send({
		to: email,
		from: 'nate19522@gmail.com',
		templateId: 'd-e51a013f84ba4eda81f2d3ba6b26bb1b',
		dynamicTemplateData: {
			link: `${getBaseLinkUrl()}/verify?token=${token}`,
		},
	})
