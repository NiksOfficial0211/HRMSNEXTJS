import { NextRequest, NextResponse } from "next/server";
import { formatDateYYYYMMDD, funISDataKeyPresent, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
import { getAllActivitiesOfUsers } from "@/app/pro_utils/constantFunGetData";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import supabase from "@/app/api/supabaseConfig/supabase";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const customerID = formData.get('customer_id');

        const { data: dobData, error: dobError } = await supabase
            .from('leap_customer')
            .select('dob')
            .eq('customer_id', customerID)
            .single(); 

        if (dobError) {
            return funSendApiErrorMessage(dobError, "Failed to fetch DOB");
        }
        const now = new Date();
        const today = now.toISOString().slice(5, 10);
        const userDob = dobData?.dob?.slice(5, 10); 

        let greetingId = 1; //gm
        if (today === userDob) {
            greetingId = 4; // hbd
        } else {
            const hour = now.getHours();
            if (hour >= 12 && hour < 16) {
                greetingId = 2; //gnoon
            } else if (hour >= 16) {
                greetingId = 3; //geve
            }
        }
        const { data: greetData, error: greetError } = await supabase
        .from('leap_dashboard_greetings')
        .select('*')
        .eq('id', greetingId);

    if (greetError) {
        return funSendApiErrorMessage(greetError, "Failed to fetch greet data");
    }
        return NextResponse.json({
            status: 1,message: "Greeting fetched successfully", data: greetData }, { status: apiStatusSuccessCode });
    } catch (error) {
        return funSendApiException(error);
    }
}
