"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerAPI } from "@/services/api/auth/authAPI.js";
import { toast } from "react-toastify";
import Link from "next/link";

function RegisterForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "CUSTOMER",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await registerAPI(formData);
            if (result.status === 201) {
                toast.success("Registration successful! Please login.");
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
                setFormData({ name: "", email: "", password: "", role: "CUSTOMER" });
            } else {
                toast.error(result.response?.data?.message || "Registration failed");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-center">Create Account</h2>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full px-3 py-2 text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Register as</label>
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="CUSTOMER" className="text-[15px]">Customer</option>
                    <option value="ORGANIZER" className="text-[15px]">Organizer</option>
                </select>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
                {loading ? "Creating account..." : "Register"}
            </button>

            <p className="text-sm text-center text-gray-600 mt-4">
                Already have an account?{" "}
                <Link href="/login" title="Login Button" className="text-indigo-600 hover:underline transition-all duration-300">
                    Login here
                </Link>
            </p>
        </form>
    );
}

export default RegisterForm;