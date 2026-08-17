import { useState } from 'react';
import { FormField, FormHeader, PasswordField, PrimaryButton, SocialButton, SocialDivider } from '../common/form';
import { GoogleIcon } from './icons';

export default function RegisterContainer() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="w-full max-w-xl px-1 sm:w-[90%] lg:w-[80%]">
            <FormHeader title="Create your account" subtitle="create your account to explore more about our school!" />

            <div className="w-full">
                <form action="#" method="POST" className="space-y-5 sm:space-y-6">
                    <div className="flex w-full flex-col gap-5 sm:flex-row">
                        <div className="w-full">
                            <FormField id="firstName" label="First Name" placeholder="First name" />
                        </div>
                        <div className="w-full">
                            <FormField id="lastName" label="Last Name" placeholder="Last name" />
                        </div>
                    </div>

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

                    <PasswordField
                        id="confirmPassword"
                        label="Confirm Password"
                        placeholder="Confirm your password"
                        autoComplete="new-password"
                        showPassword={showConfirmPassword}
                        onToggle={() => setShowConfirmPassword((value) => !value)}
                    />

                    <div className="pt-2">
                        <PrimaryButton>Sign Up</PrimaryButton>
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