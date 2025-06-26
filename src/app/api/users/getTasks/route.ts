import { NextRequest, NextResponse } from "next/server";
import { formatDateYYYYMMDD, funISDataKeyPresent, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
import { getAllActivitiesOfUsers } from "@/app/pro_utils/constantFunGetData";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";

export async function POST(request: NextRequest) {

    try {
       
        const formData = await request.formData();
        const fdata = {

            clientID: formData.get('client_id'),
            customerId: formData.get('customer_id'),
            projectId: formData.get('project_id'),
            subProjectId: formData.get('sub_project_id'),
            // task_date: formData.get('task_date'),
            id: formData.get('id'),

        }

        let query = supabase.from('leap_customer_project_task')
            .select('*,leap_project_task_types(task_type_name),leap_client_sub_projects(sub_project_name,leap_client_project(project_name)), leap_task_status(*), leap_approval_status(*)')
            .order('updated_at', {ascending:false});
            
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

        if((formData.get('from_date') && formData.get('from_date')!=null ) 
            && (formData.get('to_date') && formData.get('to_date')!=null )){
            query = query
            .gte("task_date", formatDateYYYYMMDD(formData.get('from_date'))) // to_date >= fromDate
            .lte("task_date", formatDateYYYYMMDD(formData.get('to_date'))); // from_date <= fromDate
        }else if(formData.get('from_date') && formData.get('from_date')!=null){
            query = query
            .eq("task_date", formatDateYYYYMMDD(formData.get('from_date')));
        }

        console.log(query);

        const { data: TaskData, error: taskError } = await query;
        if (taskError) {
            return funSendApiErrorMessage(taskError, "Failed to add task");
        }
        return NextResponse.json({ status: 1, message: "All Tasks", data: TaskData }, { status: apiStatusSuccessCode })


    } catch (error) {


        return funSendApiException(error);

    }
}