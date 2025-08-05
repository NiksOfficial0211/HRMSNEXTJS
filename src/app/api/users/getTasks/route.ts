import { NextRequest, NextResponse } from "next/server";
import { formatDateYYYYMMDD, funISDataKeyPresent, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";

export async function POST(request: NextRequest) {

    try {
        const {client_id, customer_id, project_id, sub_project_id, id, task_status, task_date, to_date, from_date } = await request.json();

        let query = supabase.from('leap_customer_project_task')
            .select('*,leap_project_task_types(task_type_name),leap_client_sub_projects(sub_project_name), leap_task_status(*), leap_approval_status(*)')
            //  .select('id,total_hours, total_minutes, task_details, task_type_id(task_type_id,task_type_name), task_status(id,status), approval_status(id,approval_type),sub_project_id(subproject_id,sub_project_name)')
           
            .order('updated_at', {ascending:false});
            
        if (funISDataKeyPresent(client_id)) {
            query = query.eq('client_id', client_id)
        }
        if (funISDataKeyPresent(task_status)) {
            query = query.eq('task_status', task_status)
        }
        if (funISDataKeyPresent(task_date)) {
            query = query.eq('task_date', task_date)
        }
        if (funISDataKeyPresent(customer_id)) {
            query = query.eq('customer_id', customer_id)
        }
        // if (funISDataKeyPresent(project_id)) {
        //     query = query.eq('project_id', project_id)
        // }
        if (funISDataKeyPresent(sub_project_id)) {
            query = query.eq('sub_project_id', sub_project_id)
        }
        if (funISDataKeyPresent(id))  {
            query = query.eq('id', id)
        }

        // if((from_date && from_date!=null ) 
        //     && (to_date && to_date!=null )){
        //     query = query
        //     .gte("task_date", formatDateYYYYMMDD(from_date)) // to_date >= fromDate
        //     .lte("task_date", formatDateYYYYMMDD(to_date)); // from_date <= fromDate
        // }else if(from_date && from_date!=null){
        //     query = query
        //     .eq("task_date", formatDateYYYYMMDD(from_date));
        // }

        const { data: TaskData, error: taskError } = await query;
        if (taskError) {
            return funSendApiErrorMessage(taskError, "Failed to add task");
        }
        return NextResponse.json({ status: 1, message: "All Tasks", data: TaskData }, { status: apiStatusSuccessCode })

    } catch (error) {
        return funSendApiException(error);
    }
}