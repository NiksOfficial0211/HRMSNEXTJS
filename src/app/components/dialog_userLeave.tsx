
'use client'
import React, { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import { AppliedLeave, EmpLeaveBalances } from '../models/leaveModel';
import LoadingDialog from './PageLoader';
import { staticIconsBaseURL } from '../pro_utils/stringConstants';


const UserLeaveStatus = ({ onClose, id,selectedShortCutID,isToBeEddited }: { onClose: (fetchData:boolean) => void, id: any,selectedShortCutID:any,isToBeEddited:boolean }) => {     

    const [ showResponseMessage,setResponseMessage ] = useState(false);
    const {contextClientID,contaxtBranchID, contextSelectedCustId,contextRoleID}=useGlobalContext();
   
    const [leaveData,setLeaveData]=useState<AppliedLeave>();
    const [isLoading,setLoading] = useState(true);  
    
    useEffect(() => {
        const fetchData = async () => {
                try{
                    const formData = new FormData();
                    formData.append("client_id", contextClientID );
                    formData.append("branch_id", contaxtBranchID );
                    formData.append("id", id );
                const res = await fetch(`/api/users/getAppliedLeaves`, {
                    method: "POST",
                    body: formData,
                });
                const response = await res.json();
                const user = response.leavedata[0];
                
                setLeaveData(user)
                setLoading(false);
                } catch (error) {
                    setLoading(false);
                    console.error("Error fetching user data:", error);
                }
            }
            fetchData();
    }, []);


   
    
    return (
        <div >
            <div className='rightpoup_close'>
                    <img src={staticIconsBaseURL+"/images/close_white.png"} alt="Search Icon" title='Close' onClick={(e)=>onClose(false)}/>
                </div>
            <div className="">
                <LoadingDialog isLoading={isLoading} />
                <div className="row">
                {/* <div className="col-lg-12" style={{textAlign: "right"}}>
                    <img src={staticIconsBaseURL+"/images/close.png"} className="img-fluid edit-icon" alt="Search Icon" style={{ width: "15px", paddingBottom: "5px", alignItems: "right", cursor:"pointer" }}
                     onClick={(e)=>onClose(false)}/>
                </div> */}
                </div>
                <div className="row">
                    <div className="col-lg-12 mb-4 inner_heading25">
                    Leave Details
                    </div>
                </div>
                    <div className="row">
                        <div className="col-lg-4">Leave Type:</div>
                        <div className="col-lg-8 mb-3">{leaveData?.leap_client_leave.leave_name}</div>
                        <div className="col-lg-4">Applied on:</div>
                        <div className="col-lg-8 mb-3">{leaveData?.created_at}</div>
                        <div className="col-lg-4">Date:</div>
                        {leaveData?.from_date === leaveData?.to_date ? 
                            <div className="col-lg-8 mb-3"> <span style={{color: "red"}}>{leaveData?.from_date }</span> </div>
                            :<div className="col-lg-8 mb-3">From: <span style={{color: "red"}}>{leaveData?.from_date }</span>  to: <span style={{color: "red"}}>{ leaveData?.to_date}</span></div>}
                        <div className="col-lg-4">Total days:</div>
                        <div className="col-lg-8 mb-3">{leaveData?.total_days}</div>
                        <div className="col-lg-4">Leave Period:</div>
                        <div className="col-lg-8 mb-3">{/^[0-9]+$/.test(leaveData?.duration||"")?"--":leaveData?.duration}</div>
                        <div className="col-lg-4">Leave reason:</div>
                        <div className="col-lg-8 mb-3">{leaveData?.leave_reason}</div>
                        <div className="col-lg-4">Status:</div>
                        <div className="col-lg-8 mb-3 ">{leaveData?.leap_approval_status.approval_type}</div>
                        <div className="col-lg-4">Remark:</div>
                        <div className="col-lg-8 mb-3">
                        <div className="col-lg-8 mb-3">{leaveData?.approve_disapprove_remark ? leaveData?.approve_disapprove_remark: "--"}</div>
                        </div>
                    </div>
            </div>
        </div>
    )
}

export default UserLeaveStatus
