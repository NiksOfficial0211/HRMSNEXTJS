import { NextRequest, NextResponse } from "next/server";
import { addDays, calculateNumDays, dashedDateYYYYMMDD, formatDateYYYYMMDD, funDataAddedSuccessMessage, funDataMissingError, funISDataKeyPresent, funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import supabase from "../../supabaseConfig/supabase";
import fs from "fs/promises";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";


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
        // return NextResponse.json({ status: 1, message: "Announcement Added Successfully",data: fields.show_to_department[0][0] }, { status: apiStatusSuccessCode })
        
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
        formData.append("branch_id", fields.branch_id[0]);
        formData.append("docType", "announcement");
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
        // return NextResponse.json({ status: 1, message: "Ann  ouncement Added Successfully",data: designationIDs,departmentIDs }, { status: apiStatusSuccessCode })
        
        // return NextResponse.json({satatus:1,message: " Date issue",data:addDays(formatDate, parseInt(fields.num_of_days[0]))},{status:200})
        let isError=false;
        let num_of_days=0;
        if(fields.endDate && fields.endDate.length>0){
            num_of_days=calculateNumDays(new Date(fields.startDate[0]),new Date(fields.endDate[0]))

        }

        console.log("startdate===============",fields.is_enabled);
        console.log("end_date==================",fields.endDate[0]);
        
        let query ;
        if(fields.endDate && fields.endDate.length>0 && fields.endDate[0]){
            query = supabase.from('leap_client_announcements')

            .insert({
                client_id:fields.client_id[0],
                branch_id:fields.branch_id[0],
                announcement_title: fields.announcement_title[0],
                announcement_details: fields.announcement_details[0],
                announcement_type_id: parseInt(fields.announcement_type_id[0]),
                announcement_image: fileUploadResponse.documentURL,
                send_on_date: fields.startDate[0],
                announcement_date:fields.startDate[0]? formatDateYYYYMMDD(fields.startDate[0]) : formatDateYYYYMMDD(new Date()),
                num_of_days:num_of_days,
                validity_date:formatDateYYYYMMDD(fields.endDate[0]),
                isEnabled:fields.is_enabled[0],
                
                created_at: new Date().toISOString()
            }).select();
        }else{
            query = supabase.from('leap_client_announcements')

        .insert({
            client_id:fields.client_id[0],
            branch_id:fields.branch_id[0],
            announcement_title: fields.announcement_title[0],
            announcement_details: fields.announcement_details[0],
            announcement_type_id: parseInt(fields.announcement_type_id[0]),
            announcement_image: fileUploadResponse.documentURL,
            announcement_date:fields.startDate[0]? formatDateYYYYMMDD(fields.startDate[0]) : formatDateYYYYMMDD(new Date()),
            send_on_date:fields.startDate[0] || new Date().toISOString(),
            num_of_days:num_of_days,
            isEnabled:fields.is_enabled[0]=="true"?true:false,
            created_at: new Date().toISOString()
        }).select();
        }
         
        console.log("this is the announcement query ====-==-=-==-=-==-==-=-=-=-",query);
        
    const {data:announcement, error: annError } = await query;

    if(annError){
        return funSendApiErrorMessage(annError,"Announcemnt insert issue");
    }
    const roleIDS = JSON.parse(fields.role_ids);
    const selectedBranches = JSON.parse(fields.selectedBranches);

    if (selectedBranches!=null && selectedBranches.length>0 && roleIDS != null && roleIDS.length > 0 ) {
            for(let j=0;j<selectedBranches.length;j++){

            for (let i = 0; i < roleIDS.length; i++) {

                let queryDesignationAnnouncement = supabase.from('leap_show_announcement_users')
                    .insert({
                        branch_id:selectedBranches[j].id,
                        client_id:fields.client_id[0],
                        announcement_id:announcement![0].announcement_id,
                        role_id:roleIDS[i].id,
                        is_active:true,
                        created_at: new Date().toISOString()
                    });
                    console.log("leap_show_announcement_users query is this====",queryDesignationAnnouncement);
                    
                const { error: queryDesignationAnnouncementError } = await queryDesignationAnnouncement;
                if (queryDesignationAnnouncementError) {
                    console.log("leap_show_announcement_users",queryDesignationAnnouncementError);
                                    
                    isError = true;
                }
            }
        }

        }
        return NextResponse.json({ status: 1, message: isError?"Some Announcement data Added":"Announcement Added Successfully" }, { status: apiStatusSuccessCode });

    } catch (error) { 
        return funSendApiException(error);
    }
}