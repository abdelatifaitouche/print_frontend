import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {useContext } from "react";
import AuthContext from "@/contexts/AuthContext";



export function LoginForm() {
  const { login , isLoading } = useContext(AuthContext);

  return (
    <form className={"flex flex-col gap-6"} onSubmit={login}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          {
            isLoading ? "loading ..." : "Sign in"
          }
        </Button>
      </div>
    </form>
  );
}
