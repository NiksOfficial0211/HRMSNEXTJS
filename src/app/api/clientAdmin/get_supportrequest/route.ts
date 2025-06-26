// this API is used to get support request data in the table

import { NextRequest, NextResponse } from "next/server";
import { funISDataKeyPresent, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import supabase from "@/app/api/supabaseConfig/supabase";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const fdata = {
            client_id: formData.get('client_id'),
            request_id:formData.get('request_id'),

        }
        let query = supabase.from('leap_client_employee_requests')
            .select('*, leap_request_master(*), leap_request_priority(priority_name), leap_customer(name), leap_request_status(status),leap_client_employee_requests_updates(*,leap_customer(name),leap_request_status(status))');
            
            
        if (funISDataKeyPresent(formData.get('client_id'))) {
            query = query.eq('client_id', formData.get('client_id'))
        }
        if (funISDataKeyPresent(formData.get('request_id'))) {
            query = query.eq('id', formData.get('request_id'))
        }
        
        const { data: supportData, error: supportError } = await query;
        if (supportError) {
            return funSendApiErrorMessage(supportError, "Failed to add task");
        }
        return NextResponse.json({ status: 1, message: "Support Request", data: supportData }, { status: apiStatusSuccessCode })
    } catch (error) {
        return funSendApiException(error);
    }
}