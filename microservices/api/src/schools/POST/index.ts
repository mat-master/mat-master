import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Address, Privilege, Tier } from '@common/types';
import { isResponse, res200, res400, res500 } from '../../util/res';
import { authUser } from '../../util/user';
import stripe from '../../util/stripe';
import { query } from '../../util/db';
import { generateSnowflake } from '../../util/snowflake';

export interface SchoolPostBody {
    name: string,
    address: Address
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Parse body
    if(!event.body) 
        return res400("No body submitted");
    const {name, address}: SchoolPostBody = JSON.parse(event.body);

    // Determine requesting user
    const user = await authUser(event);
    if(isResponse(user))
        return user;
    
    // Make sure user verified email
    if(user.privilege === Privilege.Unverified)
        return res400("You must verify your email before creating a school");
    
    // Generate ids
    const schoolId = generateSnowflake(), addressId = generateSnowflake();
    if(!schoolId || !addressId)
        return res500("Internal server error")

    // Create school stripe account
    const account = await stripe.accounts.create({
        type: "standard",
        country: "US",
        business_type: "company",
        email: user.email,
        company: {
            address: {
                country: "US",
                state: address.state,
                city: address.city,
                postal_code: address.postalCode,
                line1: address.line1,
                line2: address.line2
            }
        },
        metadata: {
            id: schoolId.toString(),
        }
    });

    // Create school in database
    const res = await query(`
    WITH addressId AS (INSERT INTO addresses (id, state, city, postal_code, line_1, line_2) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id) 
    INSERT INTO schools (id, owner, name, address, tier, stripe_account_id) VALUES ($7, $8, $9, (SELECT id from addressId), $10, $11)`.trim(), 
    [addressId, address.state, address.city, address.postalCode, address.line1, address.line2, 
        schoolId, user.id, name, Tier.TRIAL, account.id]);
    if(!res)
        return res500("Internal server error");
    

    return res200({
        school: {
            id: schoolId.toString(),
            name: name,
            address: address,
            tier: Tier.TRIAL,
        }
    });
}