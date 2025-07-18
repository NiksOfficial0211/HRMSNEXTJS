// // Form where employee can fill their daily tasks

// 'use client'
// import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
// import LeapHeader from '@/app/components/header'
// import Footer from '@/app/components/footer'
// import { createLeaveTitle } from '@/app/pro_utils/stringConstants'
// import supabase from '@/app/api/supabaseConfig/supabase'
// import { useParams, useRouter } from 'next/navigation';
// import { pageURL_userTaskListingPage } from '@/app/pro_utils/stringRoutes'
// import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
// import { Project, SubProject } from '@/app/models/TaskModel'
// import LeftPannel from '@/app/components/leftPannel'
// import BackButton from '@/app/components/BackButton'
// import { ALERTMSG_addAssetTypeError, deleteDataTypeAsset, ALERTMSG_exceptionString, staticIconsBaseURL } from '@/app/pro_utils/stringConstants'
// import ShowAlertMessage from '@/app/components/alert'

// interface AddTaskForm {
//   project_id: string,
//   sub_project_id: string,
//   task_type_id: string,
//   task_details: string,
//   task_date: string,
//   task_status: string,
// }

// const AssignLeave: React.FC = () => {
//   const [scrollPosition, setScrollPosition] = useState(0);
//   const [taskArray, setTask] = useState<TaskType[]>([]);
//   const [statusArray, setStatus] = useState<TaskStatus[]>([]);
//   const { contextClientID, contaxtBranchID, contextCustomerID } = useGlobalContext();
//   const [projectarray, setProject] = useState<Project[]>([]);
//   const [subProjectarray, setSubProject] = useState<SubProject[]>([]);
//   const [selectedProject, setSelectedProject] = useState<string>("");
//   const [loadingCursor, setLoadingCursor] = useState(false);

//    const [showAlert,setShowAlert]=useState(false);
//     const [alertForSuccess,setAlertForSuccess]=useState(0);
//     const [alertTitle,setAlertTitle]=useState('');
//     const [alertStartContent,setAlertStartContent]=useState('');
//     const [alertMidContent,setAlertMidContent]=useState('');
//     const [alertEndContent,setAlertEndContent]=useState('');
//     const [alertValue1,setAlertValue1]=useState('');
//     const [alertvalue2,setAlertValue2]=useState('');

//   const handleProjectTypeChange = async (e: ChangeEvent<HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormValues((prev) => ({ ...prev, [name]: value })); 
//     setSelectedProject(value);
//     const subProj = await getSubProject(value);
//     setSubProject(subProj);
//   };
//   const router = useRouter()
//   useEffect(() => {
//     setLoadingCursor(true);
//       const fetchData = async () => {
//         const project = await getProject(contextClientID, contaxtBranchID);
//         setProject(project);
//         const task = await getTaskTypes();
//         setTask(task);
//         const taskStatus = await getStatus();
//         setStatus(taskStatus);
//         setLoadingCursor(false);
//     };
//     fetchData();
//     const handleScroll = () => {
//       setScrollPosition(window.scrollY); // Update scroll position
//       const element = document.querySelector('.mainbox');
//       if (window.pageYOffset > 0) {
//         element?.classList.add('sticky');
//       } else {
//         element?.classList.remove('sticky');
//       }
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, [])

//   const [formValues, setFormValues] = useState<AddTaskForm>({
//     project_id: "",
//     sub_project_id: "",
//     task_type_id: "",
//     task_details: "",
//     task_date: "",
//     task_status: "",
//   });

//   const handleInputChange = async (e: any) => {
//     const { name, value, type, files } = e.target;
//     setFormValues((prev) => ({ ...prev, [name]: value }));
//   }
//   const formData = new FormData();
//   const [errors, setErrors] = useState<Partial<AddTaskForm>>({});

//   const validate = () => {
//     const newErrors: Partial<AddTaskForm> = {};
//     if (!formValues.project_id) newErrors.project_id = "required";
//     if (!formValues.sub_project_id) newErrors.sub_project_id = "required";
//     if (!formValues.task_type_id) newErrors.task_type_id = "required";
//     if (!formValues.task_details) newErrors.task_details = "required";
//     if (!formValues.task_date) newErrors.task_date = "required";
//     if (!formValues.task_status) newErrors.task_status = "required";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validate()) return;
//     setLoadingCursor(true);
//     console.log("handle submit called");
//     formData.append("client_id", contextClientID);
//     formData.append("customer_id", contextCustomerID);
//     formData.append("project_id", formValues.project_id);
//     formData.append("sub_project_id", formValues.sub_project_id);
//     formData.append("task_type_id", formValues.task_type_id);
//     formData.append("task_details", formValues.task_details);
//     formData.append("task_date", formValues.task_date);
//     formData.append("task_status", formValues.task_status);

//     try {
//       const response = await fetch("/api/users/addTask", {
//         method: "POST",
//         body: formData,
//       });
//       if (response.ok) {
//         setLoadingCursor(false);
//         setShowAlert(true);
//         setAlertTitle("Success")
//         setAlertStartContent("Task added Successfully");
//         setAlertForSuccess(1)
//       } else {
//         setLoadingCursor(false);       
//         setShowAlert(true);
//         setAlertTitle("Error")
//         setAlertStartContent("Failed to create task");
//         setAlertForSuccess(2)
//       }
//     } catch (error) {
//       setLoadingCursor(false);
//       setShowAlert(true);
//       console.log("Error adding type:", error);
//       setAlertTitle("Exception");
//       setAlertStartContent(ALERTMSG_exceptionString);
//       setAlertForSuccess(2);
//     }
//   }

//   return (
//     <div className='mainbox'>
//       <header>
//         <LeapHeader title={createLeaveTitle} />
//       </header>
//       <LeftPannel menuIndex={22} subMenuIndex={0} showLeftPanel={true} rightBoxUI={
//         <div className={`${loadingCursor ? "cursorLoading" : ""}`}>
//           {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
//               setShowAlert(false)
//               if (alertForSuccess == 1) {
//                   router.push(pageURL_userTaskListingPage);
//               }
//           }} onCloseClicked={function (): void {
//               setShowAlert(false)
//           }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
//           <form onSubmit={handleSubmit}>
//             <div className="container">
//               <div className="row">
//                 <div className="col-lg-12">
//                   <div className="fill_task_mainbox">
//                     <div className="apply_leave_heading">Add <span>Task</span></div>
//                     <div className="fill_task_formbox">
//                       <div className="form_new_group">
//                         <label htmlFor="exampleFormControlInput1" className="form-label" >Client<span className='req_text'>*</span> </label>
//                         <select id="project_id" name="project_id" onChange={handleProjectTypeChange} className='form-select'>
//                           <option value="">Select</option>
//                           {projectarray.map((type, index) => (
//                             <option value={type.project_id} key={type.project_id}>{type.project_name}</option>
//                           ))}
//                         </select>
//                         {errors.project_id && <span className="error" style={{color: "red"}}>{errors.project_id}</span>}
//                       </div>
//                       <div className="form_new_group">
//                         <label htmlFor="exampleFormControlInput1" className="form-label" > Project Name<span className='req_text'>*</span> </label>
//                         <select id="sub_project_id" name="sub_project_id" onChange={handleInputChange} className='form-select'>
//                           <option value="">Select</option>
//                           {subProjectarray.length > 0 ? (
//                             subProjectarray.map((type, index) => (
//                               <option value={type.subproject_id} key={type.subproject_id}>{type.sub_project_name}</option>
//                             ))
//                           ) : (
//                             <option value="" disabled>No Project under this client</option>
//                           )}
//                         </select>
//                         {errors.sub_project_id && <span className="error" style={{ color: "red" }}>{errors.sub_project_id}</span>}
//                       </div>
//                       <div className="form_new_group">
//                         <label htmlFor="exampleFormControlInput1" className="form-label" >Task Type<span className='req_text'>*</span> </label>
//                         <select id="task_type_id" name="task_type_id" onChange={handleInputChange} className='form-select'>
//                           <option value="">Select</option>
//                           {taskArray.map((type, index) => (
//                             <option value={type.task_type_id} key={type.task_type_id}>{type.task_type_name}</option>
//                           ))}
//                         </select>
//                         {errors.task_type_id && <span className="error" style={{ color: "red" }}>{errors.task_type_id}</span>}
//                       </div>
//                       <div className="form_new_group">
//                         <label htmlFor="exampleFormControlInput1" className="form-label" >Date<span className='req_text'>*</span> </label>
//                         <input className='form-control' type="date" id="task_date" name="task_date" value={formValues.task_date} onChange={handleInputChange} />
//                         {errors.task_date && <span className="error" style={{ color: "red" }}>{errors.task_date}</span>}
//                       </div>
//                       <div className="form_new_group">
//                         <label htmlFor="exampleFormControlInput1" className="form-label" >Details<span className='req_text'>*</span> </label>
//                         <textarea className='form-control' rows={1} id="task_details" name="task_details" value={formValues.task_details} onChange={handleInputChange} />
//                         {errors.task_details && <span className="error" style={{ color: "red" }}>{errors.task_details}</span>}
//                       </div>
//                       <div className="form_new_group">
//                         <label htmlFor="exampleFormControlInput1" className="form-label" >Status<span className='req_text'>*</span> </label>
//                         <select id="task_status" name="task_status" onChange={handleInputChange} className='form-select'>
//                           <option value="">Select</option>
//                           {statusArray.map((type, index) => (
//                             <option value={type.id} key={type.id}>{type.status}</option>
//                           ))}
//                         </select>
//                         {errors.task_status && <span className="error" style={{ color: "red" }}>{errors.task_status}</span>}
//                       </div>
//                       <div className="form_new_group form_new_group_btn">
//                         <BackButton isCancelText={true} />
//                         <input type='submit' value="Submit" className="red_button" onClick={handleSubmit} />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </form>
//         </div>
//       }
//       />
//       <div>
//         <Footer />
//       </div>
//     </div>
//   )
// }

// export default AssignLeave


// async function getProject(client: any, branch: any) {

//   let query = supabase
//     .from('leap_client_project')
//     .select()
//     .eq("client_id", client);

//   const { data, error } = await query;
//   if (error) {
//     // console.log(error);

//     return [];
//   } else {
//     // console.log(data);
//     return data;
//   }

// }

// async function getSubProject(project: any) {

//   let query = supabase
//     .from('leap_client_sub_projects')
//     .select()
//     .eq("project_id", project);

//   const { data, error } = await query;
//   if (error) {
//     // console.log(error);

//     return [];
//   } else {
//     // console.log(data);
//     return data;
//   }

// }
// async function getTaskTypes() {

//   let query = supabase
//     .from('leap_project_task_types')
//     .select()
//   // .eq("asset_status",1);

//   const { data, error } = await query;
//   if (error) {
//     // console.log(error);

//     return [];
//   } else {
//     // console.log(data);
//     return data;
//   }

// }
// async function getStatus() {
//   let query = supabase
//     .from('leap_task_status')
//     .select()
//     .neq("id", 5)
//     .neq("id", 6)
//     .neq("id", 4);

//   const { data, error } = await query;
//   if (error) {
//     // console.log(error);
//     return [];
//   } else {
//     // console.log(data);
//     return data;
//   }
// }

// Form where employee can fill their daily tasks

'use client'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import LeapHeader from '@/app/components/header'
import Footer from '@/app/components/footer'
import { createLeaveTitle } from '@/app/pro_utils/stringConstants'
import supabase from '@/app/api/supabaseConfig/supabase'
import { useParams, useRouter } from 'next/navigation';
import { pageURL_userTaskListingPage } from '@/app/pro_utils/stringRoutes'
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
import { Project, SubProject } from '@/app/models/TaskModel'
import LeftPannel from '@/app/components/leftPannel'
import BackButton from '@/app/components/BackButton'
import { ALERTMSG_addAssetTypeError, deleteDataTypeAsset, ALERTMSG_exceptionString, staticIconsBaseURL } from '@/app/pro_utils/stringConstants'
import ShowAlertMessage from '@/app/components/alert'

interface AddTaskForm {
  project_id: string,
  sub_project_id: string,
  task_type_id: string,
  task_details: string,
  task_date: string,
  task_status: string,
}

const AssignLeave: React.FC = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [taskArray, setTask] = useState<TaskType[]>([]);
  const [statusArray, setStatus] = useState<TaskStatus[]>([]);
  const { contextClientID, contaxtBranchID, contextCustomerID } = useGlobalContext();
  const [projectarray, setProject] = useState<Project[]>([]);
  const [subProjectarray, setSubProject] = useState<SubProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [loadingCursor, setLoadingCursor] = useState(false);

   const [showAlert,setShowAlert]=useState(false);
    const [alertForSuccess,setAlertForSuccess]=useState(0);
    const [alertTitle,setAlertTitle]=useState('');
    const [alertStartContent,setAlertStartContent]=useState('');
    const [alertMidContent,setAlertMidContent]=useState('');
    const [alertEndContent,setAlertEndContent]=useState('');
    const [alertValue1,setAlertValue1]=useState('');
    const [alertvalue2,setAlertValue2]=useState('');

  const handleProjectTypeChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value })); 
    setSelectedProject(value);
    const subProj = await getSubProject(value);
    setSubProject(subProj);
  };
  const router = useRouter()
  useEffect(() => {
    setLoadingCursor(true);
      const fetchData = async () => {
        const project = await getProject(3, contaxtBranchID);
        setProject(project);
        const task = await getTaskTypes();
        setTask(task);
        const taskStatus = await getStatus();
        setStatus(taskStatus);
        setLoadingCursor(false);
    };
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

  const [formValues, setFormValues] = useState<AddTaskForm>({
    project_id: "",
    sub_project_id: "",
    task_type_id: "",
    task_details: "",
    task_date: "",
    task_status: "",
  });

  const handleInputChange = async (e: any) => {
    const { name, value, type, files } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }
  const formData = new FormData();
  const [errors, setErrors] = useState<Partial<AddTaskForm>>({});

  const validate = () => {
    const newErrors: Partial<AddTaskForm> = {};
    if (!formValues.project_id) newErrors.project_id = "required";
    if (!formValues.sub_project_id) newErrors.sub_project_id = "required";
    if (!formValues.task_type_id) newErrors.task_type_id = "required";
    if (!formValues.task_details) newErrors.task_details = "required";
    if (!formValues.task_date) newErrors.task_date = "required";
    if (!formValues.task_status) newErrors.task_status = "required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoadingCursor(true);
    console.log("handle submit called");
    // formData.append("client_id", contextClientID);
    // formData.append("customer_id", contextCustomerID);
    // formData.append("project_id", formValues.project_id);
    // formData.append("sub_project_id", formValues.sub_project_id);
    // formData.append("task_type_id", formValues.task_type_id);
    // formData.append("task_details", formValues.task_details);
    // formData.append("task_date", formValues.task_date);
    // formData.append("task_status", formValues.task_status);

    try {
      const response = await fetch("/api/users/addTask", {
        method: "POST",
        body: JSON.stringify({
                        "client_id": contextClientID,
                        "customer_id": contextCustomerID,
                        "project_id": formValues.project_id,
                        "sub_project_id": formValues.sub_project_id,
                        "task_type_id": formValues.task_type_id,
                        "task_details": formValues.task_details,
                        "task_date": formValues.task_date,
                        "task_status": formValues.task_status
                    }),
      });
      if (response.ok) {
        setLoadingCursor(false);
        setShowAlert(true);
        setAlertTitle("Success")
        setAlertStartContent("Task added Successfully");
        setAlertForSuccess(1)
      } else {
        setLoadingCursor(false);       
        setShowAlert(true);
        setAlertTitle("Error")
        setAlertStartContent("Failed to create task");
        setAlertForSuccess(2)
      }
    } catch (error) {
      setLoadingCursor(false);
      setShowAlert(true);
      console.log("Error adding type:", error);
      setAlertTitle("Exception");
      setAlertStartContent(ALERTMSG_exceptionString);
      setAlertForSuccess(2);
    }
  }

  return (
    <div className='mainbox'>
      <header>
        <LeapHeader title={createLeaveTitle} />
      </header>
      <LeftPannel menuIndex={22} subMenuIndex={0} showLeftPanel={true} rightBoxUI={
        <div className={`${loadingCursor ? "cursorLoading" : ""}`}>
          {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
              setShowAlert(false)
              if (alertForSuccess == 1) {
                  router.push(pageURL_userTaskListingPage);
              }
          }} onCloseClicked={function (): void {
              setShowAlert(false)
          }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
          <form onSubmit={handleSubmit}>
            {/* ------------------ */}
                        <div className='container'>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="nw_user_inner_mainbox">
                                        <div className="nw_user_inner_heading_tabbox">
                                            <div className="heading25">
                                                Add <span>Tasks</span>
                                            </div>
                                            <div className="nw_user_inner_tabs empty_div"></div>
                                        </div>
                                        <div className="nw_user_inner_content_box">
                                            <div className="fill_task_mainbox">
                                            <div className="fill_task_formbox">
                                              <div className="form_new_group">
                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Client<span className='req_text'>*</span> </label>
                                                <select id="project_id" name="project_id" onChange={handleProjectTypeChange} className='form-select'>
                                                  <option value="">Select</option>
                                                  {projectarray.map((type, index) => (
                                                    <option value={type.project_id} key={type.project_id}>{type.project_name}</option>
                                                  ))}
                                                </select>
                                                {errors.project_id && <span className="error" style={{color: "red"}}>{errors.project_id}</span>}
                                              </div>
                                              <div className="form_new_group">
                                                <label htmlFor="exampleFormControlInput1" className="form-label" > Project Name<span className='req_text'>*</span> </label>
                                                <select id="sub_project_id" name="sub_project_id" onChange={handleInputChange} className='form-select'>
                                                  <option value="">Select</option>
                                                  {subProjectarray.length > 0 ? (
                                                    subProjectarray.map((type, index) => (
                                                      <option value={type.subproject_id} key={type.subproject_id}>{type.sub_project_name}</option>
                                                    ))
                                                  ) : (
                                                    <option value="" disabled>No Project under this client</option>
                                                  )}
                                                </select>
                                                {errors.sub_project_id && <span className="error" style={{ color: "red" }}>{errors.sub_project_id}</span>}
                                              </div>
                                              <div className="form_new_group">
                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Task Type<span className='req_text'>*</span> </label>
                                                <select id="task_type_id" name="task_type_id" onChange={handleInputChange} className='form-select'>
                                                  <option value="">Select</option>
                                                  {taskArray.map((type, index) => (
                                                    <option value={type.task_type_id} key={type.task_type_id}>{type.task_type_name}</option>
                                                  ))}
                                                </select>
                                                {errors.task_type_id && <span className="error" style={{ color: "red" }}>{errors.task_type_id}</span>}
                                              </div>
                                              <div className="form_new_group">
                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Date<span className='req_text'>*</span> </label>
                                                <input className='form-control' type="date" id="task_date" name="task_date" value={formValues.task_date} onChange={handleInputChange} />
                                                {errors.task_date && <span className="error" style={{ color: "red" }}>{errors.task_date}</span>}
                                              </div>
                                              <div className="form_new_group">
                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Details<span className='req_text'>*</span> </label>
                                                <textarea className='form-control' rows={1} id="task_details" name="task_details" value={formValues.task_details} onChange={handleInputChange} />
                                                {errors.task_details && <span className="error" style={{ color: "red" }}>{errors.task_details}</span>}
                                              </div>
                                              <div className="form_new_group">
                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Status<span className='req_text'>*</span> </label>
                                                <select id="task_status" name="task_status" onChange={handleInputChange} className='form-select'>
                                                  <option value="">Select</option>
                                                  {statusArray.map((type, index) => (
                                                    <option value={type.id} key={type.id}>{type.status}</option>
                                                  ))}
                                                </select>
                                                {errors.task_status && <span className="error" style={{ color: "red" }}>{errors.task_status}</span>}
                                              </div>
                                              <div className="form_new_group form_new_group_btn">
                                                <BackButton isCancelText={true} />
                                                <input type='submit' value="Submit" className="red_button" onClick={handleSubmit} />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* ------------------ */}
          </form>
        </div>
      }
      />
      <div>
        <Footer />
      </div>
    </div>
  )
}

export default AssignLeave


async function getProject(client: any, branch: any) {

  let query = supabase
    .from('leap_client_project')
    .select()
    .eq("client_id", client);

  const { data, error } = await query;
  if (error) {
    // console.log(error);

    return [];
  } else {
    // console.log(data);
    return data;
  }

}

async function getSubProject(project: any) {

  let query = supabase
    .from('leap_client_sub_projects')
    .select()
    .eq("project_id", project);

  const { data, error } = await query;
  if (error) {
    // console.log(error);

    return [];
  } else {
    // console.log(data);
    return data;
  }

}
async function getTaskTypes() {

  let query = supabase
    .from('leap_project_task_types')
    .select()
  // .eq("asset_status",1);

  const { data, error } = await query;
  if (error) {
    // console.log(error);

    return [];
  } else {
    // console.log(data);
    return data;
  }

}
async function getStatus() {
  let query = supabase
    .from('leap_task_status')
    .select()
    .neq("id", 5)
    .neq("id", 6)
    .neq("id", 4);

  const { data, error } = await query;
  if (error) {
    // console.log(error);
    return [];
  } else {
    // console.log(data);
    return data;
  }
}

// Form where employee can fill their daily tasks

// 'use client'
// import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
// import LeapHeader from '@/app/components/header'
// import Footer from '@/app/components/footer'
// import { createLeaveTitle } from '@/app/pro_utils/stringConstants'
// import supabase from '@/app/api/supabaseConfig/supabase'
// import { useParams, useRouter } from 'next/navigation';
// import { pageURL_userTaskListingPage } from '@/app/pro_utils/stringRoutes'
// import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
// import { Project, SubProject } from '@/app/models/TaskModel'
// import LeftPannel from '@/app/components/leftPannel'
// import BackButton from '@/app/components/BackButton'

// interface AddTaskForm {
//     project_id: string,
//     sub_project_id: string,
//     task_type_id: string,
//     task_details: string,
//     task_date: string,
//     task_status: string,
// }

// const AssignLeave : React.FC = () => {
//   const [scrollPosition, setScrollPosition] = useState(0);
//   const [taskArray, setTask] = useState<TaskType[]>([]);
//   const [statusArray, setStatus] = useState<TaskStatus[]>([]);
//   const {contextClientID,contaxtBranchID, contextCustomerID}=useGlobalContext();
//   const [projectarray, setProject] = useState<Project[]>([]);
//   const [subProjectarray, setSubProject] = useState<SubProject[]>([]);
//   const [selectedProject, setSelectedProject] = useState<string>("");
//   const [loadingCursor, setLoadingCursor] = useState(false);

//   const handleProjectTypeChange = async (e: ChangeEvent<HTMLSelectElement>) => {
//     const { name, value} = e.target;
//     setFormValues((prev) => ({ ...prev, [name]: value }));
//     setSelectedProject(value);
//     const subProj = await getSubProject(value);
//     setSubProject(subProj);
      
//   };
//   const router = useRouter()
//   useEffect(() => {
//     setLoadingCursor(true);
//       const fetchData = async () => {
//         const project = await getProject(contextClientID, contaxtBranchID);
//         setProject(project);
//         const task = await getTaskTypes();
//         setTask(task);
//         const taskStatus = await getStatus();
//         setStatus(taskStatus);
//         setLoadingCursor(false);
//   };
//   fetchData();
//   const handleScroll = () => {
//       setScrollPosition(window.scrollY); // Update scroll position
//       const element = document.querySelector('.mainbox');
// if (window.pageYOffset > 0) {
//   element?.classList.add('sticky');
// } else {
//   element?.classList.remove('sticky');
// }
//     };
//   window.addEventListener('scroll', handleScroll);
//   return () => {
//       window.removeEventListener('scroll', handleScroll);
//     };
//   },[])
 
//   const [formValues, setFormValues] = useState<AddTaskForm>({
//     project_id: "",
//     sub_project_id: "",
//     task_type_id: "",
//     task_details: "",
//     task_date: "",
//     task_status: "",
//    } );

//   const handleInputChange = async (e: any) => {
//     const { name, value, type, files } = e.target;
//     setFormValues((prev) => ({ ...prev, [name]: value }));
//   }
//     const formData = new FormData();
//     const [errors, setErrors] = useState<Partial<AddTaskForm>>({});

//     const validate = () => {
//       const newErrors: Partial<AddTaskForm> = {};
//        if (!formValues.project_id) newErrors.project_id = "required";
//        if (!formValues.sub_project_id) newErrors.sub_project_id = "required";
//        if (!formValues.task_type_id) newErrors.task_type_id = "required";
//        if (!formValues.task_details) newErrors.task_details = "required";
//        if (!formValues.task_date) newErrors.task_date = "required";
//        if (!formValues.task_status) newErrors.task_status = "required";
//       setErrors(newErrors);
//       return Object.keys(newErrors).length === 0;
//   };

//     const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validate()) return;
//     setLoadingCursor(true);
//     console.log("handle submit called");
//      formData.append("client_id", contextClientID);
//      formData.append("customer_id", contextCustomerID);
//      formData.append("project_id", formValues.project_id);
//      formData.append("sub_project_id", formValues.sub_project_id);
//      formData.append("task_type_id", formValues.task_type_id);
//      formData.append("task_details", formValues.task_details);
//      formData.append("task_date", formValues.task_date);
//      formData.append("task_status", formValues.task_status);

//     try {
//       const response = await fetch("/api/users/addTask", {
//           method: "POST",
//           body: formData,
//       });
//       if (response.ok) {
//         setLoadingCursor(false);
//           router.push(pageURL_userTaskListingPage);
//       } else {
//         setLoadingCursor(false);
//           alert("Failed to submit form.");
//       }
//         } catch (error) {
//           setLoadingCursor(false);
//             console.log("Error submitting form:", error);
//             alert("An error occurred while submitting the form.");
//         }
//     }
    
//     const dualFunction = async (e: any) => {
//     handleProjectTypeChange;
//     handleInputChange
// }
//     return (
//       <div className='mainbox'>
//       <header>
//       <LeapHeader title={createLeaveTitle} />
//       </header>
//       <LeftPannel menuIndex={22} subMenuIndex={0} showLeftPanel={true} rightBoxUI={
//               <div className={`${loadingCursor ? "cursorLoading" : ""}`}>
//                 <form onSubmit={handleSubmit}>
//                 <div className="container">
//                   <div className="row"> 
//                     <div className="col-lg-8 mb-5">
//                       <div className="grey_box">
//                         <div className="row">
//                           <div className="col-lg-12">
//                             <div className="add_form_inner">
//                               <div className="row">
//                                   <div className="col-lg-12 mb-4 inner_heading25">
//                                       Daily Tasks:
//                                   </div>
//                               </div>
//                               <div className="row">
//                                   <div className="col-md-4">
//                                       <div className="form_box mb-3">
//                                           <label htmlFor="exampleFormControlInput1" className="form-label" >Client<span className='req_text'>*</span>: </label>
//                                               <select id="project_id" name="project_id" onChange={handleProjectTypeChange}>
//                                                   <option value="">Select</option>
//                                                   {projectarray.map((type, index) => (
//                                                       <option value={type.project_id} key={type.project_id}>{type.project_name}</option>
//                                                   ))}
//                                               </select>
//                                               {/* {errors.project_id && <span className="error" style={{color: "red"}}>{errors.project_id}</span>} */}
//                                       </div>
//                                   </div>
//                                   <div className="col-md-4">
//                                       <div className="form_box mb-3">
//                                       <label htmlFor="exampleFormControlInput1" className="form-label" > Project Name<span className='req_text'>*</span>: </label>
//                                           <select id="sub_project_id" name="sub_project_id" onChange={handleInputChange}>
//                                                   <option value="">Select</option>
//                                                   {subProjectarray.length > 0 ? (
//                                                       subProjectarray.map((type, index) => (
//                                                           <option value={type.subproject_id} key={type.subproject_id}>{type.sub_project_name}</option>
//                                                       ))
//                                                   ) : (
//                                                       <option value="" disabled>No Project under this client</option>
//                                                   )}
//                                           </select>
//                                           {errors.sub_project_id && <span className="error" style={{color: "red"}}>{errors.sub_project_id}</span>}
//                                       </div>
//                                   </div>
//                                   <div className="col-md-4">
//                                       <div className="form_box mb-3">
//                                           <label htmlFor="exampleFormControlInput1" className="form-label" >Task Type<span className='req_text'>*</span>: </label>
//                                           <select id="task_type_id" name="task_type_id" onChange={handleInputChange}>
//                                                   <option value="">Select</option>
//                                                   {taskArray.map((type, index) => (
//                                                       <option value={type.task_type_id} key={type.task_type_id}>{type.task_type_name}</option>
//                                                   ))}
//                                           </select>
//                                           {errors.task_type_id && <span className="error" style={{color: "red"}}>{errors.task_type_id}</span>}
//                                       </div>
//                                   </div>
//                               </div> 
//                               <div className="row">
//                                   <div className="col-md-4">
//                                       <div className="form_box mb-3">
//                                           <label htmlFor="exampleFormControlInput1" className="form-label" >Date<span className='req_text'>*</span>: </label>
//                                           <input type="date" id="task_date" name="task_date" value={formValues.task_date} onChange={handleInputChange} />
//                                               {errors.task_date && <span className="error" style={{color: "red"}}>{errors.task_date}</span>}
//                                       </div>
//                                   </div>
//                                   <div className="col-md-4">
//                                       <div className="form_box mb-3">
//                                           <label htmlFor="exampleFormControlInput1" className="form-label" >Details<span className='req_text'>*</span>: </label>
//                                           <textarea id="task_details" name="task_details"  value={formValues.task_details} onChange={handleInputChange} />
//                                               {errors.task_details && <span className="error" style={{color: "red"}}>{errors.task_details}</span>}
//                                       </div>
//                                   </div>
//                                   <div className="col-md-4">
//                                       <div className="form_box mb-3">
//                                           <label htmlFor="exampleFormControlInput1" className="form-label" >Status<span className='req_text'>*</span>: </label>
//                                           <select id="task_status" name="task_status" onChange={handleInputChange}>
//                                                   <option value="">Select</option>
//                                                   {statusArray.map((type, index) => (
//                                                       <option value={type.id} key={type.id}>{type.status}</option>
//                                                   ))}
//                                           </select>
//                                           {errors.task_status && <span className="error" style={{color: "red"}}>{errors.task_status}</span>}
//                                       </div>
//                                   </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>&nbsp;
//                       <div className="row">
//                         <div className="col-lg-12" style={{ textAlign: "right" }}>
//                           <BackButton isCancelText={true}/>
//                           <input type='submit' value="Submit" className="red_button" onClick={handleSubmit} />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 </form>
//               </div>
//              }
//         />
//     <div>
//       <Footer />
//     </div>
//         </div>
//     )
// }

// export default AssignLeave


// async function getProject(client: any, branch: any ) {

//     let query = supabase
//         .from('leap_client_project')
//         .select()
//         .eq("client_id",client)
//         .eq('is_deleted', "FALSE");
//     const { data, error } = await query;
//     if (error) {
//         // console.log(error);
//         return [];
//     } else {
//         // console.log(data);
//         return data;
//     }
//   }

//   async function getSubProject(project: any ) {

//     let query = supabase
//         .from('leap_client_sub_projects')
//         .select()
//         .eq("project_id",project)
//         .eq('is_deleted', "FALSE");

//     const { data, error } = await query;
//     if (error) {
//         // console.log(error);
//         return [];
//     } else {
//         // console.log(data);
//         return data;
//     }
//   }
//   async function getTaskTypes () {

//     let query = supabase
//         .from('leap_project_task_types')
//         .select()
//         // .eq("asset_status",1);
  
//     const { data, error } = await query;
//     if (error) {
//         // console.log(error);
  
//         return [];
//     } else {
//         // console.log(data);
//         return data;
//     }
  
//   }
//   async function getStatus () {
//     let query = supabase
//         .from('leap_task_status')
//         .select()
//         .neq("id",5);
  
//     const { data, error } = await query;
//     if (error) {
//         // console.log(error);
//         return [];
//     } else {
//         // console.log(data);
//         return data;
//     }
//   }