"use client";
import {useEffect, useRef, useState} from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";

interface UserLogin{
    email: string,
    password: string,
}

export default function Login() {
    const {login} = useAuth();
    const formRef = useRef<HTMLFormElement>(null);
    const [formData, setFormData] = useState<UserLogin>({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
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
                    setError(data.error);
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

    // TODO: fade in/fade out animation
    useEffect(() => {
        if(error) {
            const timer = setTimeout(() => {setError("")}, 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    //TODO: handle invalid logins
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
            {error && (
                <div role="alert" className="absolute m-5 bottom-0 w-fit alert alert-error">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Error! {error}</span>
                </div>
            )}
        </>
    )
}