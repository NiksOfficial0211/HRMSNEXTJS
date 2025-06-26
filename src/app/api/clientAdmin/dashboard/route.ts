import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { allClientsData, allEmployeeListData, apiStatusFailureCode, apiStatusSuccessCode, apiwentWrong } from "@/app/pro_utils/stringConstants";
import { funloggedInAnotherDevice, funSendApiException } from "@/app/pro_utils/constant";
import { funGetAnnouncements, funGetClientCustomerList, funGetClientEmployeeAttendance, funGetClientEmployeeAttendanceforManager, funGetClientEmployeeLeaveRequest, funGetClientEmployeeList, funGetClientEmployeeListForManager, funGetClientEmployeeSummary, funGetClientHolidayList, funGetClientList, funGetClientUpCommingHolidayList, funGetCustomer, funGetEmpBirthdayList, funGetEmployeeLeaveRequest, funGetEmployeeLeaveRequestforManager, funGetMidShortCutsList, funGetMyLeaveBalance, funGetShortCutsOneList, getAllActivitiesOfUsers, getDashboardAllActivitiesOfUsers, getMyAttendance, getMyDocumentsList, getMyPresentTeam, getUserRoles, isAuthTokenValid } from "@/app/pro_utils/constantFunGetData";
import { platform } from "os";

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
      clientId: formData.get('client_id'),
      customerId: formData.get('customer_id'),
      roleId: formData.get('role_id') as string,
      platform:formData.get('platform'),
      authToken:formData.get('auth_token'),
      version:formData.get('version')
    }
    if(fdata.platform && fdata.customerId && fdata.authToken){
    if(!await isAuthTokenValid(fdata.platform,fdata.customerId,fdata.authToken)){
      return funloggedInAnotherDevice()
    }
    }
    const getCustomerInfo = await funGetCustomer(fdata.customerId)
    if (getCustomerInfo == null) {
      return funSendApiException("Customer fetch failed")
    }
    // return funGetEmployeeLeaveRequestforManager(fdata.clientId, null, new Date(), null,fdata.customerId, false  );
    // const getRoles=await getUserRoles()
    // if(getRoles==null){
    //  return funSendApiException("Roles fetch went wrong")
    // }
    if(fdata.roleId! && fdata.roleId == "1"){
      return NextResponse.json({
        message: allEmployeeListData,
        clientList: await funGetClientList(),
        customerList: 
                      await funGetClientCustomerList(fdata.clientId) ,
        employeeSummary:  null,    
        employees: await funGetClientEmployeeList(fdata.clientId,0,parseInt(fdata.roleId),true),
        leaveRequest:  null,
        employeeAttendance: null,
        holidayList: await funGetClientHolidayList(fdata.clientId, null,fdata.platform),
        upcommingHolidays: await funGetClientUpCommingHolidayList(fdata.clientId,null,fdata.platform),
        myattendance: null,
      },
        { status: apiStatusSuccessCode });
    }
    else if(fdata.roleId! && fdata.roleId == "2"){
      return NextResponse.json({
        message: allEmployeeListData,
        clientList: null,
        // customerList: await funGetClientCustomerList(fdata.clientId),
        midShortcutsList:await funGetMidShortCutsList(fdata.clientId),
        shortCutOne:await funGetShortCutsOneList(fdata.clientId),
        employeeSummary:   await funGetClientEmployeeSummary(fdata.clientId),    
        employees: await funGetClientEmployeeList(fdata.clientId,5,parseInt(fdata.roleId),true),
        // leaveRequest: await funGetClientEmployeeLeaveRequest(fdata.clientId, null, new Date(), null, false),
        employeeAttendance: await funGetClientEmployeeAttendance(fdata.clientId, new Date()) ,
        instantNotify: await getDashboardAllActivitiesOfUsers(fdata.clientId,null),
        // holidayList: await funGetClientHolidayList(fdata.clientId, null),
        // upcommingHolidays: await funGetClientUpCommingHolidayList(fdata.clientId,null),
        // myattendance: await getMyAttendance(fdata.customerId, fdata.clientId, new Date()),
      },
        { status: apiStatusSuccessCode });
    }
    else if(fdata.roleId! && fdata.roleId == "3"){
      return NextResponse.json({
        message: allEmployeeListData,
        clientList: null,
        customerList: null,
        employeeSummary: null,    
        employees: await funGetClientEmployeeList(fdata.clientId,0,parseInt(fdata.roleId),true),
                    
        leaveRequest:
          await funGetClientEmployeeLeaveRequest(fdata.clientId, null, new Date(), null, false),
          
        employeeAttendance: 
        await funGetClientEmployeeAttendance(fdata.clientId, new Date()),
        
        holidayList: await funGetClientHolidayList(fdata.clientId, null,fdata.platform),
        upcommingHolidays: await funGetClientUpCommingHolidayList(fdata.clientId,null,fdata.platform),
        myattendance: await getMyAttendance(fdata.customerId, fdata.clientId, new Date()),
      },
        { status: apiStatusSuccessCode });
    }else if(fdata.roleId! && (fdata.roleId == "4"|| fdata.roleId == "9")){
      return NextResponse.json({
        message: allEmployeeListData,
           
        employees: funGetClientEmployeeListForManager(fdata.clientId,fdata.customerId),
        leaveRequest: 
            await funGetEmployeeLeaveRequestforManager(fdata.clientId, null, new Date(), null,  fdata.customerId,false),
        
        upcommingHolidays: await funGetClientUpCommingHolidayList(fdata.clientId,null,fdata.platform),
        myattendance: await getMyAttendance(fdata.customerId, fdata.clientId, new Date()),
        my_documents: await getMyDocumentsList(fdata.customerId),
        my_leave_requests:await funGetEmployeeLeaveRequest(fdata.customerId,0),
        myLeaveBalances:await funGetMyLeaveBalance(fdata.clientId,fdata.customerId,0),
        announcements:await funGetAnnouncements(fdata.clientId,fdata.customerId,fdata.roleId),
        birthdays:await funGetEmpBirthdayList(fdata.clientId,fdata.customerId,false),
        mypresentTeam:await getMyPresentTeam(fdata.clientId,fdata.customerId),


      },
        { status: apiStatusSuccessCode });
    }
    else if(fdata.roleId! && fdata.roleId == "5"){

    return NextResponse.json({
      message: allEmployeeListData,
      
      leaveRequest: null,
      employeeAttendance: null,
      upcommingHolidays: await funGetClientUpCommingHolidayList(fdata.clientId,null,fdata.platform),
      myattendance: await getMyAttendance(fdata.customerId, fdata.clientId, new Date()),
      my_documents: await getMyDocumentsList(fdata.customerId),
      my_leave_requests:await funGetEmployeeLeaveRequest(fdata.customerId,0),
      myLeaveBalances:await funGetMyLeaveBalance(fdata.clientId,fdata.customerId,0),
      announcements:await funGetAnnouncements(fdata.clientId,fdata.customerId,fdata.roleId),
      birthdays:await funGetEmpBirthdayList(fdata.clientId,fdata.customerId,false),

      mypresentTeam:null,

    },
      { status: apiStatusSuccessCode });
  }
  } catch (error) {
    return funSendApiException(error);
  }
}



