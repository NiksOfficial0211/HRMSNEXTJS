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
        const customer_id=formData.get('customer_id');
        const date=formData.get('date');
        const clientID=formData.get('client_id');

        const { data: clientData, error: clientError } = await supabase
        .from('leap_client')
        .select(`fullday_working_hours`)
        .eq("client_id", clientID)
        .single(); 

        const working_hour = clientData?.fullday_working_hours;
        
        if (clientError) {
            return funSendApiErrorMessage(clientError, "Failed to fetch client");
        }
            const { data: attendance, error: attError } = await supabase
            .from("leap_customer_attendance")
            .select(`*`)
            .eq("customer_id", customer_id)
            .eq("date",date);

        if (attError) {
            return funSendApiErrorMessage(attError, "Unable to fetch Attendance");
        }
        
        return NextResponse.json({
            status: 1, message: "Attendance Timer",data: attendance},{ status: apiStatusSuccessCode });
    } catch (error) {
        return funSendApiException(error);
    }
}