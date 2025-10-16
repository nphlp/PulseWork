"use client";

import Loader from "@comps/UI/loader";
import { signOut } from "@lib/authClient";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Logout() {
    // Logout management
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);

        const { data } = await signOut();

        if (data) {
            router.push("/");
        } else {
            throw new Error("Something went wrong...");
        }

        setTimeout(() => setIsLoading(false), 1000);
    };

    return (
        <button
            aria-label="Se déconnecter"
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-2 rounded-md p-1.5 hover:bg-gray-100"
        >
            {isLoading ? <Loader className="size-4" /> : <LogOut className="size-4" />}
            <span>Déconnexion</span>
        </button>
    );
}
