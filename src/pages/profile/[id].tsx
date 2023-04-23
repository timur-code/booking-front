import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

interface ProfileProps {
    id: string;
}

const Profile: React.FC<ProfileProps> = ({ id }) => {
    return (
        <div>
            <h1>Restaurant {id}</h1>
            {/* Render your restaurant data */}
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.query;

    // Fetch restaurant data using the id, if necessary

    return {
        props: {
            id,
        },
    };
};

export default Profile;