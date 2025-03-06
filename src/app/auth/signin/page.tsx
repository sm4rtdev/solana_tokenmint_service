"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useGlobalContext } from "@/context/global-context"
import { login } from "@/utils/api"


const SignIn = ({ searchParams}: {searchParams: { [key:string]: string}}) => {
    const redirect = searchParams.redirect || '/tokens';
    const router = useRouter()
    const { user, setUser } = useGlobalContext();
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    })
    const [errors, setErrors] = useState({
        email: "",
        password: "",
    })

    const validateForm = () => {
        const newErrors = {
            email: "",
            password: "",
        }
        let isValid = true

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
            rememberMe: checked,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsLoading(true)

        // Simulate API call
        try {
            const data = await login(formData.email, formData.password);

            if (data.ok) {
                localStorage.setItem('token', data.token);
                setUser({
                    ...data,
                    email: formData.email
                });
                toast.success(data.message);
                router.push(redirect, {scroll: true});
            }
            else { toast.warn(data.message) }
        } catch (error) {
            toast.error("Failed to sign in. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            router.push(redirect, {scroll: true});
        }
    }, [user])

    return (
        <div className="flex w-full justify-center pt-16">
            <Card>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4 pt-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isLoading}
                                aria-invalid={!!errors.email}
                            />
                            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
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

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remember-me"
                                checked={formData.rememberMe}
                                onCheckedChange={(checked) => handleCheckboxChange(checked as boolean)}
                            />
                            <Label htmlFor="remember-me" className="text-sm font-normal cursor-pointer">
                                Remember me
                            </Label>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>

                        <div className="text-center text-sm">
                            Don't have an account?{" "}
                            <Link href="/auth/register" className="text-primary hover:underline">
                                Sign up
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
export default SignIn;

