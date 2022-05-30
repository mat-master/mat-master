import Head from "next/head";
import Navbar from "./nav-bar";
import { useEffect } from "react"

interface PageLayoutProps {
    className?: string,
    children?: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ className, children }: PageLayoutProps) => {
    return (<div>
        <Head>
            <title>Mat Master</title>
            <meta name="description" content="Mat Master" />
            <link rel="icon" href="/favicon.ico" />
            <link rel="stylesheet" href="https://use.typekit.net/cbb4avu.css" />
        </Head>
        <Navbar />
        <main className={`${className} mt-`}>{children}</main>
    </div>);
};

export default PageLayout;