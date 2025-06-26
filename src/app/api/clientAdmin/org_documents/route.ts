import { NextRequest, NextResponse } from "next/server";
import { funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import { getAllActivitiesOfUsers } from "@/app/pro_utils/constantFunGetData";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode, companyDocUpload } from "@/app/pro_utils/stringConstants";
import fs from "fs/promises";

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
        const {data:docType,error:docTypeError}= await supabase.from("leap_document_type").select("document_name").eq("id",fields.doc_type_id[0]);
        if(docTypeError){
          return funSendApiErrorMessage(docTypeError,"Failed to get Document Type");

        }
        console.log("thsi is the doc type response ----==-=-=-",docType);
        
        const uploadedFile = files.file[0];
                const fileBuffer = await fs.readFile(uploadedFile.path);
                const fileBlob = new Blob([fileBuffer], { type: uploadedFile.headers["content-type"] });
                const formData = new FormData();
                formData.append("client_id", fields.client_id[0]);
                formData.append("customer_id", fields.customer_id[0]);
                formData.append("branch_id", fields.branch_id[0]);
                
                formData.append("docType", docType[0].document_name);
                formData.append("file", fileBlob, uploadedFile.originalFilename);
                const fileUploadURL = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/UploadFiles", {
                    method: "POST",
                    // headers:{"Content-Type":"multipart/form-data"},
                    body: formData,
                });
        
                const fileUploadResponse = await fileUploadURL.json();
                if (fileUploadResponse.error) {
                    return NextResponse.json({ error: "File upload api call error" }, { status: 500 });
                }

    let query=null;
    if(fields.uploadType[0]==companyDocUpload){
        query = supabase.from("leap_client_documents")
        .insert({
          client_id:fields.client_id[0],
          branch_id:fields.customer_id[0],
          document_type_id:fields.doc_type_id[0],
          document_url:fileUploadResponse.documentURL,
          created_at:new Date(),
          show_to_employees:fields.show_to_users[0],
        });
  
    }else{
      query = supabase.from("leap_customer_documents")
        .insert({
          client_id:fields.client_id[0],
          customer_id:fields.customer_id[0],
          doc_type_id:fields.doc_type_id[0],
          bucket_url:fileUploadResponse.documentURL,
          created_at:new Date(),
          isEnabled:true,
        });
    }         
    const { data: documents, error } = await query;
    if (error) {
      return funSendApiErrorMessage(error, "Failed To Fetch Documents");
    }
    else {
      return NextResponse.json({ status: 1, message: "Document uploaded", data: documents },
        { status: apiStatusSuccessCode });
    }



  } catch (error) {

    console.log(error);
    
    return funSendApiException(error);

  }
}