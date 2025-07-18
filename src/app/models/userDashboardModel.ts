
export interface DashboardGreetingModel {
    status: number
    message: string
    data: DashboardGreeting[]
  }
  
export interface DashboardGreeting {
    id: string
    created_at: string
    greeting_topic: string
    greeting_msg: string
    img_url: any
  }

  export interface AttendanceTimer {
     date: string
    remark: any
    in_time: string
    out_time: string
    client_id: string
    if_paused: boolean
    created_at: any
    updated_at: string
    approved_by: any
    customer_id: string
    total_hours: number
    attendance_id: number
    img_attachment: string
    pause_end_time: string[]
    approval_status: any
    paused_duration: string
    working_type_id: any
    attendanceStatus: number
    pause_start_time: string[]
    paused_reasons: string[]
    leap_working_type: WorkingTypeid
  }

  export interface WorkingTypeid{
    id: number
    created_at: any
    type: string
  }

  export interface TeamMembersModel {
  status: number
  message: string
  data: TeamDetails
}
export interface TeamDetails {
  manager: ManagerData
  teamMembers: TeamMember[]
  subordinates: Subordinate[]
}
export interface ManagerData {
  name: string
  contact_number: string
  email_id: string
  profile_pic: any
  designation_id: number
  leap_client_designations: LeapClientDesignations
}

export interface LeapClientDesignations {
  designation_name: string
}

export interface TeamMember {
  name: string
  contact_number: string
  email_id: string
  profile_pic: any
  designation_id: number
  leap_client_designations: LeapClientDesignations2
}

export interface LeapClientDesignations2 {
  designation_name: string
}

export interface Subordinate {
  name: string
  contact_number: string
  email_id: string
  profile_pic?: string
  designation_id: number
  leap_client_designations: LeapClientDesignations3
}

export interface LeapClientDesignations3 {
  designation_name: string
}