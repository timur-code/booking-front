import React from 'react';
import {GetServerSideProps} from 'next';
import adminApi from "@component/mixin/adminApi";
import cookie from 'cookie';
import dynamic from 'next/dynamic';

interface AdminPageProps {
    showModal: boolean;
}

const AdminPage: React.FC<AdminPageProps> = ({showModal}) => {
    const DynamicAdminLoginModal = dynamic(
        () => import('@component/modals/adminLogin'),
        { ssr: false }
    );

    return (
        <div>
            <p className="h1">Admin</p>
            {showModal && <DynamicAdminLoginModal show={true} onClose={() => {}} />}
        </div>
    );
};


export const getServerSideProps: GetServerSideProps = async (context) => {
    let showModal = true;

    // Parse cookies from the request headers
    const cookies = cookie.parse(context.req.headers.cookie || '');

    try {
        const isAdmin = await adminApi.isAdmin(cookies.access_token);
        console.log("isAdmin ",isAdmin)
        if (isAdmin) {
            showModal = false;
        }
    } catch (error) {
        console.error('Error checking admin status:', error);
    }

    return {
        props: { showModal },
    };
}

export default AdminPage;
