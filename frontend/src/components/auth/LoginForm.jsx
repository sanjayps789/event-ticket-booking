"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loginAPI } from "@/services/api/auth/authAPI.js";
import { loginSuccess } from "@/redux/slices/authSlice";

function LoginForm() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({ email: "", password: "", role: "CUSTOMER" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const result = await loginAPI({
                email: formData.email,
                password: formData.password,
                role: formData.role,
            });

            if (result.status === 200) {
                dispatch(loginSuccess(result.data));

                const actualRole = result.data.data.role;
                if (actualRole === "ORGANIZER") {
                    router.push("/organizer/dashboard");
                } else {
                    router.push("/customer/dashboard");
                }
            } else {
                setError(result.response?.data?.message || "Login failed");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>

            {error && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-4">
                    {error}
                </p>
            )}

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Login as</label>
                <div className="flex items-center justify-start gap-6">
                    <div className="flex items-center">
                        <input
                            type="radio"
                            id="role-customer"
                            name="role"
                            value="CUSTOMER"
                            checked={formData.role === "CUSTOMER"}
                            onChange={handleChange}
                            className="w-4 h-4 mr-2"
                        />
                        <label htmlFor="role-customer">Customer</label>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="radio"
                            id="role-organizer"
                            name="role"
                            value="ORGANIZER"
                            checked={formData.role === "ORGANIZER"}
                            onChange={handleChange}
                            className="w-4 h-4 mr-2"
                        />
                        <label htmlFor="role-organizer">Organizer</label>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
                {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-sm text-center text-gray-600 mt-4">
                {` Don't have an account? `}
                <a href="/register" className="text-indigo-600 hover:underline">
                    Register here
                </a>
            </p>
        </form>
    );
}

export default LoginForm;