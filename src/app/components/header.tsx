'use client';
import Head from 'next/head';
import React, { useRef, useState } from 'react'
import { createClient } from '../../../utils/supabase/client';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import useSession from '../pro_utils/sessionmgmt';
import { useRouter } from 'next/navigation';
import { pageURL_clientProfilePage, pageURL_dashboard, pageURL_userProfile } from '../pro_utils/stringRoutes';
import { getImageApiURL, staticIconsBaseURL } from '../pro_utils/stringConstants';
// import supabase from '../api/supabaseConfig/supabase';

const LeapHeader = ({ title }: any) => {
    const { session, login, logout } = useSession();
const { contaxtBranchID, contextClientID, contextRoleID,
        contextUserName, contextCustomerID, contextEmployeeID, contextLogoURL, contextProfileImage,
        contextCompanyName,setGlobalState } = useGlobalContext();
       const router =useRouter();
    const [isSearchVisible, setSearchVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const handleSearchClick = () => {
        setSearchVisible(true);

        // Start the timeout to hide the search bar if no input is entered
        timerRef.current = setTimeout(() => {
            setSearchVisible(false);
        }, 5000); // 5 seconds
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchText(value);

        // Reset the timeout if the user starts typing
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        if (value.trim() === '') {
            timerRef.current = setTimeout(() => {
                setSearchVisible(false);
            }, 5000);
        }
    };

    const handleLogout = async () => {
        setGlobalState({
            contextUserName: '',
            contextClientID: '',
            contaxtBranchID: '',
            contextCustomerID: '',
            contextRoleID: '',
            contextProfileImage: '',
            contextEmployeeID: '',
            contextCompanyName: contextCompanyName,
            contextLogoURL: '',
            contextSelectedCustId: '',
            contextAddFormEmpID: '',
            contextAnnouncementID:'',
            contextAddFormCustID: '',
            dashboard_notify_cust_id: '',
            dashboard_notify_activity_related_id: '',
            selectedClientCustomerID: '',
            contextPARAM7: '',
            contextPARAM8: '',
        });
       
        const supabase =createClient();
        await supabase.auth.signOut()
        logout(contextCompanyName);


        console.log("User logged out");
    };
    let subTitle = "";
    if (title.toLowerCase() == "dashboard") {
        subTitle = "Welcome To "
    }

    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {


        setDropdownVisible((prev) => !prev);
        console.log("drop down visble---------------------------", isDropdownVisible);
    };

    const hideDropdown = () => {
        setDropdownVisible(false);
    };
    function navigateToProfile(goToNumber: number) {
        if(goToNumber==1){
            router.push(pageURL_clientProfilePage);
        }else{
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
                contextSelectedCustId: '',
                contextAddFormEmpID: '',
                contextAnnouncementID: '',
                contextAddFormCustID: '',
                dashboard_notify_cust_id: '',
                dashboard_notify_activity_related_id: '',
                selectedClientCustomerID: '',
                contextPARAM7: '',
                contextPARAM8: '',
    
            });
            router.push(pageURL_userProfile)
        }
    }
    function navigateToDashboard() {
            console.log("navigate dashboard called");
            
            router.push(pageURL_dashboard);
        
    }

    return (

        <div>
            <div className="container-fluid">
                <div className="row">
                    <div className="grid grid-cols-1 p-0">
                        {/* "/images/dashboard-logo.png" */}
                        <div className="dash_logo"><img src={getImageApiURL +"/"+ contextLogoURL} className="header-logo" style={{cursor:"pointer"}}onClick={()=>{navigateToDashboard()}}/></div>
                        {/* <div className="dash_logo"><img src="/images/dashboard-logo.png" className="img-fluid" /></div> */}
                        <div className="dash_topbox">

                            <div className="welcome_text">

                                {subTitle}<span>{title} {contextUserName}</span>
                                <div style={{display:"none"}}>{contextLogoURL}</div>
                            </div>
                            <div className="dash_topotherbox">
                                <div className="option">
                                    {!isSearchVisible && (
                                        <a onClick={handleSearchClick} style={{ cursor: 'pointer' }}>
                                            <img src={staticIconsBaseURL+"/images/search_icon.png"} className="img-fluid" alt="Search Icon" />
                                            <div className="option_label">Search</div>
                                        </a>
                                    )}

                                    {isSearchVisible && (
                                        <div className="search-bar-container">
                                            <div className="search-bar">
                                                <img src={staticIconsBaseURL+"/images/search_icon.png"} className="search-icon" alt="Search Icon" />
                                                <input
                                                    type="text"
                                                    value={searchText}
                                                    onChange={handleInputChange}
                                                    placeholder="Type to search..."
                                                    className="form-control search-input"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="option">
                                    <a href="#"><img src={staticIconsBaseURL+"/images/notification_icon.png"} className="img-fluid" /><div className="option_label">Notification</div></a>
                                </div>
                                

                                <div className="headeroptions-container"
                                    style={{ position: "relative", display: "inline-block" }}
                                    onMouseEnter={() => setDropdownVisible(true)} // Show dropdown on hover
                                    onMouseLeave={() => setDropdownVisible(false)} // Hide dropdown when not hovering
                                >
                                    <div className="option profile_box" onClick={toggleDropdown} style={{ cursor: "pointer" }}>
                                            <img src={getImageApiURL +contextProfileImage} className="img-fluid" style={{ maxHeight: "35px" }} />
                                            <div className="profile_dropdown">
                                            {contextRoleID=="2"?<div onClick={(e)=> {navigateToProfile(1)}}>Profile</div>:<div onClick={(e)=> {navigateToProfile(2)}}>My Profile</div>}
                                                    <div>Setting</div>
                                                    <div onClick={handleLogout}>Logout</div>
                                            </div>
                                    </div>

                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default LeapHeader