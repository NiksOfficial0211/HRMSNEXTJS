import { NextRequest, NextResponse } from "next/server";
import { allClientsData, apiStatusFailureCode, apiStatusSuccessCode, apiwentWrong, updateAdrressFailure, updateAdrressSuccess, updateBankFailure, updateBankSuccess, updateGrossSalaryFailure, updateSalaryFailure } from "@/app/pro_utils/stringConstants";
import { funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
import supabase from "@/app/api/supabaseConfig/supabase";

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


      customerId: formData.get('customer_id'),
      client_id: formData.get('client_id'),
      branch_id: formData.get('branch_id'),

      bank_id: formData.get('bank_id'),
      bank_name: formData.get('bank_name'),
      account_number: formData.get('account_number'),
      IFSC_code: formData.get('IFSC_code'),
      UAN_number: formData.get('UAN_number'),
      ESIC_number: formData.get('ESIC_number'),
      PAN_number: formData.get('PAN_number'),
      TIN_number: formData.get('TIN_number'),
      security_insurance_no: formData.get('security_insurance_no'),
      branch_name: formData.get('branch_name'),

      salaryAmountsArray: formData.get('salaryAmountsArray') as string,

      total_salary_table_id: formData.get('total_salary_table_id') ,
      total_gross_salary: formData.get('total_gross_salary'),
      total_deduction: formData.get('total_deduction'),
      net_payable_salary: formData.get('net_payable_salary'),
      pay_accural_id: formData.get('pay_accural_id'),



    }
    const salaryAmounts = JSON.parse(fdata.salaryAmountsArray);
    let eContactUpQuery ;
    console.log("1======================",fdata.bank_id);
    
    if(fdata.bank_id && fdata.bank_id != "0"){
      console.log("2======================");
       eContactUpQuery = supabase
      .from("leap_customer_bank_details")
      .update({
         bank_name: fdata.bank_name,
        account_number: fdata.account_number,
        IFSC_code: fdata.IFSC_code,
        UAN_number: fdata.UAN_number,
        ESIC_number: fdata.ESIC_number,
        PAN_number: fdata.PAN_number,
        TIN_number: fdata.TIN_number,
        security_insurance_no: fdata.security_insurance_no || 0,
        branch_name: fdata.branch_name,
      }).eq("id",fdata.bank_id);
    }else{
      console.log("3======================");
      eContactUpQuery = supabase
      .from("leap_customer_bank_details")
      .insert({
        client_id:fdata.client_id,
        customer_id: fdata.customerId,
        bank_name: fdata.bank_name,
        account_number: fdata.account_number,
        IFSC_code: fdata.IFSC_code,
        UAN_number: fdata.UAN_number,
        ESIC_number: fdata.ESIC_number,
        PAN_number: fdata.PAN_number,
        TIN_number: fdata.TIN_number,
        security_insurance_no: fdata.security_insurance_no,
        branch_name: fdata.branch_name,
        created_at:new Date()
      })
    }
    const { error } = await eContactUpQuery;
    if (error) {
      console.log(error);

      return NextResponse.json({ message: updateBankFailure, error: error },
        { status: apiStatusFailureCode });

    }

    for (let i = 0; i < salaryAmounts.length; i++) {
      console.log("4======================");
      console.log(salaryAmounts[i]);
      let salaryDetailsqwery;
      if(salaryAmounts[i].id!="0"){
       salaryDetailsqwery = supabase.from('leap_client_employee_salary').update([
        {
          salary_component_id: salaryAmounts[i].salary_component_id,
          amount: salaryAmounts[i].amount,
          created_at: new Date()
        }

      ]).eq("id",salaryAmounts[i].id);
    }else{
      console.log("5======================",);
      salaryDetailsqwery = supabase.from('leap_client_employee_salary').insert([
        {
          
          customer_id:fdata.customerId,
          branch_id:fdata.branch_id,
          client_id:fdata.client_id,
          salary_component_id: salaryAmounts[i].leap_client_salary_components.client_Salary_compionent_id,
          amount: salaryAmounts[i].amount,
          created_at: new Date()
        }

      ])
    }
      
      const { error: insertBankError } = await salaryDetailsqwery;

      if (insertBankError) {
        console.log(insertBankError);
        return funSendApiErrorMessage(updateSalaryFailure, "Insert Bank Details Issue")
      }
    }
    let totalSalaryqwery
    if(fdata.total_salary_table_id!="0"){
      console.log("6======================");
    totalSalaryqwery = supabase.from('leap_employee_total_salary').update([
      {
        gross_salary: fdata.total_gross_salary,
        total_deduction: fdata.total_deduction,
        net_pay: fdata.net_payable_salary,
      }
    ]).eq("id", fdata.total_salary_table_id);
  }else{
    console.log("7======================");
    totalSalaryqwery = supabase.from('leap_employee_total_salary').insert([
      {
        customer_id:fdata.customerId,
        gross_salary: fdata.total_gross_salary,
        total_deduction: fdata.total_deduction,
        net_pay: fdata.net_payable_salary,
        pay_acural_days:fdata.pay_accural_id,

      }
    ])
  }



    const { error: insertTotalSalaryError } = await totalSalaryqwery;

    if (insertTotalSalaryError) {
      return funSendApiErrorMessage(updateGrossSalaryFailure, "Insert Total Salary Details Issue")
    }
    return NextResponse.json({ message: updateBankSuccess, status: 1 });


  } catch (error) {
    console.log(error);

    return funSendApiException(error);

  }
}