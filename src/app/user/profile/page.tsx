'use client'
import Footer from '@/app/components/footer';
import LeapHeader from '@/app/components/header'
import LeftPannel from '@/app/components/leftPannel'
import React, { useEffect, useState } from 'react'
import { createWorker } from 'tesseract.js';
import { funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import supabase from '@/app/api/supabaseConfig/supabase';
import { error } from 'console';
import { CustomerProfile, LeapRelations } from '@/app/models/employeeDetailsModel';
import LoadingDialog from '@/app/components/PageLoader';
import { UserEmployement } from '@/app/components/profileEmployementUser';
import { UserAddress } from '@/app/components/profileAddressUser';
import { UserBankDetails } from '@/app/components/profileBankDetailsUser';
import { UserPersonalDetails } from '@/app/components/profilePersonalDetailsUser';
import { clientAdminDashboard, employeeProfileDetails, staticIconsBaseURL } from '@/app/pro_utils/stringConstants';
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext';
import { UserProfileLeaveDetails } from '@/app/components/profileLeaveDetailsUser';

// interface FormValues {
//     name: string,
//     contact_number: string
//     email_id: string
//     personalEmail: string
//     dob: string
//     gender: string
//     date_of_joining: string
//     employment_status: string
//     device_id: string
//     emergency_contact: string
//     contact_name: string
//     relation: string
//     manager_id: string
//     designation_id: string
//     branch_id: string
//     marital_status: string
//     nationality: string
//     blood_group: string
//     department_id: any
//     employment_type: string
//     work_location: string

//     city: string
//     state: string
//     country: string
//     postal_code: string
//     address_type: string
//     address_line1: string
//     address_line2: string

//     IFSC_code: string
//     bank_name: string
//     client_id: string
//     PAN_number: string
//     TIN_number: string
//     UAN_number: string
//     ESIC_number: string
//     branch_name: string
//     account_number: string
//     security_insurance_no: string
// }

const EmployeeProfile = () => {
    const [userData, setUserData] = useState<CustomerProfile>();
    const [scrollPosition, setScrollPosition] = useState(0);
    const [designationArray, setDesignations] = useState<DesignationTableModel[]>([]);
    const [departmentArray, setDepartment] = useState<DepartmentTableModel[]>([]);
    const [EmploymentTypeArray, setEmployementTypeArray] = useState<ClientEmployementType[]>([]);
    const [managerArray, setManagerArray] = useState<RoleManagerNameModel[]>([]);
    const [emergencyContactRelation, setEmergencyRelation] = useState<LeapRelations[]>([]);
    const [isChecked, setIsChecked] = useState(true);
    const [selectedMaritialStatus, setMaritialStatus] = useState("Single");
    const { contextClientID, contaxtBranchID, contextCustomerID, contextRoleID, contextSelectedCustId,
        setGlobalState } = useGlobalContext();
    const [viewIndex, setViewIndex] = useState(0);

    useEffect(() => {

        const fetchData = async () => {

            const designationType = await getDesignations();
            setDesignations(designationType);
            const departmentType = await getDepartments();
            setDepartment(departmentType);
            const managerName = await getManagers();
            setManagerArray(managerName);
            const employmentsType = await getEmploymentType();
            setEmployementTypeArray(employmentsType);
            const relationsType = await getRelations();
            setEmergencyRelation(relationsType);

            try {

                const res = await fetch("/api/users/getProfile", {
                    method: "POST",
                    body: JSON.stringify({
                        "client_id": contextClientID,
                        "customer_id": contextSelectedCustId,
                    }),
                });
                console.log(res);

                const response = await res.json();
                console.log(response);

                const user = response.customer_profile[0];
                setUserData(user);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
        fetchData();
        const handleScroll = () => {
            setScrollPosition(window.scrollY); // Update scroll position
            const element = document.querySelector('.mainbox');
            if (window.pageYOffset > 0) {
                element?.classList.add('sticky');
            } else {
                element?.classList.remove('sticky');
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {

            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    return (
        <div className='mainbox'>
            <header>
                <LeapHeader title={employeeProfileDetails} />
            </header>

            <LeftPannel menuIndex={0} subMenuIndex={0} showLeftPanel={true} rightBoxUI={

                userData! ?
                    <div className='container'>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="user_my_profile_mainbox">
                                    <div className="user_my_profile_leftbox">
                                        <div className="user_my_profile_leftbox_sticky">
                                            < UserPersonalDetails />
                                        </div>
                                    </div>
                                    <div className="user_my_profile_rightbox">
                                        <div className="user_employeement_other_detail_tabing">
                                            <ul>
                                                <li><a href="#employement_id">
                                                    <div className='' onClick={(e) => { setViewIndex(0) }}>
                                                        <div className={viewIndex == 0 ? "nw_user_inner_listing_selected" : "nw_user_inner_listing"}>
                                                            <span><img src={staticIconsBaseURL+"/images/user/user-profile-tabbing-1.svg"} alt="" className="img-fluid" /></span><span> Employement Details</span>
                                                        </div>
                                                    </div></a>
                                                </li>
                                                <li><a href="#address_id">
                                                    <div className='' onClick={(e) => { setViewIndex(1) }}>
                                                        <div className={viewIndex == 1 ? "profile_selected_tab" : "profile_unselected_tab"}>
                                                            <span><img src={staticIconsBaseURL+"/images/user/user-profile-tabbing-2.svg"} alt="" className="img-fluid" /></span><span> Address</span>
                                                        </div>
                                                    </div></a>
                                                </li>
                                                <li><a href="#bank_id">
                                                    <div className='' onClick={(e) => { setViewIndex(2) }}>
                                                        <div className={viewIndex == 2 ? "profile_selected_tab" : "profile_unselected_tab"}>
                                                            <span><img src={staticIconsBaseURL+"/images/user/user-profile-tabbing-3.svg"} alt="" className="img-fluid" /></span><span> Bank Details</span>
                                                        </div>
                                                    </div></a>
                                                </li>
                                                <li><a href="#leave_id">
                                                    <div className='' onClick={(e) => { setViewIndex(3) }}>
                                                        <div className={viewIndex == 3 ? "profile_selected_tab" : "profile_unselected_tab"}>
                                                            <span><img src={staticIconsBaseURL+"/images/user/user-profile-tabbing-4.svg"} alt="" className="img-fluid" /></span><span> Leave Details</span>
                                                        </div>
                                                    </div></a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="user_employeement_other_detail_tabing_content">
                                            <div className="user_my_employement_details_box">
                                                < UserEmployement />
                                            </div>
                                            <div className="user_my_address_details_box">
                                                < UserAddress />
                                            </div>
                                            <div className="user_my_bank_details_box">
                                                < UserBankDetails />
                                            </div>
                                            <div className="user_my_leave_details_box">
                                                < UserProfileLeaveDetails />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="row mb-4">
                            <div className="col-lg-12">
                                <div className="employee_details_tabbing">
                                    <div className="list_view_box" onClick={(e) => setViewIndex(0)}>
                                        <a >
                                            <div className="list_view_heading">
                                                Employement Details

                                            </div>
                                        </a>
                                    </div>
                                    <div className="list_view_box" onClick={(e) => setViewIndex(1)}>
                                        <a >
                                            <div className="list_view_heading">
                                                Address

                                            </div>
                                        </a>
                                    </div>
                                    <div className="list_view_box" onClick={(e) => setViewIndex(2)}>
                                        <a >
                                            <div className="list_view_heading">
                                                Bank Details

                                            </div>
                                        </a>
                                    </div>
                                    <div className="list_view_box" onClick={(e) => setViewIndex(3)}>
                                        <a >
                                            <div className="list_view_heading">
                                                Leave Details

                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-8">
                                {viewIndex == 0 ?
                                    < UserEmployement /> : viewIndex == 1 ?
                                        < UserAddress /> : viewIndex == 2 ?
                                            < UserBankDetails /> : viewIndex == 3 ? < UserProfileLeaveDetails /> : <div />
                                }
                            </div>
                            <div className="col-lg-4">
                                <div className="container">
                                    <div className="row">
                                        < UserPersonalDetails />
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                    : <LoadingDialog isLoading={true} />
            } />
            < Footer />
        </div>
    )
}
export default EmployeeProfile
async function getDesignations() {
    let query = supabase
        .from('leap_client_designations')
        .select();

    const { data, error } = await query;
    if (error) {


        return [];
    } else {


        return data;
    }
}
async function getDepartments() {

    let query = supabase
        .from('leap_client_departments')
        .select();

    const { data, error } = await query;
    if (error) {
        // console.log(error);

        return [];
    } else {
        // console.log(data);
        return data;
    }

}
async function getEmploymentType() {

    let query = supabase
        .from('leap_employement_type')
        .select();

    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {
        return data;
    }

}
async function getManagers() {
    const clientID = 3;
    let query = supabase
        .from('leap_customer')
        .select("customer_id,emp_id,name,client_id,branch_id")
        .eq("client_id", 3);

    if (clientID == 3) {
        query = query.eq("user_role", 4);
    } else {
        query = query.eq("user_role", 6);
    }

    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {
        return data;
    }

}

async function getRelations() {

    let query = supabase
        .from('leap_relations')
        .select();

    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {


        return data;
    }
}

async function getDesignationSetUserRole(designation_id: any) {
    let userRole = { role: 5, isMAnager: false, isTeamlead: false, isemployee: true }
    const { data: Designation, error: desigError } = await supabase.from('leap_client_designations').select('*').eq('id', designation_id);
    console.log("this isthe designation got------", Designation);
    if (Designation![0].designation_name.toLowerCase().includes('manager')) {
        userRole = { role: 4, isMAnager: true, isTeamlead: false, isemployee: false }
    } else if (Designation![0].designation_name.toLowerCase().includes('team lead')) {
        userRole = { role: 9, isMAnager: false, isTeamlead: true, isemployee: false }
    }

    return userRole;
}
