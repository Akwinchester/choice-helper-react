'use client'
import React, {useState} from 'react';
import Link from "next/link";
import {useForm} from "react-hook-form";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import {loginUser} from "@/api/users/login";
import {useRouter} from "next/navigation";


interface IAuthRegistration {
    title: string;
    buttonText: string;
}
function AuthRegistration({title, buttonText}: IAuthRegistration) {
    const {register, handleSubmit: handleFormSubmit, formState: {errors}, watch} = useForm()
    const [showPassword, setShowPassword] = useState(false);
    const passwordValue = watch('password', '')
    const router = useRouter()

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const loginFunc =  async (data: any) =>{
        try {
            const dataRes = await loginUser(data)
            console.log('dataRes',dataRes)
            if(dataRes?.access_token){
              await router.push('/profile')
            }
        }
        catch (error){
            console.error('Ошибка')
        }

    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">{title}</h2>
                <form onSubmit={handleFormSubmit(loginFunc)} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Имя пользователя
                        </label>
                        <input
                            type="text"
                            id="username"
                            {...register('username', { required: 'Введите имя пользователя' })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                            required
                        />
                        {errors.username?.message && (
                            <p className="text-red-500 text-sm mt-1">{String(errors.username.message)}</p>
                        )}
                    </div>
                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Пароль
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            {...register('password', { required: 'Введите пароль', minLength: { value: 6, message: 'Пароль должен быть не менее 6 символов' } })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                            required
                        />
                        {
                            passwordValue && (
                            showPassword ?
                        <span
                            className="absolute inset-y-0 top-6 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer"
                            onClick={togglePasswordVisibility}
                        >
                            <FontAwesomeIcon icon={faEye}/></span>
                                :
                        <span
                            className="absolute inset-y-0 top-6 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer"
                            onClick={togglePasswordVisibility}
                        >

                            <FontAwesomeIcon icon={faEyeSlash} /></span>
                            )}
                        {errors.password?.message && (
                            <p className="text-red-500 text-sm mt-1">{String(errors.password.message)}</p>
                        )}
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                        >
                            {buttonText}
                        </button>
                        <Link
                            href="/"
                            className="w-full flex justify-center mt-5 py-2 px-4 border border-gray-300 text-gray-600b rounded hover:bg-gray-100"
                        >
                            Назад на главную
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AuthRegistration;