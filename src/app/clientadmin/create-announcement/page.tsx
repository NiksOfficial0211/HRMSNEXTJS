// 'use client'
// import supabase from '@/app/api/supabaseConfig/supabase';
// import Footer from '@/app/components/footer';
// import LeapHeader from '@/app/components/header';
// import LeftPannel from '@/app/components/leftPannel';
// import { announcementListingPage } from '@/app/pro_utils/stringConstants';
// import React, { useEffect, useState } from 'react'
// import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext';
// import BackButton from '@/app/components/BackButton';
// import { leftMenuAnnouncementPageNumbers, pageURL_announcementListingPage, pageURL_defaultLogin, pageURL_userList } from '@/app/pro_utils/stringRoutes';
// import moment from 'moment';
// import { DateRange, RangeKeyDict } from 'react-date-range';
// import { Range } from 'react-date-range';
// import { format } from 'date-fns';
// import { useRouter } from 'next/navigation';
// import LoadingDialog from '@/app/components/PageLoader';


// const AnnouncementListing = () => {
//     const [scrollPosition, setScrollPosition] = useState(0);
//     const [announcementList, setAnnouncementList] = useState<AnnouncementList[]>([]);
//     const { contextClientID, contextCustomerID, contaxtBranchID, contextRoleID } = useGlobalContext();
//     const [branchArray, setBranchArray] = useState<ClientBranchTableModel[]>([]);
//     const [announcementTypeArray, setAnnouncementTypeArray] = useState<AnnouncementType[]>([]);
//     const [roleTypeArray, setRoleTypes] = useState<Roles[]>([]);
//     const [allRoleSelected, setAllRoleSelected] = useState(false);
//     const [isLoading, setLoading] = useState(false);
//     const [allBranchSelected, setAllBranchSelected] = useState(false);
//     const [showCalendar, setShowCalendar] = useState(false);
//     const router = useRouter()

//     const [announcementFormValues, setFormValues] = useState<AnnouncementFormValues>({
//         branchID: [{
//             id: 0,
//             branch_name: '',
//             isSelected: false
//         }],
//         announceTypeID: '',
//         roleTypes: [{
//             id: 0,
//             role_types: '',
//             isSelected: false
//         }],
//         title: '',
//         image: null,
//         description: '',
//         announcementDate: '',
//         startDate: '',
//         endDate: '',
//         enabled: false,
//         hasValidity: false,
//     })


//     useEffect(() => {
//  if(contextClientID.length==0 || contaxtBranchID.length==0 ){
//                 router.push(pageURL_defaultLogin);
//             }
//         fetchData();

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
//     }, [])
//     const fetchData = async () => {
//         setLoading(true);
//         setAllBranchSelected(false);
//         setAllRoleSelected(false);
//         const branch = await getBranches(contextClientID);
//         setBranchArray(branch);
//         const getBranche: AnnouncementBranchID[] = []
//         // getBranche.push({
//         //     id: 0,
//         //     branch_name: "All",
//         //     isSelected: false
//         // })
//         for (let i = 0; i < branch.length; i++) {
//             getBranche.push({
//                 id: branch[i].id,
//                 branch_name: branch[i].branch_number,
//                 isSelected: false
//             })
//         }
//         setFormValues((prev) => ({ ...prev, ["branchID"]: getBranche }));
//         const announcementTYpe = await getAnnouncementType();
//         setAnnouncementTypeArray(announcementTYpe);
//         const roles = await getRoleType(contextClientID);
//         const getRoles: AnnouncementRoleTypesID[] = []
//         // getRoles.push({
//         //     id: 0,
//         //     role_types: "All",
//         //     isSelected: false
//         // })
//         for (let i = 0; i < roles.length; i++) {
//             getRoles.push({
//                 id: roles[i].id,
//                 role_types: roles[i].user_role,
//                 isSelected: false
//             })
//         }
//         setFormValues((prev) => ({ ...prev, ["roleTypes"]: getRoles }));

//         setRoleTypes(roles);
//         setLoading(false);
//     }

//     const setImage = (e: any) => {
//         const { name, value, type, files } = e.target;

//         setFormValues((prev) => ({ ...prev, ['image']: files[0] }));

//         // console.log("Form values updated:", formValues);s

//     };
//     const handleInputChange = (e: any) => {
//         const { name, value, checked, type, files } = e.target;
//         console.log("name from selected options", name);
//         console.log("value from selected options", value);

//         let selectedOptions: any = [];

//         if (name === "hasValidity" || name === "enabled") {
//             setFormValues((prev) => ({ ...prev, [name]: checked }));
//         } else {
//             setFormValues((prev) => ({ ...prev, [name]: value }));
//         }
//         console.log("Selected Form Values", announcementFormValues);


//     };
//     const [errors, setErrors] = useState<Partial<AnnouncementValues>>({});

//     const validate = () => {
//         const newErrors: Partial<AnnouncementValues> = {};
//         if (!announcementFormValues.announceTypeID) newErrors.announceTypeID = "required";
//         if (!announcementFormValues.title) newErrors.title = "required";
//         if (!announcementFormValues.description) newErrors.description = "required";
//         if (!announcementFormValues.image) newErrors.image = "required";
        
//             if (!announcementFormValues.startDate) newErrors.startDate = "required";
//             if (!announcementFormValues.endDate) newErrors.endDate = "required";
       

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleAllSelected = (isBranch: boolean, isSelected: boolean) => {

//         if (isBranch) {
//             setAllBranchSelected(!isSelected)
//             if (isSelected) {
//                 setFormValues((prev) => {
//                     const updatedBranches = prev.branchID.map((branch) => ({
//                         ...branch,
//                         isSelected: false
//                     }));

//                     console.log(updatedBranches);

//                     return { ...prev, branchID: updatedBranches };
//                 });
//             } else {
//                 setFormValues((prev) => {
//                     const updatedBranches = prev.branchID.map((branch) => ({
//                         ...branch,
//                         isSelected: true
//                     }));



//                     return { ...prev, branchID: updatedBranches };
//                 });
//             }
//         } else {
//             setAllRoleSelected(!isSelected)
//             if (isSelected) {
//                 setFormValues((prev) => {
//                     const updatedBranches = prev.roleTypes.map((role) => ({
//                         ...role,
//                         isSelected: false
//                     }));

//                     console.log(updatedBranches);

//                     return { ...prev, roleTypes: updatedBranches };
//                 });
//             } else {
//                 setFormValues((prev) => {
//                     const updatedBranches = prev.roleTypes.map((role) => ({
//                         ...role,
//                         isSelected: true
//                     }));
//                     return { ...prev, roleTypes: updatedBranches };
//                 });
//             }
//         }
//     }

//     const handleBranchToggle = (branchId: any, isSelected: boolean) => {


//         setFormValues((prev) => {
//             const updatedBranches = prev.branchID.map((branch) =>
//                 branch.id === branchId
//                     ? { ...branch, isSelected: !branch.isSelected }
//                     : branch
//             );
//             const notAllSelected = updatedBranches.filter(b => b.isSelected).length;

//             // Update parent state based on selection count
//             setAllBranchSelected(notAllSelected === updatedBranches.length);
//             return { ...prev, branchID: updatedBranches };

//         });




//     };

//     const handleRoleToggle = (role_id: any, isSelected: boolean) => {

//         setFormValues((prev) => {
//             const updatedBranches = prev.roleTypes.map((role) =>
//                 role.id === role_id
//                     ? { ...role, isSelected: !role.isSelected }
//                     : role
//             );
//             const notAllSelected = updatedBranches.filter(b => b.isSelected).length;

//             // Update parent state based on selection count
//             setAllRoleSelected(notAllSelected === updatedBranches.length);
//             return { ...prev, roleTypes: updatedBranches };
//         });

//     };

//     const formatDateYYYYMMDD = (date: any, isTime = false) => {
//         if (!date) return '';
//         const parsedDate = moment(date);

//         if (isTime) return parsedDate.format('HH:mm A');

//         return parsedDate.format('YYYY-MM-DD');
//     };
//     const [state, setState] = useState<Range[]>([
//         {
//             startDate: new Date() || null,
//             endDate: new Date() || null,
//             key: 'selection'
//         }
//     ]);
//     // const formattedRange = state[0].startDate! == state[0].endDate! ? format(state[0].startDate!, 'yyyy-MM-dd') : `${format(state[0].startDate!, 'yyyy-MM-dd')} to ${format(state[0].endDate!, 'yyyy-MM-dd')}`;


//     const handleChange = (ranges: RangeKeyDict) => {
//         setState([ranges.selection]);
//         setShowCalendar(false)

//         setFormValues((prev) => ({ ...prev, ['startDate']: formatDateYYYYMMDD(ranges.selection.startDate) }));
//         setFormValues((prev) => ({ ...prev, ['endDate']: formatDateYYYYMMDD(ranges.selection.endDate) }));



//     };
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         if (!validate()) return;
//         setLoading(true);
//         if (!announcementFormValues.branchID) {
//             handleAllSelected(true, true)
//         }
//         if (!announcementFormValues.roleTypes) {
//             handleAllSelected(true, true)
//         }
//         if(contextClientID.length==0 || contaxtBranchID.length==0 ){
//             alert("Session Expired");
//             router.push(pageURL_defaultLogin);
//         }
//         const formData = new FormData();
//         formData.append("client_id", contextClientID);
//         formData.append("branch_id", contaxtBranchID);

//         formData.append("selectedBranches", JSON.stringify(announcementFormValues.branchID));
//         formData.append("role_ids", JSON.stringify(announcementFormValues.roleTypes));
//         formData.append("announcement_type_id", announcementFormValues.announceTypeID);
//         formData.append("announcement_title", announcementFormValues.title);
//         formData.append("announcement_details", announcementFormValues.description);

//         formData.append("file", announcementFormValues.image!);
//         formData.append("announcement_date", announcementFormValues.announcementDate);
//         formData.append("startDate", formatDateYYYYMMDD(announcementFormValues.startDate) || formatDateYYYYMMDD(new Date()));
//         formData.append("endDate", announcementFormValues.endDate);
//         formData.append("is_enabled", "true");

//         try {
//             const apiCall = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/clientAdmin/create_announcement", {
//                 method: "POST",
//                 body: formData,

//             });
//             console.log(apiCall);

//             const response = await apiCall.json();
//             console.log(response);

//             if (apiCall.ok) {
//                 setLoading(false);
//                 alert(response.message)
//                 router.push(pageURL_announcementListingPage)

//             } else {
//                 setLoading(false);
//                 alert("Failed to submit form.");
//             }
//         } catch (error) {
//             setLoading(false);
//             console.error("Error submitting form:", error);
//             alert("An error occurred while submitting the form." + error);
//         }

//     }

//     return (

//         <div className='mainbox'>
//             <header>
//                 <LeapHeader title={announcementListingPage} />
//             </header>
//             <LeftPannel menuIndex={leftMenuAnnouncementPageNumbers} subMenuIndex={0} showLeftPanel={true} rightBoxUI={
//                 <form onSubmit={handleSubmit}>
//                     <div className='container'>
//                         <LoadingDialog isLoading={isLoading}/>
//                         <div className="row heading25 mb-3">
//                             <div className="col-lg-8">
//                                 Create <span>Announcement/ News</span>
//                             </div>

//                         </div>&nbsp;

//                         <div className="grey_box">
//                             <div className="row">
//                                 <div className="col-md-12">
//                                     <div className="form_box mb-3">
//                                         <label htmlFor="formFile" className="form-label">Branch<span className='req_text'>*</span>:</label>
//                                         {/* <select id="branchID" name="branchID" multiple onChange={handleInputChange}>
//                                             <option value="">Select</option>
//                                             <option value="-1" >All</option>
//                                             {branchArray.map((branch, index) => (
//                                                 <option value={branch.id} key={branch.id}>{branch.branch_number}</option>
//                                             ))}
//                                         </select> */}
//                                         <div className="horizontal_scrolling pb-2" >
//                                             <div className={allBranchSelected ? "announcement_branch_box_selected" : "announcement_branch_box"} style={{ width: "auto" }}>
//                                                 <a onClick={() => handleAllSelected(true, allBranchSelected)} style={{ cursor: "pointer" }}>
//                                                     <div className="list_view_heading text-center">All</div>
//                                                 </a>

//                                             </div>
//                                             {announcementFormValues.branchID.map((branch) => (
//                                                 <div className={branch.isSelected ? "announcement_branch_box_selected" : "announcement_branch_box"} key={branch.id} style={{ width: "auto" }}>

//                                                     <a onClick={() => handleBranchToggle(branch.id, branch.isSelected)} style={{ cursor: "pointer" }}>
//                                                         <div className="list_view_heading text-center"> {branch.branch_name}</div>
//                                                     </a>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                         {errors.branchID! && <span className='error' style={{ color: "red" }}>{errors.branchID}</span>}
//                                     </div>
//                                 </div>

//                                 <div className="col-md-12">
//                                     <div className="form_box mb-3">
//                                         <label htmlFor="formFile" className="form-label">Role Type<span className='req_text'>*</span>:</label>
//                                         <div className={allRoleSelected ? "announcement_branch_box_selected" : "announcement_branch_box"} style={{ width: "auto" }}>
//                                             <a onClick={() => handleAllSelected(false, allRoleSelected)} style={{ cursor: "pointer" }}>
//                                                 <div className="list_view_heading text-center">All</div>
//                                             </a>

//                                         </div>
//                                         {announcementFormValues.roleTypes.map((roles) => (
//                                             <div className={roles.isSelected ? "announcement_role_box_selected" : "announcement_role_box"} key={roles.id} >

//                                                 <a onClick={() => handleRoleToggle(roles.id, roles.isSelected)} style={{ cursor: "pointer" }}>
//                                                     <div className={roles.isSelected ? "selected text-center" : "list_view_heading text-center"}> {roles.role_types} </div>
//                                                 </a>
//                                             </div>
//                                         ))}
//                                         {errors.roleTypes && <span className='error' style={{ color: "red" }}>{errors.roleTypes}</span>}
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="row">
//                                 <div className="col-md-4">
//                                     <div className="form_box mb-3">
//                                         <label htmlFor="formFile" className="form-label">Announcement Type<span className='req_text'>*</span>:</label>
//                                         <select id="announceTypeID" name="announceTypeID" onChange={handleInputChange}>
//                                             <option value="">Select</option>
//                                             {announcementTypeArray.map((types, index) => (
//                                                 <option value={types.announcement_type_id} key={types.announcement_type_id}>{types.announcement_type}</option>
//                                             ))}
//                                         </select>
//                                         {errors.announceTypeID && <span className='error' style={{ color: "red" }}>{errors.announceTypeID}</span>}
//                                     </div>
//                                 </div>
//                                 <div className="col-md-4">
//                                     <div className="form_box mb-3">
//                                         <label htmlFor="formFile" className="form-label">Title<span className='req_text'>*</span>:</label>
//                                         <input type="text" className="form-control" id="title" name="title" value={announcementFormValues.title} onChange={handleInputChange} placeholder="Enter title" />

//                                         {errors.title && <span className='error' style={{ color: "red" }}>{errors.title}</span>}
//                                     </div>
//                                 </div>
//                                 <div className="col-md-4">
//                                     <div className="form_box mb-3">
//                                         <label htmlFor="formFile" className="form-label">Description<span className='req_text'>*</span>:</label>
//                                         <input type="text" className="form-control" id="title" name="description" value={announcementFormValues.description} onChange={handleInputChange} placeholder="Enter details" />

//                                         {errors.description && <span className='error' style={{ color: "red" }}>{errors.description}</span>}
//                                     </div>
//                                 </div>

//                             </div>

//                             <div className="row mb-2">
//                                 <div className="col-md-4">
//                                     <div className="form_box mb-3">
//                                         <label htmlFor="formFile" className="form-label">Image<span className='req_text'>*</span>:</label>
//                                         <div className="col-lg-12 mb-2">
//                                             <input type="file" className="upload_document" accept="image/*" name="image" id="formFileSm" onChange={setImage} />
//                                         </div>
//                                         {errors.image && <span className='error' style={{ color: "red" }}>{errors.image}</span>}
//                                     </div>
//                                 </div>
//                                 {/* <div className="col-lg-4 announcement_switch_row">
//                                     <label htmlFor="formFile" className="form-label ">Show for specific Time Period:</label>
//                                     <label className="switch">
//                                         <input type="checkbox" name="hasValidity" onChange={handleInputChange} />
//                                         <span className="slider round"></span>
//                                     </label>
//                                 </div>
//                                 <div className="col-lg-4 announcement_switch_row">
//                                     <label htmlFor="formFile" className="form-label">Enabled:</label>
//                                     <label className="switch">
//                                         <input type="checkbox" name="enabled" onChange={handleInputChange} />
//                                         <span className="slider round"></span>
//                                     </label>
//                                 </div> */}

//                             <div className="col-lg-4">
//                             <label htmlFor="formFile" className="form-label">Date<span className='req_text'>*</span>: </label>
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     value={announcementFormValues.startDate+ " - " +announcementFormValues.endDate }
//                                     readOnly
//                                     onClick={() => setShowCalendar(!showCalendar)}
//                                 />
//                                 {showCalendar && (
//                                     <div style={{ position: 'absolute', zIndex: 1000 }}>
//                                         <DateRange
//                                             editableDateInputs={true}
//                                             onChange={handleChange}
//                                             moveRangeOnFirstSelection={false}
//                                             ranges={state}
//                                             minDate={new Date()}
//                                         />
//                                     </div>
//                                 )}
//                                 {errors.startDate && <span className='error' style={{ color: "red" }}>{errors.startDate}</span>}

//                             </div>
//                             </div>
                            
//                             {/* {announcementFormValues.hasValidity && <div className="row mt-3">
//                                 <div className="col-md-4">
//                                     <div className="form_box mb-3">
//                                         <label htmlFor="formFile" className="form-label">Start Date: </label>
//                                         <input type="date" id="startDate" name="startDate"
//                                             min={new Date().toISOString().split("T")[0]}
//                                             value={announcementFormValues.startDate} onChange={handleInputChange} />
//                                         {errors.startDate && <span className='error' style={{ color: "red" }}>{errors.startDate}</span>}

//                                     </div>
//                                 </div>
//                                 <div className="col-md-4">
//                                     <div className="form_box mb-3">
//                                         <label htmlFor="formFile" className="form-label">End Date: </label>
//                                         <input type="date" id="endDate" name="endDate"
//                                             min={new Date().toISOString().split("T")[0]}

//                                             value={announcementFormValues.endDate} onChange={handleInputChange} />
//                                         {errors.endDate && <span className='error' style={{ color: "red" }}>{errors.endDate}</span>}

//                                     </div>
//                                 </div>

//                             </div>} */}
//                             <div className="row">
//                                 <div className="col-lg-12" style={{ textAlign: "right" }}>
//                                     <BackButton isCancelText={true} />
//                                     <input type="submit" value="Submit" className="red_button" />
//                                 </div>
//                             </div>
//                         </div>

//                     </div>
//                 </form>
//             }
//             />
//             <Footer />
//         </div>
//     );
// }

// export default AnnouncementListing


// async function getBranches(contextClientID: any) {

//     let query = supabase
//         .from('leap_client_branch_details')
//         .select()
//         .eq("client_id", contextClientID || "3");

//     const { data, error } = await query;
//     if (error) {
//         console.log(error);

//         return [];
//     } else {
//         return data;
//     }

// }
// async function getAnnouncementType() {

//     let query = supabase
//         .from('leap_announcement_types')
//         .select();


//     const { data, error } = await query;
//     if (error) {
//         console.log(error);

//         return [];
//     } else {

//         return data;
//     }

// }

// async function getRoleType(contextClientID: any) {
//     const { data: client, error: clientError } = await supabase
//         .from('leap_client')
//         .select().eq('parent_id', contextClientID || "3");

//     if (clientError) {
//         return [];
//     }
//     let query = null
//     if (client && client.length > 0) {
//         query = supabase
//             .from('leap_user_role')
//             .select().gte('id', '3');
//     } else {
//         query = supabase
//             .from('leap_user_role')
//             .select().gte('id', '4');
//     }



//     const { data, error } = await query;
//     if (error) {
//         console.log(error);

//         return [];
//     } else {

//         return data;
//     }

// }

//Swapnil design changes on 12th may 2025



'use client'
import supabase from '@/app/api/supabaseConfig/supabase';
import Footer from '@/app/components/footer';
import LeapHeader from '@/app/components/header';
import LeftPannel from '@/app/components/leftPannel';
import { announcementListingPage } from '@/app/pro_utils/stringConstants';
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext';
import BackButton from '@/app/components/BackButton';
import { addAssetTitle, staticIconsBaseURL } from '@/app/pro_utils/stringConstants'
import { leftMenuAnnouncementPageNumbers, pageURL_announcementListingPage, pageURL_defaultLogin, pageURL_userList } from '@/app/pro_utils/stringRoutes';
import moment from 'moment';
import { DateRange, RangeKeyDict } from 'react-date-range';
import { Range } from 'react-date-range';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import LoadingDialog from '@/app/components/PageLoader';


const AnnouncementListing = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [announcementList, setAnnouncementList] = useState<AnnouncementList[]>([]);
    const { contextClientID, contextCustomerID, contaxtBranchID, contextRoleID } = useGlobalContext();
    const [branchArray, setBranchArray] = useState<ClientBranchTableModel[]>([]);
    const [announcementTypeArray, setAnnouncementTypeArray] = useState<AnnouncementType[]>([]);
    const [roleTypeArray, setRoleTypes] = useState<Roles[]>([]);
    const [allRoleSelected, setAllRoleSelected] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [allBranchSelected, setAllBranchSelected] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const router = useRouter()

    const [announcementFormValues, setFormValues] = useState<AnnouncementFormValues>({
        branchID: [{
            id: 0,
            branch_name: '',
            isSelected: false
        }],
        announceTypeID: '',
        roleTypes: [{
            id: 0,
            role_types: '',
            isSelected: false
        }],
        title: '',
        image: null,
        description: '',
        announcementDate: '',
        startDate: '',
        endDate: '',
        enabled: false,
        hasValidity: false,
    })


    useEffect(() => {
 if(contextClientID.length==0 || contaxtBranchID.length==0 ){
                router.push(pageURL_defaultLogin);
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
    }, [])
    const fetchData = async () => {
        setLoading(true);
        setAllBranchSelected(false);
        setAllRoleSelected(false);
        const branch = await getBranches(contextClientID);
        setBranchArray(branch);
        const getBranche: AnnouncementBranchID[] = []
        // getBranche.push({
        //     id: 0,
        //     branch_name: "All",
        //     isSelected: false
        // })
        for (let i = 0; i < branch.length; i++) {
            getBranche.push({
                id: branch[i].id,
                branch_name: branch[i].branch_number,
                isSelected: false
            })
        }
        setFormValues((prev) => ({ ...prev, ["branchID"]: getBranche }));
        const announcementTYpe = await getAnnouncementType();
        setAnnouncementTypeArray(announcementTYpe);
        const roles = await getRoleType(contextClientID);
        const getRoles: AnnouncementRoleTypesID[] = []
        // getRoles.push({
        //     id: 0,
        //     role_types: "All",
        //     isSelected: false
        // })
        for (let i = 0; i < roles.length; i++) {
            getRoles.push({
                id: roles[i].id,
                role_types: roles[i].user_role,
                isSelected: false
            })
        }
        setFormValues((prev) => ({ ...prev, ["roleTypes"]: getRoles }));

        setRoleTypes(roles);
        setLoading(false);
    }

    const setImage = (e: any) => {
        const { name, value, type, files } = e.target;

        setFormValues((prev) => ({ ...prev, ['image']: files[0] }));

        // console.log("Form values updated:", formValues);s

    };
    const handleInputChange = (e: any) => {
        const { name, value, checked, type, files } = e.target;
        console.log("name from selected options", name);
        console.log("value from selected options", value);

        let selectedOptions: any = [];

        if (name === "hasValidity" || name === "enabled") {
            setFormValues((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormValues((prev) => ({ ...prev, [name]: value }));
        }
        console.log("Selected Form Values", announcementFormValues);


    };
    const [errors, setErrors] = useState<Partial<AnnouncementValues>>({});

    const validate = () => {
        const newErrors: Partial<AnnouncementValues> = {};
        if (!announcementFormValues.announceTypeID) newErrors.announceTypeID = "required";
        if (!announcementFormValues.title) newErrors.title = "required";
        if (!announcementFormValues.description) newErrors.description = "required";
        if (!announcementFormValues.image) newErrors.image = "required";
        
            if (!announcementFormValues.startDate) newErrors.startDate = "required";
            if (!announcementFormValues.endDate) newErrors.endDate = "required";
       

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAllSelected = (isBranch: boolean, isSelected: boolean) => {

        if (isBranch) {
            setAllBranchSelected(!isSelected)
            if (isSelected) {
                setFormValues((prev) => {
                    const updatedBranches = prev.branchID.map((branch) => ({
                        ...branch,
                        isSelected: false
                    }));

                    console.log(updatedBranches);

                    return { ...prev, branchID: updatedBranches };
                });
            } else {
                setFormValues((prev) => {
                    const updatedBranches = prev.branchID.map((branch) => ({
                        ...branch,
                        isSelected: true
                    }));



                    return { ...prev, branchID: updatedBranches };
                });
            }
        } else {
            setAllRoleSelected(!isSelected)
            if (isSelected) {
                setFormValues((prev) => {
                    const updatedBranches = prev.roleTypes.map((role) => ({
                        ...role,
                        isSelected: false
                    }));

                    console.log(updatedBranches);

                    return { ...prev, roleTypes: updatedBranches };
                });
            } else {
                setFormValues((prev) => {
                    const updatedBranches = prev.roleTypes.map((role) => ({
                        ...role,
                        isSelected: true
                    }));
                    return { ...prev, roleTypes: updatedBranches };
                });
            }
        }
    }

    const handleBranchToggle = (branchId: any, isSelected: boolean) => {


        setFormValues((prev) => {
            const updatedBranches = prev.branchID.map((branch) =>
                branch.id === branchId
                    ? { ...branch, isSelected: !branch.isSelected }
                    : branch
            );
            const notAllSelected = updatedBranches.filter(b => b.isSelected).length;

            // Update parent state based on selection count
            setAllBranchSelected(notAllSelected === updatedBranches.length);
            return { ...prev, branchID: updatedBranches };

        });




    };

    const handleRoleToggle = (role_id: any, isSelected: boolean) => {

        setFormValues((prev) => {
            const updatedBranches = prev.roleTypes.map((role) =>
                role.id === role_id
                    ? { ...role, isSelected: !role.isSelected }
                    : role
            );
            const notAllSelected = updatedBranches.filter(b => b.isSelected).length;

            // Update parent state based on selection count
            setAllRoleSelected(notAllSelected === updatedBranches.length);
            return { ...prev, roleTypes: updatedBranches };
        });

    };

    const formatDateYYYYMMDD = (date: any, isTime = false) => {
        if (!date) return '';
        const parsedDate = moment(date);

        if (isTime) return parsedDate.format('HH:mm A');

        return parsedDate.format('YYYY-MM-DD');
    };
    const [state, setState] = useState<Range[]>([
        {
            startDate: new Date() || null,
            endDate: new Date() || null,
            key: 'selection'
        }
    ]);
    // const formattedRange = state[0].startDate! == state[0].endDate! ? format(state[0].startDate!, 'yyyy-MM-dd') : `${format(state[0].startDate!, 'yyyy-MM-dd')} to ${format(state[0].endDate!, 'yyyy-MM-dd')}`;


    const handleChange = (ranges: RangeKeyDict) => {
        setState([ranges.selection]);
        setShowCalendar(false)

        setFormValues((prev) => ({ ...prev, ['startDate']: formatDateYYYYMMDD(ranges.selection.startDate) }));
        setFormValues((prev) => ({ ...prev, ['endDate']: formatDateYYYYMMDD(ranges.selection.endDate) }));



    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;
        setLoading(true);
        if (!announcementFormValues.branchID) {
            handleAllSelected(true, true)
        }
        if (!announcementFormValues.roleTypes) {
            handleAllSelected(true, true)
        }
        if(contextClientID.length==0 || contaxtBranchID.length==0 ){
            alert("Session Expired");
            router.push(pageURL_defaultLogin);
        }
        const formData = new FormData();
        formData.append("client_id", contextClientID);
        formData.append("branch_id", contaxtBranchID);

        formData.append("selectedBranches", JSON.stringify(announcementFormValues.branchID));
        formData.append("role_ids", JSON.stringify(announcementFormValues.roleTypes));
        formData.append("announcement_type_id", announcementFormValues.announceTypeID);
        formData.append("announcement_title", announcementFormValues.title);
        formData.append("announcement_details", announcementFormValues.description);

        formData.append("file", announcementFormValues.image!);
        formData.append("announcement_date", announcementFormValues.announcementDate);
        formData.append("startDate", formatDateYYYYMMDD(announcementFormValues.startDate) || formatDateYYYYMMDD(new Date()));
        formData.append("endDate", announcementFormValues.endDate);
        formData.append("is_enabled", "true");

        try {
            const apiCall = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/clientAdmin/create_announcement", {
                method: "POST",
                body: formData,

            });
            console.log(apiCall);

            const response = await apiCall.json();
            console.log(response);

            if (apiCall.ok) {
                setLoading(false);
                alert(response.message)
                router.push(pageURL_announcementListingPage)

            } else {
                setLoading(false);
                alert("Failed to submit form.");
            }
        } catch (error) {
            setLoading(false);
            console.error("Error submitting form:", error);
            alert("An error occurred while submitting the form." + error);
        }

    }

    return (

        <div className='mainbox'>
            <header>
                <LeapHeader title={announcementListingPage} />
            </header>
            <LeftPannel menuIndex={leftMenuAnnouncementPageNumbers} subMenuIndex={0} showLeftPanel={true} rightBoxUI={
                <form onSubmit={handleSubmit}>
                    <div className='container'>
                        <LoadingDialog isLoading={isLoading}/>
                        <div className="row">
                            <div className="col-lg-12 heading25">
                                Create <span>Announcement/ News</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className='col-lg-8 mb-5 mt-4'>
                                <div className="grey_box">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form_box mb-3">
                                                <label htmlFor="formFile" className="form-label">Branch<span className='req_text'>*</span>:</label>                                                
                                                <div className="horizontal_scrolling pb-2" style={{maxWidth:"100%"}} >
                                                    <div onClick={() => handleAllSelected(true, allBranchSelected)} className={allBranchSelected ? "announcement_branch_box announcement_branch_box_selected" : "announcement_branch_box"}>
                                                        All
                                                    </div>
                                                    {announcementFormValues.branchID.map((branch) => (
                                                        <div onClick={() => handleBranchToggle(branch.id, branch.isSelected)} className={branch.isSelected ? "announcement_branch_box announcement_branch_box_selected" : "announcement_branch_box"} key={branch.id}>
                                                            {branch.branch_name}
                                                        </div>
                                                    ))}
                                                </div>
                                                {errors.branchID! && <span className='error' style={{ color: "red" }}>{errors.branchID}</span>}
                                            </div>
                                        </div>

                                        <div className="col-md-12">
                                            <div className="form_box mb-5">
                                                <label htmlFor="formFile" className="form-label">Role Type<span className='req_text'>*</span>:</label>
                                                <div onClick={() => handleAllSelected(false, allRoleSelected)} className={allRoleSelected ? "announcement_branch_box announcement_branch_box_selected" : "announcement_branch_box"}>
                                                        All
                                                </div>
                                                {announcementFormValues.roleTypes.map((roles) => (
                                                    <div onClick={() => handleRoleToggle(roles.id, roles.isSelected)} className={roles.isSelected ? "announcement_branch_box announcement_branch_box_selected" : "announcement_branch_box"} key={roles.id} >
                                                        {roles.role_types}
                                                    </div>
                                                ))}
                                                {errors.roleTypes && <span className='error' style={{ color: "red" }}>{errors.roleTypes}</span>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="form_box mb-3">
                                                <label htmlFor="formFile" className="form-label">Announcement Type<span className='req_text'>*</span>:</label>
                                                <select id="announceTypeID" name="announceTypeID" onChange={handleInputChange}>
                                                    <option value="">Select</option>
                                                    {announcementTypeArray.map((types, index) => (
                                                        <option value={types.announcement_type_id} key={types.announcement_type_id}>{types.announcement_type}</option>
                                                    ))}
                                                </select>
                                                {errors.announceTypeID && <span className='error' style={{ color: "red" }}>{errors.announceTypeID}</span>}
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form_box mb-3">
                                                <label htmlFor="formFile" className="form-label">Title<span className='req_text'>*</span>:</label>
                                                <input type="text" className="form-control" id="title" name="title" value={announcementFormValues.title} onChange={handleInputChange} placeholder="Enter title" />

                                                {errors.title && <span className='error' style={{ color: "red" }}>{errors.title}</span>}
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <div className="form_box mb-3">
                                                <label htmlFor="formFile" className="form-label">Date<span className='req_text'>*</span>: </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={announcementFormValues.startDate + " - " + announcementFormValues.endDate}
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
                                                            minDate={new Date()}
                                                        />
                                                    </div>
                                                )}
                                                {errors.startDate && <span className='error' style={{ color: "red" }}>{errors.startDate}</span>}
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form_box mb-3">
                                                <label htmlFor="formFile" className="form-label">Description<span className='req_text'>*</span>:</label>
                                                <textarea className="form-control" id="title" name="description" value={announcementFormValues.description} onChange={handleInputChange} placeholder="Enter details" />

                                                {errors.description && <span className='error' style={{ color: "red" }}>{errors.description}</span>}
                                            </div>
                                        </div>

                                    </div>

                                    <div className="row mb-2">
                                        <div className="col-md-8">
                                            <div className="form_box mb-3">
                                                <label htmlFor="formFile" className="form-label">Image<span className='req_text'>*</span>:</label>
                                                <div className="col-lg-12 mb-2">
                                                    <input type="file" className="upload_document" style={{width:"auto"}} accept="image/*" name="image" id="formFileSm" onChange={setImage} />
                                                </div>
                                                {errors.image && <span className='error' style={{ color: "red" }}>{errors.image}</span>}
                                            </div>
                                        </div>
                                        <div className="col-lg-4 pt-4" style={{ textAlign: "right" }}>
                                            <BackButton isCancelText={true} />
                                            <input type="submit" value="Submit" className="red_button" />
                                        </div>
                                    </div>
                                    
                                    
                                    
                                </div>
                            </div>
                            <div className='col-lg-4'><img src={staticIconsBaseURL+"/images/createannouncement_icon.png"} className="img-fluid" /></div>
                        </div>

                    </div>
                </form>
            }
            />
            <Footer />
        </div>
    );
}

export default AnnouncementListing


async function getBranches(contextClientID: any) {

    let query = supabase
        .from('leap_client_branch_details')
        .select()
        .eq("client_id", contextClientID || "3");

    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {
        return data;
    }

}
async function getAnnouncementType() {

    let query = supabase
        .from('leap_announcement_types')
        .select();


    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {

        return data;
    }

}

async function getRoleType(contextClientID: any) {
    const { data: client, error: clientError } = await supabase
        .from('leap_client')
        .select().eq('parent_id', contextClientID || "3");

    if (clientError) {
        return [];
    }
    let query = null
    if (client && client.length > 0) {
        query = supabase
            .from('leap_user_role')
            .select().gte('id', '3');
    } else {
        query = supabase
            .from('leap_user_role')
            .select().gte('id', '4');
    }



    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {

        return data;
    }

}