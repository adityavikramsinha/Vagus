import dynamic from 'next/dynamic';

const Dev =
    process.env.NODE_ENV === 'development' && false
        ? dynamic(() => import('@/components/dev/ReactScan'), { ssr: false })
        : () => null;

export default Dev;
