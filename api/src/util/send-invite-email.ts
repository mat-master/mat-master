import sgmail from '@sendgrid/mail'
import { Snowflake } from '../../build'

export const sendInviteEmail = (
	email: string,
	school: { id: Snowflake; name: string }
) =>
	sgmail.send({
		to: email,
		from: 'nate19522@gmail.com',
		templateId: 'd-26d3bca19b444abeb601e17f65182197',
		dynamicTemplateData: {
			schoolName: school.name,
			link: `https://dashboard.matmaster.app/accept-invite?school=${school.id}`,
		},
	})
