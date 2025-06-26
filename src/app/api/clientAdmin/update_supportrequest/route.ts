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
            customer_id:formData.get('customer_id'),
            status:formData.get('status'),
            comments:formData.get('comments'),

        }
        let {data:updateData,error:updateError} = await supabase.from('leap_client_employee_requests')
            .update({"active_status":fdata.status}).eq("id",fdata.request_id)
        
        if (updateError) {
            return funSendApiErrorMessage(updateError, "Failed to update request");
        }
        let {data:insertRequestUpdate,error:insertRequestError} = await supabase.from('leap_client_employee_requests_updates')
            .insert({
                request_id:fdata.request_id,
                customer_id:fdata.customer_id,
                status:fdata.status,
                comments:fdata.comments,
                created_at:new Date(),
            });
        
        
        if (insertRequestError) {
            return funSendApiErrorMessage(insertRequestError, "Failed to add task");
        }
        return NextResponse.json({ status: 1, message: "Support Request Updated" }, { status: apiStatusSuccessCode })
    } catch (error) {
        return funSendApiException(error);
    }
}