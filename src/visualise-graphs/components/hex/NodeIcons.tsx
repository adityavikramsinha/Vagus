import React from 'react';
import { motion, SVGMotionProps } from 'motion/react';

export const StartNodeIcon = (
    props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) => {
    return (
        <svg
            width="34"
            height="34"
            viewBox="0 0 34 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <circle cx="17" cy="17" r="7" fill="#45B857" />
            <circle cx="17.0003" cy="16.9999" r="5.21477" fill="#262A33" />
            <ellipse cx="16.9995" cy="17.0007" rx="2.95973" ry="2.95973" fill="#45B857" />
        </svg>
    );
};

export const EndNodeIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg
            width="34"
            height="34"
            viewBox="0 0 34 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <circle cx="17" cy="17" r="7" fill="#FF0000" />
            <circle cx="17" cy="16.9999" r="5.21476" fill="#262A33" />
            <circle cx="17" cy="17" r="2.95973" fill="#FF0000" />
        </svg>
    );
};

export const BombNodeIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg
            width="34"
            height="34"
            viewBox="0 0 34 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M22.7143 15.4286C22.7143 16.2175 21.8254 11.7143 19.1429 11.7143C16.4603 11.7143 14.4286 14.6461 14.4286 13.8571C14.4286 13.0681 16.4603 11 19.1429 11C21.8254 11 22.7143 14.6396 22.7143 15.4286Z"
                fill="#120505"
            />
            <circle cx="15.5715" cy="17.5714" r="5.42857" fill="#FF0000" />
            <rect
                x="15.5676"
                y="11"
                width="4.28571"
                height="2.85714"
                transform="rotate(23.4956 15.5676 11)"
                fill="#FF0000"
            />
            <path
                d="M22.5714 13.5715L22.7767 14.5789L23.5815 13.9392L23.0912 14.8428L24.119 14.8701L23.1625 15.2472L23.9323 15.9287L22.9572 15.6028L23.1089 16.6196L22.5714 15.7432L22.034 16.6196L22.1856 15.6028L21.2105 15.9287L21.9803 15.2472L21.0239 14.8701L22.0516 14.8428L21.5613 13.9392L22.3661 14.5789L22.5714 13.5715Z"
                fill="#FFE600"
            />
            <path
                d="M22.5715 14.4285L22.6648 14.8864L23.0306 14.5956L22.8077 15.0063L23.2749 15.0187L22.8402 15.1901L23.1901 15.4999L22.7468 15.3518L22.8158 15.814L22.5715 15.4156L22.3272 15.814L22.3961 15.3518L21.9529 15.4999L22.3028 15.1901L21.868 15.0187L22.3352 15.0063L22.1123 14.5956L22.4781 14.8864L22.5715 14.4285Z"
                fill="#FFA500"
            />
            <path
                d="M13.6313 14.8227C11.9914 15.7694 11.0619 16.9438 10.7858 16.4655C10.5096 15.9872 11.3103 14.0182 12.9501 13.0715C14.59 12.1247 15.3486 12.3686 15.6248 12.8469C15.9009 13.3252 15.2711 13.8759 13.6313 14.8227Z"
                fill="white"
            />
            <path
                d="M15.7415 11.2857L16.2655 11.5136L15.7143 12.5714L15.2857 12.2857L15.7415 11.2857Z"
                fill="white"
            />
        </svg>
    );
};

export const WeightNodeIcon = (
    props: React.JSX.IntrinsicAttributes &
        SVGMotionProps<SVGSVGElement> &
        React.RefAttributes<SVGSVGElement>,
) => {
    return (
        <motion.svg
            width="34"
            height="34"
            viewBox="0 0 34 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
            initial={{ scale: 1, y: 0 }}
            animate={{
                scale: [1, 0.8, 1.05, 0.97, 1],
                y: [0, 7, -2, 2, 0],
            }}
            transition={{
                duration: 1, // Approx duration of full animation cycle
                ease: 'easeInOut',
            }}
        >
            <path
                d="M21.8611 19.2421C21.8611 21.7228 19.8501 23 17.3695 23C14.8888 23 12.8778 21.7228 12.8778 19.2421C12.8778 16.7615 14.8888 14.7505 17.3695 14.7505C19.8501 14.7505 21.8611 16.7615 21.8611 19.2421Z"
                fill="#8A68C3"
            />
            <path
                d="M20.06 17.8635C22.4971 15.2486 21.9501 13.0606 21.4386 12.5046C19.7487 10.3033 14.6789 10.7035 13.2558 12.5046C12.6999 13.2014 12.1974 15.2486 14.6345 17.8635"
                stroke="#8A68C3"
                stroke-width="3"
            />
            <path
                d="M14.9236 18.5528C14.5695 20.0339 14.7544 21.3243 14.2766 21.2101C13.7988 21.0959 13.2131 19.6336 13.5672 18.1526C13.9212 16.6715 15.081 15.7325 15.5588 15.8467C16.0365 15.9609 15.2776 17.0718 14.9236 18.5528Z"
                fill="white"
            />
            <path
                d="M12.9945 12.7097C12.7322 13.1639 12.6692 13.5644 12.5226 13.4798C12.3761 13.3952 12.3237 12.8987 12.5859 12.4445C12.8482 11.9903 13.3232 11.7941 13.4697 11.8787C13.6162 11.9633 13.2567 12.2555 12.9945 12.7097Z"
                fill="white"
            />
        </motion.svg>
    );
};
