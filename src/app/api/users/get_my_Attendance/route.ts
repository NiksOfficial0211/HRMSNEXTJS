import { NextRequest, NextResponse } from "next/server";
import { addDays, dashedDateYYYYMMDD, formatDateYYYYMMDD, funloggedInAnotherDevice, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import { funGetMyLeaveBalance, isAuthTokenValid } from "@/app/pro_utils/constantFunGetData";
import { platform } from "os";

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

            customer_id: formData.get('customer_id'),
            clientID: formData.get('client_id'),
            start_date: formData.get('start_date'),
            end_date: formData.get('end_date'),
            role_id: formData.get('role_id'),
            platform: formData.get('platform'),
            authToken: formData.get('auth_token'),
            version: formData.get('version'),
            branch_id: formData.get('branch_id')
        };
        // console.log(fdata);

        if (!await isAuthTokenValid(fdata.platform, fdata.customer_id, fdata.authToken)) {
            return funloggedInAnotherDevice()
        }
        let query = null
        if(fdata.role_id=="4" || fdata.role_id=="9"){
         query=   supabase
            .from("leap_customer_attendance")
            .select(`*,leap_customer_attendance_geolocation(*)`)
            .eq("customer_id", fdata.customer_id);
        }else{
            query=supabase
            .from("leap_customer_attendance")
            .select(`*`)
            .eq("customer_id", fdata.customer_id);
        }
        

        if (fdata.start_date && fdata.end_date) {
            query = query.gte("date", formatDateYYYYMMDD(fdata.start_date))
                .lte("date", formatDateYYYYMMDD(fdata.end_date));
        } else if (fdata.start_date) {
            query = query.eq("date", formatDateYYYYMMDD(fdata.start_date))

        } else {
            query = query.eq("date", formatDateYYYYMMDD(new Date()))

        }
        query = query.order('date', { ascending: true });




        const { data: attendance, error } = await query;

        if (error) {
            return funSendApiErrorMessage(error, "Unable to fetch users");
        }
        const totalLeaves = await funGetMyLeaveBalance(fdata.clientID, fdata.customer_id, 5);

        const { data: appliedLeavedata, error: appliedLeaveError } = await supabase
            .from("leap_customer_apply_leave")
            .select(`*`).eq('customer_id', fdata.customer_id)
            .order("updated_at", { ascending: false })
            .limit(5);

        if (appliedLeaveError) {

            return funSendApiErrorMessage(appliedLeaveError, "Unable to fetch users");
        }
        // const { data: holidayData, error:holidayFetchError } = await supabase.from("leap_holiday_list")
        // .select(`*`)
        // .eq('client_id', fdata.clientID).eq('branch_id', fdata.branch_id)
        // .gte('date', fdata.start_date).lte("date",fdata.end_date).order("date",{ascending:true});
        //  if(holidayFetchError){
        //     return funSendApiErrorMessage("Holiday fetch error :- ", holidayFetchError);
        //  }
        return NextResponse.json({
            status: 1, message: " All Users",
            data: {
                attendance,
                totalLeaves,
                appliedLeavedata,
                // holidayData

            }
        },
            { status: apiStatusSuccessCode });

    } catch (error) {


        return funSendApiException(error);

    }

}


