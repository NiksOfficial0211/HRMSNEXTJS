import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { allClientsData, allLeavesData, apiStatusFailureCode, apiStatusSuccessCode, apiwentWrong } from "@/app/pro_utils/stringConstants";
import { funISDataKeyPresent, funSendApiException } from "@/app/pro_utils/constant";
import { funGetMyLeaveBalance } from "@/app/pro_utils/constantFunGetData";

export async function POST(request: NextRequest) {

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || ""); // Default: 1
    const pageSize = parseInt(searchParams.get("limit") || ""); // Default: 20 per page

    let leaveBalances;
    const formData = await request.formData();
    const fdata = {
      clientId: formData.get('client_id'),
      branchId: formData.get('branch_id'),
      start_date: formData.get('start_date'),
      end_Date: formData.get('end_Date'),
      id: formData.get('id'),

    }
     
    const start = (page -1) * pageSize;
    const end = start + pageSize - 1;

    let query = supabase
      .from("leap_customer_apply_leave")
      .select(`*,leap_approval_status(approval_type),leap_client_leave(leave_name),leap_customer(name)`)
      .eq('client_id', fdata.clientId)
      .order('updated_at', {ascending:false})
     
      if (fdata.id) {
        query = query.eq("id", fdata.id);
      }
      if(formData.get('leave_status') && parseInt(formData.get('leave_status')+'')>0){
        query=query.eq('leave_status',formData.get('leave_status'));
      }
      if(formData.get('customer_id') && formData.get('customer_id')!="0"){
        query=query.eq('customer_id',formData.get('customer_id'));
        leaveBalances = await funGetMyLeaveBalance(fdata.clientId, formData.get('customer_id'), 5);
      }
      if(funISDataKeyPresent(formData.get('start_date')) && funISDataKeyPresent(formData.get('end_Date'))!){
                query=query.gte('from_date',formData.get('start_date')).lte('to_date',formData.get('start_date'));
              }
              if(funISDataKeyPresent(formData.get('start_date') && funISDataKeyPresent(formData.get('end_Date')))){
                query=query.lte('from_date',formData.get('end_date')).gte('to_date',formData.get('start_date'));
              }
     
      if(start || end){
         query=query.range(start, end);
      }
      console.log(query);
      const { data: leaves, error }=await query;
      
    if (error) {
      return NextResponse.json({status:0, message: apiwentWrong, error: error }, { status: apiStatusFailureCode });
    }else if(leaves.length==0 && (formData.get('start_date')|| formData.get('end_date'))){
      if(page==1){
        return NextResponse.json({ message: "start date present ifcondition", status : 1, page:page,leavedata:[] }, { status: apiStatusSuccessCode });
      }else{
        return NextResponse.json({ message: allLeavesData, status : 0, page:page-1 }, { status: apiStatusSuccessCode });
      }
    }
    else if(leaves.length==0 && !formData.get('start_date') && page){
      return NextResponse.json({ message: allLeavesData, status : 0, page:page-1 }, { status: apiStatusSuccessCode });
    }
    else {
      if(!leaveBalances){
        leaveBalances = await funGetMyLeaveBalance(fdata.clientId, leaves[0].customer_id, 5);
      }
      return NextResponse.json({ message: allLeavesData,leavedata:leaves, status : 1, emp_leave_Balances: leaveBalances }, { status: apiStatusSuccessCode });
    }
  } catch (error) {
    return funSendApiException(error);
  }
}