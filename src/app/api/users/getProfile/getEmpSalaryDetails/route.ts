import { NextRequest, NextResponse } from "next/server";
import { allClientsData, apiStatusFailureCode, apiStatusSuccessCode, apiwentWrong } from "@/app/pro_utils/stringConstants";
import {  funSendApiException } from "@/app/pro_utils/constant";
import supabase from "@/app/api/supabaseConfig/supabase";

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
        const {customer_id, role_id, client_id  } = await request.json();
    
          let bankQuery = supabase
          .from("leap_customer_bank_details")
          .select('*,bank_component_id(component_name, id)').eq('customer_id',customer_id);
          
          const {data:bankDetails,error:bankError}=await bankQuery;
          
          if(bankError){
            return NextResponse.json({ message: apiwentWrong ,error:bankError}, 
                  { status: apiStatusFailureCode });

          }

          
          if(role_id){
            if(role_id=="2"){
              let salaryDataQuery = supabase
          .from("leap_client_employee_salary")
          .select('*,leap_client_salary_components(salary_component_id,leap_salary_components(id,salary_component_name))').eq('client_id',client_id);
          
          if(customer_id){
            salaryDataQuery=salaryDataQuery.eq('customer_id',customer_id)
          }
          const {data:salaryDetails,error:salaryError}=await salaryDataQuery;
          if(salaryError){
            return NextResponse.json({ message: apiwentWrong ,error:salaryError}, 
                  { status: apiStatusFailureCode });

          }
              let totalSalayQuery = supabase
          .from("leap_employee_total_salary")
          .select('*').eq('customer_id',customer_id);
          
          
          const {data:totalSalaryDetails,error:totalSalaryError}=await totalSalayQuery;
          if(totalSalaryError){
            return NextResponse.json({ message: apiwentWrong ,error:totalSalaryError}, 
                  { status: apiStatusFailureCode });

          }


          return NextResponse.json({ message: allClientsData ,status:1,data:{bankDetails:bankDetails,salaryDetails:salaryDetails,totalSalary:totalSalaryDetails}}, 
            { status: apiStatusSuccessCode });

            }else{
              return NextResponse.json({ message: allClientsData ,status:1,bankDetails:bankDetails}, 
                { status: apiStatusSuccessCode });
            }
          
        }

  
    }catch(error){
        return funSendApiException(error);
        
    }
}