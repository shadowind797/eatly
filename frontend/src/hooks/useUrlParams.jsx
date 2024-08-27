import {useEffect, useState} from 'react';

function useUrlParams() {
    const [params, setParams] = useState({});

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const paramsObject = {};
        for (let [key, value] of searchParams.entries()) {
            paramsObject[key] = value;
        }
        setParams(paramsObject);
    }, []);

    return params;
}

export default useUrlParams;