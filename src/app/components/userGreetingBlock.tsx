
// user dashboard greeting

'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';

import ShowAlertMessage from '@/app/components/alert'
import { ALERTMSG_addAssetSuccess, ALERTMSG_exceptionString } from '@/app/pro_utils/stringConstants'

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import LoadingDialog from './PageLoader';
import { DashboardGreeting } from '../models/userDashboardModel';

const GreetingBlock = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const { contextClientID, contextCustomerID, setGlobalState } = useGlobalContext();
    const [greetArray, setGreetData] = useState<DashboardGreeting>({
        id: '',
        created_at: '',
        greeting_topic: '',
        greeting_msg: '',
        img_url: '',
    });
    const [isLoading, setLoading] = useState(false);
    const [fact, setFact] = useState('');

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
        fetchRandomFact();
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
    const fetchRandomFact = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://uselessfacts.jsph.pl/random.json?language=en");
            const data = await response.json();
            setFact(data.text);
        } catch (error) {
            console.error("Error fetching fact:", error);
            setFact("Couldn't load fact");
        } finally {
            setLoading(false);
        }
    };
    const fetchData = async () => {
        setLoading(true);
        try {
            
            const res = await fetch(`/api/users/dashboardGreeting`, {
                method: "POST",
                body: JSON.stringify({
                    "customer_id": contextCustomerID
                }),
            });
            const response = await res.json();

            if (response.status == 1) {
                const greetData = response.data[0];
                setGreetData(greetData)
                setLoading(false);
            } else {
                setLoading(false);
                setAlertTitle("Error")
                setAlertStartContent("Failed to load assets");
                setAlertForSuccess(2)
            }
        } catch (error) {
            setLoading(false);
            console.error("Error fetching user data:", error);
            setShowAlert(true);
            setAlertTitle("Exception")
            setAlertStartContent(ALERTMSG_exceptionString);
            setAlertForSuccess(2)
        }
    };

    return (
        <div className="new_personalize_greeting_mainbox">
            <LoadingDialog isLoading={isLoading} />
            {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                setShowAlert(false)
            }} onCloseClicked={function (): void { 
                setShowAlert(false)
            }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
            <div className="new_personalised_leftbox">
                <h3>{greetArray.greeting_topic}</h3>
                <div className='user_greating_box_para'>
                    <p className='m-0'>{fact}</p>
                </div>
            </div>
        </div>
    )
}
export default GreetingBlock