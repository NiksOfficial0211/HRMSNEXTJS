// 'use client'
// import React, { useRef } from 'react'
// import LeapHeader from '@/app/components/header'
// import Footer from '@/app/components/footer'
// import LoadingDialog from '@/app/components/PageLoader'
// import  { useEffect, useState } from 'react'
// import supabase from '@/app/api/supabaseConfig/supabase'
// import AssetUpdate from '@/app/components/dialog_updateAsset'
// import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
// import BackButton from '@/app/components/BackButton'
// import { pageURL_addAsset, pageURL_assetTypeList, pageURL_assignAsset, pageURL_userSupportForm } from '@/app/pro_utils/stringRoutes'
// import DialogAssignAsset from '@/app/components/dialog_assign_asset'
// import { SupportList } from '@/app/models/supportModel'
// import LeftPannel from '@/app/components/leftPannel'
// import { DateRange, RangeKeyDict } from 'react-date-range';
// import { Range } from 'react-date-range';
// import { format } from 'date-fns'
// import moment from 'moment'
// import UserSupport from '@/app/components/dialog_userSupport'
// import PageErrorCenterContent from '@/app/components/pageError'
// import ShowAlertMessage from '@/app/components/alert'
// import { ALERTMSG_addAssetSuccess, staticIconsBaseURL } from '@/app/pro_utils/stringConstants'

// interface filterType {
//     active_status: any,
//     start_date:any,
//     end_date:any
//     priority_level: any
// }

// const Support = () => {
//     const { contextClientID,contextCustomerID } = useGlobalContext();
    
//     const [supportArray, setSupport] = useState<SupportList[]>([]);
//     const [showDialog, setShowDialog] = useState(false);
//     const [isLoading, setLoading] = useState(false);
//     const [detailID, setDetailID] = useState(-1);
//     const [statusArray, setStatus] = useState<SupportStatus[]>([]);
//     const [priorityArray, setPriority] = useState<SupportPriority[]>([]);
//     const [editSupportId, setEditSupportId] = useState(0);
//     const [hasMoreData, setHasMoreData] = useState(true);
//     const [loadingCursor, setLoadingCursor] = useState(false);
//     const [selectedPage, setSelectedPage] = useState(1);

//     const [showAlert, setShowAlert] = useState(false);
//     const [alertForSuccess, setAlertForSuccess] = useState(0);
//     const [alertTitle, setAlertTitle] = useState('');
//     const [alertStartContent, setAlertStartContent] = useState('');
//     const [alertMidContent, setAlertMidContent] = useState('');
//     const [alertEndContent, setAlertEndContent] = useState('');
//     const [alertValue1, setAlertValue1] = useState('');
//     const [alertvalue2, setAlertValue2] = useState('');

//     const [filters, setFilters] = useState<filterType>({
//         active_status: "", start_date:'',end_date:'',
//         priority_level:""
//     });
//     const [scrollPosition, setScrollPosition] = useState(0);

//     useEffect(() => {
//         fetchFilter();
//         fetchData("","",selectedPage,"","");
//     const handleScroll = () => {
//         setScrollPosition(window.scrollY); // Update scroll position
//         const element = document.querySelector('.mainbox');
//     if (window.pageYOffset > 0) {
//         element?.classList.add('sticky');
//     } else {
//         element?.classList.remove('sticky');
//     }
//       };
//     window.addEventListener('scroll', handleScroll);
//     return () => {       
//         window.removeEventListener('scroll', handleScroll);
//       };
//     },[selectedPage])
//     const fetchFilter = async () => {
//         const approval = await getStatus();
//         setStatus(approval);
//         const priority = await getPriority();
//         setPriority(priority);
//     }
//     const formData = new FormData();

//     const fetchData = async (filterID: any, value: any, pageNumber: number,startDate:any,endDate:any) => {
//         setLoading(true);
//         try{
//             const formData = new FormData();
//             formData.append("client_id", contextClientID);
//             formData.append("customer_id", contextCustomerID );
//             if (filterID == 1) formData.append("active_status", filters.active_status.length > 0 && filters.active_status == value ? filters.active_status : value);
//             if (filterID == 2) formData.append("priority_level", filters.priority_level.length > 0 && filters.priority_level == value ? filters.priority_level : value);
//             if(startDate || filters.start_date) formData.append("start_date", formatDateYYYYMMDD(startDate || filters.start_date));
//             if(endDate || filters.end_date) formData.append("end_date", formatDateYYYYMMDD(endDate || filters.end_date));
//             if(filterID== 1 || filters.active_status.length > 0 ) formData.append("active_status", filters.active_status);
//             if(filterID== 2 || filters.priority_level.length > 0 ) formData.append("priority_level", filters.priority_level);

//             const res = await fetch(`/api/users/support/supportList?page=${pageNumber}&limit=${10}`, {
//             method: "POST",
//             body: formData,
//         });
//         const response = await res.json();
//         const supportData = response.data;

//         if(response.status==1 && supportData.length > 0){
//             setLoading(false);
//             setSupport(supportData);
//             if(supportData.length < 10) {
//                 setHasMoreData(false);
//             }else {
//                 setHasMoreData(true);
//             }
//         }else if(response.status == 1 && supportData.length == 0){
//             setLoading(false);
//             setSupport([]);
//             setHasMoreData(false);
//         } else if(response.status == 0) {
//             setLoading(false);
//             setSelectedPage(response.page);
//             setHasMoreData(false);
//             setShowAlert(true);
//             setAlertTitle("Error")
//             setAlertStartContent("Failed to load next page data");
//             setAlertForSuccess(2)
//         }
//         } catch (error) {
//             setLoading(false);
//             console.error("Error fetching user data:", error);
//             setShowAlert(true);
//             setAlertTitle("Exception")
//             setAlertStartContent(ALERTMSG_addAssetSuccess);
//             setAlertForSuccess(2)
//         }
//     }
//      function filter_whitebox() {
//             const x = document.getElementById("filter_whitebox");
//             if (x!.className === "filter_whitebox") {
//                 x!.className += " filter_whitebox_open";
//             } else {
//                 x!.className = "filter_whitebox";
//             }
//         }
//         const resetFilter = async () => {
//             window.location.reload();
//             setFilters({
//                 active_status: "",start_date:'',end_date:'', priority_level: ""
//             });
//             fetchData("", "",selectedPage,"","");
//         };
//         function changePage(page: any) {
//             if (hasMoreData) {
//                 setSelectedPage(selectedPage + page);
//                 fetchData(3, "", selectedPage + page,'','');
//             }
//             else if (!hasMoreData && selectedPage>1) {
//                 setSelectedPage(selectedPage + page);
//                 fetchData(3, "", selectedPage + page,'','');
//             }
//         }
//     const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//             const { name, value } = e.target;
//             console.log("this is the name ", name);
//             console.log("this is the value", value);

//             if (name == "active_status") {
//                 setFilters((prev) => ({ ...prev, ['active_status']: value }));
//                 fetchData(1, value, selectedPage, '', '');
//             }
//             if (name == "priority_level") {
//                 setFilters((prev) => ({ ...prev, ['priority_level']: value }));
//                 fetchData(2, value, selectedPage, '', '');
//             }
//         };
//         const [showCalendar, setShowCalendar] = useState(false);
//                     const ref = useRef(null);
//                     const [state, setState] = useState<Range[]>([
//                         {
//                             startDate: new Date() || null,
//                             endDate: new Date() || null,
//                             key: 'selection'
//                         }
//                     ]);
//                     const handleChange = (ranges: RangeKeyDict) => {
//                         setState([ranges.selection]);
//                         setShowCalendar(false)
//                         if(ranges.selection.startDate==ranges.selection.endDate){
//                             setFilters((prev) => ({ ...prev, ['start_date']: ranges.selection.startDate }));
//                         }else{
//                             setFilters((prev) => ({ ...prev, ['start_date']: ranges.selection.startDate }));
//                             setFilters((prev) => ({ ...prev, ['end_date']: ranges.selection.endDate }));
                
//                         }
//                         fetchData('', '',selectedPage,ranges.selection.startDate,ranges.selection.endDate);
//                     };
//                     const formattedRange = state[0].startDate! == state[0].endDate!?format(state[0].startDate!, 'yyyy-MM-dd'):`${format(state[0].startDate!, 'yyyy-MM-dd')} to ${format(state[0].endDate!, 'yyyy-MM-dd')}`;
//                     const formatDateYYYYMMDD = (date: any, isTime = false) => {
//                         if (!date) return '';
//                         const parsedDate = moment(date);
                
//                         if (isTime) return parsedDate.format('HH:mm A');
                
//                         return parsedDate.format('YYYY-MM-DD');
//                     };
//     return (
//         <div className='mainbox'>
//         <header>
//         <LeapHeader title="Welcome!" />
//         </header>
//             <LeftPannel menuIndex={27} subMenuIndex={0} showLeftPanel={true} rightBoxUI= { 
//                 //  supportArray! && supportArray.length > 0  ?              
//                 <div>
//                     <LoadingDialog isLoading={isLoading} />
                    
//                     <div className='container'>
//                         {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
//                         setShowAlert(false)
//                     }} onCloseClicked={function (): void {
//                         setShowAlert(false)
//                     }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
//                     <div className={`${loadingCursor?"cursorLoading":""}`}>
//                         <div style={{ top: "0", zIndex: "50", backgroundColor: "#ebeff2", padding: "0 0 10px 0" }}>
//                             <div className="row heading25 mb-3 pt-2" style={{ alignItems: "center" }}>
//                                 <div className="col-lg-6">
//                                     <span>Help</span>
//                                 </div>
//                                 <div className="col-lg-6" style={{textAlign: "right"}}>
//                                     <a href={pageURL_userSupportForm} className="red_button red_button2">+</a>&nbsp;
//                                     <div className="filtermenu red_button" onClick={filter_whitebox}>Filter</div>&nbsp;
//                                 </div>
//                                 <div className="row">
//                                     <div className="col-lg-12">
//                                         <div className="filter_whitebox" id="filter_whitebox">
//                                             <div className="row">
//                                                 <div className="col-lg-2">
//                                                     <div className="form_box mb-3">
//                                                         <select id="active_status" name="active_status" onChange={handleFilterChange}>
//                                                             <option value="">Status:</option>
//                                                             {statusArray.map((dep, index) => (
//                                                                 <option value={dep.id} key={dep.id}>{dep.status}</option>
//                                                             ))}
//                                                         </select>
//                                                     </div>
//                                                 </div>
//                                                 <div className="col-lg-2">
//                                                     <div className="form_box mb-3">
//                                                         <select id="priority_level" name="priority_level" onChange={handleFilterChange}>
//                                                             <option value="">Priority Level:</option>
//                                                             {priorityArray.map((dep, index) => (
//                                                                 <option value={dep.id} key={dep.id}>{dep.priority_name}</option>
//                                                             ))}
//                                                         </select>
//                                                     </div>
//                                                 </div>
//                                                 <div className="col-lg-3">
//                                                    <input
//                                                         type="text"
//                                                         className="form-control"
//                                                         value={formattedRange}
//                                                         readOnly
//                                                         onClick={() => setShowCalendar(!showCalendar)}
//                                                     />
//                                                     {showCalendar && (
//                                                         <div style={{ position: 'absolute', zIndex: 1000 }}>
//                                                             <DateRange
//                                                                 editableDateInputs={true}
//                                                                 onChange={handleChange}
//                                                                 moveRangeOnFirstSelection={false}
//                                                                 ranges={state}
//                                                             />
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                                 <div className="col-lg-2">
//                                                     <div className="form_box mb-3">
//                                                         <a className="red_button" onClick={() => resetFilter()}>Reset</a>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         {supportArray! && supportArray.length > 0 ? 
//                         <div className="row">                       
//                             <div className="col-lg-12">
//                                 <div className="row mb-5">
//                                     <div className="col-lg-12">
//                                         <div className="grey_box" style={{ backgroundColor: "#fff" }} >
//                                             <div className="row list_label mb-4">
//                                                 <div className="col-lg-2 text-center"><div className="label">Category</div></div>
//                                                 <div className="col-lg-2 text-center"><div className="label">Request Type</div></div>
//                                                 <div className="col-lg-1 text-center"><div className="label">Raised on</div></div>
//                                                 <div className="col-lg-2 text-center"><div className="label">Priority level</div></div>
//                                                 <div className="col-lg-2 text-center"><div className="label">Description</div></div>
//                                                 <div className="col-lg-2 text-center"><div className="label">Status</div></div>
//                                             </div>
//                                             {supportArray.map((id) => (
//                                                 <div className="row list_listbox" key={id.id}>
//                                                     <div className="col-lg-2 text-center">{id.leap_request_master.category}</div>
//                                                     <div className="col-lg-2 text-center">{id.leap_request_master.type_name}</div>
//                                                     <div className="col-lg-1 text-center">{id.raised_on}</div>
//                                                     {id.priority_level === 1 ? (
//                                                         <><div className="col-lg-2 text-center" ><div className="user_red_chip">{id.leap_request_priority.priority_name}</div></div></>
//                                                         ): id.priority_level === 2 ? (
//                                                             <><div className="col-lg-2 text-center" ><div className="user_orange_chip">{id.leap_request_priority.priority_name}</div></div></>
//                                                         ):  id.priority_level === 3 ? (
//                                                             <><div className="col-lg-2 text-center" ><div className="user_green_chip">{id.leap_request_priority.priority_name}</div></div></>
//                                                         ) : < div />
//                                                     }
//                                                     <div className="col-lg-2 text-center">{id.description}</div>
//                                                     {id.active_status === 1 ? (
//                                                                     <><div className="col-lg-2 text-center "><div className="user_orange_chip">{id.leap_request_status.status}</div></div></>
//                                                                 ): id.active_status === 2 ? (
//                                                                     <><div className="col-lg-2 text-center " ><div className="user_green_chip">{id.leap_request_status.status}</div></div></>
//                                                                 ):  id.active_status === 3 ? (
//                                                                     <><div className="col-lg-2 text-center "><div className="user_red_chip">{id.leap_request_status.status}</div></div></>
//                                                                 ): id.active_status === 4 ? (
//                                                                     <><div className="col-lg-2 text-center "><div className="user_blue_chip">{id.leap_request_status.status}</div></div></>
//                                                                 ):< div />}  
                                                 
//                                                     <div className="col-lg-1 text-center">
//                                                         <img src="/images/menu.png" className="img-fluid edit-icon" alt="Search Icon" style={{ width: "20px", paddingBottom: "5px", alignItems: "center" }}
//                                                             onClick={() => {
//                                                                 setEditSupportId(id.id);
//                                                                 setShowDialog(true)
//                                                                 }} />
//                                                     </div>
//                                                 </div>
//                                             ))} 
//                                                 <div className={showDialog ? "rightpoup rightpoupopen" : "rightpoup"}>
//                                                     {showDialog && <UserSupport id={editSupportId} selectedShortCutID={false} onClose={(updateData) => { setShowDialog(false), updateData && fetchData(3, "", selectedPage,'','') }} />}
//                                                 </div>
//                                             </div>
//                                     </div>
//                                 </div>
//                                 {/* here are the page number crowsels */}
//                                 <div className="row">
//                                 <div className="col-lg-6 mb-1" style={{ textAlign: "left" }}>
//                                             <BackButton isCancelText={false} />
//                                         </div>
//                                         <div className="col-lg-6" style={{ textAlign: "right" }}>
//                                             <div className="page_changer">
//                                                 {selectedPage > 1 ? <div className="white_button_border_red" onClick={() => { changePage(-1) }}>Prev</div> : <></>}
//                                                 <div className="font15Medium">{selectedPage}</div>
//                                                 <div className="red_button" onClick={() => { changePage(1) }}>Next</div>
//                                             </div>
//                                         </div>
//                                     </div>
//                             </div>
//                         </div>   
//                         : <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
//                             <PageErrorCenterContent content={"No support list"}/>
//                         </div>
//                     }           
//                     </div>
//                 </div></div>
//              }/>
//         {/* </div> */}
//     <div>
//       <Footer />
//     </div>
//         </div>
//     )
// }

// export default Support;

// async function getStatus() {

//     let query = supabase
//         .from('leap_request_status')
//         .select()
//         ;
//     const { data, error } = await query;
//     if (error) {
//         console.log(error);
//         return [];
//     } else {
//         return data;
//     }
// }

// async function getPriority() {

//     let query = supabase
//         .from('leap_request_priority')
//         .select()
//         ;
//     const { data, error } = await query;
//     if (error) {
//         console.log(error);
//         return [];
//     } else {
//         return data;
//     }
// }
'use client'
import React, { useRef } from 'react'
import LeapHeader from '@/app/components/header'
import Footer from '@/app/components/footer'
import LoadingDialog from '@/app/components/PageLoader'
import { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase'
import AssetUpdate from '@/app/components/dialog_updateAsset'
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
import BackButton from '@/app/components/BackButton'
import { pageURL_addAsset, pageURL_assetTypeList, pageURL_assignAsset, pageURL_userSupportForm } from '@/app/pro_utils/stringRoutes'
import DialogAssignAsset from '@/app/components/dialog_assign_asset'
import { SupportList } from '@/app/models/supportModel'
import LeftPannel from '@/app/components/leftPannel'
import { DateRange, RangeKeyDict } from 'react-date-range';
import { Range } from 'react-date-range';
import { format } from 'date-fns'
import moment from 'moment'
import UserSupport from '@/app/components/dialog_userSupport'
import PageErrorCenterContent from '@/app/components/pageError'
import ShowAlertMessage from '@/app/components/alert'
import { ALERTMSG_addAssetSuccess, staticIconsBaseURL } from '@/app/pro_utils/stringConstants'

interface filterType {
    active_status: any,
    start_date: any,
    end_date: any
    priority_level: any
}

const Support = () => {
    const { contextClientID, contextCustomerID } = useGlobalContext();

    const [supportArray, setSupport] = useState<SupportList[]>([]);
    const [showDialog, setShowDialog] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [detailID, setDetailID] = useState(-1);
    const [statusArray, setStatus] = useState<SupportStatus[]>([]);
    const [priorityArray, setPriority] = useState<SupportPriority[]>([]);
    const [editSupportId, setEditSupportId] = useState(0);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [loadingCursor, setLoadingCursor] = useState(false);
    const [selectedPage, setSelectedPage] = useState(1);

    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');
    const [alertMidContent, setAlertMidContent] = useState('');
    const [alertEndContent, setAlertEndContent] = useState('');
    const [alertValue1, setAlertValue1] = useState('');
    const [alertvalue2, setAlertValue2] = useState('');

    const [filters, setFilters] = useState<filterType>({
        active_status: "", start_date: '', end_date: '',
        priority_level: ""
    });
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        fetchFilter();
        fetchData("", "", selectedPage, "", "");
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
    }, [selectedPage])
    const fetchFilter = async () => {
        const approval = await getStatus();
        setStatus(approval);
        const priority = await getPriority();
        setPriority(priority);
    }
    const formData = new FormData();

    const fetchData = async (filterID: any, value: any, pageNumber: number, startDate: any, endDate: any) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("client_id", contextClientID);
            formData.append("customer_id", contextCustomerID);
            if (filterID == 1) formData.append("active_status", filters.active_status.length > 0 && filters.active_status == value ? filters.active_status : value);
            if (filterID == 2) formData.append("priority_level", filters.priority_level.length > 0 && filters.priority_level == value ? filters.priority_level : value);
            if (startDate || filters.start_date) formData.append("start_date", formatDateYYYYMMDD(startDate || filters.start_date));
            if (endDate || filters.end_date) formData.append("end_date", formatDateYYYYMMDD(endDate || filters.end_date));
            if (filterID == 1 || filters.active_status.length > 0) formData.append("active_status", filters.active_status);
            if (filterID == 2 || filters.priority_level.length > 0) formData.append("priority_level", filters.priority_level);

            const res = await fetch(`/api/users/support/supportList?page=${pageNumber}&limit=${10}`, {
                method: "POST",
                body: formData,
            });
            const response = await res.json();
            const supportData = response.data;

            if (response.status == 1 && supportData.length > 0) {
                setLoading(false);
                setSupport(supportData);
                if (supportData.length < 10) {
                    setHasMoreData(false);
                } else {
                    setHasMoreData(true);
                }
            } else if (response.status == 1 && supportData.length == 0) {
                setLoading(false);
                setSupport([]);
                setHasMoreData(false);
            } else if (response.status == 0) {
                setLoading(false);
                setSelectedPage(response.page);
                setHasMoreData(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("Failed to load next page data");
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
    function filter_whitebox() {
        const x = document.getElementById("filter_whitebox");
        if (x!.className === "filter_whitebox") {
            x!.className += " filter_whitebox_open";
        } else {
            x!.className = "filter_whitebox";
        }
    }
    const resetFilter = async () => {
        window.location.reload();
        setFilters({
            active_status: "", start_date: '', end_date: '', priority_level: ""
        });
        fetchData("", "", selectedPage, "", "");
    };
    function changePage(page: any) {
        if (hasMoreData) {
            setSelectedPage(selectedPage + page);
            fetchData(3, "", selectedPage + page, '', '');
        }
        else if (!hasMoreData && selectedPage > 1) {
            setSelectedPage(selectedPage + page);
            fetchData(3, "", selectedPage + page, '', '');
        }
    }
    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        console.log("this is the name ", name);
        console.log("this is the value", value);

        if (name == "active_status") {
            setFilters((prev) => ({ ...prev, ['active_status']: value }));
            fetchData(1, value, selectedPage, '', '');
        }
        if (name == "priority_level") {
            setFilters((prev) => ({ ...prev, ['priority_level']: value }));
            fetchData(2, value, selectedPage, '', '');
        }
    };
    const [showCalendar, setShowCalendar] = useState(false);
    const ref = useRef(null);
    const [state, setState] = useState<Range[]>([
        {
            startDate: new Date() || null,
            endDate: new Date() || null,
            key: 'selection'
        }
    ]);
    const handleChange = (ranges: RangeKeyDict) => {
        setState([ranges.selection]);
        setShowCalendar(false)
        if (ranges.selection.startDate == ranges.selection.endDate) {
            setFilters((prev) => ({ ...prev, ['start_date']: ranges.selection.startDate }));
        } else {
            setFilters((prev) => ({ ...prev, ['start_date']: ranges.selection.startDate }));
            setFilters((prev) => ({ ...prev, ['end_date']: ranges.selection.endDate }));

        }
        fetchData('', '', selectedPage, ranges.selection.startDate, ranges.selection.endDate);
    };
    const formattedRange = state[0].startDate! == state[0].endDate! ? format(state[0].startDate!, 'yyyy-MM-dd') : `${format(state[0].startDate!, 'yyyy-MM-dd')} to ${format(state[0].endDate!, 'yyyy-MM-dd')}`;
    const formatDateYYYYMMDD = (date: any, isTime = false) => {
        if (!date) return '';
        const parsedDate = moment(date);

        if (isTime) return parsedDate.format('HH:mm A');

        return parsedDate.format('YYYY-MM-DD');
    };
    return (
        <div className='mainbox'>
            <header>
                <LeapHeader title="Welcome!" />
            </header>
            <LeftPannel menuIndex={27} subMenuIndex={0} showLeftPanel={true} rightBoxUI={
                //  supportArray! && supportArray.length > 0  ?              
                <div>
                    <LoadingDialog isLoading={isLoading} />

                    {/* ---------------------------------------- */}
                    <div className='container'>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="nw_user_inner_mainbox">
                                    <div className="nw_user_inner_heading_tabbox">
                                        <div className="heading25">
                                            <span>Help</span>
                                        </div>
                                        <div className="nw_user_inner_tabs nw_user_inner_right_tabs">
                                            <ul>
                                                <li>
                                                    <a href={pageURL_userSupportForm}>
                                                        <div className="nw_user_tab_icon">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
                                                                <path className='red_to_white' fill="#ed2024" d="M12 .12A11.88 11.88 0 1 0 23.88 12 11.894 11.894 0 0 0 12 .12zm5.4 12.96h-4.32v4.32a1.08 1.08 0 0 1-2.16 0v-4.32H6.6a1.08 1.08 0 0 1 0-2.16h4.32V6.6a1.08 1.08 0 0 1 2.16 0v4.32h4.32a1.08 1.08 0 0 1 0 2.16z" data-name="Layer 2" data-original="#000000" />
                                                            </svg>
                                                        </div>
                                                        <div className="nw_user_tab_name">
                                                            Add
                                                        </div>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="nw_user_inner_content_box">
                                        {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                                            setShowAlert(false)
                                        }} onCloseClicked={function (): void {
                                            setShowAlert(false)
                                        }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                                        <div className={`${loadingCursor ? "cursorLoading" : ""}`}>
                                            <div>
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <div className="nw_user_filter_mainbox">
                                                            <div className="filter_whitebox" id="filter_whitebox">
                                                                <div className="nw_filter_form_group_mainbox">
                                                                    <div className="nw_filter_form_group">
                                                                        <select id="active_status" name="active_status" onChange={handleFilterChange}>
                                                                            <option value="">Status:</option>
                                                                            {statusArray.map((dep, index) => (
                                                                                <option value={dep.id} key={dep.id}>{dep.status}</option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                    <div className="nw_filter_form_group">
                                                                        <select id="priority_level" name="priority_level" onChange={handleFilterChange}>
                                                                            <option value="">Priority Level:</option>
                                                                            {priorityArray.map((dep, index) => (
                                                                                <option value={dep.id} key={dep.id}>{dep.priority_name}</option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                    <div className="nw_filter_form_group">
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            value={formattedRange}
                                                                            readOnly
                                                                            onClick={() => setShowCalendar(!showCalendar)}
                                                                        />
                                                                        {showCalendar && (
                                                                            <div style={{ position: 'absolute', zIndex: 1000 }}>
                                                                                <DateRange
                                                                                    editableDateInputs={true}
                                                                                    onChange={handleChange}
                                                                                    moveRangeOnFirstSelection={false}
                                                                                    ranges={state}
                                                                                />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="nw_filter_form_group">
                                                                        <div className="nw_filter_submit_btn">
                                                                            <a onClick={() => resetFilter()}>
                                                                                <img src="/images/user/undo.svg" alt="Filter icon" className="img-fluid" />
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="nw_filter_icon" onClick={filter_whitebox}>
                                                                <img src="/images/user/filter-icon.svg" alt="Filter icon" className="img-fluid" />
                                                            </div>
                                                        </div>
                                                        {/* <div className="filtermenu red_button" onClick={filter_whitebox}>Filter</div> */}
                                                    </div>
                                                    {/* <div className="row">
                                                            <div className="col-lg-12">
                                                                <div className="filter_whitebox" id="filter_whitebox">
                                                                    <div className="row">
                                                                        <div className="col-lg-2">
                                                                            <div className="form_box mb-3">
                                                                                <select id="active_status" name="active_status" onChange={handleFilterChange}>
                                                                                    <option value="">Status:</option>
                                                                                    {statusArray.map((dep, index) => (
                                                                                        <option value={dep.id} key={dep.id}>{dep.status}</option>
                                                                                    ))}
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-lg-2">
                                                                            <div className="form_box mb-3">
                                                                                <select id="priority_level" name="priority_level" onChange={handleFilterChange}>
                                                                                    <option value="">Priority Level:</option>
                                                                                    {priorityArray.map((dep, index) => (
                                                                                        <option value={dep.id} key={dep.id}>{dep.priority_name}</option>
                                                                                    ))}
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-lg-3">
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                value={formattedRange}
                                                                                readOnly
                                                                                onClick={() => setShowCalendar(!showCalendar)}
                                                                            />
                                                                            {showCalendar && (
                                                                                <div style={{ position: 'absolute', zIndex: 1000 }}>
                                                                                    <DateRange
                                                                                        editableDateInputs={true}
                                                                                        onChange={handleChange}
                                                                                        moveRangeOnFirstSelection={false}
                                                                                        ranges={state}
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="col-lg-2">
                                                                            <div className="form_box mb-3">
                                                                                <a className="red_button" onClick={() => resetFilter()}>Reset</a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div> */}
                                                </div>
                                            </div>
                                            {supportArray! && supportArray.length > 0 ?
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <div className="row mb-5">
                                                            <div className="col-lg-12">
                                                                <div className="row list_label mb-4">
                                                                    <div className="col-lg-2 text-center"><div className="label">Category</div></div>
                                                                    <div className="col-lg-2 text-center"><div className="label">Request Type</div></div>
                                                                    <div className="col-lg-1 text-center"><div className="label">Raised on</div></div>
                                                                    <div className="col-lg-2 text-center"><div className="label">Priority level</div></div>
                                                                    <div className="col-lg-2 text-center"><div className="label">Description</div></div>
                                                                    <div className="col-lg-2 text-center"><div className="label">Status</div></div>
                                                                </div>
                                                                {supportArray.map((id) => (
                                                                    <div className="row list_listbox" key={id.id}>
                                                                        <div className="col-lg-2 text-center">{id.leap_request_master.category}</div>
                                                                        <div className="col-lg-2 text-center">{id.leap_request_master.type_name}</div>
                                                                        <div className="col-lg-1 text-center">{id.raised_on}</div>
                                                                        {id.priority_level === 1 ? (
                                                                            <><div className="col-lg-2 text-center" ><div className="user_red_chip">{id.leap_request_priority.priority_name}</div></div></>
                                                                        ) : id.priority_level === 2 ? (
                                                                            <><div className="col-lg-2 text-center" ><div className="user_orange_chip">{id.leap_request_priority.priority_name}</div></div></>
                                                                        ) : id.priority_level === 3 ? (
                                                                            <><div className="col-lg-2 text-center" ><div className="user_green_chip">{id.leap_request_priority.priority_name}</div></div></>
                                                                        ) : < div />
                                                                        }
                                                                        <div className="col-lg-2 text-center">
                                                                            <div className="restrict_two_lines">
                                                                                {id.description}
                                                                            </div>
                                                                        </div>
                                                                        {id.active_status === 1 ? (
                                                                            <><div className="col-lg-2 text-center "><div className="user_orange_chip">{id.leap_request_status.status}</div></div></>
                                                                        ) : id.active_status === 2 ? (
                                                                            <><div className="col-lg-2 text-center " ><div className="user_green_chip">{id.leap_request_status.status}</div></div></>
                                                                        ) : id.active_status === 3 ? (
                                                                            <><div className="col-lg-2 text-center "><div className="user_red_chip">
                                                                                <div className="row"><div className="col-lg-4">
                                                                                    <div className="col-lg-1 text-center"><img src={"/images/user/cancel.png"} className="img-fluid" style={{ maxHeight: "25px", borderRadius: "40px" }} /></div>
                                                                                </div>
                                                                                    <div className="col-lg-8">{id.leap_request_status.status}</div></div>
                                                                            </div></div></>
                                                                        ) : id.active_status === 4 ? (
                                                                            <><div className="col-lg-2 text-center "><div className="user_blue_chip">{id.leap_request_status.status}</div></div></>
                                                                        ) : < div />}

                                                                        <div className="col-lg-1 text-center">
                                                                            <img src="/images/menu.png" className="img-fluid edit-icon" alt="Search Icon" style={{ width: "20px", paddingBottom: "5px", alignItems: "center" }}
                                                                                onClick={() => {
                                                                                    setEditSupportId(id.id);
                                                                                    setShowDialog(true)
                                                                                }} />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* here are the page number crowsels */}
                                                        <div className="row">
                                                            <div className="col-lg-6 mb-1" style={{ textAlign: "left" }}>
                                                                <BackButton isCancelText={false} />
                                                            </div>
                                                            <div className="col-lg-6" style={{ textAlign: "right" }}>
                                                                <div className="page_changer">
                                                                    {selectedPage > 1 ? <div className="white_button_border_red" onClick={() => { changePage(-1) }}>Prev</div> : <></>}
                                                                    <div className="font15Medium">{selectedPage}</div>
                                                                    <div className="red_button" onClick={() => { changePage(1) }}>Next</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                : <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
                                                    <PageErrorCenterContent content={"No support list"} />
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="nw_user_offcanvas">
                        <div className={showDialog ? "rightpoup rightpoupopen" : "rightpoup"}>
                            {showDialog && <UserSupport id={editSupportId} selectedShortCutID={false} onClose={(updateData) => { setShowDialog(false), updateData && fetchData(3, "", selectedPage, '', '') }} />}
                        </div>
                    </div>
                    {/* ---------------------------------------- */}
                </div>
            } />
            {/* </div> */}
            <div>
                <Footer />
            </div>
        </div>
    )
}

export default Support;

async function getStatus() {

    let query = supabase
        .from('leap_request_status')
        .select()
        ;
    const { data, error } = await query;
    if (error) {
        console.log(error);
        return [];
    } else {
        return data;
    }
}

async function getPriority() {

    let query = supabase
        .from('leap_request_priority')
        .select()
        ;
    const { data, error } = await query;
    if (error) {
        console.log(error);
        return [];
    } else {
        return data;
    }
}