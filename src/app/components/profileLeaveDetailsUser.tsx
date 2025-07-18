'use client'
import React, { useEffect, useState } from 'react'
import { funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import supabase from '@/app/api/supabaseConfig/supabase';
import { useRouter } from 'next/navigation';
import { error } from 'console';
import { Bank, BankDetail, BankModel, SalaryDetail, TotalSalary } from '../models/employeeDetailsModel';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import { EmpLeaveBalances } from '../models/leaveModel';
import LoadingDialog from './PageLoader';

export const UserProfileLeaveDetails = () => {



    const { contextClientID, contextRoleID, contextSelectedCustId } = useGlobalContext();
    const [isLoading, setLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {

            try {
                const formData = new FormData();
                formData.append("client_id", contextClientID);
                formData.append("customer_id", contextSelectedCustId);


                const res = await fetch("/api/users/getAppliedLeaves", {
                    method: "POST",
                    body: formData,
                });

                const response = await res.json();
                console.log(response);
                if (res.ok) {
                    const leaveBal = response.emp_leave_Balances;
                    setEmpLeaveBalances(leaveBal)
                    setLoading(false);

                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
        fetchData();
    }, []);

    const [empleaveBalances, setEmpLeaveBalances] = useState<EmpLeaveBalances>();

    return (
        <div className="container" id='leave_id'>
            <div className="row">
                <div className="col-lg-12">
                    <div className="d_user_new_details_mainbox mb-4">
                        <div className="d_user_profile_heading">Leave Balances</div>
                        <div className="d_user_leave_balance_mainbox">
                            {empleaveBalances && empleaveBalances.customerLeavePendingCount.map((counts,index) =>
                            <div className="d_user_leave_balance_listing" key={index}>
                                <div className="d_user_leave_balance_type"  style={{ backgroundColor: counts.color_code }}><span>Sick</span><br /> Leave</div>
                                <div className="d_user_leave_balance_balance">{counts.leaveBalance + "/ " + counts.leaveAllotedCount}</div>
                            </div>)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        // <div className="grey_box">
        //         <LoadingDialog isLoading={isLoading} />
        //         <div className="row">
        //             <div className="col-lg-11 mb-4 inner_heading25">
        //                 Leave Balances
        //             </div>
        //         </div>
        //         <div className="row">
        //             {empleaveBalances && empleaveBalances.customerLeavePendingCount.map((counts) =>
        //                 <div className="col-lg-5 m-3">
        //                     <div className="summery_box" style={{ backgroundColor: counts.color_code }}>
        //                         {counts.leaveType}<br /><span>{counts.leaveBalance + "/ " + counts.leaveAllotedCount}</span>
        //                     </div>
        //                 </div>
        //             )}
        //         </div>
        //     </div>
    )
}




