// // Here are all the organizational level details:
// // Currently company basic details, holiday list and leave policy

// 'use client'
// import React, { useEffect, useState } from 'react'
// import LeapHeader from '@/app/components/header'
// import Footer from '@/app/components/footer'
// import moment from "moment";
// import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
// import { LeaveType } from '@/app/models/leaveModel'
// import { Client } from '@/app/models/companyModel'
// import LeftPannel from '@/app/components/leftPannel';
// import LoadingDialog from '@/app/components/PageLoader';
// import PageErrorCenterContent from '@/app/components/pageError';

// import ShowAlertMessage from '@/app/components/alert'
// import { ALERTMSG_addAssetSuccess, staticIconsBaseURL } from '@/app/pro_utils/stringConstants'

// const HolidayList = () => {
//     const [scrollPosition, setScrollPosition] = useState(0);
//     const [viewIndex, setViewIndex] = useState(0);
//     const [holidays, setHolidays] = useState<any[]>([]);
//     const { contextClientID, contaxtBranchID, contextCustomerID, setGlobalState } = useGlobalContext();
//     const [showUpdateDialog, setShowUpdateDialog] = useState(false);
//     const [leavearray, setLeave] = useState<LeaveType[]>([]);
//     const [loadingCursor, setLoadingCursor] = useState(false);
//     const [isLoading, setLoading] = useState(false);

//     const [showAlert, setShowAlert] = useState(false);
//     const [alertForSuccess, setAlertForSuccess] = useState(0);
//     const [alertTitle, setAlertTitle] = useState('');
//     const [alertStartContent, setAlertStartContent] = useState('');
//     const [alertMidContent, setAlertMidContent] = useState('');
//     const [alertEndContent, setAlertEndContent] = useState('');
//     const [alertValue1, setAlertValue1] = useState('');
//     const [alertvalue2, setAlertValue2] = useState('');

//     const [compData, setCompData] = useState<Client>({
//         client_id: parseFloat(contextClientID),
//         created_at: '',
//         company_name: '',
//         number_of_branches: '',
//         sector_type: '',
//         company_location: '',
//         company_number: '',
//         company_email: '',
//         fullday_working_hours: '',
//         halfday_working_hours: '',
//         total_weekend_days: '',
//         is_deleted: false,
//         company_website_url: '',
//         timezone_id: '',
//         is_a_parent: true,
//         user_id: '',
//         parent_id: '',
//         updated_at: '',
//         leap_client_branch_details: {
//             id: 0,
//             uuid: '',
//             client_id: parseFloat(contextClientID),
//             dept_name: '',
//             is_active: true,
//             created_at: '',
//             updated_at: '',
//             branch_city: '',
//             branch_email: '',
//             time_zone_id: '',
//             branch_number: '',
//             branch_address: '',
//             is_main_branch: false,
//             contact_details: '',
//             total_employees: ''
//         },
//         leap_sector_type: {
//             id: 0,
//             sector_type: '',
//         },
//         leap_client_basic_info: [{
//             client_id: parseFloat(contextClientID),
//             created_at: "",
//             updated_at: "",
//             company_logo: "",
//             company_name: "",
//             primary_color: "",
//             compnay_websit: "",
//             secondary_color: "",
//             company_short_name: "",
//             client_basic_detail_id: 0
//         }]
//     });

//     useEffect(() => {
//         fetchHoliday();
//         fetchLeavePolicy();
//         fetchCompany();
//         const handleScroll = () => {
//             setScrollPosition(window.scrollY); // Update scroll position
//             const element = document.querySelector('.mainbox');
//             if (window.pageYOffset > 0) {
//                 element?.classList.add('sticky');
//             } else {
//                 element?.classList.remove('sticky');
//             }
//         };
//         window.addEventListener('scroll', handleScroll);
//         return () => {

//             window.removeEventListener('scroll', handleScroll);
//         };
//     }, []);

//     const fetchHoliday = async () => {
//         setLoading(true);
//         try {
//             const formData = new FormData();
//             formData.append("client_id", contextClientID);
//             formData.append("branch_id", contaxtBranchID);
//             formData.append("holiday_year", "1");

//             const res = await fetch("/api/commonapi/getHolidayList", {
//                 method: "POST",
//                 body: formData,
//             });
//             const response = await res.json();

//             if (response.status === 1) {
//                 setHolidays(response.data.holidays);
//                 setLoading(false);
//             } else {
//                 setHolidays([]);
//                 setLoading(false);
//                 setAlertTitle("Error")
//                 setAlertStartContent("Failed to load holidays");
//                 setAlertForSuccess(2)
//             }
//         } catch (error) {
//             setLoading(false);
//             console.error("Error fetching user data:", error);
//             setShowAlert(true);
//             setAlertTitle("Exception")
//             setAlertStartContent(ALERTMSG_addAssetSuccess);
//             setAlertForSuccess(2)
//         }
//     };
//     const fetchLeavePolicy = async () => {
//         setLoading(true);
//         try {
//             const formData = new FormData();
//             formData.append("client_id", contextClientID);
//             formData.append("branch_id", contaxtBranchID);

//             const res = await fetch("/api/users/showLeaveType", {
//                 method: "POST",
//                 body: formData,
//             });
//             const response = await res.json();
//             const leaveListData = response.data;
//             if (response.status == 1) {
//                 setLoading(false);
//                 setLeave(leaveListData);
//             } else {
//                 setLeave([]);
//                 setLoading(false);
//                 setAlertTitle("Error")
//                 setAlertStartContent("Failed to load leave policy");
//                 setAlertForSuccess(2)
//             }
//         } catch (error) {
//             setLoading(false);
//             console.error("Error fetching user data:", error);
//             setShowAlert(true);
//             setAlertTitle("Exception")
//             setAlertStartContent(ALERTMSG_addAssetSuccess);
//             setAlertForSuccess(2)
//         }
//     }
//     const fetchCompany = async () => {
//         setLoading(true);
//         try {
//             const formData = new FormData();
//             formData.append("client_id", contextClientID);

//             const res = await fetch("/api/clientAdmin/getClientProfile", {
//                 method: "POST",
//                 body: formData,
//             });
//             const response = await res.json();
//             const user = response.clients[0];
//             if (response.status == 1) {
//                 setCompData(user);
//                 setLoading(false);
//             } else {
//                 setLoading(false);
//                 setAlertTitle("Error")
//                 setAlertStartContent("Failed to load assets");
//                 setAlertForSuccess(2)
//             }
//         } catch (error) {
//             setLoading(false);
//             console.error("Error fetching user data:", error);
//             setShowAlert(true);
//             setAlertTitle("Exception")
//             setAlertStartContent(ALERTMSG_addAssetSuccess);
//             setAlertForSuccess(2)
//         }
//     }

//     const handleInputChange = async (e: any) => {
//         const { name, value } = e.target;
//     };
//     return (
//         <div className='mainbox'>
//             <header>
//                 <LeapHeader title="Welcome!" />
//             </header>
//             <LeftPannel
//                 menuIndex={26}
//                 subMenuIndex={0}
//                 showLeftPanel={true}
//                 rightBoxUI={
//                     <div>
//                         {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
//                             setShowAlert(false)
//                         }} onCloseClicked={function (): void {
//                             setShowAlert(false)
//                         }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
//                         <LoadingDialog isLoading={isLoading} />
//                         <div className='container'>
//                             <div className="row">
//                                 <div className="col-lg-12">
//                                     <div className="nw_user_inner_mainbox">
//                                         <div className="nw_user_inner_heading_tabbox">
//                                             <div className="heading25">
//                                                 About <span>Organization</span>
//                                             </div>
//                                             <div className="nw_user_inner_tabs">
//                                                 <ul>
//                                                     <li className={viewIndex === 0 ? "nw_user_inner_listing_selected" : "nw_user_inner_listing"} key={0}>
//                                                         <a onClick={(e) => { setLoadingCursor(true), setViewIndex(0), fetchCompany() }} className={viewIndex === 0 ? "nw_user_selected" : "new_list_view_heading"}>
//                                                             <div className="nw_user_tab_icon">
//                                                                 <svg width="15" height="15" viewBox="0 0 682.667 682.667">
//                                                                     <defs><clipPath id="a" clipPathUnits="userSpaceOnUse"><path fill="red" d="M0 512h512V0H0Z" data-original="#000000" /></clipPath></defs>
//                                                                     <g fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="30" clip-path="url(#a)" transform="matrix(1.33333 0 0 -1.33333 0 682.667)">
//                                                                         <path d="M497 376.5H15V104c0-32.516 26.359-58.875 58.875-58.875h364.25C470.641 45.125 497 71.484 497 104zM346.375 376.5h-180.75v44.808c0 25.166 20.401 45.567 45.567 45.567h89.616c25.166 0 45.567-20.401 45.567-45.567Z" data-original="#000000" />
//                                                                         <path d="M15 376.5c0-87.23 82.38-160.02 191.97-177.01M305.03 199.49C414.62 216.48 497 289.27 497 376.5" data-original="#000000" />
//                                                                         <path d="M305.03 244.78v-49.03c0-27.08-21.95-49.03-49.03-49.03-27.08 0-49.03 21.95-49.03 49.03v49.03Z" data-original="#000000" />
//                                                                     </g>
//                                                                 </svg>
//                                                             </div>
//                                                             <div className="nw_user_tab_name">
//                                                                 Company
//                                                             </div>
//                                                         </a>
//                                                     </li>
//                                                     <li className={viewIndex === 1 ? "nw_user_inner_listing_selected" : "nw_user_inner_listing"} key={1}>
//                                                         <a onClick={(e) => { setLoadingCursor(true), setViewIndex(1), fetchLeavePolicy() }} className={viewIndex === 1 ? "nw_user_selected" : "new_list_view_heading"}>
//                                                             <div className="nw_user_tab_icon">
//                                                                 <svg width="15" height="15" viewBox="0 0 24 24">
//                                                                     <path d="M19.2 2.098h-1.5v-.9a.9.9 0 0 0-1.8 0v.9H8.1v-.9a.9.9 0 0 0-1.8 0v.9H4.8a4.06 4.06 0 0 0-4.5 4.5v12.6a4.06 4.06 0 0 0 4.5 4.5h14.4a4.06 4.06 0 0 0 4.5-4.5v-12.6a4.06 4.06 0 0 0-4.5-4.5zm-14.4 1.8h1.5v.9a.9.9 0 0 0 1.8 0v-.9h7.8v.9a.9.9 0 0 0 1.8 0v-.9h1.5c1.892 0 2.7.807 2.7 2.7v.9H2.1v-.9c0-1.893.808-2.7 2.7-2.7zm14.4 18H4.8c-1.892 0-2.7-.808-2.7-2.7v-9.9h19.8v9.9c0 1.892-.808 2.7-2.7 2.7zm-3.564-8.94a.9.9 0 0 1 0 1.273l-3.996 4.007a.898.898 0 0 1-1.272 0l-2.004-2.004a.9.9 0 0 1 1.272-1.272L11 16.325l3.36-3.36a.899.899 0 0 1 1.276-.007z" data-original="#000000" />
//                                                                 </svg>
//                                                             </div>
//                                                             <div className="nw_user_tab_name">
//                                                                 Leave
//                                                             </div>
//                                                         </a>
//                                                     </li>
//                                                     <li className={viewIndex === 2 ? "nw_user_inner_listing_selected" : "nw_user_inner_listing"} key={2}>
//                                                         <a onClick={(e) => { setLoadingCursor(true), setViewIndex(2), fetchHoliday() }} className={viewIndex === 2 ? "nw_user_selected" : "new_list_view_heading"}>
//                                                             <div className="nw_user_tab_icon">
//                                                                 <svg width="15" height="15" viewBox="0 0 682.667 682.667">
//                                                                     <g stroke-width="30">
//                                                                         <defs><clipPath id="a" stroke-width="30" clipPathUnits="userSpaceOnUse">
//                                                                             <path d="M0 512h512V0H0Z" data-original="#000000" /></clipPath>
//                                                                         </defs>
//                                                                         <g clip-path="url(#a)" transform="matrix(1.33333 0 0 -1.33333 0 682.667)">
//                                                                             <path fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M492 80c0-33.137-26.863-60-60-60H80c-33.137 0-60 26.863-60 60v312c0 33.137 26.863 60 60 60h352c33.137 0 60-26.863 60-60V180M125 492v-80M386 412v80M255 492v-80" data-original="#000000" />
//                                                                             <path stroke="#000" d="M328 236h-30.09l-59.257 74.015a13.264 13.264 0 0 1-10.345 4.973c-9.776.006-16.198-10.208-11.956-19.016L245.233 236h-48.628l-17.644 19.348a8.03 8.03 0 0 1-13.961-5.41v-66.909a8.03 8.03 0 0 1 8.029-8.029h.948c2.213 0 4.329.914 5.846 2.526L197.209 196h47.956l-28.839-59.992C212.093 127.204 218.51 117 228.278 117h.005c4.038 0 7.857 1.841 10.374 5l58.934 74H328c11.287 0 23 8.724 23 20.011C351 227.298 339.287 236 328 236" data-original="#000000" />
//                                                                         </g>
//                                                                     </g>
//                                                                 </svg>
//                                                             </div>
//                                                             <div className="nw_user_tab_name">
//                                                                 Holiday
//                                                             </div>
//                                                         </a>
//                                                     </li>
//                                                 </ul>
//                                             </div>
//                                         </div>
//                                         <div className="nw_user_inner_content_box">
//                                             {viewIndex == 0 ?
//                                                 <div className="my_task_tabbing_content">
//                                                     <LoadingDialog isLoading={isLoading} />
//                                                     <div className="compony_profile_mainbox">
//                                                         <div className="compony_profile_contentbox">
//                                                             <div className="compony_name_heading">
//                                                                 <label >{compData?.company_name || "--"}</label>
//                                                             </div>
//                                                             <div className="compony_detail_mainbox">
//                                                                 <div className="compony_detail_listing">
//                                                                     <div className="compony_detail_icons">
//                                                                         <img src="/images/user/mail-icon.svg" alt="Email icon" className="img-fluid" />
//                                                                     </div>
//                                                                     <div className="compony_detail_data">
//                                                                         <div className="compony_details_content">{compData.company_email || "--"}</div>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="compony_detail_listing">
//                                                                     <div className="compony_detail_icons">
//                                                                         <img src="/images/user/telephone.svg" alt="Contact number icon" className="img-fluid" />
//                                                                     </div>
//                                                                     <div className="compony_detail_data">
//                                                                         <div className="compony_details_content">{compData.company_number || "--"}</div>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="compony_detail_listing">
//                                                                     <div className="compony_detail_icons">
//                                                                         <img src="/images/user/website-icon.svg" alt="Website icon" className="img-fluid" />
//                                                                     </div>
//                                                                     <div className="compony_detail_data">
//                                                                         <div className="compony_details_content">{compData.company_website_url || "--"}</div>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="compony_detail_listing">
//                                                                     <div className="compony_detail_icons">
//                                                                         <img src="/images/user/location-icon.svg" alt="Location icon" className="img-fluid" />
//                                                                     </div>
//                                                                     <div className="compony_detail_data">
//                                                                         <div className="compony_details_content">{compData.company_location || "--"}</div>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                         <div className="nw_compony_profile_right">
//                                                             <div className="compony_profile_logobox">
//                                                                 <a href="#"><img src={`${process.env.NEXT_PUBLIC_BASE_URL}/api/uploads?imagePath=${compData.leap_client_basic_info[0].company_logo}`} className="img-fluid" /></a>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 : viewIndex == 1 ?
//                                                     <div className="my_task_tabbing_content">
//                                                         <div className="row">
//                                                             <LoadingDialog isLoading={isLoading} />
//                                                             <div className="col-lg-12">
//                                                                 <div className="nw_leave_table_mainbox">
//                                                                     {leavearray.map((leaveType,index) => (
//                                                                     <div className="nw_leave_table_listing" key={index}>
//                                                                         <div className="nw_leave_table_first_box">
//                                                                             <div className="nw_leave_table_icon">
//                                                                                 {/* <img src="/images/leave_type_icons/sick_Leave.png" alt="Leave icon" className="img-fluid" /> */}
//                                                                                 <img src={leaveType.leap_leave_type_icon_and_color.icon_url != null && leaveType.leap_leave_type_icon_and_color.icon_url.length > 0 ? staticIconsBaseURL + leaveType.leap_leave_type_icon_and_color.icon_url : staticIconsBaseURL+"/images/leave_type_icons/leave.svg"} className="img-fluid" style={{ maxHeight: "25px", borderRadius: "40px" }} />
//                                                                             </div>
//                                                                             <div className="nw_leave_table_type">
//                                                                               {leaveType.leave_name && (() => {
//                                                                                 const [firstWord, ...rest] = leaveType.leave_name.split(' ');
//                                                                                     return (
//                                                                                         <>
//                                                                                             <span>{firstWord}</span>
//                                                                                             <br />
//                                                                                             {rest.join(' ')}
//                                                                                         </>
//                                                                                     );
//                                                                             })()}
//                                                                             </div>
//                                                                         </div>
//                                                                         <div className="nw_leave_table_box">
//                                                                             <div className="nw_leave_table_lable">Count</div>
//                                                                             <div className="nw_leave_table_content">{leaveType.leave_count}</div>
//                                                                         </div>
//                                                                         <div className="nw_leave_table_box">
//                                                                             <div className="nw_leave_table_lable">Applicable for</div>
//                                                                             <div className="nw_leave_table_content">{leaveType.gender}</div>
//                                                                         </div>
//                                                                         <div className="nw_leave_table_box">
//                                                                             <div className="nw_leave_table_lable">if unused</div>
//                                                                             <div className="nw_leave_table_content">{leaveType.if_unused}</div>
//                                                                         </div>
//                                                                         <div className="nw_leave_table_box">
//                                                                             <div className="nw_leave_table_lable">Category</div>
//                                                                             <div className="nw_leave_table_content">{leaveType.leave_category}</div>
//                                                                         </div>
//                                                                         <div className="nw_leave_table_box nw_leave_table_eye">
//                                                                             <img src="/images/user/info.svg" alt="Description icon" className="img-fluid" />
//                                                                             <div className="nw_leave_table_eye_contentbox">
//                                                                                 {leaveType.leave_discription}
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                                     ))}
//                                                                 </div>
                                                                
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                     : viewIndex == 2 ?
//                                                         <div className="my_task_tabbing_content">
//                                                             <div className="row">
//                                                                 <LoadingDialog isLoading={isLoading} />
//                                                                 <div className="col-lg-12">

//                                                                     <div className="nw_leave_table_mainbox">
//                                                                         {holidays.length > 0 ? (
//                                                                             holidays.map((holiday, index) => (
//                                                                                 <div className="nw_holiday_table_listing" key={index}>
//                                                                                     <div className="nw_holiday_table_calender_box">
//                                                                                         <div className="nw_calender_monthBox">{moment(holiday.date).format("MMM")}</div>
//                                                                                         <div className="nw_calender_dateBox">{moment(holiday.date).format("DD")}</div>
//                                                                                     </div>
//                                                                                     <div className="nw_leave_table_box">
//                                                                                         <div className="nw_leave_table_lable">Holiday Name</div>
//                                                                                         <div className="nw_leave_table_content">{holiday.holiday_name}</div>
//                                                                                     </div>
//                                                                                     <div className="nw_leave_table_box">
//                                                                                         <div className="nw_leave_table_lable">Holiday Type</div>
//                                                                                         <div className="nw_leave_table_content">{holiday.leap_holiday_types?.holiday_type || "N/A"}</div>
//                                                                                     </div>
//                                                                                     <div className="nw_leave_table_box">
//                                                                                         <div className="nw_leave_table_lable">Day</div>
//                                                                                         <div className="nw_leave_table_content">{moment(holiday.date).format("dddd")}</div>
//                                                                                     </div>
//                                                                                     <div className="nw_leave_table_box">
//                                                                                         <div className="nw_leave_table_lable">Date</div>
//                                                                                         <div className="nw_leave_table_content">{moment(holiday.date).format("DD-MM-YYYY")}</div>
//                                                                                     </div>
//                                                                                 </div>
//                                                                             ))
//                                                                         ) : (
//                                                                             <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
//                                                                                 <PageErrorCenterContent content={"No holidays available"} />
//                                                                             </div>
//                                                                         )}
//                                                                     </div>


//                                                                     {/* <div className="grey_box" style={{ backgroundColor: "#fff" }}>
//                                                                         <div className="row list_label mb-4">
//                                                                             <div className="col-lg-3 text-center"><div className="label">Holiday Name</div></div>
//                                                                             <div className="col-lg-3 text-center"><div className="label">Holiday Type</div></div>
//                                                                             <div className="col-lg-3 text-center"><div className="label">Day</div></div>
//                                                                             <div className="col-lg-3 text-center"><div className="label">Date</div></div>
//                                                                         </div>

//                                                                         {holidays.length > 0 ? (
//                                                                             holidays.map((holiday) => (
//                                                                                 <div className="row list_listbox" key={holiday.id}>
//                                                                                     <div className="col-lg-3 text-center"><b>{holiday.holiday_name}</b></div>
//                                                                                     <div className="col-lg-3 text-center">{holiday.leap_holiday_types?.holiday_type || "N/A"}</div>
//                                                                                     <div className="col-lg-3 text-center">{moment(holiday.date).format("dddd")}</div>
//                                                                                     <div className="col-lg-3 text-center">{moment(holiday.date).format("YYYY-MM-DD")}</div>
//                                                                                 </div>
//                                                                             ))
//                                                                         ) : (
//                                                                             <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
//                                                                                 <PageErrorCenterContent content={"No holidays available"} />
//                                                                             </div>
//                                                                         )}
//                                                                     </div> */}
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                         : <div />
//                                             }
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 }
//             />
//             <Footer />
//         </div>
//     );
// };

// export default HolidayList;

// Here are all the organizational level details:
// Currently company basic details, holiday list and leave policy

'use client'
import React, { useEffect, useState } from 'react'
import LeapHeader from '@/app/components/header'
import Footer from '@/app/components/footer'
import moment from "moment";
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
import { LeaveType } from '@/app/models/leaveModel'
import { Client } from '@/app/models/companyModel'
import LeftPannel from '@/app/components/leftPannel';
import LoadingDialog from '@/app/components/PageLoader';
import PageErrorCenterContent from '@/app/components/pageError';

import ShowAlertMessage from '@/app/components/alert'
import { ALERTMSG_addAssetSuccess, staticIconsBaseURL } from '@/app/pro_utils/stringConstants'

const HolidayList = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [viewIndex, setViewIndex] = useState(0);
    const [holidays, setHolidays] = useState<any[]>([]);
    const { contextClientID, contaxtBranchID, contextCustomerID, setGlobalState } = useGlobalContext();
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const [leavearray, setLeave] = useState<LeaveType[]>([]);
    const [loadingCursor, setLoadingCursor] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');
    const [alertMidContent, setAlertMidContent] = useState('');
    const [alertEndContent, setAlertEndContent] = useState('');
    const [alertValue1, setAlertValue1] = useState('');
    const [alertvalue2, setAlertValue2] = useState('');

    const [compData, setCompData] = useState<Client>({
        client_id: parseFloat(contextClientID),
        created_at: '',
        company_name: '',
        number_of_branches: '',
        sector_type: '',
        company_location: '',
        company_number: '',
        company_email: '',
        fullday_working_hours: '',
        halfday_working_hours: '',
        total_weekend_days: '',
        is_deleted: false,
        company_website_url: '',
        timezone_id: '',
        is_a_parent: true,
        user_id: '',
        parent_id: '',
        updated_at: '',
        leap_client_branch_details: {
            id: 0,
            uuid: '',
            client_id: parseFloat(contextClientID),
            dept_name: '',
            is_active: true,
            created_at: '',
            updated_at: '',
            branch_city: '',
            branch_email: '',
            time_zone_id: '',
            branch_number: '',
            branch_address: '',
            is_main_branch: false,
            contact_details: '',
            total_employees: ''
        },
        leap_sector_type: {
            id: 0,
            sector_type: '',
        },
        leap_client_basic_info: [{
            client_id: parseFloat(contextClientID),
            created_at: "",
            updated_at: "",
            company_logo: "",
            company_name: "",
            primary_color: "",
            compnay_websit: "",
            secondary_color: "",
            company_short_name: "",
            client_basic_detail_id: 0
        }]
    });

    useEffect(() => {
        fetchHoliday();
        fetchLeavePolicy();
        fetchCompany();
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

    const fetchHoliday = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("client_id", contextClientID);
            formData.append("branch_id", contaxtBranchID);
            formData.append("holiday_year", "1");

            const res = await fetch("/api/commonapi/getHolidayList", {
                method: "POST",
                body: formData,
            });
            const response = await res.json();

            if (response.status === 1) {
                setHolidays(response.data.holidays);
                setLoading(false);
            } else {
                setHolidays([]);
                setLoading(false);
                setAlertTitle("Error")
                setAlertStartContent("Failed to load holidays");
                setAlertForSuccess(2)
            }
        } catch (error) {
            setLoading(false);
            console.error("Error fetching user data:", error);
            setShowAlert(true);
            setAlertTitle("Exception")
            setAlertStartContent(ALERTMSG_addAssetSuccess);
            setAlertForSuccess(2)
        }
    };
    const fetchLeavePolicy = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("client_id", contextClientID);
            formData.append("branch_id", contaxtBranchID);

            const res = await fetch("/api/users/showLeaveType", {
                method: "POST",
                body: formData,
            });
            const response = await res.json();
            const leaveListData = response.data;
            if (response.status == 1) {
                setLoading(false);
                setLeave(leaveListData);
            } else {
                setLeave([]);
                setLoading(false);
                setAlertTitle("Error")
                setAlertStartContent("Failed to load leave policy");
                setAlertForSuccess(2)
            }
        } catch (error) {
            setLoading(false);
            console.error("Error fetching user data:", error);
            setShowAlert(true);
            setAlertTitle("Exception")
            setAlertStartContent(ALERTMSG_addAssetSuccess);
            setAlertForSuccess(2)
        }
    }
    const fetchCompany = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("client_id", contextClientID);

            const res = await fetch("/api/clientAdmin/getClientProfile", {
                method: "POST",
                body: formData,
            });
            const response = await res.json();
            const user = response.clients[0];
            if (response.status == 1) {
                setCompData(user);
                setLoading(false);
            } else {
                setLoading(false);
                setAlertTitle("Error")
                setAlertStartContent("Failed to load assets");
                setAlertForSuccess(2)
            }
        } catch (error) {
            setLoading(false);
            console.error("Error fetching user data:", error);
            setShowAlert(true);
            setAlertTitle("Exception")
            setAlertStartContent(ALERTMSG_addAssetSuccess);
            setAlertForSuccess(2)
        }
    }

    const handleInputChange = async (e: any) => {
        const { name, value } = e.target;
    };
    return (
        <div className='mainbox'>
            <header>
                <LeapHeader title="Welcome!" />
            </header>
            <LeftPannel
                menuIndex={26}
                subMenuIndex={0}
                showLeftPanel={true}
                rightBoxUI={
                    <div>
                        {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                            setShowAlert(false)
                        }} onCloseClicked={function (): void {
                            setShowAlert(false)
                        }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                        <LoadingDialog isLoading={isLoading} />
                        <div className='container'>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="nw_user_inner_mainbox">
                                        <div className="nw_user_inner_heading_tabbox">
                                            <div className="heading25">
                                                About <span>Organization</span>
                                            </div>
                                            <div className="nw_user_inner_tabs">
                                                <ul>
                                                    <li className={viewIndex === 0 ? "nw_user_inner_listing_selected" : "nw_user_inner_listing"} key={0}>
                                                        <a onClick={(e) => { setLoadingCursor(true), setViewIndex(0), fetchCompany() }} className={viewIndex === 0 ? "nw_user_selected" : "new_list_view_heading"}>
                                                            <div className="nw_user_tab_icon">
                                                                <svg width="15" height="15" viewBox="0 0 682.667 682.667">
                                                                    <defs><clipPath id="a" clipPathUnits="userSpaceOnUse"><path fill="red" d="M0 512h512V0H0Z" data-original="#000000" /></clipPath></defs>
                                                                    <g fill="none" className="black_to_white_stoke" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="30" clip-path="url(#a)" transform="matrix(1.33333 0 0 -1.33333 0 682.667)">
                                                                        <path d="M497 376.5H15V104c0-32.516 26.359-58.875 58.875-58.875h364.25C470.641 45.125 497 71.484 497 104zM346.375 376.5h-180.75v44.808c0 25.166 20.401 45.567 45.567 45.567h89.616c25.166 0 45.567-20.401 45.567-45.567Z" data-original="#000000" />
                                                                        <path d="M15 376.5c0-87.23 82.38-160.02 191.97-177.01M305.03 199.49C414.62 216.48 497 289.27 497 376.5" data-original="#000000" />
                                                                        <path d="M305.03 244.78v-49.03c0-27.08-21.95-49.03-49.03-49.03-27.08 0-49.03 21.95-49.03 49.03v49.03Z" data-original="#000000" />
                                                                    </g>
                                                                </svg>
                                                            </div>
                                                            <div className="nw_user_tab_name">
                                                                Company
                                                            </div>
                                                        </a>
                                                    </li>
                                                    <li className={viewIndex === 1 ? "nw_user_inner_listing_selected" : "nw_user_inner_listing"} key={1}>
                                                        <a onClick={(e) => { setLoadingCursor(true), setViewIndex(1), fetchLeavePolicy() }} className={viewIndex === 1 ? "nw_user_selected" : "new_list_view_heading"}>
                                                            <div className="nw_user_tab_icon">
                                                                <svg width="15" height="15" viewBox="0 0 24 24">
                                                                    <path className="black_to_white_fill" fill='#000000' d="M19.2 2.098h-1.5v-.9a.9.9 0 0 0-1.8 0v.9H8.1v-.9a.9.9 0 0 0-1.8 0v.9H4.8a4.06 4.06 0 0 0-4.5 4.5v12.6a4.06 4.06 0 0 0 4.5 4.5h14.4a4.06 4.06 0 0 0 4.5-4.5v-12.6a4.06 4.06 0 0 0-4.5-4.5zm-14.4 1.8h1.5v.9a.9.9 0 0 0 1.8 0v-.9h7.8v.9a.9.9 0 0 0 1.8 0v-.9h1.5c1.892 0 2.7.807 2.7 2.7v.9H2.1v-.9c0-1.893.808-2.7 2.7-2.7zm14.4 18H4.8c-1.892 0-2.7-.808-2.7-2.7v-9.9h19.8v9.9c0 1.892-.808 2.7-2.7 2.7zm-3.564-8.94a.9.9 0 0 1 0 1.273l-3.996 4.007a.898.898 0 0 1-1.272 0l-2.004-2.004a.9.9 0 0 1 1.272-1.272L11 16.325l3.36-3.36a.899.899 0 0 1 1.276-.007z" data-original="#000000" />
                                                                </svg>
                                                            </div>
                                                            <div className="nw_user_tab_name">
                                                                Leave
                                                            </div>
                                                        </a>
                                                    </li>
                                                    <li className={viewIndex === 2 ? "nw_user_inner_listing_selected" : "nw_user_inner_listing"} key={2}>
                                                        <a onClick={(e) => { setLoadingCursor(true), setViewIndex(2), fetchHoliday() }} className={viewIndex === 2 ? "nw_user_selected" : "new_list_view_heading"}>
                                                            <div className="nw_user_tab_icon">
                                                                <svg width="15" height="15" viewBox="0 0 682.667 682.667">
                                                                    <g stroke-width="30">
                                                                        <defs><clipPath id="a" stroke-width="30" clipPathUnits="userSpaceOnUse">
                                                                            <path d="M0 512h512V0H0Z" data-original="#000000" /></clipPath>
                                                                        </defs>
                                                                        <g clip-path="url(#a)" transform="matrix(1.33333 0 0 -1.33333 0 682.667)">
                                                                            <path className="black_to_white_stoke" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M492 80c0-33.137-26.863-60-60-60H80c-33.137 0-60 26.863-60 60v312c0 33.137 26.863 60 60 60h352c33.137 0 60-26.863 60-60V180M125 492v-80M386 412v80M255 492v-80" data-original="#000000" />
                                                                            <path className="black_to_white_stoke black_to_white_fill" stroke="#000" d="M328 236h-30.09l-59.257 74.015a13.264 13.264 0 0 1-10.345 4.973c-9.776.006-16.198-10.208-11.956-19.016L245.233 236h-48.628l-17.644 19.348a8.03 8.03 0 0 1-13.961-5.41v-66.909a8.03 8.03 0 0 1 8.029-8.029h.948c2.213 0 4.329.914 5.846 2.526L197.209 196h47.956l-28.839-59.992C212.093 127.204 218.51 117 228.278 117h.005c4.038 0 7.857 1.841 10.374 5l58.934 74H328c11.287 0 23 8.724 23 20.011C351 227.298 339.287 236 328 236" data-original="#000000" />
                                                                        </g>
                                                                    </g>
                                                                </svg>
                                                            </div>
                                                            <div className="nw_user_tab_name">
                                                                Holiday
                                                            </div>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="nw_user_inner_content_box">
                                            {viewIndex == 0 ?
                                                <div className="my_task_tabbing_content">
                                                    <LoadingDialog isLoading={isLoading} />
                                                    <div className="compony_profile_mainbox">
                                                        <div className="compony_profile_contentbox">
                                                            <div className="compony_name_heading">
                                                                <label >{compData?.company_name || ""}</label>
                                                            </div>
                                                            <div className="compony_detail_mainbox">
                                                                <div className="compony_detail_listing">
                                                                    <div className="compony_detail_icons">
                                                                        <img src="/images/user/mail-icon.svg" alt="Email icon" className="img-fluid" />
                                                                    </div>
                                                                    <div className="compony_detail_data">
                                                                        <div className="compony_details_content">{compData.company_email || "--"}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="compony_detail_listing">
                                                                    <div className="compony_detail_icons">
                                                                        <img src="/images/user/telephone.svg" alt="Contact number icon" className="img-fluid" />
                                                                    </div>
                                                                    <div className="compony_detail_data">
                                                                        <div className="compony_details_content">{compData.company_number || "--"}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="compony_detail_listing">
                                                                    <div className="compony_detail_icons">
                                                                        <img src="/images/user/website-icon.svg" alt="Website icon" className="img-fluid" />
                                                                    </div>
                                                                    <div className="compony_detail_data">
                                                                        <div className="compony_details_content">{compData.company_website_url || "--"}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="compony_detail_listing">
                                                                    <div className="compony_detail_icons">
                                                                        <img src="/images/user/location-icon.svg" alt="Location icon" className="img-fluid" />
                                                                    </div>
                                                                    <div className="compony_detail_data">
                                                                        <div className="compony_details_content">{compData.company_location || "--"}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="nw_compony_profile_right">
                                                            <div className="compony_profile_logobox">
                                                                <a href="#"><img src={`${process.env.NEXT_PUBLIC_BASE_URL}/api/uploads?imagePath=${compData.leap_client_basic_info[0].company_logo}`} className="img-fluid" /></a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                : viewIndex == 1 ?
                                                    <div className="my_task_tabbing_content">
                                                        <div className="row">
                                                            <LoadingDialog isLoading={isLoading} />
                                                            <div className="col-lg-12">
                                                                <div className="nw_leave_table_mainbox">
                                                                   
                                                                         {leavearray.map((leaveType,index) => (
                                                                    <div className="nw_leave_table_listing" key={index}>
                                                                        <div className="nw_leave_table_first_box">
                                                                            <div className="nw_leave_table_icon">
                                                                                {/* <img src="/images/leave_type_icons/sick_Leave.png" alt="Leave icon" className="img-fluid" /> */}
                                                                                <img src={leaveType.leap_leave_type_icon_and_color.icon_url != null && leaveType.leap_leave_type_icon_and_color.icon_url.length > 0 ? staticIconsBaseURL + leaveType.leap_leave_type_icon_and_color.icon_url : staticIconsBaseURL+"/images/leave_type_icons/leave.svg"} className="img-fluid" style={{ maxHeight: "25px", borderRadius: "40px" }} />
                                                                            </div>
                                                                            <div className="nw_leave_table_type">
                                                                              {leaveType.leave_name && (() => {
                                                                                const [firstWord, ...rest] = leaveType.leave_name.split(' ');
                                                                                    return (
                                                                                        <>
                                                                                            <span>{firstWord}</span>
                                                                                            <br />
                                                                                            {rest.join(' ')}
                                                                                        </>
                                                                                    );
                                                                            })()}
                                                                            </div>
                                                                        </div>
                                                                        <div className="nw_leave_table_box">
                                                                            <div className="nw_leave_table_lable">Count</div>
                                                                            <div className="nw_leave_table_content">{leaveType.leave_count}</div>
                                                                        </div>
                                                                        <div className="nw_leave_table_box">
                                                                            <div className="nw_leave_table_lable">Applicable for</div>
                                                                            <div className="nw_leave_table_content">{leaveType.gender}</div>
                                                                        </div>
                                                                        <div className="nw_leave_table_box">
                                                                            <div className="nw_leave_table_lable">if unused</div>
                                                                            <div className="nw_leave_table_content">{leaveType.if_unused}</div>
                                                                        </div>
                                                                        <div className="nw_leave_table_box">
                                                                            <div className="nw_leave_table_lable">Category</div>
                                                                            <div className="nw_leave_table_content">{leaveType.leave_category}</div>
                                                                        </div>
                                                                        <div className="nw_leave_table_box nw_leave_table_eye">
                                                                            <img src="/images/user/info.svg" alt="Description icon" className="img-fluid" />
                                                                            <div className="nw_leave_table_eye_contentbox">
                                                                                {leaveType.leave_discription}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    ))}
                                                                    
                                                                   
                                                                </div>
                                                               
                                                            </div>
                                                        </div>
                                                    </div>
                                                    : viewIndex == 2 ?
                                                        <div className="my_task_tabbing_content">
                                                            <div className="row">
                                                                <LoadingDialog isLoading={isLoading} />
                                                                <div className="col-lg-12">
                                                                    <div className="nw_leave_table_mainbox">
                                                                        {holidays.length > 0 ? (
                                                                            holidays.map((holiday, index) => (
                                                                                <div className="nw_holiday_table_listing" key={index}>
                                                                                    <div className="nw_holiday_table_calender_box">
                                                                                        <div className="nw_calender_monthBox">{moment(holiday.date).format("MMM")}</div>
                                                                                        <div className="nw_calender_dateBox">{moment(holiday.date).format("DD")}</div>
                                                                                    </div>
                                                                                    <div className="nw_leave_table_box">
                                                                                        <div className="nw_leave_table_lable">Holiday Name</div>
                                                                                        <div className="nw_leave_table_content">{holiday.holiday_name}</div>
                                                                                    </div>
                                                                                    <div className="nw_leave_table_box">
                                                                                        <div className="nw_leave_table_lable">Holiday Type</div>
                                                                                        <div className="nw_leave_table_content">{holiday.leap_holiday_types?.holiday_type || "N/A"}</div>
                                                                                    </div>
                                                                                    <div className="nw_leave_table_box">
                                                                                        <div className="nw_leave_table_lable">Day</div>
                                                                                        <div className="nw_leave_table_content">{moment(holiday.date).format("dddd")}</div>
                                                                                    </div>
                                                                                    <div className="nw_leave_table_box">
                                                                                        <div className="nw_leave_table_lable">Date</div>
                                                                                        <div className="nw_leave_table_content">{moment(holiday.date).format("LL")}</div>
                                                                                    </div>
                                                                                </div>
                                                                            ))
                                                                        ) : (
                                                                            <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
                                                                                <PageErrorCenterContent content={"No holidays available"} />
                                                                            </div>
                                                                        )}
                                                                    </div>


                                                                  
                                                                </div>
                                                            </div>
                                                        </div>
                                                        : <div />
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                          

                        </div>
                    </div>
                }
            />
            <Footer />
        </div>
    );
};

export default HolidayList;
