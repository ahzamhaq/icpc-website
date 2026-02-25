"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";


import { getProfile, isProfileComplete } from "@/lib/profileService";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const setHasProfile = useAuthStore((state) => state.setHasProfile);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await api.post("/auth/login", values);
      const { user, token } = response.data.data;
      login(user, token);

      // Check if profile is fully completed (not just a skeleton)
      try {
        const profile = await getProfile();
        const profileExists = isProfileComplete(profile);
        setHasProfile(profileExists);

        if (!profileExists) {
          toast.success("Please complete your profile.");
          router.push("/profile");
          return;
        }
      } catch {
        setHasProfile(false);
        toast.success("Please complete your profile.");
        router.push("/profile");
        return;
      }

      toast.success("Logged in successfully!");
      router.push("/dashboard");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string; error?: string } } };
      toast.error(err.response?.data?.error || err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      {/* Theme toggle — top right */}
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <div className="border border-border w-full max-w-sm">
        <div className="p-4">
          <div className="text-sm text-muted-foreground">&gt; login:</div>
          <Link href="/" className="text-xl font-bold text-foreground hover:text-[#3FB950] transition-colors">ICPC USICT</Link>
        </div>
        <div className="p-4 pt-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>email:</FormLabel>
                    <FormControl>
                      <Input placeholder="user@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>password:</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="********"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  forgot password?
                </Link>
              </div>

              <button
                className="w-full text-sm border border-foreground px-4 py-2 text-foreground hover:bg-muted transition-colors"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    authenticating...
                  </>
                ) : (
                  "[ ENTER ]"
                )}
              </button>
            </form>
          </Form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                or
              </span>
            </div>
          </div>

          <GoogleSignInButton text="sign in with google" />

          <p className="text-center text-xs text-muted-foreground mt-4">
            no account?{" "}
            <Link
              href="/register"
              className="text-[#58A6FF] hover:underline"
            >
              register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
