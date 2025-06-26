import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/api/supabaseConfig/supabase";
import {  apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import {  funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";

export async function POST(request: NextRequest) {
    
    try{
        

        const formData = await request.formData();
        const fdata = {
            clientId: formData.get('client_id'),
            branchID: formData.get('branch_id'),
            leaveID: formData.get('leave_id') as string

        };
        
          let query = supabase
          .from("leap_client_leave")
          .select(`*,leap_leave_type_icon_and_color(*)`)
          .eq('client_id', fdata.clientId)
          .eq('branch_id', fdata.branchID);

          if(fdata.leaveID){
            query = query.eq("leave_id", fdata.leaveID);
        }
        
          const {data:leaveData,error} = await query;
          
          if(error){
            return funSendApiErrorMessage(error, "Unable to fetch leave type");

          }
           
          return NextResponse.json({ status: 1, message: " All Leaves", data: leaveData }, 
            { status: apiStatusSuccessCode });

  
    }catch(error){
        return funSendApiException(error);
    }
}