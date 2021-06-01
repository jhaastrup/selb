import React from "react";

export const LocationIcon = ({ color = "currentColor", size = "24" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
            <path fill="none" d="M0 0h24v24H0V0z"></path>
            <path fill={color} d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"></path>
        </svg>
    );
};

export const ToggleOnIcon = ({ color = "currentColor", size = "24" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
            <path
                fill={color}
                d="M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"
            ></path>
            <path fill="none" d="M0 0h24v24H0z"></path>
        </svg>
    );
};

export const SortIcon = ({ color = "currentColor", size = "24" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
            <path fill={color} d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"></path>
            <path fill="none" d="M0 0h24v24H0z"></path>
        </svg>
    );
};

export const ToggleOffIcon = ({ color = "currentColor", size = "24" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
            <path
                fill={color}
                d="M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zM7 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"
            ></path>
            <path fill="none" d="M0 0h24v24H0z"></path>
        </svg>
    );
};

export const BookmarkIcon = ({ color = "currentColor", size = "24" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
            <path fill="none" d="M0 0h24v24H0V0z"></path>
            <path fill={color} d="M19 3H5v18l7-3 7 3V3z"></path>
        </svg>
    );
};
export const BookmarkOutlineIcon = ({ color = "currentColor", size = "24" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
            <path fill="none" d="M0 0h24v24H0V0z"></path>
            <path fill={color} d="M19 3H5.01L5 21l7-3 7 3V3zm-2 15l-5-2.18L7 18V5h10v13z"></path>
        </svg>
    );
};
export const FavoriteIcon = ({ color = "currentColor", size = "24" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
            <path fill="none" d="M0 0h24v24H0V0z"></path>
            <path
                fill={color}
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            ></path>
        </svg>
    );
};
export const FavoriteOutlineIcon = ({ color = "currentColor", size = "24" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
            <path fill="none" d="M0 0h24v24H0V0z"></path>
            <path
                fill={color}
                d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"
            ></path>
        </svg>
    );
};

export const CloseIcon = ({ color = "currentColor", size = "24" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
            <path fill={"none"} d="M0 0h24v24H0V0z" />
            <path fill={color} d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
        </svg>
    );
};

export const ChatIcon = ({ color = "currentColor", size = "24" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
            <path fill={color} d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"></path>
            <path fill="none" d="M0 0h24v24H0z"></path>
        </svg>
    );
};

export const GroupAddIcon = ({ color = "currentColor", size = "24" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path
                fill={color}
                d="M8 10H5V7H3v3H0v2h3v3h2v-3h3v-2zm10 1c1.66 0 2.99-1.34 2.99-3S19.66 5 18 5c-.32 0-.63.05-.91.14.57.81.9 1.79.9 2.86s-.34 2.04-.9 2.86c.28.09.59.14.91.14zm-5 0c1.66 0 2.99-1.34 2.99-3S14.66 5 13 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm6.62 2.16c.83.73 1.38 1.66 1.38 2.84v2h3v-2c0-1.54-2.37-2.49-4.38-2.84zM13 13c-2 0-6 1-6 3v2h12v-2c0-2-4-3-6-3z"
            ></path>
        </svg>
    );
};

export const PersonIcon = ({ color = "currentColor", size = "24" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
            <path fill={color} d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
            <path fill="none" d="M0 0h24v24H0z"></path>
        </svg>
    );
};

export const CopyIcon = ({ color = "currentColor", size = "24" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path
                fill={color}
                d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm-1 4l6 6v10c0 1.1-.9 2-2 2H7.99C6.89 23 6 22.1 6 21l.01-14c0-1.1.89-2 1.99-2h7zm-1 7h5.5L14 6.5V12z"
            ></path>
        </svg>
    );
};

export const RadioCheckedIcon = ({ color = "currentColor", size = "24" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
            <path
                fill={color}
                d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
            ></path>
            <path fill="none" d="M0 0h24v24H0z"></path>
        </svg>
    );
};

export const RadioUncheckedIcon = ({ color = "currentColor", size = "24" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
            <path
                fill={color}
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
            ></path>
            <path fill="none" d="M0 0h24v24H0z"></path>
        </svg>
    );
};

export const CheckIntermediateIcon = ({ color = "currentColor", size = "24" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
            <path fill="none" d="M0 0H24V24H0z"></path>
            <path fill={color} d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"></path>
        </svg>
    );
};

export const CheckBoxIcon = ({ color = "currentColor", size = "24" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path fill={color} d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
        </svg>
    );
};

export const CheckOutlineIcon = ({ color = "currentColor", size = "24" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
            <path fill={color} d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
            <path fill="none" d="M0 0h24v24H0z"></path>
        </svg>
    );
};



export const ChevronForward = ({ color = "currentColor", size = "24" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill="none"
            stroke={color}
            // strokeLinecap="round"
            // strokeLinejoin="round"
            strokeWidth="2"
            className="feather feather-chevron-right"
            viewBox="0 0 24 24"
        >
            <path d="M9 18L15 12 9 6"></path>
        </svg>
    );
};

export const ChevronBackward = ({ color = "currentColor", size = "24" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill="none"
            stroke={color}
            // strokeLinecap="round"
            // strokeLinejoin="round"
            strokeWidth="2"
            className="feather feather-chevron-left"
            viewBox="0 0 24 24"
        >
            <path d="M15 18L9 12 15 6"></path>
        </svg>
    );
};

export const ChevronUp = ({ color = "currentColor", size = "24" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill="none"
            stroke={color}
            // strokeLinecap="round"
            // strokeLinejoin="round"
            strokeWidth="2"
            className="feather feather-chevron-up"
            viewBox="0 0 24 24"
        >
            <path d="M18 15L12 9 6 15"></path>
        </svg>
    );
};

export const ChevronDown = ({ color = "currentColor", size = "24", id }) => {
    return (
        <svg
            id={id}
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill="none"
            stroke={color}
            // strokeLinecap="round"
            // strokeLinejoin="round"
            strokeWidth="2"
            className="feather feather-chevron-down"
            viewBox="0 0 24 24"
        >
            <path d="M6 9L12 15 18 9"></path>
        </svg>
    );
};

export const SearchIcon = ({ color = "currentColor", size = "24" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill="none"
            stroke={color}
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-search"
        >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    );
};

export const PhoneInTalkIcon = ({ color = "currentColor", size = "24" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
            <path fill="none" d="M0 0h24v24H0V0z"></path>
            <path
                fill={color}
                d="M19 12h2a9 9 0 00-9-9v2c3.87 0 7 3.13 7 7zm-4 0h2c0-2.76-2.24-5-5-5v2c1.66 0 3 1.34 3 3zm-1.79 5.37a15.045 15.045 0 01-6.59-6.59l2.53-2.53L8.54 3H3.03C2.45 13.18 10.82 21.55 21 20.97v-5.51l-5.27-.61-2.52 2.52z"
            ></path>
        </svg>
    );
};

export const ProfileIcon = ({ color = "currentColor", size = "24" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
            <path fill="none" d="M0 0h24v24H0V0z"></path>
            <path
                fill={color}
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2a7.2 7.2 0 01-6-3.22c.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08a7.2 7.2 0 01-6 3.22z"
            ></path>
        </svg>
    );
};

export const ShoppingCartIcon = ({ color = "currentColor", size = "24" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
            <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
                <g transform="translate(0 2)">
                    <path fill={color} d="M0 5h24v10.374C24 18.48 21.544 21 18.514 21H5.486C2.456 21 0 18.481 0 15.374V5z"></path>
                    <path stroke={color} strokeWidth="2.595" d="M5 6V0h14v6"></path>
                </g>
            </g>
        </svg>
    );
};

export const FilterIcon = ({ color = "currentColor", size = "24" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
            <path fill="none" d="M0 0h24v24H0V0z" />
            <path fill={color} d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
        </svg>
    );
};

export const AddIcon = ({ color = "currentColor", size = "24" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
            <path fill="none" d="M0 0h24v24H0V0z"></path>
            <path fill={color} d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
        </svg>
    );
};

export const RemoveIcon = ({ color = "currentColor", size = "24" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
            <path fill="none" d="M0 0h24v24H0V0z"></path>
            <path fill={color} d="M19 13H5v-2h14v2z"></path>
        </svg>
    );
};

export const ReloadIcon = ({ strokeWidth = "2", color = "currentColor", size = "24" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path
                fill={color}
                d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
            ></path>
        </svg>
    );
};

export const HistoryIcon = ({ color = "currentColor", size = "24" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path
                fill={color}
                d="M13 3a9 9 0 00-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0013 21a9 9 0 000-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"
            ></path>
        </svg>
    );
};

export const ArrowDown = ({ strokeWidth = "2", color = "currentColor", size = "24" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={strokeWidth}
            className="feather feather-arrow-down"
            viewBox="0 0 24 24"
        >
            <path d="M12 5L12 19"></path>
            <path d="M19 12L12 19 5 12"></path>
        </svg>
    );
};

export const ArrowUp = ({ strokeWidth = "2", color = "currentColor", size = "24" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={strokeWidth}
            className="feather feather-arrow-up"
            viewBox="0 0 24 24"
        >
            <path d="M12 19L12 5"></path>
            <path d="M5 12L12 5 19 12"></path>
        </svg>
    );
};

export const ArrowLeft = ({ strokeWidth = "2", color = "currentColor", size = "24" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={strokeWidth}
            className="feather feather-arrow-left"
            viewBox="0 0 24 24"
        >
            <path d="M19 12L5 12"></path>
            <path d="M12 19L5 12 12 5"></path>
        </svg>
    );
};

export const ArrowRight = ({ strokeWidth = "2", color = "currentColor", size = "24" }) => {
    return (
        <svg
            width={size}
            height={size}
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={strokeWidth}
            className="feather feather-arrow-right"
            viewBox="0 0 24 24"
        >
            <path d="M5 12L19 12"></path>
            <path d="M12 5L19 12 12 19"></path>
        </svg>
    );
};

export const ArrowUpRight = ({ strokeWidth = "2", color = "currentColor", size = "24" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={strokeWidth}
            className="feather feather-arrow-up-right"
            viewBox="0 0 24 24"
        >
            <path d="M7 17L17 7"></path>
            <path d="M7 7L17 7 17 17"></path>
        </svg>
    );
};

export const ArrowDownLeft = ({ strokeWidth = "2", color = "currentColor", size = "24" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={strokeWidth}
            className="feather feather-arrow-down-left"
            viewBox="0 0 24 24"
        >
            <path d="M17 7L7 17"></path>
            <path d="M17 17L7 17 7 7"></path>
        </svg>
    );
};

export const StarIcon = ({ strokeWidth = "2", fillColor = "none", color = "currentColor", size = "24", }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill={fillColor}
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={strokeWidth}
            className="feather feather-star"
            viewBox="0 0 24 24"
        >
            <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z"></path>
        </svg>
    );
};


export const AlertIcon = ({ strokeWidth = "2", color = "currentColor", size = "24" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={strokeWidth}
            className="feather feather-alert-circle"
            viewBox="0 0 24 24"
        >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 8L12 12"></path>
            <path d="M12 16L12.01 16"></path>
        </svg>
    );
};

export const ClockIcon = ({ strokeWidth = "2", color = "currentColor", size = "24" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={strokeWidth}
            className="feather feather-clock"
            viewBox="0 0 24 24"
        >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 6L12 12 16 14"></path>
        </svg>
    );
};

export const CheckCircleIcon = ({ strokeWidth = "2", color = "currentColor", size = "24" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={strokeWidth}
            className="feather feather-check-circle"
            viewBox="0 0 24 24"
        >
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
            <path d="M22 4L12 14.01 9 11.01"></path>
        </svg>
    );
};

export const CheckIcon = ({ strokeWidth = "2", color = "currentColor", size = "24" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={strokeWidth}
            className="feather feather-check"
            viewBox="0 0 24 24"
        >
            <path d="M20 6L9 17 4 12"></path>
        </svg>
    );
};

export const ShieldIcon = ({ strokeWidth = "2", color = "currentColor", size = "24" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={strokeWidth}
            className="feather feather-shield"
            viewBox="0 0 24 24"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
    );
};

export const LockIcon = ({ strokeWidth = "2", color = "currentColor", size = "24" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={strokeWidth}
            className="feather feather-lock"
            viewBox="0 0 24 24"
        >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0110 0v4"></path>
        </svg>
    );
};

export const ArrowCircleDown = ({ strokeWidth = "2", color = "currentColor", size = "24" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={strokeWidth}
            className="feather feather-arrow-down-circle"
            viewBox="0 0 24 24"
        >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 12L12 16 16 12"></path>
            <path d="M12 8L12 16"></path>
        </svg>
    );
};

export const ArrowCircleUp = ({ strokeWidth = "2", color = "currentColor", size = "24" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={strokeWidth}
            className="feather feather-arrow-up-circle"
            viewBox="0 0 24 24"
        >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M16 12L12 8 8 12"></path>
            <path d="M12 16L12 8"></path>
        </svg>
    );
};

export const MenuIcon = ({ strokeWidth = "2", color = "currentColor", size = "24" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={strokeWidth}
            className="feather feather-menu"
            viewBox="0 0 24 24"
        >
            <path d="M3 12L21 12"></path>
            <path d="M3 6L21 6"></path>
            <path d="M3 18L21 18"></path>
        </svg>
    );
};

export const BellIcon = ({ strokeWidth = "2", color = "currentColor", size = "24" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={strokeWidth}
            className="feather feather-bell"
            viewBox="0 0 24 24"
        >
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"></path>
        </svg>
    );
};
