import { NextRequest, NextResponse } from "next/server";
import { funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import { getAllActivitiesOfUsers } from "@/app/pro_utils/constantFunGetData";
import supabase from "../../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
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
        const uploadedFile = files.file[0];
                const fileBuffer = await fs.readFile(uploadedFile.path);
                const fileBlob = new Blob([fileBuffer], { type: uploadedFile.headers["content-type"] });
                const formData = new FormData();
                formData.append("client_id", fields.client_id[0]);
                formData.append("branch_id", fields.branch_id[0]);
                formData.append("docType", "company");
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