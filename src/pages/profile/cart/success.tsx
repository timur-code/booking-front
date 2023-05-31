import React from 'react';
import { GetServerSideProps } from 'next';
import cookie from "cookie";

type SuccessPageProps = {
    bookingId: string;
    isBookingSuccessful: boolean;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ bookingId, isBookingSuccessful }) => {
    return (
        <div className={"d-flex justify-content-center p-5"}>
            {isBookingSuccessful ? (
                <div className={"col-3"}>
                    <h1>Спасибо за ваш заказ</h1>
                    <h2>Пожалуйста, заходите ещё!</h2>
                </div>
            ) : (
                <p>Sorry, something went wrong with your order. Please try again.</p>
            )}
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { bookingId, userId } = context.query;

    let isBookingSuccessful = false;

    try {
        const res = await fetch(process.env.NEXT_PUBLIC_BOOKING_SERVICE + `/booking/${bookingId}/confirm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId})
        });

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
