"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { register } from "@/utils/api"
const Register = () => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        agreeToTerms: false,
    })
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        avatar: "",
        agreeToTerms: "",
    })

    const validateForm = () => {
        const newErrors = {
            name: "",
            email: "",
            password: "",
            avatar: "",
            agreeToTerms: "",
        }
        let isValid = true

        if (!formData.name.trim()) {
            newErrors.name = "Name is required"
            isValid = false
        }

        if (!formData.email) {
            newErrors.email = "Email is required"
            isValid = false
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid"
            isValid = false
        }

        if (!formData.password) {
            newErrors.password = "Password is required"
            isValid = false
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters"
            isValid = false
        }

        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = "You must agree to the terms and conditions"
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

    const handleCheckboxChange = (checked: boolean) => {
        setFormData((prev) => ({
            ...prev,
            agreeToTerms: checked,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsLoading(true)

        // Simulate API call
        try {
            const res = await register(formData.name, formData.email, formData.password);

            if (res) {
                toast.success("You have successfully created an account.")
            } else {
                toast.warn("You already have an account.")
            }

            router.push("/auth/signin")
        } catch (error) {
            toast.error("Failed to create account. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex w-full justify-center pt-16">
            <Card className="bg-[#121212] text-white border-0 py-6">
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4 pt-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="John Doe"
                                className="bg-[#090909]"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={isLoading}
                                aria-invalid={!!errors.name}
                            />
                            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email-signup">Email</Label>
                            <Input
                                id="email-signup"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                className="bg-[#090909]"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isLoading}
                                aria-invalid={!!errors.email}
                            />
                            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password-signup">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password-signup"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="bg-[#090909]"
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
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="terms"
                                    checked={formData.agreeToTerms}
                                    onCheckedChange={(checked) => handleCheckboxChange(checked as boolean)}
                                />
                                <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
                                    I agree to the terms and conditions
                                </Label>
                            </div>
                            {errors.agreeToTerms && <p className="text-sm text-destructive">{errors.agreeToTerms}</p>}
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit" className="hover:to-[#ba4bff] hover:from-[#ba4bff] rounded-full w-full bg-gradient-to-r to-[#351166] from-[#b55ced]" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </Button>

                        <div className="text-center text-sm">
                            Already have an account?{" "}
                            <Link href="signin" className="font-bold text-[16px] hover:underline">
                                Sign in
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
export default Register;
