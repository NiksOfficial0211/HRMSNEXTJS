import { NextRequest, NextResponse } from "next/server";
import { funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import { getAllActivitiesOfUsers } from "@/app/pro_utils/constantFunGetData";
import supabase from "../../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import fs from "fs/promises";
import { apiUploadDocs } from "@/app/pro_utils/constantFunAddData";

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
    const { fields, files } = await parseForm(request);

    if (!files || !files.file) {
            return NextResponse.json({ error: "No files received." }, { status: 400 });
        }
        let fileUploadResponse;
            if(files || files.file[0]){
                  fileUploadResponse=await apiUploadDocs(files.file[0],fields.branch_id[0],fields.client_id,"client_sub_project_doc")
              
            }
    const { data: documents, error } = await supabase.from("leap_client_documents")
      .insert({
        // client_id
        // branch_id
        // document_type_id
        // document_url
        // created_at:new Date(),
        // show_to_employees
      })

    if (error) {
      return funSendApiErrorMessage(error, "Failed To Fetch Documents");
    }
    else {
      return NextResponse.json({ status: 1, message: "Documents Validity", data: documents },
        { status: apiStatusSuccessCode });
    }



  } catch (error) {


    return funSendApiException(error);

  }
}