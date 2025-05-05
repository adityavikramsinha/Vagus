'use client';

import {useEffect} from 'react';

export default function ReactScan() {
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            import('react-scan').then((mod) => {
                mod.start();
            }).catch(err => {
                console.error('Failed to load react-scan:', err);
            });
        }
    }, []);

    return null;
}
