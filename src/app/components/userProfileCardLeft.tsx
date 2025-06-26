// 'use client'
// import Head from 'next/head';
// import React from 'react'
// import { Employee } from '../models/clientAdminEmployee';
// import supabase from '../api/supabaseConfig/supabase';
// import { useRouter } from 'next/navigation';
// import { pageURL_editUserPorifle } from '../pro_utils/stringRoutes';
// import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';

// const UserProfileLeft = ({ card }: { card: Employee }) => {
//     const {contextClientID,contaxtBranchID,contextCompanyName,contextCustomerID,contextEmployeeID,
//         contextLogoURL,contextRoleID,contextProfileImage,contextUserName,
//          setGlobalState}=useGlobalContext();
//     const router = useRouter()
//     const callResetDeviceID = async () => {
//         try {
//             const { error } = await supabase
//                 .from('leap_customer')
//                 .update({ device_id: null }) // Set device_id to null or the desired reset value
//                 .eq('customer_id', card.customer_id);

//             if (error) {
//                 alert(`Error resetting device ID: ${error.message}`);
//             } else {
//                 alert('Device ID reset successfully');
//             }
//         } catch (err) {
//             console.error('Unexpected error:', err);
//             alert('An unexpected error occurred while resetting the device ID.');
//         }
//     };

//     const navigateToProfile = () => {
//         setGlobalState({
//             contextUserName: contextUserName,
//             contextClientID: contextClientID,
//             contaxtBranchID: contaxtBranchID,
//             contextCustomerID: contextCustomerID,
//             contextRoleID: contextRoleID,
//             contextProfileImage: contextProfileImage,
//             contextEmployeeID: contextEmployeeID,
//             contextCompanyName: contextCompanyName,
//             contextLogoURL: contextLogoURL,
//             contextSelectedCustId: card.customer_id+'',
//             contextAddFormEmpID: '',
//             contextAnnouncementID:'',
//             contextAddFormCustID: '',
//             dashboard_notify_cust_id: '',
//             dashboard_notify_activity_related_id: '',
//             selectedClientCustomerID: '',
//             contextPARAM7: '',
//             contextPARAM8: '',

//         });
//         router.push(pageURL_editUserPorifle);
//     }

//     return (
//         <div>
//             <div className="userlist_actionbox">
//                 <a onClick={navigateToProfile} style={{ cursor: 'pointer' }}><img src="../images/userlist/edit.png" className="img-fluid" /><div>Edit {card.customer_id}</div></a>
//                 <a onClick={callResetDeviceID} style={{ cursor: 'pointer' }}><img src="../images/userlist/reset.png" className="img-fluid" /><div>Reset Device ID</div></a>
//                 <a href="#"><img src="../images/userlist/password.png" className="img-fluid" /><div>Password</div></a>
//             </div>
//         </div>

//     )
// }
// export default UserProfileLeft



//////desgin changes shared by swapnil on 11 april 2025

'use client'
import Head from 'next/head';
import React, { useState } from 'react'
import { Employee } from '../models/clientAdminEmployee';
import supabase from '../api/supabaseConfig/supabase';
import { useRouter } from 'next/navigation';
import { pageURL_editUserPorifle } from '../pro_utils/stringRoutes';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import { staticIconsBaseURL } from '../pro_utils/stringConstants';
import DialogUpdateEmployeeHierarchy from './dialog_UpdateEmployeeHierarchy';

const UserProfileLeft = ({ card,isHerarchy,callFetchData }: { card: any,isHerarchy:boolean,callFetchData:() => void }) => {
    const {contextClientID,contaxtBranchID,contextCompanyName,contextCustomerID,contextEmployeeID,
        contextLogoURL,contextRoleID,contextProfileImage,contextUserName,
         setGlobalState}=useGlobalContext();
         const[showEditDialog,setShowEditDialog]=useState(false);
    const router = useRouter()
    const callResetDeviceID = async () => {
        try {
            const { error } = await supabase
                .from('leap_customer')
                .update({ device_id: null }) // Set device_id to null or the desired reset value
                .eq('customer_id', card.customer_id);

            if (error) {
                alert(`Error resetting device ID: ${error.message}`);
            } else {
                alert('Device ID reset successfully');
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            alert('An unexpected error occurred while resetting the device ID.');
        }
    };

    const navigateToProfile = () => {
        if(!isHerarchy){
        setGlobalState({
            contextUserName: contextUserName,
            contextClientID: contextClientID,
            contaxtBranchID: contaxtBranchID,
            contextCustomerID: contextCustomerID,
            contextRoleID: contextRoleID,
            contextProfileImage: contextProfileImage,
            contextEmployeeID: contextEmployeeID,
            contextCompanyName: contextCompanyName,
            contextLogoURL: contextLogoURL,
            contextSelectedCustId: card.customer_id+'',
            contextAddFormEmpID: '',
            contextAnnouncementID:'',
            contextAddFormCustID: '',
            dashboard_notify_cust_id: '',
            dashboard_notify_activity_related_id: '',
            selectedClientCustomerID: '',
            contextPARAM7: '',
            contextPARAM8: '',

        });
        router.push(pageURL_editUserPorifle);
    }else{
        setShowEditDialog(true);
    }
    }

    return (
        <div>
            <div className="userlist_actionbox">
                <a onClick={navigateToProfile} style={{ cursor: 'pointer' }}><img src={staticIconsBaseURL+"/images/userlist/edit.png"} className="img-fluid" /><div>Edit</div></a>
                {!isHerarchy && <a onClick={callResetDeviceID} style={{ cursor: 'pointer' }}><img src={staticIconsBaseURL+"/images/userlist/reset.png"} className="img-fluid" /><div>Reset Device ID</div></a>}
                {!isHerarchy &&<a href="#"><img src={staticIconsBaseURL+"/images/userlist/password.png"} className="img-fluid" /><div>Password</div></a>}
            </div>
            <div className={showEditDialog ? "rightpoup rightpoupopen" : "rightpoup"}>

            {showEditDialog && <DialogUpdateEmployeeHierarchy onClose={function (isUpdated: any): void {
                setShowEditDialog(false);
                callFetchData();
            } } customer_id={card.customer_id} />}
            </div>
        </div>

    )
}
export default UserProfileLeft