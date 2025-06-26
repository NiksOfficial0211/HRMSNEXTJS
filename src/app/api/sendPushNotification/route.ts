import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/client";
import { funSendApiErrorMessage } from "@/app/pro_utils/constant";

async function getAccessToken() {
  const credentials = JSON.parse(process.env.FIREBASE_CREDENTIALS!);
  
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
  });

  const client = await auth.getClient();
  const token = await client.getAccessToken();
  console.log(token);
  
  return token?.token;
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
        const fdata = {

            title: formData.get('title'),
            customer_id: formData.get('customer_id'),
            message: formData.get('message'),
            client_id: formData.get('client_id'),
            attachment_url: formData.get('attachment_url'),
            navigation_url: formData.get('navigation_url'),
            
        }
  
  console.log("this is the navigation url in the send notification api",fdata.navigation_url);
      
  const supabase = createClient();
  
  let getFcmQuery = supabase
  .from("leap_customer_fcm_tokens")
  .select("fcm_token")
  if(fdata.customer_id){
    getFcmQuery=getFcmQuery.eq("customer_id",fdata.customer_id);
  } 

  const { data: tokens, error } =await getFcmQuery;
  if (error) {
    return funSendApiErrorMessage(error,"Failed to get Tokens with error");
  }
  let getWebFcmQuery = supabase
  .from("leap_customer_fcm_tokens")
  .select("web_fcm_tokens")
  if(fdata.customer_id){
    getWebFcmQuery=getWebFcmQuery.eq("customer_id",fdata.customer_id);
  } 

  const { data: webtokens, error:webError } =await getWebFcmQuery;
  if (webError ) {
    return funSendApiErrorMessage(error,"Failed to get Web Tokens with error");
  }
  if(!tokens || tokens.length === 0 || !webtokens || webtokens.length === 0){
    return funSendApiErrorMessage("Not a single token is available"+fdata.customer_id,"Failed to get Tokens");
  }
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ success: false, message: "Failed to get access token" });
  }

  const fcmUrl = `https://fcm.googleapis.com/v1/projects/leap-hrms2/messages:send`;

  // try {
  //   if(tokens){
  //   for (const tokenData of tokens) {
      
  //     const notificationPayload:any = {
  //       message: {
  //         token: tokenData.fcm_token,
  //         notification: { title:fdata.title, body: fdata.message },
  //       },
  //       data: {
  //         title: fdata.title,
  //         body: fdata.message,
  //         click_action: 'OPEN URL',
  //         url: fdata.navigation_url || '',
  //       }
  //     };
  //     if (fdata.attachment_url) {
  //       notificationPayload.message.data.attachment = fdata.attachment_url;
  //       notificationPayload.message.data.attachment_type = 'url';

  //       // You might want to add additional metadata about the attachment
  //       // notificationPayload.message.data.attachment_type = 'image'; // or 'file', 'pdf', etc.
  //     }
      

  //     const response = await fetch(fcmUrl, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //       body: JSON.stringify(notificationPayload),
  //     });

  //     if (!response.ok) {
  //       console.log(await response.json());
        
  //       // throw new Error(`FCM API error: ${response.statusText}`);
  //     }
      
  //   }
  // }
  // if(webtokens){
  //   for (const tokenData of webtokens) {
      
  //     const webNotificationPayload:any = {
  //       message: {
  //         token: tokenData.web_fcm_tokens,
  //         notification: { title:fdata.title, body: fdata.message },
  //       },
  //       data: {
  //         title: fdata.title,
  //         body: fdata.message,
  //         click_action: 'OPEN URL',
  //         url: fdata.navigation_url || '',
  //       }
  //     };
  //     if (fdata.attachment_url) {
  //       webNotificationPayload.message.data.attachment = fdata.attachment_url;
  //       webNotificationPayload.message.data.attachment_type = 'url';
  //       // You might want to add additional metadata about the attachment
  //       // webNotificationPayload.message.data.attachment_type = 'image'; // or 'file', 'pdf', etc.
  //     }
  //     const webResponse = await fetch(fcmUrl, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //       body: JSON.stringify(webNotificationPayload),
  //     });

  //     if (!webResponse.ok) {

  //       // throw new Error(`WEB TOKEN FCM API error: ${webResponse.statusText}`);
  //     }
  //   }
  // }

  //   return NextResponse.json({ success: true, message: "Notifications sent successfully" });
  // } catch (err: any) {
  //   return NextResponse.json({ success: false, message: err.message });
  // }


  try {
    if(tokens) {
      for (const tokenData of tokens) {
        // Mobile notification payload
        const notificationPayload: any = {
          message: {
            token: tokenData.fcm_token,
            notification: { 
              title: fdata.title, 
              body: fdata.message 
            },
            data: {
              title: fdata.title,
              body: fdata.message,
              click_action: 'FLUTTER_NOTIFICATION_CLICK', // Standard for Flutter
              url: fdata.navigation_url || '', // Always include URL
            }
          }
        };

        // Add attachment if present
        if (fdata.attachment_url) {
          notificationPayload.message.data.attachment = fdata.attachment_url;
          notificationPayload.message.data.attachment_type = 'url'; // Set once
        }

        const response = await fetch(fcmUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(notificationPayload),
        });

        if (!response.ok) {
          console.log(await response.json());
        }
      }
    }

    if(webtokens) {
      for (const tokenData of webtokens) {
        // Web notification payload
        const webNotificationPayload: any = {
          message: {
            token: tokenData.web_fcm_tokens,
            notification: { 
              title: fdata.title, 
              body: fdata.message 
            },
            data: {
              title: fdata.title,
              body: fdata.message,
              click_action: 'OPEN_URL',
              url: fdata.navigation_url || '',
            },
            webpush: {
              headers: {
                Urgency: "high"
              },
              fcm_options: {
                link: fdata.navigation_url || '/'
              }
            }
          }
        };

        // Add attachment for web
        if (fdata.attachment_url) {
          webNotificationPayload.message.data.attachment = fdata.attachment_url;
          webNotificationPayload.message.webpush.notification = {
            image: fdata.attachment_url,
            actions: [{
              action: "view_attachment",
              title: "View Attachment",
              icon: fdata.attachment_url
            }]
          };
        }

        const webResponse = await fetch(fcmUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(webNotificationPayload),
        });

        if (!webResponse.ok) {
          // console.log(await webResponse.json());
        }
      }
    }
  //   const now = new Date()
  //   const { data: attendances, error } = await supabase
  //   .from('leap_customer_attendance')
  //   .select('attendance_id, customer_id, in_time,leap_customer!leap_customer_attendance_employee_id_fkey(branch_id)')
  //   .eq('date', now.toISOString().split('T')[0])as unknown as { data: AttendanceWithBranch[]; error: any }
  
  // if (error) return funSendApiErrorMessage(error,"failed to get attendances data")
  // console.log("this is the attendances data---->",attendances);
    
  // let allattendanceCuurentHoursTime:any[]=[];
  // for (const attendance of attendances) {
  //   const startTime = new Date(attendance.in_time)
  //   const diffMinutes = Math.floor((now.getTime() - startTime.getTime()) / 60000)

  //   const { data: workingPolicy } = await supabase
  //     .from('leap_client_working_hour_policy')
  //     .select('full_day')
  //     .eq('branch_id', attendance.leap_customer.branch_id)
  //     .single()
  //   console.log("This is the working policy data");

  //   if (workingPolicy && diffMinutes > workingPolicy.full_day) {
  //     allattendanceCuurentHoursTime.push("loggedInTimeTime-->"+startTime+"current Time"+now+"true-->"+diffMinutes);
  //   }else{
  //     allattendanceCuurentHoursTime.push("loggedInTimeTime-->"+startTime+"current Time"+now+"false-->"+diffMinutes)
  //   }
      
  // }
    return NextResponse.json({ success: true, message: "Notifications sent successfully"});
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message });
  }
}


interface AttendanceWithBranch {
  attendance_id: number
  customer_id: number
  in_time: string
  leap_customer: {
    branch_id: number
  }
}