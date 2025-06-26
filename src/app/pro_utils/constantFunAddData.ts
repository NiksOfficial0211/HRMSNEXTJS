import { act } from "react";
import supabase from "../api/supabaseConfig/supabase";
import { funSendApiErrorMessage } from "./constant";
import { funGetActivityTypeId } from "./constantFunGetData";
import { baseUrl } from "./stringRoutes";

export async function funAddCustomerBirthDays(clientId: any, customerId: any,ocassion:any,ocassionDate:any,isEnabled:any) {
    let query = supabase.from("leap_all_birthdays")

        .upsert({ client_id: clientId,customer_id:customerId,ocassion:ocassion,ocassion_date:ocassionDate,is_enabled:isEnabled });
    const { error } = await query;
    if (error) {
        return error;
    }
    else {
        return true;
    }
}

export async function funAddSubProject(
    clientID:any,
    branchID:any,
    departmentID:any,
    project_id:any,
    subProjectName:any,
    startDate:any,
    endDate:any,
    proManagerID:any,

){
    const { error: detailsError } = await supabase.from('leap_client_sub_projects')
        .insert({
            client_id: clientID,
            branch_id: branchID,
            department_id:departmentID || null,
            project_id: project_id,
            sub_project_name: subProjectName,
            start_date: startDate! || null,
            end_date: endDate! || null,
            project_manager_id: proManagerID,
            
            created_at: new Date().toISOString()
        });
        if (detailsError) {
            return false;
        }
        return null;

}

export async function addUserActivities(client_id:any,customer_id:any,branchId:any,
                                    activityType:any,activityDetail:any,activityRelatedID:any){
    let getEmployeeQwery = supabase.from("leap_customer")
    .select(`*,leap_client_designations(*),leap_client_departments(*)`)
          .eq('client_id', client_id)
          .eq('customer_id', customer_id);
        const {data:employeeData, error: getEmpError } = await getEmployeeQwery;
        if (getEmpError) {
          console.log(getEmpError);
    
          return funSendApiErrorMessage(getEmpError, "Unable to fetch the customer in activity insert issue");
        }

    
    const activityTypeID= await funGetActivityTypeId(activityType)
    
    if(activityTypeID==null){
      return "error with activity type id"
    }

    let userActivityQuery = supabase.from("leap_client_useractivites")
      .insert({
        client_id: client_id,
        customer_id: customer_id,
        branch_id:branchId? branchId : null,
        customer_name:employeeData[0].name,
        activity_type_id:activityTypeID[0].id,
        designation_name:employeeData[0].leap_client_designations && employeeData[0].leap_client_designations.designation_name? employeeData[0].leap_client_designations.designation_name : "" ,
        department_name:employeeData[0].leap_client_departments && employeeData[0].leap_client_departments.department_name ? employeeData[0].leap_client_departments.department_name :"",
        activity_details: activityDetail,
        customer_image:employeeData[0].profile_pic ? employeeData[0].profile_pic: "",
        activity_related_id:activityRelatedID,
        activity_status:1,
        created_at: new Date()
      });
      
    const {data:activity, error: activitieserror } = await userActivityQuery;

    if (activitieserror) {

      return "1";
    }
    let {data:clientAdminID,error:errorGetAdminID} = await supabase.from("leap_customer")
          .select(`customer_id`)
                .eq('client_id', client_id)
                .eq('user_role', '2');
                console.log("start of call push notification clientAdminID------",clientAdminID);
                  
      if(clientAdminID){
        try{
          const formData = new FormData();
          formData.append("customer_id", clientAdminID[0].customer_id);
          formData.append("title", employeeData[0].name+":-"+activityType);
          formData.append("message", activityDetail);
          formData.append("attachment_url", employeeData[0].profile_pic);
          formData.append("navigation_url", baseUrl+"/dashboard");

          const res = await fetch(`${baseUrl}/api/sendPushNotification`, {
            cache: "no-store",
            method: "POST",
            body: formData,
        });
        if (!res.ok) {
          const log=addErrorLog(client_id,"ExceptionSendActivityPushNotification--",res.json())
        }else{
          console.log("Nikhil-------------_----->12",await res.json());

        }
        }catch(error){
          console.log("niks----------------------->13",error);
          
          const log=addErrorLog(client_id,"ExceptionSendActivityPushNotification--",error)
        }
      }
    return "0";
}


export async function addErrorLog(client_id:any,actionType:any,errorJson:any,
  ){
    let userActivityQuery = supabase.from("leap_client_useractivites")
      .insert({
        client_id: client_id,
        action_type:actionType,
        details_log:errorJson,
        created_at: new Date()
      });
      
    const { error: activities } = await userActivityQuery;

    if (activities) {      
      return "1";
    }
    return "0";
  }
