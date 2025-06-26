// Manager can view their team members leaves
import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { allClientsData, apiStatusFailureCode, apiStatusSuccessCode, apiwentWrong } from "@/app/pro_utils/stringConstants";
import { funSendApiException, funISDataKeyPresent } from "@/app/pro_utils/constant";
import { log } from "console";
import { funGetMyLeaveBalance } from "@/app/pro_utils/constantFunGetData";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || ""); 
    const pageSize = parseInt(searchParams.get("limit") || ""); 

    const formData = await request.formData();
    const fdata = {
      clientId: formData.get('client_id'),
      managerId: formData.get('manager_id')
    }
   
    let leaveBalances;

    if (!fdata.managerId) {
      return NextResponse.json({ status: 0, message: "Manager ID is required" }, { status: apiStatusFailureCode });
    }

    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    // Fetch employees under this manager
    const { data: teamMembers, error: teamError } = await supabase
      .from("leap_customer")
      .select("customer_id")
      .eq("manager_id", fdata.managerId)
      .order('updated_at', {ascending:false})

    if (teamError) {
      return NextResponse.json({ status: 0, message: apiwentWrong, error: teamError }, { status: apiStatusFailureCode });
    }

    if (!teamMembers || teamMembers.length === 0) {
      return NextResponse.json({ status: 1, message: "No employees found under this manager", leavedata: [] }, { status: apiStatusSuccessCode });
    }

    const employeeIds = teamMembers.map(emp => emp.customer_id);
    // Fetch leave records for employees under this manager
    let query = supabase
      .from("leap_customer_apply_leave")
      .select(`*, leap_approval_status(approval_type), leap_client_leave(leave_name), leap_customer(name)`)
      .in("customer_id", employeeIds)
      .order("updated_at", { ascending: false })
      .range(start, end);

        if(formData.get('customer_id') && formData.get('customer_id')!="0"){
                query=query.eq('customer_id',formData.get('customer_id'));
                leaveBalances = await funGetMyLeaveBalance(fdata.clientId, formData.get('customer_id'), 5);
              }
        if(formData.get('leave_status') && parseInt(formData.get('leave_status')+'')>0){
        query=query.eq('leave_status',formData.get('leave_status'));
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
        log(query);
    const { data: leaves, error: leaveError } = await query;

    if (leaveError) {
      return NextResponse.json({ status: 0, message: apiwentWrong, error: leaveError }, { status: apiStatusFailureCode });
    }

    return NextResponse.json({ message: allClientsData, status: 1, leavedata: leaves }, { status: apiStatusSuccessCode });

  } catch (error) {
    return funSendApiException(error);
  }
}