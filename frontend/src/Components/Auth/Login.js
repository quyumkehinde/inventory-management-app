import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useJwt } from 'react-jwt';
import config from '../../config';

export default function Login() {
    const { register, handleSubmit, formState: { errors: formErrors } } = useForm();
    const [ error, setError ] = useState();
    const { reEvaluateToken, decodedToken, isExpired } = useJwt(config.TOKEN);
    const submitForm = (data) => {
        setError(null);
        axios.post(`${config.BE_BASE_URL}/login`, data)
            .then(response => {
                const token = response.data.data.token;
                localStorage.setItem('token', token);
                reEvaluateToken(token);
            })
            .catch(response => {
                setError(response.response.data.message);
            });
    };
    useEffect(() => {
        !isExpired
            && decodedToken
            && window.location.replace(`/${decodedToken.userType}/dashboard`);
    }, [isExpired, decodedToken]);

    return (
        <section className='flex justify-center'>
            <form onSubmit={handleSubmit(submitForm)} className='w-1/2 border border-gray-300 p-20'>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Login</h3>
                <p className="mt-1 text-sm text-gray-500"> Enter your login details to continue. </p>
                <span className='text-red-500'> {error} </span>
                <div className='mt-6'>
                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        {...register('email', { required: true })}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border py-1 border-gray-300 rounded-md"
                    />
                    <span className='text-red-500 text-sm'>
                        {formErrors.email && 'This field is required'}
                    </span>
                </div>
                <div className='mt-6'>
                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        type="password"
                        {...register('password', { required: true })}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border py-1 border-gray-300 rounded-md"
                    />
                    <span className='text-red-500 text-sm'>
                        {formErrors.password && 'This field is required'}
                    </span>
                </div>
                <div className="flex justify-end mt-10">
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Login
                    </button>
                </div>
            </form>
        </section>
    );
}