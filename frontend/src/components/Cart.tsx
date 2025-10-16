export default function Cart(props: { cartItemCount?: number }) {
    return(
         <div className="relative cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-Black hover:text-blue-400"
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
              <span className="absolute -top-2 -right-2 bg-red-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full">
                {props.cartItemCount}
              </span>
            </div>
    )
}

