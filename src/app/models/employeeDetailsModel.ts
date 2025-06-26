export interface AddressModel {
  message: string
  status: number
  data: Address[]
}

export interface Address {
  customerAddress: CustomerAddress[]
  emergencyContact: EmergencyContact[]
}

export interface CustomerAddress {
  id: number
  client_id: number
  branch_id: number
  customer_id: number
  address_line1: string
  address_line2: string
  city: string
  state: string
  postal_code: string
  country: string
  latitude: any
  longitude: any
  is_primary: boolean
  created_at: any
  updated_at: string
  address_type: string
}

export interface EmergencyContact {
  emergency_contact: string
  contact_name: string
  relation: string
  leap_relations: LeapRelations
}

export interface LeapRelations {
  id: number
  relation_type: string
}


export interface BankModel {
  message: string
  status: number
  data: Bank[]
}

export interface Bank {
  bankDetails: BankDetail[]
  salaryDetails: SalaryDetail[]
  totalSalary: TotalSalary[]
}

export interface BankDetail {
  id: number
  created_at: string
  customer_id: number
  client_id: number
  bank_name: string
  account_number: string
  IFSC_code: string
  UAN_number: string
  ESIC_number: string
  PAN_number: string
  updated_at: string
  TIN_number: any
  security_insurance_no: any
  branch_name: any
}
export interface TotalSalary {
  id: number
  gross_salary: any
  total_deduction: any
  net_pay: any

  customer_id: number
}

export interface SalaryDetail {
  id: number
  client_id: number
  branch_id: number
  customer_id: number
  salary_component_id: number
  amount: string
  
  leap_client_salary_components: LeapClientSalaryComponents
}

export interface LeapClientSalaryComponents {
  client_Salary_compionent_id:number,
  salary_component_id: number
  leap_salary_components: LeapSalaryComponents
}

export interface LeapSalaryComponents {
  id: number
  salary_component_name: string
  salary_add:boolean
}

export interface ProfileModel {
  message: string
  status: number
  customer_profile: CustomerProfile[]
}

export interface CustomerProfile {
  id: string
  customer_id: number
  created_at: string
  name: string
  contact_number: string
  email_id: string
  dob: string
  client_id: number
  gender: string
  date_of_joining: string
  employment_status: boolean
  device_id: string
  salary_structure: string
  user_role: number
  profile_pic: any
  emergency_contact: number
  contact_name: string
  relation: number
  manager_id: number
  designation_id: number
  authUuid: any
  branch_id: number
  emp_id: string
  updated_at: string
  marital_status: string
  nationality: string
  blood_group: string
  department_id: number
  employment_type: number
  work_location: string
  probation_period: any
  official_onboard_date: any
  alternateContact: any
  personalEmail: string
  work_mode: number
  leap_client_branch_details: LeapClientBranchDetails
  leap_client: LeapClient
  leap_client_designations: LeapDesignation
  leap_client_departments: LeapDepartment
  leap_working_type: LeapWorkingType
  leap_employement_type: LeapEmployementType
}

export interface LeapClientBranchDetails {
  id: number
  uuid: string
  client_id: number
  dept_name: string
  is_active: boolean
  created_at: string
  updated_at: string
  branch_city: string
  branch_email: string
  time_zone_id: any
  branch_number: string
  branch_address: string
  is_main_branch: boolean
  contact_details: number
  total_employees: number
}

export interface LeapClient {
  user_id: string
  client_id: number
  parent_id: any
  created_at: string
  is_deleted: boolean
  updated_at: string
  is_a_parent: boolean
  sector_type: string
  timezone_id: any
  company_name: string
  company_email: string
  company_number: string
  company_location: string
  number_of_branches: number
  total_weekend_days: number
  company_website_url: string
  fullday_working_hours: number
  halfday_working_hours: number
}

export interface LeapDesignation {
  id: number
  department: any
  designation_name: string
}

export interface LeapDepartment {
  id: number
  is_active: boolean
  department_name: string
}

export interface LeapWorkingType {
  id: number
  type: string
  created_at: string
}

export interface LeapEmployementType {
  created_at: string
  updated_at: string
  employeement_type: string
  employment_type_id: number
}


// export interface EmployeeDetailsModel {
//   message: string
//   status: number
//   customer_profile: CustomerProfile[]
// }

// export interface CustomerProfile {
//   id: string
//   customer_id: number
//   created_at: string
//   name: string
//   contact_number: string
//   email_id: string
//   dob: string
//   client_id: number
//   gender: string
//   date_of_joining: string
//   employment_status: boolean
//   device_id: string
//   salary_structure: string
//   user_role: number
//   profile_pic: any
//   emergency_contact: number
//   contact_name: string
//   relation: number
//   manager_id: number
//   designation_id: any
//   authUuid: any
//   branch_id: number
//   emp_id: string
//   updated_at: string
//   marital_status: string
//   nationality: string
//   blood_group: string
//   department_id: any
//   employment_type: number
//   work_location: any
//   probation_period: any
//   official_onboard_date: any
//   alternateContact: any
//   personalEmail: any
//   leap_client_branch_details: LeapClientBranchDetails
//   leap_client: LeapClient
//   leap_customer_address: LeapCustomerAddress[]
//   leap_customer_bank_details: LeapCustomerBankDetail[]
//   leap_client_designations: LeapDesignation
//   leap_client_departments: LeapDepartment
//   leap_customer: LeapCustomer[]
//   leap_employement_type: LeapEmployementType
//   leap_relations: LeapRelations
//   leap_working_type: LeapWorkingType}

// export interface LeapClientBranchDetails {
//   id: number
//   uuid: string
//   client_id: number
//   dept_name: string
//   is_active: boolean
//   created_at: string
//   updated_at: string
//   branch_city: string
//   branch_email: string
//   time_zone_id: any
//   branch_number: string
//   branch_address: string
//   is_main_branch: boolean
//   contact_details: number
//   total_employees: number
// }

// export interface LeapClient {
//   user_id: string
//   client_id: number
//   parent_id: any
//   created_at: string
//   is_deleted: boolean
//   updated_at: string
//   is_a_parent: boolean
//   sector_type: string
//   timezone_id: any
//   company_name: string
//   company_email: string
//   company_number: string
//   company_location: string
//   number_of_branches: number
//   total_weekend_days: number
//   company_website_url: string
//   fullday_working_hours: number
//   halfday_working_hours: number
// }

// export interface LeapCustomerAddress {
//   id: number
//   city: string
//   state: string
//   country: string
//   latitude: any
//   branch_id: number
//   client_id: number
//   longitude: any
//   created_at: any
//   is_primary: boolean
//   updated_at: string
//   customer_id: number
//   postal_code: string
//   address_type: string
//   address_line1: string
//   address_line2: string
// }

// export interface LeapCustomerBankDetail {
//   id: number
//   IFSC_code: string
//   bank_name: string
//   client_id: number
//   PAN_number: string
//   TIN_number: number
//   UAN_number: string
//   created_at: string
//   updated_at: string
//   ESIC_number: string
//   branch_name: any
//   customer_id: number
//   account_number: string
//   security_insurance_no: number
// }

// export interface LeapDesignation {
//   id: number
//   department: any
//   designation_name: string
// }

// export interface LeapDepartment {
//   id: number
//   is_active: boolean
//   department_name: string
// }

// export interface LeapCustomer {
//   id: string
//   dob: string
//   name: string
//   emp_id: string
//   gender: string
//   authUuid: any
//   email_id: string
//   relation: number
//   branch_id: number
//   client_id: number
//   device_id: string
//   user_role: number
//   created_at: string
//   manager_id: number
//   updated_at: string
//   blood_group: any
//   customer_id: number
//   nationality: string
//   profile_pic: any
//   contact_name: string
//   department_id: number
//   personalEmail: any
//   work_location: any
//   contact_number: string
//   designation_id: number
//   marital_status: string
//   date_of_joining: string
//   employment_type: number
//   alternateContact: any
//   probation_period: any
//   salary_structure: string
//   emergency_contact: number
//   employment_status: boolean
//   official_onboard_date: any
// }

// export interface LeapEmployementType {
//   created_at: string
//   updated_at: string
//   employeement_type: string
//   employment_type_id: number
// }

// export interface LeapRelations {
//   id: number
//   relation_type: string
// }

// export interface LeapWorkingType {
//   id: number
//   type: string
//   created_at: string
// }
