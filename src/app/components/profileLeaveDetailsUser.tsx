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

    const { contextClientID, contaxtBranchID, contextSelectedCustId } = useGlobalContext();
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {

            try {

                const res = await fetch("/api/users/getAppliedLeaves", {
                    method: "POST",
                    body:JSON.stringify({
                        "client_id": contextClientID,
                        "customer_id": contextSelectedCustId,
                        "branch_id": contaxtBranchID
                    }),
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
                            {empleaveBalances && empleaveBalances.customerLeavePendingCount.map((counts, index) =>
                                <div className="d_user_leave_balance_listing" key={index}>
                                    <div className="d_user_leave_balance_type"
                                        style={{ backgroundColor: counts.color_code }}>
                                        {counts.leaveType && (() => {
                                            const [firstWord, ...rest] = counts.leaveType.split(' ');
                                            return (
                                                <>
                                                    <span>{firstWord}</span>
                                                    <br />
                                                    {rest.join(' ')}
                                                </>
                                            );
                                        })()}
                                    </div>
                                    <div className="d_user_leave_balance_balance">{counts.leaveBalance + "/" + counts.leaveAllotedCount}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
