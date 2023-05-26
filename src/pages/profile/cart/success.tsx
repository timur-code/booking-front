import React from 'react';
import { GetServerSideProps } from 'next';
import cookie from "cookie";

type SuccessPageProps = {
    bookingId: string;
    isBookingSuccessful: boolean;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ bookingId, isBookingSuccessful }) => {
    return (
        <div>
            {isBookingSuccessful ? (
                <>
                    <h1>Thank you for your order</h1>
                    <p>Your booking ID is: {bookingId}</p>
                </>
            ) : (
                <p>Sorry, something went wrong with your order. Please try again.</p>
            )}
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { bookingId } = context.query;
    const cookies = cookie.parse(context.req.headers.cookie || '');

    let isBookingSuccessful = false;
    console.log(`COOKIE ${cookies.access_token}`)

    try {
        const res = await fetch(process.env.NEXT_PUBLIC_BOOKING_SERVICE + `/booking/${bookingId}/confirm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Include the access token in the headers if required
                'Authorization': `Bearer ${cookies.access_token}`,
            }
        });

        console.log("RESULT: ", res);

        if (res.ok) {
            isBookingSuccessful = true;
        } else {
            console.error('Failed to post booking:', res.body);
        }
    } catch (error) {
        console.error('Failed to post booking:', error);
    }

    return {
        props: {
            bookingId: bookingId as string,
            isBookingSuccessful,
        },
    }
}

export default SuccessPage;
