"use client";
import {useRef, useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";

interface UserRegistration {
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    verify_password: string
}

export default function Register() {
    const router = useRouter();
    const {login} = useAuth();
    const formRef = useRef<HTMLFormElement>(null);
    const [formData, setFormData] = useState<UserRegistration>({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        verify_password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showVerifyPassword, setShowVerifyPassword] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 

        if(formRef.current?.checkValidity()) {
            if(formData.password !== formData.verify_password) {
                alert("Passwords do not match");
                return;
            }
            console.log("Form submitted");
            console.log(formData);

            try {
                const regResponse = await fetch ("http://localhost:3001/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                    credentials: "include"
                });

                if(!regResponse.ok) {
                    var contentType = regResponse.headers.get('content-type')
                    if (contentType && contentType.indexOf('application/json') !== -1) {
                        const data = await regResponse.json();
                        setError(data.error);
                        return;
                        //throw Error(`Error making request: ${regResponse.status.toString()}: ${data.error}`)
                    } else {
                        throw Error(`Error making request: ${regResponse.status.toString()}`)
                    }
                }

                // do something to indicate success
                // automatically log in
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
                    throw new Error("Login failed");
                }

                const data = await loginResponse.json();
                login(data.token);

            } catch (error) {
                console.error(error);
                // do something to indicate failure
            }

        } else {
            formRef.current?.reportValidity();
        }
    }

    //TODO: Test if mismatching but otherwise valid passwords is working? 
    return (
        <>
            <div className="w-full grid place-items-center py-3">
                <Link href="/" passHref><p className="text-2xl py-1 font-bold rounded btn btn-ghost text-center mx-auto">Astral</p></Link>
            </div>
            <div className="flex h-screen w-screen">
                <div className="rounded-xl hero bg-base-200 p-3 w-full sm:w-2/3 w-2/3 md:w-1/2 m-auto">
                    <div className="flex flex-col md:flex-none hero-content md:flex-row-reverse w-full p-2">
                        <div className="text-left">
                            <h1 className="text-5xl font-bold">Register</h1>
                        </div>
                        <form ref={formRef} onSubmit={handleSubmit} noValidate className="fieldset w-full">
                            <input
                                type="input"
                                className="input validator w-full"
                                placeholder="First Name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                minLength={1}
                                maxLength={30}
                                required />
                            <p className="hidden validator-hint">Must be 1-30 characters.</p>
                            <input type="input"
                                className="input validator w-full"
                                placeholder="Last Name"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                minLength={1}
                                maxLength={30}
                                required />
                            <p className="hidden validator-hint">Must be 1-30 characters.</p>
                            <input
                                type="email"
                                className="input validator w-full"
                                placeholder="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                pattern="^\S+@\S+\.\S+$"
                                required />
                            <p className="hidden validator-hint">
                                Must be a valid email address.
                            </p>
                            <div className="relative">
                                <input
                                    type={showPassword ? "input" : "password"}
                                    className="input validator w-full"
                                    placeholder="Password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$"
                                    minLength={12}
                                    required />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-500">
                                    {showPassword ? <RiEyeLine size={26} /> : <RiEyeCloseLine size={26} />}
                                </button>
                            </div>

                            <p className="hidden validator-hint">
                                Must be more than 12 characters, including
                                <br />At least one number
                                <br />At least one lowercase letter
                                <br />At least one uppercase letter
                                <br />At least one special character
                            </p>
                            <div className="relative">
                                <input
                                    type={showVerifyPassword ? "input" : "password"}
                                    className="input validator w-full"
                                    placeholder="Verify Password"
                                    name="verify_password"
                                    value={formData.verify_password}
                                    onChange={handleChange}
                                    required />
                                <button
                                    type="button"
                                    onClick={() => setShowVerifyPassword(!showVerifyPassword)}
                                    className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-500">
                                    {showVerifyPassword ? <RiEyeLine size={26} /> : <RiEyeCloseLine size={26} />}
                                </button>
                            </div>
                            <div><a className="link link-hover">Forgot password?</a></div>
                            <input type="submit" className="btn btn-neutral mt-4" value="Register" />
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