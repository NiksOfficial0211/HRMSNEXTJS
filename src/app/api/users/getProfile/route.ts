import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { allClientsData, apiStatusFailureCode, apiStatusSuccessCode, apiwentWrong } from "@/app/pro_utils/stringConstants";
import {  funSendApiException } from "@/app/pro_utils/constant";

export async function POST(request: NextRequest) {
    
    try{
        // const { data: user, error: userError } = await supabase.auth.getUser();
    
    
        // // Handle case where the user is not authenticated
        // if (userError || !user) {
        //   return NextResponse.json(
        //     { error: 'User not authenticated' },
        //     { status: 401 }
        //   );
        // }
        const formData = await request.formData();
    
        
          let query = supabase
          .from("leap_customer")
          .select(`
            *,
            leap_client_branch_details(*),leap_client(*),leap_client_designations(*),leap_client_departments(*),leap_working_type(*),leap_employement_type(*)
          `).eq('client_id',formData.get('client_id'));
          
          
          if(formData.get('branch_id')){
            query=query.eq('branch_id',formData.get('branch_id'))
          }
          if(formData.get('customer_id')){
            query=query.eq('customer_id',formData.get('customer_id'))
          }
          const {data:customerProfile,error:clientError}=await query;
          
          if(clientError){
            return NextResponse.json({ message: apiwentWrong ,error:clientError}, 
                  { status: apiStatusFailureCode });

          }
           if(customerProfile){
            return NextResponse.json({ message: allClientsData ,status:1,customer_profile:customerProfile}, 
                  { status: apiStatusSuccessCode });
          }

  
    }catch(error){
        return funSendApiException(error);
        
    }
}