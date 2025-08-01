import { NextRequest, NextResponse } from "next/server";
import { addDays, dashedDateYYYYMMDD, formatDateYYYYMMDD, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";

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
        const {role_id, client_id, branch_id} = await request.json();
        if(role_id! && role_id=="1" ||role_id=="2" || role_id=="3"){
            return sendAllAnnouncements (client_id, branch_id)    
        }else{
            return  sendUsersAnnouncement (role_id, branch_id)
        }
    } catch (error) {
        return funSendApiException(error);
    }
}

async function sendAllAnnouncements(client_id: any, branch_id: any){
    let query =  supabase.from('leap_client_announcements')
    .select('*,leap_show_announcement_users(announcement_id, role_id)')
    .eq('client_id', client_id)
    .eq('branch_id', branch_id)
    .eq('isEnabled', true)
    .eq('isDeleted', true);

    const { data: TaskData, error: taskError } =await query;
    if (taskError) {
        return funSendApiErrorMessage(taskError, "Failed to get announcement");
    }
    return NextResponse.json({ status: 1, message: "All Announcement", data: TaskData }, { status: apiStatusSuccessCode })
}

async function  sendUsersAnnouncement(roleid: any, branchid: any) {
    let alldata: any[]=[];

        const role_id=roleid;
        const branch_id=branchid;

            // const orCondition = `leap_show_announcement_users.designation_id.eq.${designationId},  leap_show_announcement_users.department_id.eq.${departmentID}`;
            // let designationQuery=null;
            // let departmentQuery=null;
            let today = dashedDateYYYYMMDD(new Date());

            const { data: designationData, error: desError } = await supabase
            .from('leap_show_announcement_users')
            .select(`
                leap_client_announcements!inner(*)
            `)
            .eq('role_id', role_id)
            .eq('branch_id', branch_id)

            .or(
                `send_on_date.eq.${today},and(send_on_date.lte.${today},validity_date.gte.${today})`,
                { foreignTable: 'leap_client_announcements' }
            )           
            .order('validity_date', { foreignTable: 'leap_client_announcements', ascending: true });
            
            if (desError) {
                return funSendApiErrorMessage(desError, "Failed to get announcement");
            }
        
        // console.log("api announcement departmentID",departmentID);
        // if(departmentID){
        // departmentQuery =   supabase.from('leap_show_announcement_users')
        //     .select('leap_client_announcements(*)')
        //     .eq('department_id',departmentID)
        //     .lte('leap_client_announcements.send_on_date',dashedDateYYYYMMDD(new Date()))
        //     .gte('leap_client_announcements.validity_date',dashedDateYYYYMMDD(new Date()));
        //     const { data: departmentData, error: depError } =await departmentQuery;
        //     if (depError) {
        //         return funSendApiErrorMessage(depError, "Failed to get announcement");
        //     }
        // }
        // for(let i=0;i<designationData.length;i++){
        //     alldata.push(designationData[i].leap_client_announcements)
        // }
        // for(let i=0;i<departmentData.length;i++){
        //     alldata.push(departmentData[i].leap_client_announcements)
        // }
       
        
        // const uniqueAnnouncements = alldata.filter(
        //     (item, index, self) =>
        //       index === self.findIndex((t) => t.announcement_id === item.announcement_id)
        //   );
           
        //   uniqueAnnouncements.sort((a, b) => {
        //     const dateA = a.validity_date ? new Date(a.validity_date).getTime() : 0; // Defaults to epoch if invalid
        //     const dateB = b.validity_date ? new Date(b.validity_date).getTime() : 0; // Defaults to epoch if invalid
        //     return dateA - dateB;
        //   });

        return NextResponse.json({ status: 1, message: "User Announcement", data: designationData }, { status: apiStatusSuccessCode })

}