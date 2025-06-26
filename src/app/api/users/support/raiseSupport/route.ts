// this API is used to insert support request data in the table

import { NextRequest, NextResponse } from "next/server";
import { calculateNumDays, formatDateYYYYMMDD, funCalculateTimeDifference, funDataAddedSuccessMessage, funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import fs from "fs/promises";
import { addUserActivities } from "@/app/pro_utils/constantFunAddData";
import supabase from "@/app/api/supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
        const fdata = {
            client_id: formData.get('client_id'),
            customer_id: formData.get('customer_id'),
            branch_id: formData.get('branch_id'),
            type_id: formData.get('type_id'),
            description: formData.get('description'),
            priority_level: formData.get('priority_level'),
           
        }
        const { data: supportData, error: supportError } = await supabase.from('leap_client_employee_requests')
        .insert({
                client_id: fdata.client_id,
                customer_id: fdata.customer_id,
                branch_id: fdata.branch_id,
                type_id: fdata.type_id,
                description: fdata.description,
                priority_level: fdata.priority_level,
                active_status: "1",
                created_at: new Date().toISOString(),
                raised_on: new Date()
            }).select();
            if (supportError) {
                return funSendApiErrorMessage(supportError, "Failed to raise support ticket");
            }
            const addActivity= await addUserActivities(fdata.client_id, fdata.customer_id, fdata.branch_id, "Support", fdata.description, supportData[0].id);
                if(addActivity=="1"){
                  return funSendApiErrorMessage(addActivity, "Customer Support Activity Insert Issue");
                }
            return NextResponse.json({ status: 1, message: "Support ticket raised successfully", data: supportData }, { status: apiStatusSuccessCode })

  } catch (error) {
    return funSendApiException(error);
  }
}