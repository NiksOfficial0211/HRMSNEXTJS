import { funSendApiException, parseForm } from "@/app/pro_utils/constant";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import { apiStatusFailureCode, apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";

export async function POST(request: NextRequest) {

    try {
            const { fields, files } = await parseForm(request);
            if (!files || !files.file) {
                return NextResponse.json({ error: "No files received." }, { status: 400 });
            }

        const uploadedFile = files.file[0];
        const fileBuffer = await fs.readFile(uploadedFile.path);


const fileBlob = new Blob([new Uint8Array(fileBuffer)], {
            type: uploadedFile.headers["content-type"]
          });
        const formData = new FormData();
        formData.append("client_id", fields.client_id[0]);
        formData.append("customer_id", fields.customer_id[0]);
        formData.append("docType", fields.docName[0] || "");
        formData.append("file", fileBlob, uploadedFile.originalFilename);



        const fileUploadURL = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/UploadFiles", {
            method: "POST",
            // headers:{"Content-Type":"multipart/form-data"},
            body: formData,
        });

        const fileUploadResponse = await fileUploadURL.json();
        if (fileUploadResponse.error) {
            return NextResponse.json({ status: 0,message:"Unable to upload file",error: "File upload api call error" }, { status: apiStatusFailureCode });
        }
        return NextResponse.json({status:1 ,message: "File uploaded", data:fileUploadResponse.documentURL}, { status: apiStatusSuccessCode })

    }catch(e){
        console.log(error);
        return funSendApiException(error)
        
    }
}