
import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/api/supabaseConfig/supabase";
import { apiStatusInvalidDataCode, apiStatusSuccessCode, clientAddedFailed, clientAddedSuccess, apifailedWithException, clientAssetSuccess,  } from "@/app/pro_utils/stringConstants";
import { funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import fs from "fs/promises";


export async function POST(request: NextRequest) {

    try{
      const { fields, files } = await parseForm(request);

  

    const fdata = {
      client_id: fields.client_id[0],
      branchID: fields.branch_id[0],
      assetID: fields.asset_id[0],
      customerID: fields.customer_id[0],
      remark: fields.remark[0],
      assetPicUrl: fields.asset_pic,
      givenDate: fields.date_given[0],
    }
    
    const { data,error } = await supabase.from('leap_customer_asset').insert([
        {   
          client_id:fdata.client_id,
          branch_id:fdata.branchID,
          asset_id:fdata.assetID,
          customer_id:fdata.customerID,
            asset_pic: fdata.assetPicUrl || null,
            remark:fdata.remark || null,
            date_given:fdata.givenDate || null,

        }
    ]).select();
    
    if(error){
        return funSendApiErrorMessage(error,"Asset Insert Issue");
      }

      // Update asset_status in leap_asset to 2 (Assigned)
      const { error: updateError } = await supabase
      .from("leap_asset")
      .update({ asset_status: 2 })
      .eq("asset_id", fdata.assetID);

    if (updateError) {
      console.error("Failed to update asset status:", updateError);
      return funSendApiErrorMessage(updateError, "Asset Status Update Issue");
  }

        return NextResponse.json({ message: clientAssetSuccess ,data:data}, { status: apiStatusSuccessCode });
      
  }catch(error){
      console.log(error);      
      return funSendApiException(error);     
    }
  }