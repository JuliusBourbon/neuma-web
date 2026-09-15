export default function CoinIcon({ size = 24, color = "currentColor", className = "" }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            className={className}
        >
            <g clipPath="url(#clip0_4418_4113)">
                <path d="M16.9492 16.9508C19.6792 14.2208 19.6792 9.78078 16.9492 7.05078" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7.04945 7.05078C4.31945 9.78078 4.31945 14.2208 7.04945 16.9508" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9.66992 13.6302C9.66992 14.5302 10.3699 15.2602 11.2299 15.2602H12.9899C13.7399 15.2602 14.3499 14.6202 14.3499 13.8402C14.3499 12.9902 13.9799 12.6802 13.4199 12.4902L10.6099 11.5102C10.0599 11.3202 9.6799 11.0102 9.6799 10.1602C9.6799 9.37024 10.2899 8.74023 11.0399 8.74023H12.7999C13.6599 8.74023 14.3599 9.47024 14.3599 10.3702" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 7.80078V16.2008" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 6C2.75 7.67 2 9.75 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2C10.57 2 9.2 2.3 7.97 2.85" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <defs>
                <clipPath id="clip0_4418_4113">
                    <rect width="24" height="24" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}