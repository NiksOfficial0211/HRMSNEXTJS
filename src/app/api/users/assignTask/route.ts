import { NextRequest, NextResponse } from "next/server";
import { funDataAddedSuccessMessage, funDataMissingError, funISDataKeyPresent, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
import { getAllActivitiesOfUsers } from "@/app/pro_utils/constantFunGetData";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import { addUserActivities } from "@/app/pro_utils/constantFunAddData";
import { FaPray } from "react-icons/fa";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const fdata = {
            client_id: formData.get('client_id'),
            branch_id: formData.get('branch_id'),
            assigned_to: formData.get('assigned_to'),
            project_id: formData.get('project_id'),
            sub_project_id: formData.get('sub_project_id'),
            task_type_id: formData.get('task_type_id'),
            task_details: formData.get('task_details'),
            // task_date: formData.get('task_date'),
            task_priority: formData.get('task_priority'),
            deadline: formData.get('deadline'),
            assigned_by: formData.get('assigned_by'),
            // task_status: formData.get('task_status'),
        }

        const { data: TaskData, error: taskError } = await supabase.from('leap_customer_project_task_assignment')
            .insert({
                client_id: fdata.client_id,
                branch_id: fdata.branch_id,
                assigned_to: fdata.assigned_to || null,
                project_id: fdata.project_id || null,
                sub_project_id: fdata.sub_project_id || null,
                task_type_id: fdata.task_type_id || null,
                task_details: fdata.task_details || null,
                task_date: new Date().toISOString(),
                // formatDateYYYYMMDD(new Date())
                task_priority: fdata.task_priority || null,
                deadline: fdata.deadline || null,
                assigned_by: fdata.assigned_by || null,
                // task_status: fdata.task_status || null,
                created_at: new Date().toISOString()
            }).select();
        if (taskError) {
            return funSendApiErrorMessage(taskError, "Failed to add task");
        }
        const addActivity= await addUserActivities(fdata.client_id,fdata.assigned_to,"","Work task",fdata.task_details, TaskData[0].id);
            if(addActivity=="1"){
              return funSendApiErrorMessage(addActivity, "Customer Leave Activity Insert Issue");
            }
        return NextResponse.json({ status: 1, message: "Task Added Successfully", data: TaskData }, { status: apiStatusSuccessCode })
    } catch (error) {
        return funSendApiException(error);
    }
}