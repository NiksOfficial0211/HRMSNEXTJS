import { NextRequest, NextResponse } from "next/server";
import { calculateNumDays, formatDateYYYYMMDD, funDataAddedSuccessMessage, funDataMissingError, funISDataKeyPresent, funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import { getAllActivitiesOfUsers } from "@/app/pro_utils/constantFunGetData";
import supabase from "../../supabaseConfig/supabase";
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
        // return NextResponse.json({ status: 1, message: "Announcement Added Successfully",data: fields.show_to_department[0][0] }, { status: apiStatusSuccessCode })

        // if (!files || !files.file) {
        //     return NextResponse.json({ error: "No files received." }, { status: 400 });
        // }

        let fileURL=""
        if (files && files.file && files.file[0]) {
            const currentDateTime = new Date();
            const uploadedFile = files.file[0];
            const fileBuffer = await fs.readFile(uploadedFile.path);
            const fileBlob = new Blob([fileBuffer], { type: uploadedFile.headers["content-type"] });
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

            let query = supabase.from('leap_client_announcements').update({
                announcement_image: fileUploadResponse.documentURL,

            }).eq("announcement_id", fields.announcement_id[0]);

            const { data: announcement, error: annError } = await query;
            if (annError) {
                return funSendApiErrorMessage(annError, "Announcemnt insert issue");
            }
        }
        console.log("outside of file call -------------------------------1");
        
        let isError=false;
        let num_of_days=0;
        if(fields.endDate && fields.endDate.length>0){
            num_of_days=calculateNumDays(new Date(fields.startDate[0]),new Date(fields.endDate[0]))

        }
        let query ;
        console.log("api announcement fields",fields);
        
        if(fields.endDate){
            query = supabase.from('leap_client_announcements')

            .update({
                
                announcement_title: fields.announcement_title[0],
                announcement_details: fields.announcement_details[0],
                announcement_type_id: parseInt(fields.announcement_type_id[0]),
                announcement_date:fields.startDate[0]? formatDateYYYYMMDD(fields.startDate[0]) : formatDateYYYYMMDD(new Date()),
                num_of_days:num_of_days,
                send_on_date:fields.startDate[0] || new Date().toISOString(),
                validity_date:formatDateYYYYMMDD(fields.endDate[0]),
                isEnabled:fields.is_enabled[0],
            }).eq("announcement_id", fields.announcement_id[0]);;
        }else{
            query = supabase.from('leap_client_announcements')

        .update({
            client_id:fields.client_id[0],
            branch_id:fields.branch_id[0],
            announcement_title: "First Check Static",
            announcement_details: fields.announcement_details[0],
            announcement_type_id: parseInt(fields.announcement_type_id[0]),
            announcement_date:fields.startDate[0]? formatDateYYYYMMDD(fields.startDate[0]) : formatDateYYYYMMDD(new Date()),
            send_on_date:fields.startDate[0] || new Date().toISOString(),
            num_of_days:num_of_days,
            isEnabled:fields.is_enabled[0]=="true"?true:false,
            created_at: new Date().toISOString()
        }).eq("announcement_id", fields.announcement_id[0]);;
        }

        const { error:updateAnnouncementError } = await query;
        if(updateAnnouncementError){
            return funSendApiErrorMessage(updateAnnouncementError,"Failed to update announcement")
        }
        const roleIDS = JSON.parse(fields.role_ids);
        const selectedBranches = JSON.parse(fields.selectedBranches);


        let currentAnouncementQuery = supabase
            .from('leap_show_announcement_users')
            .delete()
            .eq("announcement_id", fields.announcement_id[0]);
            console.log("outside of file call -------------------------------2");

        const { error:currentAnouncementError } = await currentAnouncementQuery;
        if(currentAnouncementError){
            return funSendApiErrorMessage(currentAnouncementError,"Failed to delete data")
        }
        if (selectedBranches!=null && selectedBranches.length>0 && roleIDS != null && roleIDS.length > 0 ) {
            for(let j=0;j<selectedBranches.length;j++){

            for (let i = 0; i < roleIDS.length; i++) {

                let queryDesignationAnnouncement = supabase.from('leap_show_announcement_users')
                    .insert({
                        branch_id:selectedBranches[j].id,
                        client_id:fields.client_id[0],
                        announcement_id:fields.announcement_id[0],
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
        
        return NextResponse.json({ status: 1, message: isError ? "Some Announcement data Updated" : "Announcement Updated Successfully" }, { status: apiStatusSuccessCode });
    } catch (error) {

        console.log(error);

        return funSendApiException(error);

    }
}




// if (selectedBranches != null && selectedBranches.length > 0 && roleIDS != null && roleIDS.length > 0) {
//     let queryDesignationAnnouncement ;
//     for (let j = 0; j < selectedBranches.length; j++) {
//         for (let i = 0; i < roleIDS.length; i++) {
//             for(let k=0;k<currentAnouncementData.length;k++){
//                 if(currentAnouncementData[k].role_id==roleIDS[i] && currentAnouncementData[k].branch_id==selectedBranches[j]){
//                     queryDesignationAnnouncement = supabase.from('leap_show_announcement_users')
//                     .update({
//                         branch_id: selectedBranches[j],
//                         client_id: fields.client_id[0],
//                         role_id: roleIDS[i],
//                         is_active:true,
//                         created_at: new Date().toISOString()
//                     }).eq("announcement_id", fields.announcement_id[0]);;
//                 }else{
//                     queryDesignationAnnouncement = supabase.from('leap_show_announcement_users')
//                     .update({
//                         branch_id: selectedBranches[j],
//                         client_id: fields.client_id[0],
//                         role_id: roleIDS[i],
//                         is_active:false,
//                         created_at: new Date().toISOString()
//                     }).eq("announcement_id", fields.announcement_id[0]);;
//                 }
//             }
           
//             console.log("outside of file call -------------------------------4");

//             const { error: queryDesignationAnnouncementError } = await queryDesignationAnnouncement!;
//             if (queryDesignationAnnouncementError) {

//                 console.log("queryDesignationAnnouncementError=======",queryDesignationAnnouncementError);

//                 isError = true;
//             }
//         }
//     }


// }
// }else{
// console.log("outside of file call -------------------------------2");

// let query;
// if (selectedBranches!=null && selectedBranches.length>0 && roleIDS != null && roleIDS.length > 0 ) {
//     for(let j=0;j<selectedBranches.length;j++){

//     for (let i = 0; i < roleIDS.length; i++) {

//         let queryDesignationAnnouncement = supabase.from('leap_show_announcement_users')
//             .insert({
//                 branch_id:selectedBranches[j].id,
//                 client_id:fields.client_id[0],
//                 announcement_id:fields.announcement_id[0],
//                 role_id:roleIDS[i].id,
//                 is_active:true,
//                 created_at: new Date().toISOString()
//             });
//             console.log("leap_show_announcement_users query is this====",queryDesignationAnnouncement);
            
//         const { error: queryDesignationAnnouncementError } = await queryDesignationAnnouncement;
//         if (queryDesignationAnnouncementError) {
//             console.log("leap_show_announcement_users",queryDesignationAnnouncementError);
                            
//             isError = true;
//         }
//     }
// }
// }

