'use client'
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import LeapHeader from '@/app/components/header'
import Footer from '@/app/components/footer'
import { employeeResponse } from '@/app/models/clientAdminEmployee'
import { createLeaveTitle } from '@/app/pro_utils/stringConstants'
import supabase from '@/app/api/supabaseConfig/supabase'
import { useParams, useRouter } from 'next/navigation';
import { CustomerProfile } from '@/app/models/employeeDetailsModel'
import { LeaveType } from '@/app/models/leaveModel'
import { pageURL_userLeave } from '@/app/pro_utils/stringRoutes'
import { LeapClientBranchDetail } from '@/app/models/companyModel'
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
import LeftPannel from '@/app/components/leftPannel'
import BackButton from '@/app/components/BackButton'
import moment from 'moment'
import { DateRange, RangeKeyDict } from 'react-date-range';
import { format } from 'date-fns'
import { Range } from 'react-date-range';

import { ALERTMSG_addAssetSuccess, staticIconsBaseURL, ALERTMSG_FormExceptionString, raiseSupportTitle } from '@/app/pro_utils/stringConstants'
import ShowAlertMessage from '@/app/components/alert'

interface AssignEmpLeave {
  client_id: string,
  branch_id: string,
  customer_id: string,
  leave_type: string,
  from_date: string,
  to_date: string,
  leave_reason: string,
  duration: string,
}

const AssignLeave: React.FC = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [leaveArray, setLeave] = useState<LeaveType[]>([]);
  const [isHalfDayDisabled, setIsHalfDayDisabled] = useState(false);
  const { contextClientID, contaxtBranchID, contextCustomerID } = useGlobalContext();
  const [loadingCursor, setLoadingCursor] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
      const [alertForSuccess, setAlertForSuccess] = useState(0);
      const [alertTitle, setAlertTitle] = useState('');
      const [alertStartContent, setAlertStartContent] = useState('');
      const [alertMidContent, setAlertMidContent] = useState('');
      const [alertEndContent, setAlertEndContent] = useState('');
      const [alertValue1, setAlertValue1] = useState('');
      const [alertvalue2, setAlertValue2] = useState('');

  const router = useRouter()
  useEffect(() => {
    setLoadingCursor(true);
    const fetchData = async () => {
      const leavetype = await getLeave();
      setLeave(leavetype);
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

  const [formValues, setFormValues] = useState<AssignEmpLeave>({
    client_id: "",
    branch_id: "",
    customer_id: "",
    leave_type: "",
    from_date: "",
    to_date: "",
    leave_reason: "",
    duration: "",
  });

  const handleInputChange = async (e: any) => {
    const { name, value, type, files } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }
  const formData = new FormData();
  const [errors, setErrors] = useState<Partial<AssignEmpLeave>>({});
  const [selected, setSelected] = React.useState(formValues.duration);

  const validate = () => {
    const newErrors: Partial<AssignEmpLeave> = {};
    if (!formValues.leave_type) newErrors.leave_type = "required";
    if (!formValues.from_date) newErrors.from_date = "required";
    if (!formValues.to_date) newErrors.to_date = "required";
    if (!formValues.leave_reason) newErrors.leave_reason = "required";
    if (!formValues.duration && !isHalfDayDisabled) newErrors.duration = "required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoadingCursor(true);
    console.log("handle submit called");

    formData.append("client_id", contextClientID);
    formData.append("branch_id", contaxtBranchID );
    formData.append("customer_id", contextCustomerID );
    formData.append("leave_type", formValues.leave_type);
    formData.append("from_date", formatDateYYYYMMDD(formValues.from_date));
    formData.append("to_date", formatDateYYYYMMDD(formValues.to_date));
    formData.append("leave_reason", formValues.leave_reason);
    formData.append("duration", formValues.duration);

    try {
      const response = await fetch("/api/users/applyLeave", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setLoadingCursor(false);
        setShowAlert(true);
        setAlertTitle("Success")
        setAlertStartContent("Leave applied Successfully");
        setAlertForSuccess(1)
      } else {
        setLoadingCursor(false);
        e.preventDefault()
        setShowAlert(true);
        setAlertTitle("Error")
        setAlertStartContent("Failed!");
        setAlertForSuccess(2)
      }
    } catch (error) {
      setLoadingCursor(false);
      e.preventDefault()
      console.log("Error submitting form:", error);
      setShowAlert(true);
      setAlertTitle("Exception")
      setAlertStartContent(ALERTMSG_FormExceptionString);
      setAlertForSuccess(2)
    }
  }
  const formatDateYYYYMMDD = (date: any, isTime = false) => {
    if (!date) return '';
    const parsedDate = moment(date);

    if (isTime) return parsedDate.format('HH:mm A');

    return parsedDate.format('YYYY-MM-DD');
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
      setFormValues((prev) => ({ ...prev, ['from_date']: ranges.selection.startDate + "" }));
      setIsHalfDayDisabled(false);
    } else {
      setFormValues((prev) => ({ ...prev, ['from_date']: ranges.selection.startDate + "" }));
      setFormValues((prev) => ({ ...prev, ['to_date']: ranges.selection.endDate + "" }));
      setIsHalfDayDisabled(true);
    }
    // dateStart = ranges.selection.startDate;
    // fetchUsers(3, '', selectedPage,ranges.selection.startDate,ranges.selection.endDate);
  };
  const formattedRange = state[0].startDate! == state[0].endDate! ? format(state[0].startDate!, 'yyyy-MM-dd') : `${format(state[0].startDate!, 'yyyy-MM-dd')} to ${format(state[0].endDate!, 'yyyy-MM-dd')}`;

  return (
    <div className='mainbox'>
      <header>
        <LeapHeader title={createLeaveTitle} />
      </header>
      <LeftPannel menuIndex={23} subMenuIndex={0} showLeftPanel={true} rightBoxUI={
        <div className={`${loadingCursor ? "cursorLoading" : ""}`}>
          {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
              setShowAlert(false)
              if (alertForSuccess == 1) {
                  router.push(pageURL_userLeave);
              }
          }} onCloseClicked={function (): void {
              setShowAlert(false)
          }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
          <form onSubmit={handleSubmit}>
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="new_apply_leave_mainbox">
                    <div className="new_apply_leave_leftbox">
                      <div className="apply_leave_heading">Apply for <span>Leave</span></div>
                        <div className="new_leave_formgoup">
                          <select id="leave_type" name="leave_type" onChange={handleInputChange} className='form-select'>
                            <option value="">Leave Type</option>
                            {leaveArray.map((type, index) => (
                              <option value={type.leave_id} key={type.leave_id}>{type.leave_name}</option>
                            ))}
                          </select>
                          {errors.leave_type && <span className="error" style={{ color: "red" }}>{errors.leave_type}</span>}
                        </div>
                        <div className="new_leave_formgoup">
                          <input
                            placeholder='Date'
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
                          {errors.from_date && <span className="error" style={{ color: "red" }}>{errors.from_date}</span>}
                        </div>
                        <div className="new_leave_formgoup">
                          <textarea placeholder='Leave reason' rows={1} id="leave_reason" name="leave_reason" value={formValues.leave_reason} onChange={handleInputChange} className='form-control' />
                          {errors.leave_reason && <span className="error" style={{ color: "red" }}>{errors.leave_reason}</span>}
                        </div>
                        <div className="new_leave_formgoup_radio">
                          <div className="new_leave_btn_radio">
                            <label htmlFor="fullday">Full day</label>
                            <input type="radio" id="duration" disabled={isHalfDayDisabled} name="duration" value="Full day" onChange={handleInputChange} />
                          </div>
                          <div className="new_leave_btn_radio">
                            <label htmlFor="fhalf">1st half</label>
                            <input type="radio" id="duration" disabled={isHalfDayDisabled} name="duration" value="1st half day" onChange={handleInputChange} />
                          </div>
                          
                          <div className="new_leave_btn_radio">
                            <label htmlFor="shalf">2nd half</label>
                            <input type="radio" id="duration" disabled={isHalfDayDisabled} name="duration" value="2nd half day" onChange={handleInputChange} />
                          </div>
                          {errors.duration && <span className="error" style={{ color: "red" }}>{errors.duration}</span>}
                        </div>
                        <div className="new_leave_formgoup_btn">
                          <BackButton isCancelText={true} />
                          <input type='submit' value="Submit" className="red_button" onClick={handleSubmit} />
                        </div>
                      
                    </div>
                    <div className="new_apply_leave_rightbox">
                      <img src="/images/user/apply-leave.webp" alt="Apply leave image" className="img-fluid" />
                    </div>
                  </div>
                  {/* <div className="grey_box">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="add_form_inner">
                          <div className="row">
                            <div className="col-lg-12 mb-4 inner_heading25">
                              Apply for Leave:
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-4">
                              <div className="form_box mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Leave Type<span className='req_text'>*</span>:</label>
                                <select id="leave_type" name="leave_type" onChange={handleInputChange}>
                                  <option value="">Select</option>
                                  {leaveArray.map((type, index) => (
                                    <option value={type.leave_id} key={type.leave_id}>{type.leave_name}</option>
                                  ))}
                                </select>
                                {errors.leave_type && <span className="error" style={{ color: "red" }}>{errors.leave_type}</span>}
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form_box mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Date<span className='req_text'>*</span>:  </label>
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
                                {errors.from_date && <span className="error" style={{ color: "red" }}>{errors.from_date}</span>}
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-4" >
                              <div className="form_box mb-3" >
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Duration:  </label>
                                <div className="row" >
                                  <div className="col-md-4"><label htmlFor="exampleFormControlInput1">Full day</label></div>
                                  <div className="col-md-6" style={{ alignContent: "center" }}><input type="radio" id="duration" disabled={isHalfDayDisabled} name="duration" value="Full day" onChange={handleInputChange} /></div>
                                </div>
                                <div className="row" >
                                  <div className="col-md-4"><label htmlFor="exampleFormControlInput1">1st half</label></div>
                                  <div className="col-md-6" style={{ alignContent: "center" }}><input type="radio" id="duration" disabled={isHalfDayDisabled} name="duration" value="1st half day" onChange={handleInputChange} /></div>
                                </div>
                                <div className="row" >
                                  <div className="col-md-4"><label htmlFor="exampleFormControlInput1">2nd half</label></div>
                                  <div className="col-md-6" style={{ alignContent: "center" }}><input type="radio" id="duration" disabled={isHalfDayDisabled} name="duration" value="2nd half day" onChange={handleInputChange} /></div>
                                </div>
                                {errors.duration && <span className="error" style={{ color: "red" }}>{errors.duration}</span>}
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form_box mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Leave reason<span className='req_text'>*</span>: </label>
                                <textarea id="leave_reason" name="leave_reason" value={formValues.leave_reason} onChange={handleInputChange} />
                                {errors.leave_reason && <span className="error" style={{ color: "red" }}>{errors.leave_reason}</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>&nbsp;
                  <div className="row">
                    <div className="col-lg-12" style={{ textAlign: "right" }}>
                      <BackButton isCancelText={true} />
                      <input type='submit' value="Submit" className="red_button" onClick={handleSubmit} />
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
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


async function getLeave() {

  let query = supabase
    .from('leap_client_leave')
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