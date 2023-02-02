import React, { useState } from 'react';
import Darkreader, { Switch, useDarkreader } from 'react-darkreader';

const DarkModeToggle = () => {
    const [isDark, { toggle }] = useDarkreader(false, {
        brightness: 150,
        contrast: 100,
        sepia: 0,
        },
        {
            ignoreImageAnalysis: ['.background-image', '.background-image-2', '.login-page-splash-image-container']}
    );

    const [message, setMessage] = useState('Current theme mode is what');

    return (
        <>
            <Switch
                checked={isDark}
                onChange={toggle}
                styling="github"
            />
            {/* <Darkreader
                defaultDarken
                theme={{
                    brightness: 100,
                    contrast: 95,
                    sepia: 0,
                }}
                styling="github"
                onChange={isDark =>
                    setMessage(`Current theme mode is ${isDark ? '🌜' : '🌞'}`)
                }
            /> */}
        </>
    )
};

export default DarkModeToggle;