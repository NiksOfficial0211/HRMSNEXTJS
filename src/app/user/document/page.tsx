// here employee can view their own personal documents and organizational related documents

// btn 1 : org doc-- /clientadmin/documents
// btn 2 : emp personal doc-- user/document/employee-doc
// pages/page.js

'use client'
import React from 'react'
import LeapHeader from '@/app/components/header'
import Footer from '@/app/components/footer'
import { useEffect, useState } from 'react'
import { pageURL_assignLeaveForm, leftMenuLeavePageNumbers, leftMenuProjectMGMTPageNumbers, leftMenuProjectsSub1PageNumbers, baseUrl } from '@/app/pro_utils/stringRoutes'
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
import { FaFilePdf, FaFileAlt, FaDownload } from "react-icons/fa";
import LeftPannel from '@/app/components/leftPannel'
import DialogUploadDocument from '@/app/components/dialog_addDocument'
import { ALERTMSG_addAssetSuccess, employeeDocUpload, staticIconsBaseURL } from '@/app/pro_utils/stringConstants'
import PageErrorCenterContent from '@/app/components/pageError'
import ShowAlertMessage from '@/app/components/alert'

const EmployeeDocuments = () => {

    const [loadingCursor, setLoadingCursor] = useState(false);
    const { contextClientID, contextCustomerID, contaxtBranchID } = useGlobalContext();
    const [scrollPosition, setScrollPosition] = useState(0);
    const [tabSelectedIndex, setTabSelectedIndex] = useState(0);
    const [orgDocArray, setOrgDoc] = useState<LeapClientDocuments[]>([]);
    const [empOrgArray, setEmpOrgDoc] = useState<OrganizationSpecific[]>([]);
    const [empPerArray, setEmpPerDoc] = useState<EmployeePersonal[]>([]);
    const [showUploadDialog, setShowUploadDialog] = useState(false);

    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');
    const [alertMidContent, setAlertMidContent] = useState('');
    const [alertEndContent, setAlertEndContent] = useState('');
    const [alertValue1, setAlertValue1] = useState('');
    const [alertvalue2, setAlertValue2] = useState('');

    useEffect(() => {
        fetchCompanyDoc();
        fetchEmployeeDoc();
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

    const fetchCompanyDoc = async () => {
        // setLoading(true);
        try {
            const formData = new FormData();

            // for (const [key, value] of formData.entries()) {
            //     console.log(`${key}: ${value}`);
            // }
            const res = await fetch(`/api/users/getCompanyDocuments`, {
                method: "POST",
                body: JSON.stringify({
                    "client_id": contextClientID,
                    "branch_id": contaxtBranchID,
                    "customer_id": contextCustomerID
                }),
            });
            const response = await res.json();
            console.log(response);
            const companyDoc = response.data;
            if (response.status == 1 && companyDoc.length > 0) {
                setOrgDoc(companyDoc)
                // setLoading(false);
            } else {
                setOrgDoc([]);
                // setLoading(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("No documents uploaded yet!");
                setAlertForSuccess(2)
            }
        } catch (error) {
            // setLoading(false);
            console.error("Error fetching user data:", error);
            setShowAlert(true);

            setAlertTitle("Exception")
            setAlertStartContent(ALERTMSG_addAssetSuccess);
            setAlertForSuccess(2)
        }
        setLoadingCursor(false);
    }

    const fetchEmployeeDoc = async () => {
        try {
            const formData = new FormData();
            // formData.append("client_id", contextClientID);
            // // formData.append("branch_id", contaxtBranchID )
            // formData.append("customer_id", contextCustomerID);
            
            for (const [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }
            const res = await fetch(`/api/users/getEmployeeDocuments`, {
                method: "POST",
                body: JSON.stringify({
                    "client_id": contextClientID,
                    // "branch_id": contaxtBranchID,
                    "customer_id": contextCustomerID
                }),
            });
            const response = await res.json();
            // console.log(response);
            const empOrgDoc = response.organization_specific;
            const empPerDoc = response.employee_personal;

            if (response.status == 1 && empOrgDoc.length > 0) {
                setEmpOrgDoc(empOrgDoc)
                // setLoading(false);
            } else {
                setEmpOrgDoc(empOrgDoc);
                // setLoading(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("No documents uploaded yet!");
                setAlertForSuccess(2)
            }
            if (response.status == 1 && empPerDoc.length > 0) {
                setEmpPerDoc(empPerDoc)
                // setLoading(false);
            } else {
                setEmpPerDoc(empPerDoc);
                // setLoading(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("No documents uploaded yet!");
                setAlertForSuccess(2)
            }
        } catch (error) {
            // setLoading(false);
            console.error("Error fetching user data:", error);
            setShowAlert(true);
            setAlertTitle("Exception")
            setAlertStartContent(ALERTMSG_addAssetSuccess);
            setAlertForSuccess(2)
        }
        setLoadingCursor(false);
    }
    const getFileIcon = (type: string, url: string) => {
        switch (type) {
            case "pdf":
                return <FaFilePdf className="text-danger fs-2" />;
            case "image":
                return <img src={baseUrl + url} alt="Thumbnail" width={50} height={50} />;
            case "xls":
                return <FaFileAlt className="text-success fs-2" />;
            case "doc":
                return <FaFileAlt className="text-primary fs-2" />;
            default:
                return <FaFileAlt className="text-secondary fs-2" />;
        }
    };
    return (
        <div className='mainbox'>
            <header>
                <LeapHeader title="Welcome!" />
            </header>
            <LeftPannel menuIndex={25} subMenuIndex={0} showLeftPanel={true} rightBoxUI={
                <div>
                    {/* <LoadingDialog isLoading={isLoading} /> */}
                    {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                        setShowAlert(false)
                    }} onCloseClicked={function (): void {
                        setShowAlert(false)
                    }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                    {/* ---------------------- */}
                    <div className='container'>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="nw_user_inner_mainbox">
                                    <div className="nw_user_inner_heading_tabbox">
                                        <div className="heading25">
                                            Documents<span></span>
                                        </div>
                                        <div className="nw_user_inner_tabs">
                                            <ul>
                                                <li className={tabSelectedIndex == 0 ? "nw_user_inner_listing_selected" : "nw_user_inner_listing"} key={0}>
                                                    <a onClick={(e) => { setTabSelectedIndex(0), setLoadingCursor(true), fetchCompanyDoc() }} className={tabSelectedIndex == 0 ? "nw_user_selected" : "new_list_view_heading"}>
                                                        <div className="nw_user_tab_icon">
                                                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="15" height="15" x="0" y="0" viewBox="0 0 512 512">
                                                                <g>
                                                                    <path className='black_to_white_fill' d="M446.605 124.392 326.608 4.395A15.02 15.02 0 0 0 316 0H106C81.187 0 61 20.187 61 45v422c0 24.813 20.187 45 45 45h300c24.813 0 45-20.187 45-45V135c0-4.09-1.717-7.931-4.395-10.608zM331 51.213 399.787 120H346c-8.271 0-15-6.729-15-15zM406 482H106c-8.271 0-15-6.729-15-15V45c0-8.271 6.729-15 15-15h195v75c0 24.813 20.187 45 45 45h75v317c0 8.271-6.729 15-15 15z" fill="#000000" opacity="1" data-original="#000000"></path>
                                                                    <path className='black_to_white_fill' d="M346 212H166c-8.284 0-15 6.716-15 15s6.716 15 15 15h180c8.284 0 15-6.716 15-15s-6.716-15-15-15zM346 272H166c-8.284 0-15 6.716-15 15s6.716 15 15 15h180c8.284 0 15-6.716 15-15s-6.716-15-15-15zM346 332H166c-8.284 0-15 6.716-15 15s6.716 15 15 15h180c8.284 0 15-6.716 15-15s-6.716-15-15-15zM286 392H166c-8.284 0-15 6.716-15 15s6.716 15 15 15h120c8.284 0 15-6.716 15-15s-6.716-15-15-15z" fill="#000000" opacity="1" data-original="#000000">
                                                                    </path>
                                                                </g>
                                                            </svg>
                                                        </div>
                                                        <div className="nw_user_tab_name">
                                                            Company
                                                        </div>
                                                    </a>
                                                </li>
                                                <li className={tabSelectedIndex == 1 ? "nw_user_inner_listing_selected" : "nw_user_inner_listing"} key={1}>
                                                    <a onClick={(e) => { setTabSelectedIndex(1), setLoadingCursor(true), fetchEmployeeDoc() }} className={tabSelectedIndex == 1 ? "nw_user_selected" : "new_list_view_heading"}>
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
                                                            Official
                                                        </div>
                                                    </a>
                                                </li>
                                                <li className={tabSelectedIndex == 2 ? "nw_user_inner_listing_selected" : "nw_user_inner_listing"} key={2}>
                                                    <a onClick={(e) => { setTabSelectedIndex(2), setLoadingCursor(true), fetchEmployeeDoc() }} className={tabSelectedIndex == 2 ? "nw_user_selected" : "new_list_view_heading"}>
                                                        <div className="nw_user_tab_icon">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" className='black_to_white_fill'>
                                                                <path d="M12 12.922a6.458 6.458 0 1 0-6.458-6.457A6.458 6.458 0 0 0 12 12.922zm0-11.07a4.613 4.613 0 1 1-4.613 4.613A4.613 4.613 0 0 1 12 1.852zm11.07 17.823a8.5 8.5 0 0 0-8.13-6.15H9.073a8.512 8.512 0 0 0-8.13 6.15H.93a3.383 3.383 0 0 0 3.247 4.317h15.621a3.383 3.383 0 0 0 3.272-4.317zm-2.017 1.857a1.538 1.538 0 0 1-1.23.615H4.189a1.538 1.538 0 0 1-1.476-1.955 6.642 6.642 0 0 1 6.36-4.797h5.854a6.63 6.63 0 0 1 6.36 4.81 1.525 1.525 0 0 1-.247 1.327z" data-original="#000000" />
                                                            </svg>
                                                        </div>
                                                        <div className="nw_user_tab_name">
                                                            Personal
                                                        </div>
                                                    </a>
                                                </li>
                                            </ul>
                                            <ul>
                                                <li>
                                                    <a className="" onClick={() => { setShowUploadDialog(true) }}>
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
                                        {tabSelectedIndex == 0 ?
                                            // Company documents
                                            <>
                                                <div className="user_document_right_listing">
                                                    {orgDocArray.length > 0 ? (
                                                        <div className="user_document_right_cardbox">
                                                            {orgDocArray.map((doc, index) => {
                                                                const docEntry = doc.leap_client_documents?.[0]; // ✅ might be undefined
                                                                const fileUrl = docEntry?.document_url ?? ""; // fallback to empty string
                                                                const fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
                                                                const fileExt = fileName.split(".").pop()?.toLowerCase() ?? "";

                                                                return (
                                                                    <div className="user_document_right_card_listing" key={index}>
                                                                        <div className="user_document_right_card_icon">
                                                                            <img src={staticIconsBaseURL+"/images/user/adobe-pdf-icon.png"} alt="PDF icon" className="img-fluid" />
                                                                        </div>
                                                                        <div className="user_document_right_card_content">
                                                                            <div className="user_document_right_card_heading">
                                                                                {doc.leap_client_documents[0].document_url.substring(doc.leap_client_documents[0].document_url.lastIndexOf('/') + 1)}
                                                                            </div>
                                                                            <div className="user_document_right_card_two_btns">
                                                                                <div className="user_document_right_card_two_btns_list">
                                                                                    <a href={doc.leap_client_documents[0].document_url} download >Download</a>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
                                                            <PageErrorCenterContent content={"No documents uploaded"} />
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                            : tabSelectedIndex == 1 ?
                                                // Official documents
                                                <>
                                                    <div className="user_document_right_listing">
                                                        {empOrgArray.length > 0 ? (
                                                            <div className="user_document_right_cardbox">
                                                                {empOrgArray.map((doc, index) => {
                                                                    const fileName = doc.leap_customer_documents[0].bucket_url!.substring(doc.leap_customer_documents[0].bucket_url.lastIndexOf("/") + 1) || "";
                                                                    const fileExt = fileName.split(".").pop().toLowerCase();
                                                                    return (
                                                                        <div className="user_document_right_card_listing" key={index}>
                                                                            <div className="user_document_right_card_icon">
                                                                                <img src={staticIconsBaseURL+"/images/user/adobe-pdf-icon.png"} alt="PDF icon" className="img-fluid" />
                                                                            </div>
                                                                            <div className="user_document_right_card_content">
                                                                                <div className="user_document_right_card_heading">
                                                                                    {doc.leap_customer_documents[0].bucket_url.substring(doc.leap_customer_documents[0].bucket_url.lastIndexOf('/') + 1)}
                                                                                </div>
                                                                                <div className="user_document_right_card_two_btns">
                                                                                    <div className="user_document_right_card_two_btns_list">
                                                                                        <a href={doc.leap_customer_documents[0].bucket_url} download >Download</a>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        ) : (
                                                            <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
                                                                <PageErrorCenterContent content={"No documents uploaded"} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </>
                                                : tabSelectedIndex == 2 ?
                                                    // Personal documents
                                                    <>
                                                        <div className="user_document_right_listing">
                                                            {empPerArray.length > 0 ? (
                                                                <div className="user_document_right_cardbox">
                                                                    {empPerArray.map((doc, index) => {
                                                                        const docEntry = doc.leap_customer_documents?.[0]; // ✅ might be undefined

                                                                        const fileUrl = docEntry?.bucket_url ?? ""; // fallback to empty string
                                                                        const fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
                                                                        const fileExt = fileName.split(".").pop()?.toLowerCase() ?? "";
                                                                        return (
                                                                            <div className="user_document_right_card_listing" key={index}>
                                                                                <div className="user_document_right_card_icon">
                                                                                    <img src={staticIconsBaseURL+"/images/user/adobe-pdf-icon.png"} alt="PDF icon" className="img-fluid" />
                                                                                </div>
                                                                                <div className="user_document_right_card_content">
                                                                                    <div className="user_document_right_card_heading">
                                                                                        {doc.leap_customer_documents[0].bucket_url.substring(doc.leap_customer_documents[0].bucket_url.lastIndexOf('/') + 1)}
                                                                                    </div>
                                                                                    <div className="user_document_right_card_two_btns">
                                                                                        <div className="user_document_right_card_two_btns_list">
                                                                                            <a href={doc.leap_customer_documents[0].bucket_url} download >Download</a>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            ) : (
                                                                <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
                                                                    <PageErrorCenterContent content={"No documents uploaded"} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </>
                                                    : <div />
                                        }
                                        {showUploadDialog && <DialogUploadDocument onClose={() => { setShowUploadDialog(false); fetchEmployeeDoc() }} docType={employeeDocUpload} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* ---------------------- */}
                </div>
            } />
            {/* </div> */}
            <div>
                <Footer />
            </div>
        </div>
    )
}
export default EmployeeDocuments;