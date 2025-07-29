import { NextRequest, NextResponse } from "next/server";
import {
  funISDataKeyPresent,
  funSendApiErrorMessage,
  funSendApiException,
} from "@/app/pro_utils/constant";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import supabase from "@/app/api/supabaseConfig/supabase";

export async function POST(request: NextRequest) {
  try {
    const {
      client_id,
      customer_id,
      branch_id,
      type_id,
      priority_level,
      active_status,
      raised_on,
      id,
      end_date,
      start_date,
      page,
      limit,
    } = await request.json();

    const currentPage = parseInt(page || 1); // Default to 1
    const pageSize = parseInt(limit || 10); // Default to 20 per page
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize - 1;

    let query = supabase
      .from("leap_client_employee_requests")
      .select(
        "*, leap_request_master(*), leap_request_priority(priority_name), leap_customer(name), leap_request_status(status), leap_client_employee_requests_updates(*, leap_customer(name), leap_request_status(status))"
      )
      .order("updated_at", { ascending: false });

    if (client_id && client_id !== "0") query = query.eq("client_id", client_id);
    if (branch_id && branch_id !== "0") query = query.eq("branch_id", branch_id);
    if (customer_id && customer_id !== "0") query = query.eq("customer_id", customer_id);
    if (type_id && type_id !== "0") query = query.eq("type_id", type_id);
    if (priority_level && priority_level !== "0") query = query.eq("priority_level", priority_level);
    if (active_status && active_status !== "0") query = query.eq("active_status", active_status);
    if (id && id !== "0") query = query.eq("id", id);

    // Date range filter
    if (funISDataKeyPresent(start_date) && funISDataKeyPresent(end_date)) {
      query = query.gte("raised_on", start_date).lte("raised_on", end_date);
    }

    // Exact date filter
    if (funISDataKeyPresent(raised_on)) {
      query = query.eq("raised_on", raised_on);
    }

    // Pagination
    query = query.range(start, end);

    const { data: supportData, error: supportError } = await query;

    if (supportError) {
      return funSendApiErrorMessage(supportError, "Failed to fetch support data");
    }

    return NextResponse.json(
      {
        status: 1,
        message: "Support request data fetched successfully",
        data: supportData || [],
        // page: currentPage,
      },
      { status: apiStatusSuccessCode }
    );
  } catch (error) {
    return funSendApiException(error);
  }
}
