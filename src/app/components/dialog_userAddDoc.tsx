'use client'
import React, { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import { LeapDashboardShortcuts } from '../models/DashboardModel';
import { companyDocUpload, employeeDocUpload, staticIconsBaseURL } from '../pro_utils/stringConstants';
import Select from "react-select";
import LoadingDialog from './PageLoader';


interface FormCompanyUploadDocDialog {
    docTypeID: any
    selectedFile: File | null,
    showToUsers: boolean
}
interface FormEmpUploadDocDialog {
    customer_id: any
    emp_id: any,
    branch_id: any,
    docTypeID: any
    selectedFile: File | null,
    showToUsers: boolean
}

const DialogUserUploadDocument = ({ onClose, docType }: { onClose: () => void, docType: any }) => {

    const [docTypes, setDocTypes] = useState<LeapDocumentType[]>([]);
    const [employeeData, setEmployee] = useState<LeapEmployeeBasic[]>([]);
    const [branchArray, setBranchArray] = useState<ClientBranchTableModel[]>([]);
    const [empIDArray, setEmpIDArray] = useState<any[]>([]);
    const [branchSelected, setBranchSelected] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const [employeeName, setEmployeeNames] = useState([{ value: '', label: '' }]);
    const [inputData, setInputData] = useState<FormCompanyUploadDocDialog>({
        docTypeID: "",
        selectedFile: null,
        showToUsers: false
    });
    const [formFilledData, setformFilledData] = useState<FormEmpUploadDocDialog>({
        customer_id: "",
        emp_id: '',
        branch_id: '',
        docTypeID: "",
        selectedFile: null,
        showToUsers: false
    });
    const { contextClientID, contaxtBranchID, contextRoleID, contextCustomerID } = useGlobalContext();
    const [showResponseMessage, setResponseMessage] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            const docTypes = await getDocumentsTypes(contextRoleID, docType)
            setDocTypes(docTypes);
            const branch = await getBranches(contextClientID);
            setBranchArray(branch);
            fetchEmployeeData(contextClientID, 0)
        };
        fetchData();
    }, []);

    const fetchEmployeeData = async (client_id: any, branch_id: any) => {
        if (contextRoleID == "2" || contextRoleID == "3") {
            const empData = await getEmployees(client_id, branch_id)
            setEmployee(empData);
            let name: any[] = []
            for (let i = 0; i < empData.length; i++) {

                name.push({
                    value: empData[i].customer_id,
                    label: empData[i].emp_id + "  " + empData[i].name,
                })
            }
            console.log(name);

            setEmployeeNames(name);
        }

    }
    const uploadDocument = async () => {
        const formData = new FormData();
        formData.append("uploadType", docType);



        if (docType == companyDocUpload) {
            if (inputData.selectedFile == null) {
                return alert("Please select File to upload");
            }
            if (inputData.docTypeID.length > 0) {
                return alert("Please select type of document");
            }
            formData.append("client_id", contextClientID);
            formData.append("branch_id", contaxtBranchID);
            formData.append("customer_id", contextCustomerID);
            formData.append("file", inputData.selectedFile!);
            formData.append("doc_type_id", inputData.docTypeID);
            formData.append("show_to_users", inputData.showToUsers + "");
        } else {
            if (formFilledData.selectedFile == null) {
                return alert("Please select File to upload");
            }
            if (inputData.docTypeID.length > 0) {
                return alert("Please select type of document");
            }
            formData.append("client_id", contextClientID);
       
                formData.append("customer_id", contextCustomerID);
        

            formData.append("file", formFilledData.selectedFile!);
            formData.append("branch_id", formFilledData.branch_id!);
            formData.append("doc_type_id", formFilledData.docTypeID);

        }
        try {
            const res = await fetch("/api/clientAdmin/org_documents", {
                method: "POST",
                body: formData,
            });
            const response = await res.json();
            // console.log(response);

            if (response.status == 1) {
                alert(response.message)
                onClose();
            } else {

                alert(response.message)
            }
        } catch (e) {
            console.log(e);
            alert("Somthing went wrong! Please try again.")

        }

    };

    const handleInputChange = (e: any) => {
        const { name, value, checked, type, files } = e.target;
        if (type === "file") {
            setInputData((prev) => ({ ...prev, [name]: files[0] }));
        }
        else if (name === "showToUsers") {
            setInputData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setInputData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleEmpInputChange = (e: any) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            setformFilledData((prev) => ({ ...prev, [name]: files[0] }));
        } else {
            setformFilledData((prev) => ({ ...prev, [name]: value }));
        }


        if (name == "branch_id") {
            setSelectedEmployee(null);
            setformFilledData((prev) => ({ ...prev, ['customer_id']: '' }))
            if (value) {
                console.log("on select branch dropdown value of branch id", value);

                setBranchSelected(true);
            } else {
                setBranchSelected(false)
            }
            fetchEmployeeData(contextClientID, value);

        }

    };




    return (
        <div >
            <div className='rightpoup_close'>
                <img src={staticIconsBaseURL + "/images/close_white.png"} alt="Search Icon" title='Close' onClick={onClose} />
            </div>
            {/* -------------- */}
            <div className="nw_user_offcanvas_mainbox">
                {/* <LoadingDialog isLoading={isLoading} /> */}
                <div className="nw_user_offcanvas_heading">
                   Add <span>Document</span>
                </div>
                <div className="nw_user_offcanvas_listing_mainbox">
                    <div className="row">
                        <div className="col-lg-10">
                            <div className="nw_user_doc_mainbox">
                                <div className="nw_user_doc_selectbox">
                                    <label htmlFor="exampleFormControlInput1" className="form-label" >Document Type</label>
                                    <select id="docTypeID" name="docTypeID" className='form-select' onChange={handleEmpInputChange}>
                                        <option value="">Select</option>
                                        {docTypes.map((type) => (
                                            <option value={type.id} key={type.id}>{type.document_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="nw_user_doc_uploadbox">
                                    <label htmlFor="selectedFile" className='nw_user_doc_upload_lablebox'>
                                        <div className="user_upload_iconbox">
                                            <svg width="40" height="40" x="0" y="0" viewBox="0 0 512.056 512.056">
                                                <g>
                                                    <path d="M426.635 188.224C402.969 93.946 307.358 36.704 213.08 60.37 139.404 78.865 85.907 142.542 80.395 218.303 28.082 226.93-7.333 276.331 1.294 328.644c7.669 46.507 47.967 80.566 95.101 80.379h80v-32h-80c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64 8.837 0 16-7.163 16-16-.08-79.529 64.327-144.065 143.856-144.144 68.844-.069 128.107 48.601 141.424 116.144a16 16 0 0 0 13.6 12.8c43.742 6.229 74.151 46.738 67.923 90.479-5.593 39.278-39.129 68.523-78.803 68.721h-64v32h64c61.856-.187 111.848-50.483 111.66-112.339-.156-51.49-35.4-96.241-85.42-108.46z" fill="#000000" opacity="1" data-original="#000000"></path><path d="m245.035 253.664-64 64 22.56 22.56 36.8-36.64v153.44h32v-153.44l36.64 36.64 22.56-22.56-64-64c-6.241-6.204-16.319-6.204-22.56 0z" fill="#000000" opacity="1" data-original="#000000"></path>
                                                </g>
                                            </svg>
                                        </div>
                                        <div className="user_upload_headingbox">
                                            Choose a file or drag & drop it here.
                                        </div>
                                        <div className="user_upload_subheadingbox">
                                            DOC, PDF formats, up to 5 MB.
                                        </div>
                                        <div className="user_upload_btnbox">
                                            Browse File
                                        </div>
                                    </label>
                                    <input type="file" className="upload_document" name="selectedFile" id="selectedFile" onChange={handleEmpInputChange} />
                                </div>
                                <div className="nw_user_doc_btnbox new_leave_formgoup_back_btn">
                                    <a className="red_button" onClick={uploadDocument}>Upload</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* -------------- */}
        </div>
    )
}


export default DialogUserUploadDocument


async function getDocumentsTypes(roleID: any, docTypes: any) {

    let query = supabase
        .from('leap_document_type')
        .select();
    if (roleID == "2" || roleID == "3") {
        if (docTypes == companyDocUpload) {
            query = query.eq("document_type_id", 2);
        } else {
            query = query.eq("document_type_id", 5);
        }
    }
    if (roleID == "4" || roleID == "5" || roleID == "9") {
        query = query.eq("document_type_id", 5);
    }


    const { data, error } = await query;


    if (error) {
        // console.log(error);

        return [];
    } else {
        // console.log(data);
        return data;
    }

}

async function getBranches(clientID: any) {

    let query = supabase
        .from('leap_client_branch_details')
        .select().eq("client_id", clientID);
    const { data, error } = await query;
    if (error) {
        return [];
    } else {
        return data;
    }

}
async function getSelectedCustomerBranch(customerID: any) {
    console.log("getSelectedCustomerBranch called--------------------------", customerID);

    let query = supabase
        .from('leap_customer')
        .select(`branch_id`).eq("customer_id", customerID);

    const { data, error } = await query;

    if (error) {
        console.log(error);

        return 0;
    } else {

        console.log(data[0].branch_id);

        return data[0].branch_id;

    }

}

async function getEmployees(client_id: any, branchID: any) {

    let query = supabase
        .from('leap_customer')
        .select(`customer_id,name,emp_id,branch_id`).eq("client_id", client_id);
    if (branchID > 0) {
        query = query.eq("branch_id", branchID);
    }


    const { data, error } = await query;


    if (error) {
        // console.log(error);

        return [];
    } else {
        // console.log(data);
        return data;
    }

}
