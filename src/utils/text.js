/**
 * Helper untuk mengekstrak string dari nilai bilingual JSON { id, en }
 * atau format primitif string/number.
 * @param {string|number|object} val
 * @param {string} lang - 'id' | 'en'
 * @returns {string}
 */
export const getText = (val, lang = 'id') => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'number') return String(val);
    if (typeof val === 'object') {
        if (lang === 'en' && typeof val.en === 'string') return val.en;
        if (lang === 'id' && typeof val.id === 'string') return val.id;
        if (typeof val.id === 'string') return val.id;
        if (typeof val.en === 'string') return val.en;
        if (val.text) return getText(val.text, lang);
        if (val.title) return getText(val.title, lang);
        if (val.name) return getText(val.name, lang);
        return '';
    }
    return String(val);
};

export default getText;
