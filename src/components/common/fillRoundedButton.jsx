export default function FillRoundedButton({ text, href, classes = '', onClick }) {
    if (onClick) {
        return (
            <button
                type="button"
                onClick={onClick}
                className={`rounded-full ${classes} px-8 py-3 cursor-pointer transition duration-200`}
            >
                {text}
            </button>
        );
    }

    return (
        <a href={href || '#'} className={`rounded-full ${classes} px-8 py-3 cursor-pointer transition duration-200`}>
            {text}
        </a>
    );
}