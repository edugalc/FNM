import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

export default function Cart() {
  const count = useCartStore((state) => state.count);

  return (
    <Link href="/cart">
      <div className="relative cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-black hover:text-blue-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.2 6h12.4L19 13M7 13H3m16 0l1 6H6"
          />
        </svg>

        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </div>
    </Link>
  );
}
