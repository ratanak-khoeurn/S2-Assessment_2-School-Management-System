import { useState } from 'react';
import { FormField, FormHeader, PasswordField, PrimaryButton, SocialButton, SocialDivider } from '../common/form';
import { GoogleIcon } from '../register/icons';

export default function LoginContainer() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="w-full max-w-xl px-1 sm:w-[90%] lg:w-[80%]">
            <FormHeader
                title="Sign in to your account"
                subtitle={
                    <>
                        Not a member?{' '}
                        <a href="/register" className="font-semibold text-blue-600 hover:text-blue-500">
                            Start for free
                        </a>
                    </>
                }
            />

            <div className="w-full">
                <form action="#" method="POST" className="space-y-5 sm:space-y-6">
                    <FormField
                        id="email"
                        label="Email address"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                    />

                    <PasswordField
                        id="password"
                        label="Password"
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        showPassword={showPassword}
                        onToggle={() => setShowPassword((value) => !value)}
                    />

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center">
                            <input id="terms" type="checkbox" className="h-4 w-4 rounded border-blue-400 text-blue-600 accent-blue-600 focus:ring-blue-500" />
                            <label htmlFor="terms" className="ml-3 text-sm font-medium text-gray-600">Remember me</label>
                        </div>
                        <a href="/forgot-password" className="text-sm font-medium text-blue-500 hover:underline">
                            Forgot password?
                        </a>
                    </div>

                    <div className="pt-2">
                        <PrimaryButton>Sign in</PrimaryButton>
                    </div>
                </form>

                <SocialDivider />

                <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
                    <SocialButton className="sm:max-w-xs">
                        <GoogleIcon />
                        <span>Continue with Google</span>
                    </SocialButton>
                    <a href="https://t.me" target="_blank" rel="noreferrer" className="flex w-full items-center justify-center gap-3 border border-blue-400 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none sm:max-w-xs">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnYrpwLTmU4XedNUe02vv2k5g0wXHmUPtUGZ6VnBvIng&s=10" alt="Telegram" className="h-5 w-5 object-contain" />
                        <span>Connect on Telegram</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
