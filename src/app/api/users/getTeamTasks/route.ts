// Manager can view their team members leaves
import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { allClientsData, apiStatusFailureCode, apiStatusSuccessCode, apiwentWrong, taskUpdateFailed, taskUpdatedData } from "@/app/pro_utils/stringConstants";
import { funSendApiException, funISDataKeyPresent } from "@/app/pro_utils/constant";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10); 
    const pageSize = parseInt(searchParams.get("limit") || "50", 10); 

    const formData = await request.formData();
    const managerId = formData.get('manager_id'); 

    if (!managerId) {
      return NextResponse.json({ status: 0, message: "Manager ID is required" }, { status: apiStatusFailureCode });
    }

    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    // Fetch employees under this manager
    const { data: teamMembers, error: teamError } = await supabase
      .from("leap_customer")
      .select("customer_id")
      .eq("manager_id", managerId);

    if (teamError) {
      return NextResponse.json({ status: 0, message: apiwentWrong, error: teamError }, { status: apiStatusFailureCode });
    }

    if (!teamMembers || teamMembers.length === 0) {
      return NextResponse.json({ status: 1, message: "No employees found under this manager", taskdata: [] }, { status: apiStatusSuccessCode });
    }

    const employeeIds = teamMembers.map(emp => emp.customer_id);

    // Fetch task records for employees under this manager
    let query = supabase
      .from("leap_customer_project_task")
      .select(`*, leap_project_task_types(*), leap_customer(name), leap_client_sub_projects(*, leap_client_project(*)), leap_task_status(*), leap_approval_status(*)`)
      .in("customer_id", employeeIds)
      .order("updated_at", { ascending: false })
      // .range(start, end);
       
        if (funISDataKeyPresent(formData.get('client_id'))) {
            query = query.eq('client_id', formData.get('client_id'))
        }
        if (funISDataKeyPresent(formData.get('task_status'))) {
            query = query.eq('task_status', formData.get('task_status'))
        }
        if (funISDataKeyPresent(formData.get('task_date'))) {
            query = query.eq('task_date', formData.get('task_date'))
        }
        if (funISDataKeyPresent(formData.get('customer_id'))) {
            query = query.eq('customer_id', formData.get('customer_id'))
        }
        if (funISDataKeyPresent(formData.get('project_id'))) {
            query = query.eq('project_id', formData.get('project_id'))
        }
        if (funISDataKeyPresent(formData.get('sub_project_id'))) {
            query = query.eq('sub_project_id', formData.get('sub_project_id'))
        }
        if (funISDataKeyPresent(formData.get('id')))  {
            query = query.eq('id', formData.get('id'))
        }
    const { data: task, error: taskError } = await query;

    if (taskError) {
      return NextResponse.json({ status: 0, message: taskUpdateFailed, error: taskError }, { status: apiStatusFailureCode });
    }

    return NextResponse.json({ message: "All Team Tasks",  status: 1, taskdata: task }, { status: apiStatusSuccessCode });

  } catch (error) {
    return funSendApiException(error);
  }
}

