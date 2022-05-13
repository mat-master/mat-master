import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { query } from '../../../../../util/db';
import { isResponse, res200, res400, res404, res500, Response } from '../../../../../util/res';
import { getSchool, getSchoolAuth } from '../../../../../util/school';
import { authUser, getUser, getUserId } from '../../../../../util/user';
import { generateSnowflake } from '../../../../../util/snowflake';
import { validator } from '@common/util';
import { validateBody } from '../../../../../util/validation';
import stripe from '../../../../../util/stripe';
import type { School, Snowflake } from '@common/types';

export const handler = async (event: APIGatewayProxyEvent): Promise<Response> => {
    const body = await validateBody(validator.api.schoolStudentsPatchSchema, event.body);
    if(isResponse(body))
        return body;

    const user = await authUser(event);
    if(isResponse(user)) return user;

    const school = await getSchool(event);
    if(isResponse(school)) return school;

    if(!event.pathParameters || !event.pathParameters.studentId)
        return res400("No student id provided");

    const studentId = event.pathParameters.studentId;

    interface MembershipPair {
        membership: Snowflake
        stripeSubscriptionId: string
    }

    const promises: Promise<Response | null>[] = [];

    if(body.memberships) {
        const currMembershipsReq = await query(`SELECT json_build_array(json_build_object('membership', membership, 'stripeSubscriptionId', stripe_subscription_id)) as memberships FROM student_memberships WHERE student = $1`, [studentId]);
        let currMemberships: MembershipPair[] = [];
        if(currMembershipsReq && currMembershipsReq.rowCount > 0)
            currMemberships = currMembershipsReq.rows[0].memberships;
        const flatMemberships = currMemberships.map(m => m.membership);
        for(const membership of body.memberships) {
            if(!flatMemberships.includes(membership)) {
                // Add membership
                promises.push(addMembership(school, membership, studentId));
            }
        }
        for(const membership of flatMemberships) {
            if(!body.memberships.includes(membership)) {
                // Remove membership
                promises.push(removeMembership(school, membership, studentId));
            }
        }
    }

    const results = await Promise.all(promises);
    for(const result of results)
        if(result) return result;

    return res200();
}

const addMembership = async (school: School, membershipId: Snowflake, studentId: Snowflake) => {
    const membership = await query("SELECT * FROM memberships WHERE school = $1 AND id = $2 LIMIT 1", [school.id, membershipId]);
    if(!membership || membership.rowCount === 0)
        return res404("Membership does not exist");
    const student = await query("SELECT * FROM students WHERE school = $1 AND id = $2 LIMIT 1", [school.id, studentId]);
    if(!student || student.rowCount === 0)
        return res404("Student does not exist");    

    const subscription = await stripe.subscriptions.create({
        customer: student.rows[0].stripe_customer_id,
        items: [{
            price: membership.rows[0].stripe_price_id 
        }],
        metadata: {
            membership: membership.rows[0].id,
            student: studentId.toString()
        }
    }, {
        stripeAccount: school.stripeAccountId
    });
        
    await query("INSERT INTO student_memberships (student, membership, stripe_subscription_id) VALUES ($1, $2, $3)", [studentId, membershipId, subscription.id]);    
    return null;
}

const removeMembership = async (school: School, membershipId: Snowflake, studentId: Snowflake) => {
    const membership = await query("SELECT * FROM memberships WHERE school = $1 AND id = $2 LIMIT 1", [school.id, membershipId]);
    if(!membership || membership.rowCount === 0)
        return res404("Membership does not exist");
    const student = await query("SELECT * FROM students WHERE school = $1 AND id = $2 LIMIT 1", [school.id, studentId]);
    if(!student || student.rowCount === 0)
        return res404("Student does not exist");    
    const studentMembership = await query("SELECT * FROM student_memberships WHERE student = $1 AND membership = $2 LIMIT 1", [studentId, membershipId]);
    if(!studentMembership || studentMembership.rowCount === 0)
        return res404("Student does not have membership");

    await stripe.subscriptions.del(studentMembership.rows[0].stripe_subscription_id, {
        stripeAccount: school.stripeAccountId
    });
        
    await query("DELETE FROM student_memberships WHERE student = $1 AND membership = $2", [studentId, membershipId]);    
    return null;
}