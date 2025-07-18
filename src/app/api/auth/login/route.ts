import { NextResponse } from 'next/server';
import { createClient } from '../../../../../utils/supabase/server';
import { funSendApiErrorMessage } from '@/app/pro_utils/constant';
import { generate16BitAlphanumericToken } from '@/app/pro_utils/helpers';
// import supabase from '../../supabaseConfig/supabase';

export async function POST(request: Request) {
  try {
    const supabase =await createClient();
    // console.log( await request.json());
    const {semail, spassword, loginType, social_login, platform } = await request.json();
    // const requestEmail = String(formData.get('email'));
    // const reqPassword = String(formData.get('password'));
    // const loginType = String(formData.get('loginType'));
    // const isSocialLogin = String(formData.get('social_login'));

    let email,password="";
    if (loginType == 'email') {
      email=semail;
      password=spassword;
      
    } else if (loginType == "empID") {
      // email based on loginType
      const { data: userData, error: userError } = await supabase
        .from("leap_customer")
        .select("email_id")
        .eq('emp_id',semail)
        .limit(1);


      if (userError || !userData) {
        
        // return NextResponse.json(userError?.message || "Invalid input or user not found.");
        return NextResponse.json({status: 0,error:userError?.message || "Invalid input or user not found."});
      }
      email=userData[0].email_id;
      password=spassword;

    }

    const { data,error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return NextResponse.json({status:0, error: error.message }, { status: 200 }); 
    }
    // await supabase.auth.setSession(data.session);
    
    // console.log("this is the session in the api------------------    ",await supabase.auth.getSession());
    // return Response.json({"data":data});
    const authID = data.user.id;
    return authUserDetails(authID,platform);

  }
  catch (error) {
    console.log(error);
    
    return NextResponse.json({ status:0,error: "Unexpected error occurred" }, { status: 500 });
  }
}

async function authUserDetails(authUUID: any,platform:any) {
  const supabase =await createClient();
  if(platform=="ios" || platform=="android"){
    const { data:cust,error:custFetchError } = await supabase
    .from("leap_customer").select("customer_id").eq("authUuid", authUUID)
    if(custFetchError){
      return funSendApiErrorMessage(custFetchError,"Unable to fetch customer");
    }
    const generateAuthToken=generate16BitAlphanumericToken();
    
    console.log(cust);
    console.log(generateAuthToken);
    
    
      const { error } = await supabase
          .from("leap_customer").update({"auth_token":cust[0].customer_id+"_"+generateAuthToken})
          .eq("customer_id", cust[0].customer_id);
          if(error){
          return funSendApiErrorMessage(custFetchError,"Unable to update token");
          }
  }
  
  const { data, error } = await supabase
    .from("leap_customer")
    .select("*,leap_client(company_name,company_email,company_website_url,company_number,leap_client_basic_info(*))")
    .eq("authUuid", authUUID);

  if (error) {
    return funSendApiErrorMessage(error,"Unable to login");
  }
  if (!data || data.length === 0) {
    
    return NextResponse.json({ status: 0, message: "No user found" }, { status: 200 });
  }

  return NextResponse.json({
    status: 1,
    message: "Data Fetched Successfully",
    client_data: data[0],
  }, { status: 200 });


}


// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
// import { cookies } from 'next/headers';
// import { NextResponse } from 'next/server';
// import supabase from '../../supabaseConfig/supabase';



// export async function POST(request: Request) {
//   const formData = await request.formData();
//   const email = String(formData.get('email'));
//   const password = String(formData.get('password'));
//   const isSocialLogin = String(formData.get('social_login'));

//   // Sign in the user
  
//   // if(isSocialLogin){
//   //   // const { data,error } = await supabase.auth.sign({
//   //   //   email,
//   //   //   password,
//   //   // });
//   // }else{
//   const { data,error } = await supabase.auth.signInWithPassword({
//     email,
//     password,
//   });


  
//   if (error) {
//     return NextResponse.json({ error: error.message }, { status: 401 });
//   }else{
//     // return Response.json({"data":data});
//     const authID=data.user.id
//     return authUserDetails(authID);
    
//   }
// // }

  
// }

// export async function authUserDetails(authUUID:any){
    
//     // const { data, error } = await supabase
//     // .from("leap_client_branch_details")
//     // .select("*")
//     // .eq("client_id", client_id);//.eq("branch_city", "wakad");

//     const { data, error } = await supabase
//     .from("leap_customer")
//     .select("*,leap_client(*,leap_client_branch_details (*))")
//     .eq("authUuid", authUUID);    

// if (error) {
//     return NextResponse.json({ status: 0, message: error.message }, { status: 400 });
// }

//  return NextResponse.json({
//     status: 1,
//     message: "Data Fetched Successfully",
    
//     client_data: data,
    
// }, { status: 200 });

// }


