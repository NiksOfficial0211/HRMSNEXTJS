import { NextRequest, NextResponse } from "next/server";
import { addDays, dashedDateYYYYMMDD, formatDateYYYYMMDD, funloggedInAnotherDevice, funSendApiErrorMessage, funSendApiException, getFirstDateOfYear, getLastDateOfYear } from "@/app/pro_utils/constant";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import { funGetClientHolidayList, isAuthTokenValid } from "@/app/pro_utils/constantFunGetData";


export async function POST(request: NextRequest) {

    try {
        
        const formData = await request.formData();
        const fdata = {

            clientID: formData.get('client_id'),
            branchID: formData.get('branch_id'),
            customer_id: formData.get('customer_id'),
            holidayID: formData.get('id'),
            platform: formData.get('platform') as string,
            authToken: formData.get('auth_token'),
            version: formData.get('version'),
            yearID: formData.get('holiday_year'),
        };
        if (fdata.authToken && fdata.customer_id) {
            if (!await isAuthTokenValid(fdata.platform, fdata.customer_id, fdata.authToken)) {
                return funloggedInAnotherDevice()
            }
        }
        let query = supabase.from("leap_holiday_list")
            .select(`*,leap_holiday_types(*),leap_client_branch_details(branch_number)`)
            .eq('client_id', fdata.clientID);

        if (fdata.branchID ) {
            query = query.eq('branch_id', fdata.branchID);
        }
        if (fdata.holidayID ) {
            query = query.eq('id', fdata.holidayID);
        }
        if (fdata.yearID ) {
            query = query.eq('holiday_year', fdata.yearID);
        }
        query = query.gte('date', formatDateYYYYMMDD(getFirstDateOfYear())) // `to_date` must be >= `fromDate`
            .lte('date', formatDateYYYYMMDD(getLastDateOfYear())).order('date', { ascending: true });

        console.log(query);
        
        const { data: holidayData, error } = await query;
        if (error) {
            return funSendApiErrorMessage("Failed to fetsch Holidays", error);
        }


        const { data: holidayList, error: holidayError } = await query;
        if (holidayError) {
            return funSendApiErrorMessage("failed to get Upcoming holiday",holidayError);
        }
        const holidaysByMonth = holidayData.reduce((acc, holiday) => {
            const monthName = new Date(holiday.date).toLocaleString("en-US", { month: "long" }); // Get month name
            if (!acc[monthName]) {
              acc[monthName] = [];
            }
            acc[monthName].push(holiday);
            return acc;
          }, {});
      
          // **Convert grouped object into an array of objects**
          const formattedHolidays = Object.keys(holidaysByMonth).map((month) => ({
            month: month,
            holidays: holidaysByMonth[month],
          }));
        return NextResponse.json({ status: 1, message: "All Holiday List", data: { totalHolidays: holidayData.length, holidays: fdata.platform &&(fdata.platform.toLowerCase()=="android"||fdata.platform=="ios")?formattedHolidays:holidayData } },
            { status: apiStatusSuccessCode });

    } catch (error) {


        return funSendApiException(error);

    }

}

