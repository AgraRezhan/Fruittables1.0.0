// src/utils.js

import queryString from 'query-string';

export const generateUrl = () => {
    const baseUrl = 'http://localhost:5173';
    const params = {
        gs_ssp: 'eJzj4tLP1TfILku3zCtSYDRgdGDwEs1OzU3NK0ktykzMU8hOLU7NSCxJzAMA6iMMyQ',
        q: 'fruitables',
        rlz: '1C1ONGR_enID1009ID1009',
        sourceid: 'chrome',
        ie: 'UTF-8'
    };

    const url = `${baseUrl}?${queryString.stringify(params)}`;
    return url;
};