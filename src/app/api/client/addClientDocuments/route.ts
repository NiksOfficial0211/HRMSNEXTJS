import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusInvalidDataCode, apiStatusSuccessCode, clientAddedFailed, clientAddedSuccess, apifailedWithException, apiStatusFailureCode } from "@/app/pro_utils/stringConstants";
import { funDataAddedSuccessMessage, funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";

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
      return NextResponse.json({ error: "No files received." }, { status: apiStatusInvalidDataCode });
    }

    const currentDateTime = new Date();
    const uploadedFile = files.file[0];
    const fileBuffer = await fs.readFile(uploadedFile.path);


    const fileBlob = new Blob([fileBuffer], { type: uploadedFile.headers["content-type"] });

    const formData = new FormData();
    formData.append("client_id", fields.client_id[0]);
    formData.append("customer_id", fields.customer_id[0]);
    formData.append("docType", "clients");
    formData.append("file", fileBlob, uploadedFile.originalFilename);



    const fileUploadURL = await fetch(process.env.NEXT_PUBLIC_UPLOAD_IMAGE_BASE_URL + "/api/UploadFiles", {
      method: "POST",
      // headers:{"Content-Type":"multipart/form-data"},
      body: formData,
    });

    const fileUploadResponse = await fileUploadURL.json();
    // return NextResponse.json({ message: "FIle uploaded successfully",status:1,fileUploadResponse }, { status: apiStatusSuccessCode })

    if (fileUploadResponse.error) {
      return NextResponse.json({ error: "File upload api call error" }, { status: apiStatusFailureCode });
    }
    const {error} = await supabase.from("leap_client_documents")
                        .insert({client_id:fields.client_id[0],branch_id:fields.branch_id[0],
                          document_type_id:fields.document_type_id[0],
                          document_url:fileUploadResponse.documentURL,
                          created_at:new Date()
                        });


if (error) {
      console.log(error);
      
      return NextResponse.json({ message: "file upload data insert error :- ",error:error ,status:0}, { status: apiStatusFailureCode });
    }
  else{
    return NextResponse.json({ message: "FIle uploaded successfully",status:1 }, { status: apiStatusSuccessCode })
  }  

  } catch (error) {
    return funSendApiException(error);

  }
}