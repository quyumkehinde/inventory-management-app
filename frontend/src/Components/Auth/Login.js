import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import config from '../../config';

export default function Login() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const submitForm = (data) => {
        axios.post(`${config.BE_BASE_URL}/login`, data)
            .then(response => {
                console.log('success:', response);
            })
            .catch(error => {
                console.log('error', error);
            })
    }

    return (
        <form onSubmit={handleSubmit(submitForm)}>
            <h2 className='font-bold'>Please login</h2>
            <label>
                <p>Username</p>
                <input type="text" {...register('email')}/>
            </label>
            <label>
                <p>Password</p>
                <input type="password" {...register('password')} />
            </label>
            <div>
                <button type="submit">Submit</button>
            </div>
        </form>
    );
}