"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

const ChangePassword = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setConfirmShowPassword] = useState(false)
    const [showOldPassword, setShowOldPassword] = useState(false)
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
        oldPassword: "",
    })
    const [errors, setErrors] = useState({
        password: "",
        confirmPassword: "",
        oldPassword: "",
        isvalid: "",
    })

    const validateForm = () => {
        const newErrors = {
            password: "",
            confirmPassword: "",
            oldPassword: "",
            isvalid: ""
        }
        let isValid = true

        if (!formData.password) {
            newErrors.password = "Password is required"
            isValid = false
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Confirm Password is required"
            isValid = false
        }

        if (!formData.oldPassword) {
            newErrors.oldPassword = "Oldpassword is required"
            isValid = false
        }

        if (formData.password !== formData.confirmPassword && formData.password && formData.confirmPassword) {
            newErrors.isvalid = "Passwords do not match"
            toast.error(newErrors.isvalid);
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsLoading(true)
        const token = localStorage.getItem('token');


        // Simulate API call
        try {
            const response = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
                body: JSON.stringify({
                    password: formData.password,
                    oldPassword: formData.oldPassword,
                }),
            })
            const data = await response.json()

            if (data.ok) {
                localStorage.setItem('token', data.token);
                toast.success(data.message);

            }
            else { toast.warn(data.message) }
        } catch (error) {
            toast.error("Failed to sign in. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex w-full justify-center">
            <Card>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4 pt-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="oldpassword">Old Password</Label>
                            </div>
                            <div className="relative">
                                <Input
                                    id="oldPassword"
                                    name="oldPassword"
                                    type={showOldPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={formData.oldPassword}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    aria-invalid={!!errors.oldPassword}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                    disabled={isLoading}
                                >
                                    {showOldPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    <span className="sr-only">{showOldPassword ? "Hide password" : "Show password"}</span>
                                </Button>
                            </div>
                            {errors.oldPassword && <p className="text-sm text-destructive">{errors.oldPassword}</p>}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">New Password</Label>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    aria-invalid={!!errors.password}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                                </Button>
                            </div>
                            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Confirm Password</Label>
                            </div>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    aria-invalid={!!errors.confirmPassword}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setConfirmShowPassword(!showConfirmPassword)}
                                    disabled={isLoading}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
                                </Button>
                            </div>
                            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Change...
                                </>
                            ) : (
                                "Change Password"
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
export default ChangePassword;