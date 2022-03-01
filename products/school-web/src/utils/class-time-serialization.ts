import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';

dayjs.extend(durationPlugin);

const SEPERATER = ' : ' as const;
export type ClassTime = `${string}${typeof SEPERATER}${number}`;

const validateClassTime = (classTime: unknown): classTime is ClassTime => {
	if (typeof classTime !== 'string') return false;
	return /^(((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ){5}: \d+$/.test(classTime);
};

export const serializeClassTime = (start: Date, end: Date): ClassTime => {
	// ensure start and end are on the same date
	end = dayjs(end)
		.year(start.getFullYear())
		.month(start.getMonth())
		.date(start.getDate())
		.toDate();

	const cronSchedule = `${start.getMinutes()} ${start.getHours()} * * ${start.getDay()}`;
	const duration = dayjs.duration({
		milliseconds: Math.max(0, end.getTime() - start.getTime()),
	});

	// format: cron schedule : duration in minutes
	// example: 0 18 * * 1 : 60
	// meaning: every monday from 6:00pm to 7:00pm
	return `${cronSchedule}${SEPERATER}${Math.round(duration.asMinutes())}`;
};

export function deserializeClassTime(src: string): [Date, Date] {
	if (!validateClassTime(src)) throw Error('Invalid source');
	const [cronSchedule, duration] = src.split(SEPERATER);
	// For some reason this works and ...map(parseInt) doesn't so just dont touch it
	const [minute, hour, _, __, day] = cronSchedule.split(' ').map((e) => parseInt(e));

	const start = dayjs().day(day).hour(hour).minute(minute).second(0).millisecond(0).toDate();
	const end = dayjs(start).add(parseInt(duration), 'minute').toDate();

	return [start, end];
}
