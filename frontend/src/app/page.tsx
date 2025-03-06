import Link from "next/link";
import "./globals.css";

export default function Home() {
  return (
    <>
      <div className="navbar shadow-xl bg-neutral">
        <div className="navbar-start ms-2">
          <Link href="/" passHref><p className="text-2xl font-bold btn btn-ghost mx-2">Astral</p></Link>
        </div>
        <div className="navbar-end">
          <Link href="/login"><button className="btn btn-outline btn-primary mx-1">Login</button></Link>
          <Link href="/register"><button className="btn btn-primary mx-1">Register</button></Link>
        </div>
      </div>
    </>
  );
}
