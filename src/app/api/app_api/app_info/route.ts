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
            role_id: formData.get('role_id'),
            platform: formData.get('platform'),
            authToken: formData.get('auth_token'),
            version: formData.get('version')
        };
        // console.log(fdata);
        if(fdata.authToken && fdata.customer_id){
            if (!await isAuthTokenValid(fdata.platform, fdata.customer_id, fdata.authToken)) {
                return funloggedInAnotherDevice()
            }
        }
//  here we get the app version if platform is passed in api and matches ios or android
        let appVersions:any=[];
        
        if(fdata.platform && (fdata.platform==="android" || fdata.platform==="ios")){
            console.log(fdata.platform);

            const {data,error} = await supabase
            .from("app_versioning")
            .select("*").eq("platform",fdata.platform);
            if (error) {
                console.log(error);
                
                appVersions=[]
            }else{
                appVersions=data;
            }
        }
//  here we get the customer company info if customer_id is passed in api

        let companyDetails:any=[];
        if(fdata.customer_id){
            const {data,error} = await supabase
            .from("leap_customer")
            .select("leap_client(leap_client_basic_info(*))")
            .eq("customer_id", fdata.customer_id);

            if (error) {
                return funSendApiErrorMessage(error,"Unable to get user");
            }else{
                companyDetails=data;
            }
        }
        const {data:DashboardPermission,error} = await supabase.from("leap_client_employee_permissions")
            .select('*,leap_client_employee_permission_types(*)')
            .eq("customer_id",fdata.customer_id)
            console.log(error);

            const filteredPermissions = DashboardPermission?.filter(permission =>
                permission.leap_client_employee_permission_types?.permission_name === "Dashboard"
              );
// here we create the result api response data into a single object
        const appInfoResult:AppInfoModel={
            platform: appVersions[0].platform,
            version: appVersions[0].app_version,
            force_update: appVersions[0].force_update,
            live_app_url:appVersions[0].app_url,
            client_id: companyDetails[0].leap_client.leap_client_basic_info[0].client_id,
            company_logo: companyDetails[0].leap_client.leap_client_basic_info[0].company_logo,
            company_name: companyDetails[0].leap_client.leap_client_basic_info[0].company_name,
            compnay_websit: companyDetails[0].leap_client.leap_client_basic_info[0].compnay_websit,
            primary_color: companyDetails[0].leap_client.leap_client_basic_info[0].primary_color,
            secondary_color: companyDetails[0].leap_client.leap_client_basic_info[0].secondary_color,
            show_dashboard:filteredPermissions![0].is_allowed
        }



        return NextResponse.json({
                status: 1, message: "App Info",
                data: //appVersions,companyDetails,
                 appInfoResult
            },
            { status: apiStatusSuccessCode });

    } catch (error) {


        return funSendApiException(error);

    }

}


