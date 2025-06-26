

// User dashboard

'use client'
import React, { useEffect, useRef, useState } from 'react'
import LeapHeader from '../../components/header'
import LeftPannel from '../../components/leftPannel';
import supabase from '../../api/supabaseConfig/supabase';
import LoadingDialog from '../../components/PageLoader';
import { useRouter } from 'next/navigation';
import Footer from '../../components/footer';
import { useGlobalContext } from '../../contextProviders/loggedInGlobalContext';
import { clientAdminDashboard, permission_m_asset_id, permission_m_document_id, permission_m_help_id, permission_m_holiday_id, permission_m_leave_id, permission_m_notification_id, permission_m_task_id, permission_s_googleMeetCalender_id, staticIconsBaseURL } from '../../pro_utils/stringConstants';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import ShowAlertMessage from '@/app/components/alert'
import { ALERTMSG_addAssetSuccess } from '@/app/pro_utils/stringConstants'

interface userPermissionModel {
    permission_id:'',
    is_allowed:false
}
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import GreetingBlock from '@/app/components/userGreetingBlock';
import UserAttendanceTimer from '@/app/components/userAttendanceTimer';
import { CustomerLeavePendingCount } from '@/app/models/leaveModel';
import moment from 'moment';
import { pageURL_userApplyLeaveForm, pageURL_userAsset, pageURL_userDoc, pageURL_userFillTask, pageURL_userSupportForm, pageURL_userTeamLeave } from '@/app/pro_utils/stringRoutes';
import { AttendanceTimer } from '@/app/models/userDashboardModel';

const Dashboard = () => {
    const router = useRouter();
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    const swiperRef = useRef<any>(null);
    const [isLoading, setLoading] = useState(false);
    const [balancearray, setBalanceLeave] = useState<CustomerLeavePendingCount[]>([]);
    const [holidays, setHolidays] = useState<any[]>([]);
    const [empSalarySlip, setSalarySlip] = useState<LeapCustomerDocument[]>([]);
    const [permissionData, setPermissionData] = useState<userPermissionModel[]>();
    const { contaxtBranchID, contextClientID, contextRoleID,
        contextUserName, contextCustomerID, contextEmployeeID, contextLogoURL, contextProfileImage,
        contextCompanyName, dashboard_notify_activity_related_id, dashboard_notify_cust_id, setGlobalState } = useGlobalContext();
    const [announcementData, setAnnouncementData] = useState<userPermissionModel[]>();

    const [attendanceData, setAttendanceData] = useState<AttendanceTimer>();

    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');
    const [alertMidContent, setAlertMidContent] = useState('');
    const [alertEndContent, setAlertEndContent] = useState('');
    const [alertValue1, setAlertValue1] = useState('');
    const [alertvalue2, setAlertValue2] = useState('');

    
    useEffect(() => {

        fetchDashboard();
        // const intervalId = setInterval(() => {
        //     // fetchActivities();
        //     fetchData();
        // }, 5000); // Call fetchActivities every 5 seconds

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
            // clearInterval(intervalId);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const fetchDashboard = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("client_id", contextClientID);
            formData.append("branch_id", contaxtBranchID);
            formData.append("customer_id", contextCustomerID);
            formData.append("role_id", contextRoleID);

            const res = await fetch("/api/clientAdmin/dashboard", {
                method: "POST",
                body: formData,
            });
            if (res.ok) {
                const response = await res.json();
                setHolidays(response.upcommingHolidays.holidays);
                setBalanceLeave(response.myLeaveBalances.customerLeavePendingCount);
                setSalarySlip(response.my_documents[0]);
                setAttendanceData(response.myattendance[0]);
                setAnnouncementData(response.announcements[0]);
            } else {
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("Failed to load dashboard");
                setAlertForSuccess(2)
            }
        } catch (error) {
            setLoading(false);
            console.error("Error fetching user data:", error);
            setShowAlert(true);
            setAlertTitle("Exception")
            setAlertStartContent("Failed to load");
            setAlertForSuccess(2)
        }
    };

    const checkPermission = (permissionId:any) => {
        if(permissionData){
        for(let i = 0; i< permissionData?.length; i++ ){
            if(permissionData[i].permission_id === permissionId){
                return permissionData[i].is_allowed;
            }
        }
        }
    }
    return (
        <div className='mainbox'>
            <header>
                <LeapHeader title={clientAdminDashboard} />
            </header>
            <LeftPannel menuIndex={20} subMenuIndex={0} showLeftPanel={true} rightBoxUI={
                <div >
                    {/* <LoadingDialog isLoading={isLoading} /> */}
                    {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                        setShowAlert(false)
                    }} onCloseClicked={function (): void {
                        setShowAlert(false)
                    }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="new_user_dashbord_leftbox">
                                    <div className="new_user_left_firstmainbox">
                                        < GreetingBlock />
                                        {attendanceData && < UserAttendanceTimer data={attendanceData!} />}
                                    </div>
                                    <div className="new_user_btns">
                                            {/* {checkPermission(permission_m_document_8) && */}
                                            <div className="salery_slip_btn_box">
                                                <div className="salery_slip_btn_left">
                                                    {/* {empSalarySlip[0].doc_type_id == "19" &&  */}
                                                    {/* <a href={empSalarySlip[0].bucket_url} download > */}
                                                        {/* <img src={staticIconsBaseURL+"/images/download_red.png"} className="img-fluid" style={{ width: "30px" }} /> */}
                                                        <img src="/images/user/salaryslip.gif" alt="Salary Slip Icon" style={{maxWidth: "45px", padding:"1px 1px 0px 7px"}} className="img-fluid" />
                                                    {/* </a> */}
                                                     {/* } */}
                                                </div>
                                                <div className="salery_slip_btn_right"><span>SALARY</span> SLIP</div>
                                            </div>
                                             {/* }  */}
                                        {/* {checkPermission(permission_m_task_5) && */}
                                        <a href={pageURL_userFillTask}>
                                            <div className="new_user_btnlist">
                                                <div className="new_user_btnlist_left">
                                                    <img src="/images/user/task_gif.gif" alt="Task Icon" className="img-fluid" />
                                                </div>
                                                <div className="new_user_btnlist_right">
                                                    My Task
                                                </div>
                                            </div>
                                        </a>
                                         {/* }  */}
                                        {/* {checkPermission(permission_m_asset_6) && */}
                                        <a href={pageURL_userAsset}>
                                            <div className="new_user_btnlist">
                                                <div className="new_user_btnlist_left">
                                                    <img src="/images/user/asset.gif" alt="Assets Icon" className="img-fluid" />
                                                </div>
                                                <div className="new_user_btnlist_right">
                                                    My Assets
                                                </div>
                                            </div>
                                        </a>
                                         {/* }  */}
                                        {/* {checkPermission(permission_m_document_8) && */}
                                        <a href={pageURL_userDoc}>
                                            <div className="new_user_btnlist">
                                                <div className="new_user_btnlist_left">
                                                    <img src="/images/user/document.gif" alt="Documents Icon" className="img-fluid" />
                                                </div>
                                                <div className="new_user_btnlist_right">
                                                    Documents
                                                </div>
                                            </div>
                                        </a>
                                         {/* }  */}
                                        {/* {checkPermission(permission_m_help_10) && */}
                                            <a href={pageURL_userSupportForm}>
                                            <div className="new_user_btnlist new_user_btnlist_last">
                                                <div className="new_user_btnlist_left">
                                                    <img src="/images/user/help.gif" alt="Support Icon" style={{maxWidth: "28px", height: "auto"}} />
                                                </div>
                                                <div className="new_user_btnlist_right" style={{padding: "0px 1px 2px 1p"}}>
                                                    Help
                                                </div>
                                            </div>
                                        </a>
                                         {/* } */}
                                    </div>
                                    {/* {checkPermission(permission_m_leave_7) && */}
                                    <div className="new_user_left_fourthmainbox">
                                        <div className="new_user_fourth_leftbox">
                                            <div className="swiper-wrapper-with-nav">
                                                <div>
                                                    <Swiper
                                                        slidesPerView="auto"
                                                        spaceBetween={16}
                                                        navigation={{
                                                            nextEl: '.swiper-button-next-custom',
                                                            prevEl: '.swiper-button-prev-custom',
                                                        }}
                                                        modules={[Navigation]}
                                                        onSwiper={(swiper) => {
                                                            swiperRef.current = swiper;
                                                            setIsBeginning(swiper.isBeginning);
                                                            setIsEnd(swiper.isEnd);
                                                        }}
                                                        onSlideChange={(swiper) => {
                                                            setIsBeginning(swiper.isBeginning);
                                                            setIsEnd(swiper.isEnd);
                                                        }}
                                                        className="custom-swiper"
                                                    >
                                                        {balancearray.map((balance, index) =>
                                                            <SwiperSlide key={index}>
                                                                <div className="new_user_modal_leave_listing">
                                                                    <div className="new_user_modal_leave_leftbox">
                                                                        {balance.leaveType && (() => {
                                                                            const [firstWord, ...rest] = balance.leaveType.split(' ');
                                                                            return (
                                                                                <>
                                                                                    <span>{firstWord}</span>
                                                                                    <br />
                                                                                    {rest.join(' ')}
                                                                                </>
                                                                            );
                                                                        })()}
                                                                    </div>
                                                                    <div className="new_user_modal_leave_rightbox">
                                                                        {balance.leaveBalance}/{balance.leaveAllotedCount}
                                                                    </div>
                                                                </div>
                                                            </SwiperSlide>
                                                        )}
                                                    </Swiper>
                                                </div>
                                                <div className="new_user_navbox">
                                                    <div className="swiper-button-prev-custom swiper_btn">{"<"}</div>
                                                    <div className="swiper-button-next-custom swiper_btn">{">"}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="new_user_fourth_rightbox">
                                            <div className="new_user_fourth_right_btnbox">
                                                <a href={pageURL_userApplyLeaveForm}>
                                                    Apply Leave
                                                </a>
                                            </div>
                                            {contextRoleID != "5" && 
                                                <div className="new_user_fourth_right_btnbox">
                                                <a href={pageURL_userTeamLeave}>
                                                    My Team
                                                </a>
                                            </div>}
                                        </div>
                                    </div>
                                    {/* } */}
                                    <div className="new_user_left_secondmainbox">
                                    </div>
                                    <div className="new_user_left_thirdmainbox">

                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="new_user_dashbord_rightbox">
                                    {/* {permissionData(permission_m_notification_9) && */}
                                        <div className="new_user_notification_mainbox">
                                        <div className="new_user_notification_headingbox">
                                            <div className="new_user_notification_icon">
                                                <img src="/images/user/notification-icon.svg" alt="Notification Icon" className="img-fluid" />
                                            </div>
                                            <div className="new_user_notification_heading">Notification Corner</div>
                                        </div>
                                        <div className="new_user_notification_listing">
                                            <ul className="user_notification_list">
                                                <li><a href="">Happy Birthday Sahil Khambe<span className='notification_detail_icon'><img src="/images/user/notification-detail-icon.svg" alt="Notification detail" className="img-fluid" /></span></a></li>
                                                <li><a href="">Celebration  of International Workers Day on 1 May 2025<span className='notification_detail_icon'><img src="/images/user/notification-detail-icon.svg" alt="Notification detail" className="img-fluid" /></span></a></li>
                                                <li><a href="">Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque, repudiandae!<span className='notification_detail_icon'><img src="/images/user/notification-detail-icon.svg" alt="Notification detail" className="img-fluid" /></span></a></li>
                                                <li><a href="">Lorem ipsum dolor sit amet consectetur adipisicing elit.<span className='notification_detail_icon'><img src="/images/user/notification-detail-icon.svg" alt="Notification detail" className="img-fluid" /></span></a></li>
                                                <li><a href="">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt?<span className='notification_detail_icon'><img src="/images/user/notification-detail-icon.svg" alt="Notification detail" className="img-fluid" /></span></a></li>
                                                <li><a href="">Happy Birthday Sahil Khambe<span className='notification_detail_icon'><img src="/images/user/notification-detail-icon.svg" alt="Notification detail" className="img-fluid" /></span></a></li>
                                                <li><a href="">Celibration  of International Workers Day on 1 May 2025<span className='notification_detail_icon'><img src="/images/user/notification-detail-icon.svg" alt="Notification detail" className="img-fluid" /></span></a></li>
                                                <li><a href="">Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque, repudiandae!<span className='notification_detail_icon'><img src="/images/user/notification-detail-icon.svg" alt="Notification detail" className="img-fluid" /></span></a></li>
                                                <li><a href="">Lorem ipsum dolor sit amet consectetur adipisicing elit.<span className='notification_detail_icon'><img src="/images/user/notification-detail-icon.svg" alt="Notification detail" className="img-fluid" /></span></a></li>
                                                <li><a href="">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt?<span className='notification_detail_icon'><img src="/images/user/notification-detail-icon.svg" alt="Notification detail" className="img-fluid" /></span></a></li>
                                            </ul>
                                        </div>
                                    </div>
                                     {/* } */}
                                    {/* {permissionData(permission_m_holiday_id) && */}
                                        <div className="new_user_holiday_list_mainbox">
                                        <div className="new_user_notification_headingbox">
                                            <div className="new_user_notification_icon">
                                                <img src="/images/user/calender.svg" alt="Calender Icon" className="img-fluid" />
                                            </div>
                                            <div className="new_user_notification_heading"> Holiday List</div>
                                        </div>
                                        {holidays.map((holiday) => (
                                            <div className="new_user_notification_listing" key={holiday.id}>
                                                <div className="monthely_holiday_listing" >
                                                    <div className="monthely_holiday_leftbox">
                                                        <div className="monthely_holiday_day">{moment(holiday.date).format("Do")}</div>
                                                        <div className="monthely_holiday_date">{moment(holiday.date).format("MMMM")}</div>
                                                    </div>
                                                    <div className="monthely_holiday_rightbox">
                                                        {holiday.holiday_name}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* } */}
                                    {/* {permissionData(permission_s_googleMeetCalender_id) */}
                                        <div className="new_user_meeting_mainbox">
                                        <div className="new_user_notification_headingbox">
                                            <div className="new_user_notification_icon">
                                                <img src="/images/user/video.svg" alt="Calender Icon" className="img-fluid" />
                                            </div>
                                            <div className="new_user_notification_heading">Meeting List</div>
                                        </div>
                                        {/* <div className="new_user_notification_listing"> */}
                                            <iframe src="https://calendar.google.com/calendar/embed?height=200&wkst=1&ctz=Asia%2FKolkata&showPrint=0&src=cml0aWthLnNAZXZvbml4LmNv&src=ZW4uaW5kaWFuI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%23039BE5&color=%230B8043" style={{borderWidth:"0", width:"400", height:"200", border:"0"}}></iframe>
                                            {/* <iframe src="https://calendar.google.com/calendar/embed?height=200&wkst=1&ctz=Asia%2FKolkata&showPrint=0&src=cml0aWthLnNAZXZvbml4LmNv&src=ZW4uaW5kaWFuI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%23039BE5&color=%230B8043" style="border:solid 1px #777" width="400" height="200" frameborder="0" scrolling="no"></iframe>                   */}              
                                                    {/* </div>  */}
                                    </div>
                                    {/* } */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            />
            <Footer />
        </div>
    )
}
export default Dashboard
