/**
 * @page Login
 * 
 * This is the login page for the application, allowing users to authenticate using their email and password.
 * It includes:
 * - Form fields for email and password with validation
 * - Password visibility toggle
 * - Error handling to display authentication errors
 * - Redirect to the home page on successful login
 * 
 * The form sends a POST request to the API to authenticate the user, and on success, a JWT token is stored.
 * 
 * @component LoginForm
 * 
 * @remarks
 * - The form uses local state to track form data and error messages.
 * - A 3-second timeout clears error messages once they are displayed.
 * - The password input field toggles between plain text and password for better user experience.
 */
"use client";
import {useEffect, useRef, useState} from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useUserMessages } from "@/context/UserMessageContext";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";

interface UserLogin{
    email: string,
    password: string,
}

export default function Login() {
    const {login} = useAuth();
    const {error, info, success} = useUserMessages();
    const formRef = useRef<HTMLFormElement>(null);
    const [formData, setFormData] = useState<UserLogin>({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const loginResponse = await fetch("http://localhost:3001/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                }),
                credentials: "include"
            });

            if(!loginResponse.ok) {
                var contentType = loginResponse.headers.get('content-type')
                if (contentType && contentType.indexOf('application/json') !== -1) {
                    const data = await loginResponse.json();
                    error(data.error);
                    return;
                    //throw Error(`Error making request: ${loginResponse.status.toString()}: ${data.error}`)
                } else {
                    throw Error(`Error making request: ${loginResponse.status.toString()}`)
                }
            }

            const data = await loginResponse.json();
            login(data.token);

        } catch (error) {
            console.error(error);
            // do something to indicate failure
        }
    }

    //TODO: handle invalid logins (what does this mean??)
    return (
        <>
            <div className="w-full grid place-items-center py-3">
                <Link href="/" passHref><p className="text-2xl py-1 font-bold rounded btn btn-ghost text-center mx-auto">Astral</p></Link>
            </div>
            <div className="flex h-screen w-screen">
                <div className="rounded-xl hero bg-base-200 p-3 w-full sm:w-2/3 w-2/3 md:w-1/2 m-auto">
                    <div className="flex flex-col md:flex-none hero-content md:flex-row-reverse p-3">
                        <div className="text-left">
                            <h1 className="text-5xl font-bold">Login</h1>
                        </div>

                        <form ref={formRef} onSubmit={handleSubmit} noValidate className="fieldset">
                            <input
                                type="email"
                                className="input validator"
                                placeholder="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                pattern="^\S+@\S+\.\S+$"
                                required />
                            <p className="hidden validator-hint">
                                Invalid email address.
                            </p>
                            <div className="relative">
                                <input
                                    type={showPassword ? "input" : "password"}
                                    className="input validator"
                                    placeholder="Password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required />
                                <button type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-500">
                                    {showPassword ? <RiEyeLine size={26} /> : <RiEyeCloseLine size={26} />}
                                </button>
                            </div>
                            <div><a className="link link-hover">Forgot password?</a></div>
                            <input type="submit" className="btn btn-neutral mt-4" value="Login" />
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}