// user asset page, read only


'use client'
import React from 'react'
import LeapHeader from '@/app/components/header'
import Footer from '@/app/components/footer'
import LoadingDialog from '@/app/components/PageLoader'
import { useEffect, useRef, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase'
import { CustomerAssetList } from '@/app/models/AssetModel'
import AssetUpdate from '@/app/components/dialog_updateAsset'
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
import LeftPannel from '@/app/components/leftPannel'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import BackButton from '@/app/components/BackButton'
import PageErrorCenterContent from '@/app/components/pageError'
import ShowAlertMessage from '@/app/components/alert'
import { ALERTMSG_addAssetSuccess, getImageApiURL, staticIconsBaseURL } from '@/app/pro_utils/stringConstants'


const Asset = () => {
    const { contextClientID, contextCustomerID } = useGlobalContext();
    const [asset, setAsset] = useState<CustomerAssetList[]>([]);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isLoading, setLoading] = useState(true);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    const swiperRef = useRef<any>(null);

    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');
    const [alertMidContent, setAlertMidContent] = useState('');
    const [alertEndContent, setAlertEndContent] = useState('');
    const [alertValue1, setAlertValue1] = useState('');
    const [alertvalue2, setAlertValue2] = useState('');

    useEffect(() => {
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


    const fetchData = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("client_id", contextClientID);
            formData.append("customer_id", contextCustomerID);
            const res = await fetch("/api/client/asset/getCustomerAsset", {
                method: "POST",
                body: formData,
            });
            const response = await res.json();
            console.log(response);
            const assetListData = response.assetList;

            if (response.status === 1) {
                setAsset(assetListData);
                setLoading(false);
            } else {
                setAsset([]);
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("Failed to load assets");
                setAlertForSuccess(2)
            }
        } catch (error) {
            setLoading(false);
            console.error("Error fetching user data:", error);
            setShowAlert(true);
            setAlertTitle("Exception")
            setAlertStartContent(ALERTMSG_addAssetSuccess);
            setAlertForSuccess(2)
        }
    }


    return (
        <div className='mainbox'>
            <header>
                <LeapHeader title="Welcome!" />
            </header>
            <LeftPannel menuIndex={24} subMenuIndex={0} showLeftPanel={true} rightBoxUI={
                //  asset! && asset.length > 0 ?
                <div>
                    <LoadingDialog isLoading={isLoading} />
                    
                    <div className='container'>
                        {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                            setShowAlert(false)
                        }} onCloseClicked={function (): void {
                            setShowAlert(false)
                        }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                        <div style={{ top: "0", zIndex: "50", backgroundColor: "#ebeff2", padding: "0 0 10px 0" }}>
                            <div className="row heading25 mb-3">
                                <div className="col-lg-6">
                                    My <span>Asset</span>
                                </div>
                                <div className="col-lg-6 mb-1" style={{ textAlign: "right" }}>
                                <BackButton isCancelText={false} />
                                </div>
                            </div>
                        </div>

                        <div className="user_assets_listingBox">
                            {asset.length > 0 ? (asset.map((assetList) => (
                                <div className="user_asset_list" key={assetList.id}>
                                    <div className="user_asset_imageBox">
                                        <div className="swiper-wrapper-with-nav">
                                            <Swiper
                                                slidesPerView="auto"
                                                spaceBetween={0}
                                                pagination={{ clickable: true }}
                                                autoplay={{
                                                    delay: 5000,
                                                    disableOnInteraction: false,
                                                }}
                                                modules={[Pagination, Autoplay]}
                                                onSwiper={(swiper) => {
                                                    swiperRef.current = swiper;
                                                    setIsBeginning(swiper.isBeginning);
                                                    setIsEnd(swiper.isEnd);
                                                }}
                                                onSlideChange={(swiper) => {
                                                    setIsBeginning(swiper.isBeginning);
                                                    setIsEnd(swiper.isEnd);
                                                }}
                                                className="custom-swiper"
                                            >
                                                {/* <SwiperSlide>
                                                    <div className="image_wrap">
                                                        <img
                                                            src="/images/user/laptop-wooden-table.webp"
                                                            alt="{assetList.leap_asset.asset_name}"
                                                            className="img-fluid"
                                                        />
                                                    </div> */}
                                                    {/* </SwiperSlide> */}

                                                    {/* below the image is uploaded on the server and won't be accessed locally */}
                                                {/* { assetList.asset_pic && assetList.asset_pic.length> 0 ?( assetList.asset_pic.map((img) => ( */}
                                                    <SwiperSlide >
                                                        <div className='asset_thumb_img'>
                                                            {/* <img src={getImageApiURL+assetList.asset_pic} className="img-fluid" alt="Image not uploaded" /> */}
                                                            <img src={assetList.asset_pic && assetList.asset_pic.length> 0 ? getImageApiURL + assetList.asset_pic : staticIconsBaseURL + "/images/"} onError={(e) => { const target = e.target as HTMLImageElement; target.onerror = null; target.src = staticIconsBaseURL + "/images/user/laptop-wooden-table.webp"; }} alt='text' className="img-fluid" style={{ objectFit: 'cover', }} />
                                                            
                                                            {/* <img src={getImageApiURL + announcement.leap_client_announcements.announcement_image : staticIconsBaseURL + "/images/"} onError={(e) => { const target = e.target as HTMLImageElement; target.onerror = null; target.src = staticIconsBaseURL + "/images/user/laptop-wooden-table.webp"; }} alt='text' className="img-fluid" style={{ objectFit: 'cover', }} /> */}
                                                        </div>
                                                    </SwiperSlide>
                                                    {/* ))): */}
                                                        {/* <SwiperSlide>
                                                        <div className="image_wrap">
                                                            <img
                                                                src="/images/user/laptop-wooden-table.webp"
                                                                alt="{assetList.leap_asset.asset_name}"
                                                                className="img-fluid"
                                                            />
                                                        </div>
                                                    </SwiperSlide>} */}
                                            </Swiper>
                                        </div>
                                    </div>
                                    <div className="asset_contentBox">
                                        <div className="status_btn">
                                            {assetList.date_of_return === null ? (
                                                <>
                                                    <div className="col-lg-2 text-center " style={{ color: "green" }}>Active</div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="col-lg-2 text-center  " style={{ color: "red" }}>Inactive</div>
                                                </>
                                            )}
                                        </div>
                                        <div className="user_asset_name user_asset_detail">Asset Name: <span>{assetList.leap_asset.asset_name}</span></div>
                                        <div className="user_asset_type user_asset_detail">Asset Type: <span>{assetList.leap_asset.leap_asset_type.asset_type}</span></div>
                                        <div className="user_asset_allotment_date user_asset_detail">Allotment Date: <span>{assetList.date_given}</span></div>
                                        <div className="user_return_date user_asset_detail">Date of return: <span>{assetList.date_of_return ? assetList.date_of_return : "--"}</span></div>
                                        <div className="user_configration user_asset_detail">Configuration: <span>{assetList.leap_asset.configuration}</span></div>
                                    </div>
                                </div>
                            ))
                            ) :  <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
                                <PageErrorCenterContent content={"None Allotted"}/>
                            </div>}
                        </div>
                    </div>
                </div>

                //   <LoadingDialog isLoading={true} />
            } />
            {/* </div> */}

            <div>
                <Footer />
            </div>
        </div>
    )
}

export default Asset;


