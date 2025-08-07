// Here is the form to add the financial year for holiday list

'use client'
import React, { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import { Holiday, LeapHolidayTypes } from '../models/HolidayModel';
import { ALERTMSG_exceptionString, staticIconsBaseURL } from '../pro_utils/stringConstants';
import LoadingDialog from './PageLoader';
import ShowAlertMessage from './alert';

interface FormValues {
    id: string,
    list_name: string,
    description: string,
    from_date: string,
    to_date: string,
    client_id: string
}

const AddHolidayYear = ({ onClose }: { onClose: () => void }) => {
    const [formHolidayValues, setHolidayValues] = useState<FormValues>({
        id: '',
        list_name: '',
        description: '',
        from_date: '',
        to_date: '',
        client_id: '',
    });
    const [scrollPosition, setScrollPosition] = useState(0);
    const { contextClientID } = useGlobalContext();
    const [showResponseMessage, setResponseMessage] = useState(false);

    const [isLoading, setLoading] = useState(false);

    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');
    const [alertMidContent, setAlertMidContent] = useState('');
    const [alertEndContent, setAlertEndContent] = useState('');
    const [alertValue1, setAlertValue1] = useState('');
    const [alertvalue2, setAlertValue2] = useState('');

    const [errors, setErrors] = useState<Partial<FormValues>>({});
    useEffect(() => {
        setLoading(false);
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
    const [maxendDate, setMaxEndDate] = useState<string>("");
    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleInputChange = async (e: any) => {
        const { name, value } = e.target;
        console.log("Form values updated:", formHolidayValues);
        if (name === "from_date") {
            const fromDateObj = new Date(value);
            // Min: next day

            // Max: 12 months later (same day next year)
            const maxDateObj = new Date(fromDateObj);
            maxDateObj.setFullYear(maxDateObj.getFullYear() + 1);
            const maxdate= formatDate(maxDateObj);
            setMaxEndDate(maxdate); // Update max end date based on from_date
        }
        setHolidayValues((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const newErrors: Partial<FormValues> = {};
        if (!formHolidayValues.list_name) newErrors.list_name = "required";
        //  if (!formHolidayValues.description) newErrors.description = "required";
        if (!formHolidayValues.from_date) newErrors.from_date = "required";
        if (!formHolidayValues.to_date) newErrors.to_date = "required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        const formData = new FormData();
        e.preventDefault();
        if (!validate()) return;
        formData.append("client_id", contextClientID);
        formData.append("list_name", formHolidayValues.list_name);
        formData.append("description", "");
        formData.append("from_date", formHolidayValues.from_date);
        formData.append("to_date", formHolidayValues.to_date);

        try {
            const response = await fetch("/api/commonapi/addHolidayYear", {
                method: "POST",
                body: formData,
            });
            // const response = await res.json();
            console.log(response);
            if (response.ok) {

                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Success")
                setAlertStartContent("Holiday added successfully.");
                setAlertForSuccess(1)

            } else {
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("Failed to add holiday year");
                setAlertForSuccess(2)
            }

        } catch (e) {
            console.log(e);
            setLoading(false);
            setShowAlert(true);
            setAlertTitle("Exception")
            setAlertStartContent(ALERTMSG_exceptionString);
            setAlertForSuccess(2)
        }

    }

    return (

        <div >
            <LoadingDialog isLoading={isLoading} />
            {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent.length > 0 ? alertEndContent : ""} value1={""} value2={""} onOkClicked={function (): void {
                setShowAlert(false)
                if (alertForSuccess == 1) {
                    onClose();
                }

            }} onCloseClicked={function (): void {
                setShowAlert(false)
            }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
            <div className='rightpoup_close' onClick={onClose}>
                <img src={staticIconsBaseURL + "/images/close_white.png"} alt="Search Icon" title='Close' />
            </div>
            <div className="row">
                <div className="col-lg-12 mb-4 inner_heading25">
                    Add Holiday Financial year
                </div>
            </div>
            <form onSubmit={handleSubmit}>


                <div className="row" style={{ alignItems: "center" }}>
                    <div className="col-md-4">
                        <div className="form_box mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Holiday List name:</label>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form_box mb-3">
                            <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Holiday List name" value={formHolidayValues.list_name} name="list_name" onChange={handleInputChange} />
                            {errors.list_name && <span className="error" style={{ color: "red" }}>{errors.list_name}</span>}
                        </div>
                    </div>
                    {/* <div className="col-md-4">
                            <div className="form_box mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label" >Description:</label>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form_box mb-3">
                                <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Describe the financial year" value={formHolidayValues.description} name="description" onChange={handleInputChange} />
                                {errors.description && <span className="error" style={{color: "red"}}>{errors.description}</span>}
                            </div>
                        </div> */}
                    <div className="col-md-4">
                        <div className="form_box mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label" > From Date:</label>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form_box mb-3">
                            <input type="date" className="form-control" id="exampleFormControlInput1" placeholder="" value={formHolidayValues.from_date} name="from_date" onChange={handleInputChange} />
                            {errors.from_date && <span className="error" style={{ color: "red" }}>{errors.from_date}</span>}
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form_box mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label" >To Date:{maxendDate}</label>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form_box mb-4">
                            <input type="date" className="form-control" id="exampleFormControlInput1" placeholder="" value={formHolidayValues.to_date} min={maxendDate} name="to_date" onChange={handleInputChange} />
                            {errors.to_date && <span className="error" style={{ color: "red" }}>{errors.to_date}</span>}
                        </div>
                    </div>
                </div>

                <div className="row mb-5">
                    <div className="col-lg-6 " style={{ textAlign: "left" }}>
                        <input type='submit' value="Submit" className="red_button" />

                    </div>
                </div>
            </form>
        </div>

    )
}

export default AddHolidayYear

