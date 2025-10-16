import { autoRedirectIfLoggedIn } from "@lib/permissions";
import { redirect } from "next/navigation";

export default async function Page() {
    await autoRedirectIfLoggedIn();

    redirect("/login");
}
