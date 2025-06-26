import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/api/supabaseConfig/supabase";
import { apiStatusInvalidDataCode, apiStatusSuccessCode, apiStatusFailureCode, companyUpdatedData, companyUpdateFailed } from "@/app/pro_utils/stringConstants";
import { funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const fdata = {
     
     leaveID: formData.get("leave_id"),
     leaveStatus: formData.get("status"),
     statusRemark: formData.get("status_remark"),
      // customerID: formData.get("customer_id"),
      
    };
    if (!fdata.leaveID) {
      return NextResponse.json({ error: "Leave ID needed" },{ status: apiStatusInvalidDataCode }
      );
    }
    console.log("-------------- lieave status",fdata.leaveStatus);
    
    const { data, error } = await supabase
      .from('leap_customer_apply_leave')
      .update({
       
        leave_status: fdata.leaveStatus,
        approve_disapprove_remark: fdata.statusRemark || null,
        isAssigned: "FALSE",
        
      })
      .eq('id', fdata.leaveID )
      .select("*");
    
    if (error) {
      return funSendApiErrorMessage(error, "Company Update Issue");
    }
    
    if (error) {
        // console.log(error);
        return funSendApiErrorMessage("Update Activity", "Customer Leave Activity Insert Issue");
    }
    let query = supabase
        .from('leap_client_useractivites')
        .update({activity_status:fdata.leaveStatus})
        .eq("activity_related_id",fdata.leaveID);
        // .eq("asset_status", 1);
    const { data:activity, error:activityError } = await query;
    if (activityError) {
      console.log(activityError);
      return funSendApiErrorMessage(activityError, "Customer Update Leave activity Issue");
    }
    
    if (data) {
      return NextResponse.json({ message: companyUpdatedData, data: data }, { status: apiStatusSuccessCode });
    }else 
    return NextResponse.json({ message: companyUpdateFailed }, { status: apiStatusFailureCode });
    
  } catch (error) {
    console.log(error);
    
    return funSendApiException(error);
  }
}