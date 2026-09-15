export default function StreakIcon({
    active = false,
    size = 24,
    color = "currentColor",
    className = "",
}) {
    if (active) {
        // Streak On
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill={color}
                className={className}
            >
                <g clipPath="url(#clip0_streak_on)">
                    <path d="M20.3603 2.57973C20.6532 2.28687 21.1279 2.28685 21.4208 2.57973C21.7137 2.87261 21.7137 3.34739 21.4208 3.64027L18.0907 6.97035C17.7979 7.26319 17.3231 7.26319 17.0302 6.97035C16.7373 6.67747 16.7373 6.2027 17.0302 5.90981L20.3603 2.57973Z" />
                    <path d="M2.58002 2.57972C2.87291 2.28683 3.34768 2.28683 3.64057 2.57972L6.97065 5.9098C7.26346 6.2027 7.26351 6.67748 6.97065 6.97035C6.67778 7.26322 6.203 7.26316 5.9101 6.97035L2.58002 3.64027C2.28713 3.34738 2.28713 2.87262 2.58002 2.57972Z" />
                    <path d="M17.0292 17.0297C17.3221 16.7368 17.7969 16.7368 18.0898 17.0297L21.4199 20.3598C21.7127 20.6527 21.7127 21.1275 21.4199 21.4204C21.127 21.7132 20.6522 21.7132 20.3593 21.4204L17.0292 18.0903C16.7363 17.7974 16.7363 17.3226 17.0292 17.0297Z" />
                    <path d="M5.91008 17.0297C6.20298 16.7369 6.67775 16.7368 6.97063 17.0297C7.26347 17.3226 7.26347 17.7974 6.97063 18.0903L3.64055 21.4203C3.34767 21.7132 2.87289 21.7132 2.58 21.4203C2.28712 21.1275 2.28715 20.6527 2.58 20.3598L5.91008 17.0297Z" />
                    <path d="M19.7401 12.49L14.0901 13.71C13.9001 13.75 13.7501 13.9 13.7101 14.09L12.4901 19.74C12.3801 20.26 11.6301 20.26 11.5101 19.74L10.2901 14.09C10.2501 13.9 10.1001 13.75 9.91012 13.71L4.26012 12.49C3.74012 12.38 3.74012 11.63 4.26012 11.51L9.91012 10.29C10.1001 10.25 10.2501 10.1 10.2901 9.91L11.5101 4.26C11.6201 3.74 12.3701 3.74 12.4901 4.26L13.7101 9.91C13.7501 10.1 13.9001 10.25 14.0901 10.29L19.7401 11.51C20.2601 11.62 20.2601 12.37 19.7401 12.49Z" />
                </g>
                <defs>
                    <clipPath id="clip0_streak_on">
                        <rect width="24" height="24" fill="white" />
                    </clipPath>
                </defs>
            </svg>
        );
    }

    // Streak Off
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            className={className}
        >
            <g clipPath="url(#clip0_streak_off)">
                <path opacity="0.4" d="M17.5605 6.44L20.8905 3.11" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path opacity="0.4" d="M6.43938 6.44L3.10938 3.11" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path opacity="0.4" d="M17.5605 17.56L20.8905 20.89" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path opacity="0.4" d="M6.43938 17.56L3.10938 20.89" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 12L13.78 13.78L12 22L10.22 13.78L2 12L10.22 10.22L12 2L13.78 10.22L22 12Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <defs>
                <clipPath id="clip0_streak_off">
                    <rect width="24" height="24" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}
