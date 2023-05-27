import cookie from "cookie";
import adminApi from "../mixin/adminApi";
import {GetServerSidePropsContext, PreviewData} from "next";
import {ParsedUrlQuery} from "querystring";

const checkAdmin = async (context: GetServerSidePropsContext) => {
    try {
        const cookies = cookie.parse(context.req.headers.cookie || '');
        const res = await adminApi.isAdmin(cookies.access_token);


        if (res) {
            return {props: {}};
        }
    } catch (error) {
        console.log(error);
    }

    console.log("NOT ADMIN")
    if (context.res) {
        context.res.writeHead(302, {Location: '/admin/login'});
        context.res.end();
    }

    return {props: {}};
};

export default checkAdmin;
