import React from 'react';
import {GetServerSideProps} from 'next';
import checkAdmin from "@component/utils/checkAdmin";
import ISupportRequest from "@component/models/ISupportRequest";
import adminApi from "@component/mixin/adminApi";
import SupportRequestCard from "@component/components/SupportRequestCard";
import Link from "next/link";

interface AdminPageProps {
    requests: ISupportRequest[]
}

const AdminPage: React.FC<AdminPageProps> = ({requests}) => {
    return (
        <div className="w-75 m-auto p-2">
            <p className="h1">Администрация</p>
            <div className={"d-flex flex-row flex-wrap gap-3 mb-3"}>
                <Link className={"btn btn-outline-info"} href={"/admin/restaurant"}>Добавить ресторан</Link>
                <Link className={"btn btn-outline-info"} href={"/admin/bookings"}>Просмотреть брони</Link>
            </div>
            <div className={"d-flex flex-row flex-wrap gap-3"}>
                {requests && requests.map((item) => (
                    <SupportRequestCard key={item.id} request={item}/>
                ))}
            </div>
        </div>
    );
};


export const getServerSideProps: GetServerSideProps = async (context) => {
    await checkAdmin(context)
    let requests: ISupportRequest[] = await adminApi.getSupportRequests(context)
    return {props: {requests}};
}

export default AdminPage;
