import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useUserQuery } from '../features/slices/user.slice';

export const UserIsLoggedIn = () => {
    const navigate = useNavigate();

    const { error } = useUserQuery();
    console.log({ error })

    useEffect(() => {
        if (error) {
            navigate('/login');
        }
    }, [error]);
};
