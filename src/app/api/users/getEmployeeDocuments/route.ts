import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import { calculateNumMonths, funISDataKeyPresent, funloggedInAnotherDevice, funSendApiErrorMessage, funSendApiException, getFirstDateOfYearbyDate } from "@/app/pro_utils/constant";
import { isAuthTokenValid } from "@/app/pro_utils/constantFunGetData";

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
    const { client_id, branch_id, customer_id, platform, version, auth_token, id } = await request.json();
    // const fdata = {
    //   clientId: formData.get('client_id'),
    //   branch_id: formData.get('branch_id'),
    //   customer_id: formData.get('customer_id'),
    //   platform: formData.get('platform'),
    //   version: formData.get('version'),
    //   authToken: formData.get('auth_token'),
    //   id: formData.get('id')
    // }

    if (!await isAuthTokenValid(platform, customer_id, auth_token)) {
      return funloggedInAnotherDevice()
    }
    let query = supabase
      .from('leap_document_type')
      .select('*,leap_customer_documents(*)')
      .or(`document_type_id.eq.2,document_type_id.eq.5`)
      .eq('is_deleted', false)
      .eq('leap_customer_documents.customer_id', customer_id)
      .eq('leap_customer_documents.isEnabled', true)
      // .order('leap_customer_documents.updated_at', { ascending: true });
    // .filter('id', 'eq', fdata.docId); 

    if (funISDataKeyPresent(id)) {
      query = query.eq('id', id)
    }

    const { data, error } = await query;
    if (error) {
      return funSendApiErrorMessage(error, "Unable to get Documents")
    }
    else {
      const filteredData = data.filter(item =>
        item.leap_customer_documents && item.leap_customer_documents.length > 0
      );
      const type2Docs: any = [];
      const type5Docs: any = [];

      filteredData.forEach(item => {
        if (item.document_type_id === 2) {
          type2Docs.push(item);
        } else if (item.document_type_id === 5) {
          type5Docs.push(item);
        }
      });

      return NextResponse.json({
        message: "All Documents",
        status: 1,
        organization_specific: type2Docs,
        employee_personal: type5Docs
      }, { status: apiStatusSuccessCode })
    }

  } catch (error) {
    return funSendApiException(error);

  }
}