// this API is used to get support request data in the table

import { NextRequest, NextResponse } from "next/server";
import { formatDateYYYYMMDD, funISDataKeyPresent, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import supabase from "@/app/api/supabaseConfig/supabase";

export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || ""); // Default: 1
        const pageSize = parseInt(searchParams.get("limit") || ""); // Default: 20 per page

        const formData = await request.formData();
        const fdata = {
            client_id: formData.get('client_id'),
            customer_id: formData.get('customer_id'),
            branch_id: formData.get('branch_id'),
            type_id: formData.get('type_id'),
            description: formData.get('description'),
            priority_level: formData.get('priority_level'),
            active_status: formData.get('active_status'),
            raised_on: formData.get('raised_on'),
            id: formData.get('id')
        }
        const start = (page - 1) * pageSize;
        const end = start + pageSize - 1;

        let query = supabase.from('leap_client_employee_requests')
            .select('*, leap_request_master(*), leap_request_priority(priority_name), leap_customer(name), leap_request_status(status),leap_client_employee_requests_updates(*,leap_customer(name),leap_request_status(status))')
            .order('updated_at', {ascending:false});

        if (formData.get('client_id') && (formData.get('client_id')!="0")) {
            query = query.eq('client_id', formData.get('client_id'))
        }
        if (formData.get('branch_id') && (formData.get('branch_id')!="0")) {
            query = query.eq('branch_id', formData.get('branch_id'))
        }
        if (formData.get('customer_id') && (formData.get('customer_id')!="0")) {
            query = query.eq('customer_id', formData.get('customer_id'))
        }
        if (formData.get('type_id') && (formData.get('type_id')!="0")) {
            query = query.eq('type_id', formData.get('type_id'))
        }
        if (formData.get('active_status') && (formData.get('active_status')!="0")) {
            query = query.eq('active_status', formData.get('active_status'))
        }
        if (formData.get('priority_level') && (formData.get('priority_level')!="0")) {
            query = query.eq('priority_level', formData.get('priority_level'))
        }
        if (formData.get('id') && (formData.get('id')!="0"))  {
            query = query.eq('id', formData.get('id'))
        }
        if(funISDataKeyPresent(formData.get('start_date')) && funISDataKeyPresent(formData.get('end_Date'))!){
            query=query.gte('raised_on',formData.get('start_date')).lte('raised_on',formData.get('start_date'));
          }
          if(funISDataKeyPresent(formData.get('start_date') && funISDataKeyPresent(formData.get('end_Date')))){
            query=query.lte('raised_on',formData.get('end_date')).gte('raised_on',formData.get('start_date'));
          }
        if (funISDataKeyPresent(formData.get('raised_on')))  {
            query = query.eq('raised_on', formData.get('raised_on'))
        }
        if(start || end){
         query=query.range(start, end);
      }
        const { data: supportData, error: supportError } = await query;
        if (supportError) {
            return funSendApiErrorMessage(supportError, "Failed to add task");
        }else if(supportData.length==0 && (formData.get('start_date')|| formData.get('end_date'))){
            if(page==1){
            return NextResponse.json({ message: "start date present ifcondition", status : 1, page:page,leavedata:[] }, { status: apiStatusSuccessCode });
            }else{
            return NextResponse.json({ message: "Support support data", status : 0, page:page-1 }, { status: apiStatusSuccessCode });
            }
        }
        else if(supportData.length==0 && !formData.get('start_date') && page){
            return NextResponse.json({ message: "Support support data", status : 0, page:page-1 }, { status: apiStatusSuccessCode });
        }
        else if(supportData.length==0 && !formData.get('active_status') && page){
            return NextResponse.json({ message: "Support support data", status : 0, page:page-1 }, { status: apiStatusSuccessCode });
        }
        else if(supportData.length==0 && !formData.get('priority_level') && page){
            return NextResponse.json({ message: "Support support data", status : 0, page:page-1 }, { status: apiStatusSuccessCode });
        }
     else{
        return NextResponse.json({ status: 1, message: "All Support Request", data: supportData }, { status: apiStatusSuccessCode })
}    } catch (error) {
        return funSendApiException(error);
    }
}