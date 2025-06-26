
import React, { useEffect, useState } from 'react'
import supabase from '../api/supabaseConfig/supabase';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import LoadingDialog from './PageLoader';
import moment from 'moment';
import { staticIconsBaseURL } from '../pro_utils/stringConstants';
import { AssignedTask, Task } from '../models/TaskModel';

interface TaskUpdateModel {
    id: string,
    task_details: string,
    task_status: string,
    leap_task_status: {
        id: number
        status: string
        created_at: string
    }
}
const TeamTaskData = ({ id, num, onClose }: { id: any, num: any, onClose: () => void }) => {
    const { contextClientID } = useGlobalContext();
    const [isLoading, setLoading] = useState(false);
    const [teamTaskarray, setTeamTask] = useState<Task[]>([]);
    const [projectTaskarray, setProjectTask] = useState<Task[]>([]);
    const [assignedTaskarray, setAssignedTask] = useState<AssignedTask[]>([]);
    const [formValues, setFormValues] = useState<TaskUpdateModel>({
        id: "",
        task_details: "",
        task_status: "",
        leap_task_status: {
            id: 0,
            status: "",
            created_at: ""
        }
    });
    const [taskData, setTaskData] = useState<Task>();

    useEffect(() => {
        fetchAssignedTasks();
        fetchTeamTasks();
        fetchProjectTasks();
    }, []);

    const fetchAssignedTasks = async () => {
        try {
            const formData = new FormData();
            formData.append("assigned_to", id);
            const res = await fetch(`/api/users/getAssignedTask`, {
                method: "POST",
                body: formData,
            });
            const response = await res.json();
            console.log(response);

            const taskData = response.data;
            if (response.status == 1) {
                setAssignedTask(taskData);
            } else {
                setAssignedTask([]);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };
    const fetchTeamTasks = async () => {
        try {
            const formData = new FormData();
            formData.append("id", id);

            const res = await fetch(`/api/users/getTeamTasks`, {
                method: "POST",
                body: formData,
            });
            const response = await res.json();
            console.log(response);

            const taskData = response.taskdata;
            if (response.status == 1 || []) {
                setTeamTask(taskData);
            } else {
                setTeamTask([]);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };
    
    const fetchProjectTasks = async () => {
        try {
            const formData = new FormData();
            formData.append("project_manager_id", id);

            const res = await fetch(`/api/users/getProjectTasks`, {
                method: "POST",
                body: formData,
            });
            const response = await res.json();
            console.log(response);

            const taskData = response.taskdata;
            if (response.status == 1 || []) {
                setProjectTask(taskData);
            } else {
                setProjectTask([]);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    return (
        <div >
            <div className='rightpoup_close'>
                <img src={staticIconsBaseURL + "/images/close_white.png"} alt="Search Icon" title='Close' onClick={onClose} />
            </div>
            {/* -------------- */}
            <div className="nw_user_offcanvas_mainbox">
                <LoadingDialog isLoading={isLoading} />
                <div className="nw_user_offcanvas_heading">
                    Task <span>Details</span>
                </div>
                {/* Assigned */}
                <div className="nw_user_offcanvas_listing_mainbox">
                    <div className="nw_user_offcanvas_listing">
                        <div className="nw_user_offcanvas_listing_lable">Name</div>
                        <div className="nw_user_offcanvas_listing_content">{taskData?.task_date}</div>
                    </div>
                    <div className="nw_user_offcanvas_listing">
                        <div className="nw_user_offcanvas_listing_lable">Date</div>
                        <div className="nw_user_offcanvas_listing_content">{taskData?.task_date}</div>
                    </div>
                    <div className="nw_user_offcanvas_listing">
                        <div className="nw_user_offcanvas_listing_lable">Project Name</div>
                        <div className="nw_user_offcanvas_listing_content">{taskData?.leap_client_sub_projects.sub_project_name}</div>
                    </div>
                    <div className="nw_user_offcanvas_listing">
                        <div className="nw_user_offcanvas_listing_lable">Task Type</div>
                        <div className="nw_user_offcanvas_listing_content">{taskData?.leap_project_task_types.task_type_name}</div>
                    </div>
                    <div className="nw_user_offcanvas_listing">
                        <div className="nw_user_offcanvas_listing_lable">Details</div>
                        <div className="nw_user_offcanvas_listing_content">
                            <input type="text" className="form-control" value={taskData?.task_details} readOnly={taskData?.task_status === 3} name="task_details" onChange={(e) => setFormValues((prev) => ({ ...prev, ['task_details']: e.target.value }))} id="task_details" placeholder="Task description" />
                        </div>
                    </div>
                    <div className="nw_user_offcanvas_listing">
                        <div className="nw_user_offcanvas_listing_lable">Status</div>
                        <div className='nw_user_offcanvas_listing_content'>{taskData?.leap_project_task_types.task_type_name}</div>
                        {/* <div className="nw_user_offcanvas_listing_content">

                        {taskData?.task_status === 1 ? (
                            <><div className="nw_priority_mainbox">
                                <div className="nw_priority_iconbox">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                        <path fill="#9e9e9e" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                    </svg>
                                </div>
                                <div className="nw_priority_namebox">{taskData?.leap_task_status.status}</div>
                            </div>
                            </>
                        ) : taskData?.task_status === 2 ? (
                            <><div className="nw_priority_mainbox">
                                <div className="nw_priority_iconbox">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                        <path fill="#FFFF00" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                    </svg>
                                </div>
                                <div className="nw_priority_namebox">{taskData?.leap_task_status.status}</div>
                            </div>
                            </>
                        ) : taskData?.task_status === 3 ? (
                            <><div className="nw_priority_mainbox">
                                <div className="nw_priority_iconbox">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                        <path fill="#388e3c" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                    </svg>
                                </div>
                                <div className="nw_priority_namebox">{taskData?.leap_task_status.status}</div>
                            </div>
                            </>
                        ) : taskData?.task_status === 4 ? (
                            <><div className="nw_priority_mainbox">
                                <div className="nw_priority_iconbox">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                        <path fill="#d32f2f" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                    </svg>
                                </div>
                                <div className="nw_priority_namebox">{taskData?.leap_task_status.status}</div>
                            </div>
                            </>
                        ) : taskData?.task_status === 5 ? (
                            <><div className="nw_priority_mainbox">
                                <div className="nw_priority_iconbox">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                        <path fill="#1976d2" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                    </svg>
                                </div>
                                <div className="nw_priority_namebox">{taskData?.leap_task_status.status}</div>
                            </div>
                            </>
                        ) : taskData?.task_status === 6 ? (
                            <><div className="nw_priority_mainbox">
                                <div className="nw_priority_iconbox">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                        <path fill="#d32f2f" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                    </svg>
                                </div>
                                <div className="nw_priority_namebox">{taskData?.leap_task_status.status}</div>
                            </div>
                            </>
                        ) : < div />
                        }
                    </div> */}
                    </div>
                    <div className="nw_user_offcanvas_listing">
                        <div className="nw_user_offcanvas_listing_lable">Approval Status</div>
                        <div className="nw_user_offcanvas_listing_content">

                            {taskData?.approval_status === 1 ? (
                                <><div className="nw_priority_mainbox">
                                    <div className="nw_priority_iconbox">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                            <path fill="#f57c00" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                        </svg>
                                    </div>
                                    <div className="nw_priority_namebox">{taskData?.leap_approval_status.approval_type}</div>
                                </div>
                                </>
                            ) : taskData?.approval_status === 2 ? (
                                <><div className="nw_priority_mainbox">
                                    <div className="nw_priority_iconbox">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                            <path fill="#388e3c" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                        </svg>
                                    </div>
                                    <div className="nw_priority_namebox">{taskData?.leap_approval_status.approval_type}</div>
                                </div>
                                </>
                            ) : taskData?.approval_status === 3 ? (
                                <><div className="nw_priority_mainbox">
                                    <div className="nw_priority_iconbox">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                            <path fill="#d32f2f" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                        </svg>
                                    </div>
                                    <div className="nw_priority_namebox">{taskData?.leap_approval_status.approval_type}</div>
                                </div>
                                </>
                            ) : < div />
                            }
                        </div>
                    </div>
                    <div className="nw_user_offcanvas_listing">
                        <div className="nw_user_offcanvas_listing_lable">Hours</div>
                        <div className="nw_user_offcanvas_listing_content">{taskData?.total_hours ? taskData?.total_hours : "--"}</div>
                    </div>
                    <div className="nw_user_offcanvas_listing">
                        <div className="nw_user_offcanvas_listing_lable">Minutes</div>
                        <div className="nw_user_offcanvas_listing_content">{taskData?.total_minutes ? taskData?.total_minutes : "--"}</div>
                    </div>
                    <div className="row mb-5">
                        <div className="col-lg-12" style={{ textAlign: "right" }}>
                            <input type='submit' disabled={taskData?.task_status == 4} value="Update" className="red_button" />
                        </div>
                    </div>
                </div>
                {/* Team */}
                <div className="nw_user_offcanvas_listing_mainbox">
                    <div className="nw_user_offcanvas_listing">
                        <div className="nw_user_offcanvas_listing_lable">Name</div>
                        <div className="nw_user_offcanvas_listing_content">{taskData?.task_date}</div>
                    </div>
                    <div className="nw_user_offcanvas_listing">
                        <div className="nw_user_offcanvas_listing_lable">Date</div>
                        <div className="nw_user_offcanvas_listing_content">{taskData?.task_date}</div>
                    </div>
                    <div className="nw_user_offcanvas_listing">
                        <div className="nw_user_offcanvas_listing_lable">Project Name</div>
                        <div className="nw_user_offcanvas_listing_content">{taskData?.leap_client_sub_projects.sub_project_name}</div>
                    </div>
                    <div className="nw_user_offcanvas_listing">
                        <div className="nw_user_offcanvas_listing_lable">Task Type</div>
                        <div className="nw_user_offcanvas_listing_content">{taskData?.leap_project_task_types.task_type_name}</div>
                    </div>
                    <div className="nw_user_offcanvas_listing">
                        <div className="nw_user_offcanvas_listing_lable">Details</div>
                        <div className="nw_user_offcanvas_listing_content">
                            <input type="text" className="form-control" value={taskData?.task_details} readOnly={taskData?.task_status === 3} name="task_details" onChange={(e) => setFormValues((prev) => ({ ...prev, ['task_details']: e.target.value }))} id="task_details" placeholder="Task description" />
                        </div>
                    </div>
                    <div className="nw_user_offcanvas_listing">
                        <div className="nw_user_offcanvas_listing_lable">Status</div>
                        <div className='nw_user_offcanvas_listing_content'>{taskData?.leap_project_task_types.task_type_name}</div>
                        {/* <div className="nw_user_offcanvas_listing_content">

                        {taskData?.task_status === 1 ? (
                            <><div className="nw_priority_mainbox">
                                <div className="nw_priority_iconbox">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                        <path fill="#9e9e9e" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                    </svg>
                                </div>
                                <div className="nw_priority_namebox">{taskData?.leap_task_status.status}</div>
                            </div>
                            </>
                        ) : taskData?.task_status === 2 ? (
                            <><div className="nw_priority_mainbox">
                                <div className="nw_priority_iconbox">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                        <path fill="#FFFF00" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                    </svg>
                                </div>
                                <div className="nw_priority_namebox">{taskData?.leap_task_status.status}</div>
                            </div>
                            </>
                        ) : taskData?.task_status === 3 ? (
                            <><div className="nw_priority_mainbox">
                                <div className="nw_priority_iconbox">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                        <path fill="#388e3c" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                    </svg>
                                </div>
                                <div className="nw_priority_namebox">{taskData?.leap_task_status.status}</div>
                            </div>
                            </>
                        ) : taskData?.task_status === 4 ? (
                            <><div className="nw_priority_mainbox">
                                <div className="nw_priority_iconbox">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                        <path fill="#d32f2f" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                    </svg>
                                </div>
                                <div className="nw_priority_namebox">{taskData?.leap_task_status.status}</div>
                            </div>
                            </>
                        ) : taskData?.task_status === 5 ? (
                            <><div className="nw_priority_mainbox">
                                <div className="nw_priority_iconbox">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                        <path fill="#1976d2" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                    </svg>
                                </div>
                                <div className="nw_priority_namebox">{taskData?.leap_task_status.status}</div>
                            </div>
                            </>
                        ) : taskData?.task_status === 6 ? (
                            <><div className="nw_priority_mainbox">
                                <div className="nw_priority_iconbox">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                        <path fill="#d32f2f" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                    </svg>
                                </div>
                                <div className="nw_priority_namebox">{taskData?.leap_task_status.status}</div>
                            </div>
                            </>
                        ) : < div />
                        }
                    </div> */}
                    </div>
                    <div className="nw_user_offcanvas_listing">
                        <div className="nw_user_offcanvas_listing_lable">Approval Status</div>
                        <div className="nw_user_offcanvas_listing_content">

                            {taskData?.approval_status === 1 ? (
                                <><div className="nw_priority_mainbox">
                                    <div className="nw_priority_iconbox">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                            <path fill="#f57c00" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                        </svg>
                                    </div>
                                    <div className="nw_priority_namebox">{taskData?.leap_approval_status.approval_type}</div>
                                </div>
                                </>
                            ) : taskData?.approval_status === 2 ? (
                                <><div className="nw_priority_mainbox">
                                    <div className="nw_priority_iconbox">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                            <path fill="#388e3c" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                        </svg>
                                    </div>
                                    <div className="nw_priority_namebox">{taskData?.leap_approval_status.approval_type}</div>
                                </div>
                                </>
                            ) : taskData?.approval_status === 3 ? (
                                <><div className="nw_priority_mainbox">
                                    <div className="nw_priority_iconbox">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                            <path fill="#d32f2f" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                        </svg>
                                    </div>
                                    <div className="nw_priority_namebox">{taskData?.leap_approval_status.approval_type}</div>
                                </div>
                                </>
                            ) : < div />
                            }
                        </div>
                    </div>
                    <div className="nw_user_offcanvas_listing">
                        <div className="nw_user_offcanvas_listing_lable">Hours</div>
                        <div className="nw_user_offcanvas_listing_content">{taskData?.total_hours ? taskData?.total_hours : "--"}</div>
                    </div>
                    <div className="nw_user_offcanvas_listing">
                        <div className="nw_user_offcanvas_listing_lable">Minutes</div>
                        <div className="nw_user_offcanvas_listing_content">{taskData?.total_minutes ? taskData?.total_minutes : "--"}</div>
                    </div>
                    <div className="row mb-5">
                        <div className="col-lg-12" style={{ textAlign: "right" }}>
                            <input type='submit' disabled={taskData?.task_status == 4} value="Update" className="red_button" />
                        </div>
                    </div>
                </div>
                {/* Project */}
                <div className="nw_user_offcanvas_listing_mainbox">
                    <div className="nw_user_offcanvas_listing">
                        <div className="nw_user_offcanvas_listing_lable">Name</div>
                        <div className="nw_user_offcanvas_listing_content">{taskData?.task_date}</div>
                    </div>
                    <div className="nw_user_offcanvas_listing">
                        <div className="nw_user_offcanvas_listing_lable">Date</div>
                        <div className="nw_user_offcanvas_listing_content">{taskData?.task_date}</div>
                    </div>
                    <div className="nw_user_offcanvas_listing">
                        <div className="nw_user_offcanvas_listing_lable">Project Name</div>
                        <div className="nw_user_offcanvas_listing_content">{taskData?.leap_client_sub_projects.sub_project_name}</div>
                    </div>
                    <div className="nw_user_offcanvas_listing">
                        <div className="nw_user_offcanvas_listing_lable">Task Type</div>
                        <div className="nw_user_offcanvas_listing_content">{taskData?.leap_project_task_types.task_type_name}</div>
                    </div>
                    <div className="nw_user_offcanvas_listing">
                        <div className="nw_user_offcanvas_listing_lable">Details</div>
                        <div className="nw_user_offcanvas_listing_content">
                            <input type="text" className="form-control" value={taskData?.task_details} readOnly={taskData?.task_status === 3} name="task_details" onChange={(e) => setFormValues((prev) => ({ ...prev, ['task_details']: e.target.value }))} id="task_details" placeholder="Task description" />
                        </div>
                    </div>
                    <div className="nw_user_offcanvas_listing">
                        <div className="nw_user_offcanvas_listing_lable">Status</div>
                        <div className='nw_user_offcanvas_listing_content'>{taskData?.leap_project_task_types.task_type_name}</div>
                        {/* <div className="nw_user_offcanvas_listing_content">

                        {taskData?.task_status === 1 ? (
                            <><div className="nw_priority_mainbox">
                                <div className="nw_priority_iconbox">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                        <path fill="#9e9e9e" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                    </svg>
                                </div>
                                <div className="nw_priority_namebox">{taskData?.leap_task_status.status}</div>
                            </div>
                            </>
                        ) : taskData?.task_status === 2 ? (
                            <><div className="nw_priority_mainbox">
                                <div className="nw_priority_iconbox">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                        <path fill="#FFFF00" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                    </svg>
                                </div>
                                <div className="nw_priority_namebox">{taskData?.leap_task_status.status}</div>
                            </div>
                            </>
                        ) : taskData?.task_status === 3 ? (
                            <><div className="nw_priority_mainbox">
                                <div className="nw_priority_iconbox">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                        <path fill="#388e3c" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                    </svg>
                                </div>
                                <div className="nw_priority_namebox">{taskData?.leap_task_status.status}</div>
                            </div>
                            </>
                        ) : taskData?.task_status === 4 ? (
                            <><div className="nw_priority_mainbox">
                                <div className="nw_priority_iconbox">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                        <path fill="#d32f2f" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                    </svg>
                                </div>
                                <div className="nw_priority_namebox">{taskData?.leap_task_status.status}</div>
                            </div>
                            </>
                        ) : taskData?.task_status === 5 ? (
                            <><div className="nw_priority_mainbox">
                                <div className="nw_priority_iconbox">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                        <path fill="#1976d2" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                    </svg>
                                </div>
                                <div className="nw_priority_namebox">{taskData?.leap_task_status.status}</div>
                            </div>
                            </>
                        ) : taskData?.task_status === 6 ? (
                            <><div className="nw_priority_mainbox">
                                <div className="nw_priority_iconbox">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                        <path fill="#d32f2f" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                    </svg>
                                </div>
                                <div className="nw_priority_namebox">{taskData?.leap_task_status.status}</div>
                            </div>
                            </>
                        ) : < div />
                        }
                    </div> */}
                    </div>
                    <div className="nw_user_offcanvas_listing">
                        <div className="nw_user_offcanvas_listing_lable">Approval Status</div>
                        <div className="nw_user_offcanvas_listing_content">

                            {taskData?.approval_status === 1 ? (
                                <><div className="nw_priority_mainbox">
                                    <div className="nw_priority_iconbox">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                            <path fill="#f57c00" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                        </svg>
                                    </div>
                                    <div className="nw_priority_namebox">{taskData?.leap_approval_status.approval_type}</div>
                                </div>
                                </>
                            ) : taskData?.approval_status === 2 ? (
                                <><div className="nw_priority_mainbox">
                                    <div className="nw_priority_iconbox">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                            <path fill="#388e3c" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                        </svg>
                                    </div>
                                    <div className="nw_priority_namebox">{taskData?.leap_approval_status.approval_type}</div>
                                </div>
                                </>
                            ) : taskData?.approval_status === 3 ? (
                                <><div className="nw_priority_mainbox">
                                    <div className="nw_priority_iconbox">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                            <path fill="#d32f2f" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                        </svg>
                                    </div>
                                    <div className="nw_priority_namebox">{taskData?.leap_approval_status.approval_type}</div>
                                </div>
                                </>
                            ) : < div />
                            }
                        </div>
                    </div>
                    <div className="nw_user_offcanvas_listing">
                        <div className="nw_user_offcanvas_listing_lable">Hours</div>
                        <div className="nw_user_offcanvas_listing_content">{taskData?.total_hours ? taskData?.total_hours : "--"}</div>
                    </div>
                    <div className="nw_user_offcanvas_listing">
                        <div className="nw_user_offcanvas_listing_lable">Minutes</div>
                        <div className="nw_user_offcanvas_listing_content">{taskData?.total_minutes ? taskData?.total_minutes : "--"}</div>
                    </div>
                    <div className="row mb-5">
                        <div className="col-lg-12" style={{ textAlign: "right" }}>
                            <input type='submit' disabled={taskData?.task_status == 4} value="Update" className="red_button" />
                        </div>
                    </div>
                </div>
            </div>
            {/* -------------- */}
        </div>
    )
}

export default TeamTaskData

async function getStatus() {
    let query = supabase
        .from('leap_task_status')
        .select()
        .neq("id", 5)
        .neq("id", 6);

    const { data, error } = await query;
    if (error) {
        // console.log(error);
        return [];
    } else {
        // console.log(data);
        return data;
    }
}