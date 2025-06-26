import { NextRequest, NextResponse } from "next/server";
import { funDataAddedSuccessMessage, funDataMissingError, funISDataKeyPresent, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
import { getAllActivitiesOfUsers } from "@/app/pro_utils/constantFunGetData";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import { addUserActivities } from "@/app/pro_utils/constantFunAddData";

export async function POST(request: NextRequest) {

    try {
        // const { data: user, error: userError } = await supabase.auth.getUser();


        // // Handle case where the user is not authenticated
        // if (userError || !user) {
        //   return NextResponse.json(
        //     { error: 'User not authenticated' },
        //     { status: 401 }
        //   );
        // }
        const formData = await request.formData();
        const fdata = {

            clientID: formData.get('client_id'),
            customerId: formData.get('customer_id'),
            projectId: formData.get('project_id'),
            subProjectId: formData.get('sub_project_id'),
            taskTypeId: formData.get('task_type_id'),
            totalHours: formData.get('total_hours'),
            totalMinutes: formData.get('total_minutes'),
            taskDetails: formData.get('task_details'),
            taskDate: formData.get('task_date'),
        }
        const { data: TaskData, error: taskError } = await supabase.from('leap_customer_project_task')
            .insert({
                client_id: fdata.clientID,
                customer_id: fdata.customerId,
                project_id: fdata.projectId,
                sub_project_id: fdata.subProjectId,
                task_type_id: fdata.taskTypeId,
                total_hours: fdata.totalHours,
                total_minutes: fdata.totalMinutes,
                task_details: fdata.taskDetails,
                task_date: fdata.taskDate,
                created_at: new Date().toISOString()
            }).select("id");
        if (taskError) {
            return funSendApiErrorMessage(taskError, "Failed to add task");
        }
        const addActivity= await addUserActivities(fdata.clientID,fdata.customerId,"","Work task",fdata.taskDetails,TaskData[0].id);
            if(addActivity=="1"){
              return funSendApiErrorMessage(addActivity, "Customer Task Activity Insert Issue");
            }
        return NextResponse.json({ status: 1, message: "Task Added Successfully", data: TaskData }, { status: apiStatusSuccessCode })
    } catch (error) {
        return funSendApiException(error);
    }
}