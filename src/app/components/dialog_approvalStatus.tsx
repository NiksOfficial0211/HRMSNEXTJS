// 'use client'
// import React, { useEffect, useState } from 'react'
// import supabase from '@/app/api/supabaseConfig/supabase';
// import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
// import { AppliedLeave } from '../models/leaveModel';


// interface LeaveType {
//     leave_id: string,
//     // customer_id: string,
//     status: string,
//     status_remark: string,

// }

// const LeaveStatusUpdate = ({ onClose, id,selectedShortCutID }: { onClose: () => void, id: any,selectedShortCutID:any }) => {     

//     const [ showResponseMessage,setResponseMessage ] = useState(false);
//     // const [assetArray, setAsset] = useState<AssetList[]>([]);
//     const {contextClientID,contaxtBranchID, contextSelectedCustId,contextRoleID}=useGlobalContext();

//     const [formValues, setFormValues] = useState<LeaveType>({
//         leave_id: "",
//         // customer_id: "",
//         status: "",
//         status_remark: "",
//       });
//     const [leaveData,setLeaveData]=useState<AppliedLeave>();
//     const [isLoading,setLoading] = useState(true);  

//     useEffect(() => {
//         const fetchData = async () => {

//                 try{
//                     const formData = new FormData();
//                     formData.append("client_id", contextClientID );
//                     formData.append("branch_id", contaxtBranchID );
//                     formData.append("id", id );


//                 const res = await fetch(`/api/users/getAppliedLeaves`, {
//                     method: "POST",
//                     body: formData,
//                 });

//                 const response = await res.json();

//                 const user = response.leavedata[0];
//                 setFormValues({
//                     leave_id: user.id,
//                     status: user.leave_status,
//                     status_remark: user.approve_disapprove_remark,
//                 });
//                 setLeaveData(user)


//                 } catch (error) {
//                     console.error("Error fetching user data:", error);
//                 }
//             }
//             fetchData();

//     }, []);

//     const handleInputChange = async (e: any) => {
//         const { name, value } = e.target;
//         console.log("Form values updated:", formValues);
//         setResponseMessage(true);
//         setFormValues((prev) => ({ ...prev, [name]: value }));
//     };
//     const [errors, setErrors] = useState<Partial<LeaveType>>({});

//     const validate = () => {
//       const newErrors: Partial<LeaveType> = {};
//       if (!formValues.status) newErrors.status = "required";   

//       setErrors(newErrors);
//       return Object.keys(newErrors).length === 0;
//   };
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!validate()) return;
//         console.log("handle submit called");
//         const formData = new FormData();
//         formData.append("leave_id", id); // page thru
//         // formData.append("customer_id", formValues.customer_id); // page thru maybe not necessary
//         formData.append("status", formValues.status); // form
//         formData.append("status_remark", formValues.status_remark); // form
//         try {
//           const response = await fetch("/api/users/updateAppliedLeaveStatus", {
//               method: "POST",
//               body: formData,

//           });
//           // console.log(response);

//           if (response.ok) {
//               if(selectedShortCutID){
//                 updateActivityStatus(selectedShortCutID,formValues.status)
//               }
//               onClose();
//           } else {
//               alert("Failed to submit form.");
//           }
//       } catch (error) {
//           console.log("Error submitting form:", error);
//           alert("An error occurred while submitting the form.");
//       }
//       }

//     return (
//         <div className="">
//             <div className="">
//                 <div className="row">
//                 <div className="col-lg-12" style={{textAlign: "right"}}>
//                     <img src="/images/close.png" className="img-fluid edit-icon" alt="Search Icon" style={{ width: "15px", paddingBottom: "5px", alignItems: "right" }}
//                      onClick={onClose}/>
//                 </div>
//                 </div>
//                 <div className="row">
//                     <div className="col-lg-12 mb-4 inner_heading25 text-center">
//                     Update Leave Status
//                     </div>
//                 </div>
//                 <form onSubmit={handleSubmit}>
//                             <div className="row">
//                                 <div className="col-lg-12">

//                                 <label htmlFor="exampleFormControlInput1" className="form-label inner_heading12" >Name:  </label>
//                                 <label htmlFor="exampleFormControlInput1" className="form-label inner_heading14"  >{leaveData?.leap_customer.name}</label>

//                                 <label htmlFor="exampleFormControlInput1" className="form-label inner_heading12" >Leave Type:  </label>
//                                 <label htmlFor="exampleFormControlInput1" className="form-label inner_heading14" >{leaveData?.leap_client_leave.leave_name}</label>

//                                 <label htmlFor="exampleFormControlInput1" className="form-label inner_heading12" >Day:  </label>
//                                 <label htmlFor="exampleFormControlInput1" className="form-label inner_heading14" >{leaveData?.duration}</label>

//                                 </div>

//                             </div>
//                             <div className="row">
//                                 <div className="col-md-4">
//                                     <div className="form_box mb-3">
//                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Status:  </label>
//                                             <select id="status" name="status" value={formValues.status} onChange={(e)=>setFormValues((prev) => ({ ...prev, ['status']: e.target.value }))}>
//                                                 <option value="1">Pending</option>
//                                                 <option value="2">Approved</option>
//                                                 <option value="3">Disapproved</option>
//                                             </select>
//                                         {/* {errors.leaveType && <span className="error" style={{color: "red"}}>{errors.leaveType}</span>} */}
//                                     </div>
//                                 </div>
//                                 <div className="col-md-8">
//                                     <div className="form_box mb-3">
//                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Remark:  </label>
//                                         <input type="text" className="form-control" value={formValues.status_remark} name="status_remark" onChange={(e)=>setFormValues((prev) => ({ ...prev, ['status_remark']: e.target.value }))}  id="status_remark" placeholder="Remark" />
//                                             {/* {errors.categoryID && <span className="error" style={{color: "red"}}>{errors.categoryID}</span>} */}
//                                     </div>
//                                 </div>
//                             </div> 

//                     <div className="row mb-5">
//                         <div className="col-lg-12" style={{ textAlign: "center" }}>
//                         <input type='submit' value="Update" className="red_button"  />
//                         </div>
//                     </div>
//                 </form>
//                 {showResponseMessage &&  <div className="row md-5"><label>Leave Type Updated Successfully</label></div>}
//             </div>
//         </div>
//     )
// }

// export default LeaveStatusUpdate

// async function updateActivityStatus(shortcutID:any,status:any) {

// let selectQuery = supabase
//         .from('leap_client_useractivites').select("*").eq("id",shortcutID)
//         const { data:Activity, error:selectError } = await selectQuery;
//         if (selectError) {
//             // console.log(error);
//             return [];
//         }
//     let query = supabase
//         .from('leap_client_useractivites')
//         .update({activity_status:status})
//         .eq("activity_related_id",Activity[0].activity_related_id);
//         // .eq("asset_status", 1);
//     const { data, error } = await query;
//     if (error) {
//         // console.log(error);
//         return [];
//     } else {
//         // console.log(data);
//         return data;
//     } 
//   }

///design Shared by swapnil on 11 april 2025 second time shared change

// 'use client'
// import React, { useEffect, useState } from 'react'
// import supabase from '@/app/api/supabaseConfig/supabase';
// import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
// import { AppliedLeave } from '../models/leaveModel';


// interface LeaveType {
//     leave_id: string,
//     // customer_id: string,
//     status: string,
//     status_remark: string,

// }

// const LeaveStatusUpdate = ({ onClose, id,selectedShortCutID }: { onClose: () => void, id: any,selectedShortCutID:any }) => {     

//     const [ showResponseMessage,setResponseMessage ] = useState(false);
//     // const [assetArray, setAsset] = useState<AssetList[]>([]);
//     const {contextClientID,contaxtBranchID, contextSelectedCustId,contextRoleID}=useGlobalContext();

//     const [formValues, setFormValues] = useState<LeaveType>({
//         leave_id: "",
//         // customer_id: "",
//         status: "",
//         status_remark: "",
//       });
//     const [leaveData,setLeaveData]=useState<AppliedLeave>();
//     const [isLoading,setLoading] = useState(true);  

//     useEffect(() => {
//         const fetchData = async () => {

//                 try{
//                     const formData = new FormData();
//                     formData.append("client_id", contextClientID );
//                     formData.append("branch_id", contaxtBranchID );
//                     formData.append("id", id );


//                 const res = await fetch(`/api/users/getAppliedLeaves`, {
//                     method: "POST",
//                     body: formData,
//                 });

//                 const response = await res.json();

//                 const user = response.leavedata[0];
//                 setFormValues({
//                     leave_id: user.id,
//                     status: user.leave_status,
//                     status_remark: user.approve_disapprove_remark,
//                 });
//                 setLeaveData(user)


//                 } catch (error) {
//                     console.error("Error fetching user data:", error);
//                 }
//             }
//             fetchData();

//     }, []);

//     const handleInputChange = async (e: any) => {
//         const { name, value } = e.target;
//         console.log("Form values updated:", formValues);
//         setResponseMessage(true);
//         setFormValues((prev) => ({ ...prev, [name]: value }));
//     };
//     const [errors, setErrors] = useState<Partial<LeaveType>>({});

//     const validate = () => {
//       const newErrors: Partial<LeaveType> = {};
//       if (!formValues.status) newErrors.status = "required";   

//       setErrors(newErrors);
//       return Object.keys(newErrors).length === 0;
//   };
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!validate()) return;
//         console.log("handle submit called");
//         const formData = new FormData();
//         formData.append("leave_id", id); // page thru
//         // formData.append("customer_id", formValues.customer_id); // page thru maybe not necessary
//         formData.append("status", formValues.status); // form
//         formData.append("status_remark", formValues.status_remark); // form
//         try {
//           const response = await fetch("/api/users/updateAppliedLeaveStatus", {
//               method: "POST",
//               body: formData,

//           });
//           // console.log(response);

//           if (response.ok) {
//               if(selectedShortCutID){
//                 updateActivityStatus(selectedShortCutID,formValues.status)
//               }
//               onClose();
//           } else {
//               alert("Failed to submit form.");
//           }
//       } catch (error) {
//           console.log("Error submitting form:", error);
//           alert("An error occurred while submitting the form.");
//       }
//       }

//     return (
//         <div className="">
//             <div className="">
//                 <div className="row">
//                 <div className="col-lg-12" style={{textAlign: "right"}}>
//                     <img src="/images/close.png" className="img-fluid edit-icon" alt="Search Icon" style={{ width: "15px", paddingBottom: "5px", alignItems: "right" }}
//                      onClick={onClose}/>
//                 </div>
//                 </div>
//                 <div className="row">
//                     <div className="col-lg-12 mb-4 inner_heading25">
//                     Update Leave Status
//                     </div>
//                 </div>
//                 <form onSubmit={handleSubmit}>
//                             <div className="row">
//                                     <div className="col-lg-4">Name:</div>
//                                     <div className="col-lg-8 mb-3">{leaveData?.leap_customer.name}</div>
//                                     <div className="col-lg-4">Leave Type:</div>
//                                     <div className="col-lg-8 mb-3">{leaveData?.leap_client_leave.leave_name}</div>
//                                     <div className="col-lg-4">Day:</div>
//                                     <div className="col-lg-8 mb-3">{leaveData?.duration}</div>
//                             </div>
//                             <div className="row">
//                                 <div className="col-md-4">
//                                     <div className="form_box mb-3">
//                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Status:  </label>
//                                             <select id="status" name="status" value={formValues.status} onChange={(e)=>setFormValues((prev) => ({ ...prev, ['status']: e.target.value }))}>
//                                                 <option value="1">Pending</option>
//                                                 <option value="2">Approved</option>
//                                                 <option value="3">Disapproved</option>
//                                             </select>
//                                         {/* {errors.leaveType && <span className="error" style={{color: "red"}}>{errors.leaveType}</span>} */}
//                                     </div>
//                                 </div>
//                                 <div className="col-md-8">
//                                     <div className="form_box mb-3">
//                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Remark:  </label>
//                                         <input type="text" className="form-control" value={formValues.status_remark} name="status_remark" onChange={(e)=>setFormValues((prev) => ({ ...prev, ['status_remark']: e.target.value }))}  id="status_remark" placeholder="Remark" />
//                                             {/* {errors.categoryID && <span className="error" style={{color: "red"}}>{errors.categoryID}</span>} */}
//                                     </div>
//                                 </div>
//                             </div> 

//                     <div className="row mb-5">
//                         <div className="col-lg-12">
//                         <input type='submit' value="Update" className="red_button"  />
//                         </div>
//                     </div>
//                 </form>
//                 {showResponseMessage &&  <div className="row md-5"><label>Leave Type Updated Successfully</label></div>}
//             </div>
//         </div>
//     )
// }

// export default LeaveStatusUpdate

// async function updateActivityStatus(shortcutID:any,status:any) {

// let selectQuery = supabase
//         .from('leap_client_useractivites').select("*").eq("id",shortcutID)
//         const { data:Activity, error:selectError } = await selectQuery;
//         if (selectError) {
//             // console.log(error);
//             return [];
//         }
//     let query = supabase
//         .from('leap_client_useractivites')
//         .update({activity_status:status})
//         .eq("activity_related_id",Activity[0].activity_related_id);
//         // .eq("asset_status", 1);
//     const { data, error } = await query;
//     if (error) {
//         // console.log(error);
//         return [];
//     } else {
//         // console.log(data);
//         return data;
//     } 
//   }

//////swapnil code shared on 14th May 2025


'use client'
import React, { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import { AppliedLeave, EmpLeaveBalances } from '../models/leaveModel';
import LoadingDialog from './PageLoader';
import { staticIconsBaseURL } from '../pro_utils/stringConstants';


interface LeaveType {
    leave_id: string,
    // customer_id: string,
    status: string,
    status_remark: string,

}

const LeaveStatusUpdate = ({ onClose, id, selectedShortCutID, isToBeEddited }: { onClose: (fetchData: boolean) => void, id: any, selectedShortCutID: any, isToBeEddited: boolean }) => {

    const [showResponseMessage, setResponseMessage] = useState(false);
    // const [assetArray, setAsset] = useState<AssetList[]>([]);
    const { contextClientID, contaxtBranchID, contextSelectedCustId, contextRoleID } = useGlobalContext();

    const [formValues, setFormValues] = useState<LeaveType>({
        leave_id: "",
        // customer_id: "",
        status: "",
        status_remark: "",
    });
    const [leaveData, setLeaveData] = useState<AppliedLeave>();
    const [empleaveBalances, setEmpLeaveBalances] = useState<EmpLeaveBalances>();
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {

        const fetchData = async () => {

            try {
                const formData = new FormData();
                formData.append("client_id", contextClientID);
                formData.append("branch_id", contaxtBranchID);
                formData.append("id", id);


                const res = await fetch(`/api/users/getAppliedLeaves`, {
                    method: "POST",
                    body: formData,
                });

                const response = await res.json();

                const user = response.leavedata[0];

                setFormValues({
                    leave_id: user.id,
                    status: user.leave_status,
                    status_remark: user.approve_disapprove_remark,
                });
                setLeaveData(user)
                const leaveBal = response.emp_leave_Balances;
                setEmpLeaveBalances(leaveBal)
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error("Error fetching user data:", error);
            }
        }
        fetchData();

    }, []);

    const handleInputChange = async (e: any) => {
        const { name, value } = e.target;
        console.log("Form values updated:", formValues);
        setResponseMessage(true);
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };
    const [errors, setErrors] = useState<Partial<LeaveType>>({});

    const validate = () => {
        const newErrors: Partial<LeaveType> = {};
        if (!formValues.status) newErrors.status = "required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        console.log("handle submit called");
        const formData = new FormData();
        formData.append("leave_id", id); // page thru
        // formData.append("customer_id", formValues.customer_id); // page thru maybe not necessary
        formData.append("status", formValues.status); // form
        formData.append("status_remark", formValues.status_remark); // form
        try {
            const response = await fetch("/api/users/updateAppliedLeaveStatus", {
                method: "POST",
                body: formData,

            });
            // console.log(response);

            if (response.ok) {

                if (selectedShortCutID) {
                    updateActivityStatus(selectedShortCutID, formValues.status)
                }
                setLoading(false);
                onClose(true);
            } else {
                setLoading(false)
                alert("Failed to update leave status.Something went wrong!");
            }
        } catch (error) {
            setLoading(false);
            console.log("Error submitting form:", error);
            alert("An error occurred while submitting the form.");
        }
    }

    return (
        <div className="">
            <div className="">
                <LoadingDialog isLoading={isLoading} />
                <div className='rightpoup_close' onClick={()=>onClose(false)}>
                    <img src={staticIconsBaseURL + "/images/close_white.png"} alt="Search Icon" title='Close' />
                </div>
                <div className="row">
                    <div className="col-lg-12 mb-3 inner_heading25">
                        Update Leave Status
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-lg-4">Name:</div>
                        <div className="col-lg-8 mb-3">{leaveData?.leap_customer.name}</div>
                        <div className="col-lg-4">Leave Type:</div>
                        <div className="col-lg-8 mb-3">{leaveData?.leap_client_leave.leave_name}</div>
                        <div className="col-lg-4">Reason:</div>
                        <div className="col-lg-8 mb-3">{leaveData?.leave_reason}</div>
                        <div className="col-lg-4">Total days:</div>
                        <div className="col-lg-8 mb-3">{leaveData?.total_days}</div>
                        <div className="col-lg-4">Leave Period:</div>
                        <div className="col-lg-8 mb-3">{/^[0-9]+$/.test(leaveData?.duration || "") ? "--" : leaveData?.duration}</div>
                        <div className="col-lg-4">Status:</div>
                        <div className="col-lg-8 mb-3 ">
                            <div className="form_box">
                                {isToBeEddited ? <select id="status" name="status" value={formValues.status} onChange={(e) => setFormValues((prev) => ({ ...prev, ['status']: e.target.value }))}>
                                    <option value="1">Pending</option>
                                    <option value="2">Approved</option>
                                    <option value="3">Disapproved</option>
                                </select> : <div className="col-lg-8 mb-3">{formValues.status == "2" ? "Approved" : "Disapproved"}</div>}
                            </div>
                        </div>
                        <div className="col-lg-4">Remark:</div>
                        <div className="col-lg-8 mb-3">
                            {isToBeEddited ?
                                <textarea style={{ fontSize: "13px", minHeight: "50px" }} className="form-control" value={formValues.status_remark} name="status_remark" onChange={(e) => setFormValues((prev) => ({ ...prev, ['status_remark']: e.target.value }))} id="status_remark" placeholder="Remark"></textarea>
                                : <div className="col-lg-8 mb-3">{formValues.status_remark}</div>}

                        </div>

                        {isToBeEddited ? <div className="col-lg-8 mb-3">
                            <input type='submit' value="Update" className="red_button" />
                        </div> : <></>}

                    </div>


                </form>
                <div className="row">
                    <div className="col-lg-12 mb-4 inner_heading25">
                        Leave Balances
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        {empleaveBalances && empleaveBalances.customerLeavePendingCount.map((counts, index) =>
                            <div className="leave_bal_box" key={index} style={{ backgroundColor: counts.color_code }}>
                                {counts.leaveType}<br /><span>{counts.leaveBalance + "/ " + counts.leaveAllotedCount}</span>
                            </div>
                        )}
                    </div>
                </div>

                {showResponseMessage && <div className="row md-5"><label>Leave Type Updated Successfully</label></div>}
            </div>
        </div>
    )
}

export default LeaveStatusUpdate

async function updateActivityStatus(shortcutID: any, status: any) {

    let selectQuery = supabase
        .from('leap_client_useractivites').select("*").eq("id", shortcutID)
    const { data: Activity, error: selectError } = await selectQuery;
    if (selectError) {
        // console.log(error);
        return [];
    }
    let query = supabase
        .from('leap_client_useractivites')
        .update({ activity_status: status })
        .eq("activity_related_id", Activity[0].activity_related_id);
    // .eq("asset_status", 1);
    const { data, error } = await query;
    if (error) {
        // console.log(error);
        return [];
    } else {
        // console.log(data);
        return data;
    }
}