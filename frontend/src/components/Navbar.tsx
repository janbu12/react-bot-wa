import { NavLink } from "react-router-dom";
import { useWebSocket } from "../context/WebSocketContext";
import { useEffect, useState } from "react";

function Navbar() {
    const { isConnected } = useWebSocket();
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
        if (!isConnected) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }, [isConnected]);

    const navLinks = [
        { text: "Commands", href: "/commands", disabled: false },
        { text: "Logs", href: "/logs", disabled: false },
        { text: isConnected ? "Terhubung" : "Hubungkan Ulang", href: "/", disabled: isDisabled },
    ];

    return (
        <nav className="bg-primary">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <div className="flex items-center gap-2">
                    <img src="/logo.jpeg" alt="logo.jpeg" className="w-10 h-10 object-cover rounded" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
                        WhatsappBot
                    </span>
                </div>
                <button
                    data-collapse-toggle="navbar-default"
                    type="button"
                    className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg md:hidden focus:outline-none focus:ring-2 text-gray-400 hover:bg-gray-700 focus:ring-gray-600"
                    aria-controls="navbar-default"
                    aria-expanded="false"
                >
                    <span className="sr-only">Open main menu</span>
                    <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 17 14"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 1h15M1 7h15M1 13h15"
                        />
                    </svg>
                </button>
                <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
                        {navLinks.map(({ text, href, disabled }) => (
                            <li key={href}>
                                <NavLink
                                    to={disabled ? "#" : href} // Hanya nonaktifkan jika disabled
                                    className={({ isActive }) =>
                                        `block py-2 px-3 rounded-sm md:p-0 transition-all ${
                                            disabled
                                                ? "text-gray-500 cursor-not-allowed opacity-50" // Efek disabled
                                                : isActive
                                                ? "text-secondary"
                                                : "md:hover:bg-transparent text-white hover:text-secondary hover:bg-gray-700"
                                        }`
                                    }
                                >
                                    {text}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
