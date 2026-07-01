"use client";
import { useScroll } from "@/hooks/use-scroll";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MobileNav } from "@/components/mobile-nav";
import { useRouter } from "next/navigation";

export const navLinks = [];

export function Header() {
	const router 	= useRouter()
	const scrolled = useScroll(10);

	return (
		<header
			className={cn("sticky top-0 z-50 w-full border-transparent border-b", {
				"border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50":
					scrolled,
			})}
		>
			<nav className="flex h-14  items-center justify-between px-4">
				<div className="rounded-md p-2">
					<div className="relative w-20 md:w-20 lg:w-20  aspect-video cursor-pointer">
						<Image src={'/logo_transparent.png'} alt="NextAPI" fill style={{ objectFit: 'contain' }}/>
					</div>
				</div>
				<div className="hidden items-center gap-3 md:flex">
					<Button variant={'ghost'} className="cursor-pointer font-medium" onClick={()=>{
						router.push('/login')
					}}>Sign In</Button>
					<Button className="cursor-pointer font-medium" onClick={()=>{
						router.push('/register')
					}}>Get Started</Button>
				</div>
				<MobileNav />
			</nav>
		</header>
	);
}
