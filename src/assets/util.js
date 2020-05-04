
/* Node UID generator */
export const uuid = () => {
    const id = ([1e4] + -1e3).replace(/[018]/g, c => {
        let exp = crypto.getRandomValues(new Uint8Array(1))[0] & 15;
        exp = exp >> (c / 4);
        const val = c ^ exp;
        return val.toString(16)
    });
    if (window.cy.$('#' + id).length > 0){
        return uuid();
    }
    return id;
}

const getSelectorIndex = (selector) => {
    const s = window.cy.style();
    let i = s.length - 1;
    Object.values(window.cy.style()).forEach(s => {
        if (!s.selector){
            return;
        }
        if (s.selector.inputText === selector) {
            i = s.index;
        }
    });
    return i;
}

export const updateSelector = (selector, style) => {
    let valid = true;
    Object.keys(style).forEach(k => {
        const p = window.cy.style().parseImpl(k, style[k]);
        if (!p){
            valid = false;
        }
    });
    if (!valid){
        return;
    }

    const s = window.cy.style();
    let i = getSelectorIndex(selector);
    // Reset style.
    s[i].properties = [];
    s[i].mappedProperties = [];

    // Apply new style;
    const oldLength = s.length;
    s.length = i + 1;    
    s.css(style);
    s.length = oldLength;
    s._private.newStyle = true;

    return s; // chaining
};

export const arrayIntersection = (a, b) => {
    return a.filter(value => b.includes(value))
}

export const objectIntersection = (o1, o2) => {
    return Object.keys(o1).filter({}.hasOwnProperty.bind(o2));
}

export const EH_CLASSES = [
    'eh-handle',
    // 'eh-source',
    // 'eh-target',
    'eh-preview',
    // 'eh-hover',
    'eh-ghost-node',
    'eh-ghost-edge',
    'eh-ghost',
    'eh-presumptive-target',
    'eh-preview-active']

export const HIDDEN_SELECTORS = [
    ".eh-handle",
    ".eh-hover",
    ".eh-source",
    ".eh-target",
    ".eh-preview, .eh-ghost-edge",
    ".eh-ghost-edge.eh-preview-active"];

export const DEFAULT_SELECTORS = [
    'node',
    'edge'
];

const CLASS_REG = /\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*\s*/g;

export const G = (selector) => {
    return window.cy.$(selector).filter(ele => {
        return arrayIntersection(ele.classes(), EH_CLASSES).length === 0;
    })
}

// Download a JSON object to a file.
export const downloadFile = (data, name) => {
    const text = JSON.stringify(data, null, 2);
    const element = document.createElement("a");
    const file = new Blob(
        [text], { type: 'text/javascript' });
    element.href = URL.createObjectURL(file);
    element.download = name + ".json";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
}

export const getClassesUnion = (elements) => {
    let classes = new Set();
    elements.forEach((ele, i) => {
        ele.classes().forEach(item => classes.add(item));
    });
    return Array.from(classes);
}

export const getClassesIntersection = (elements) => {
    let classes = new Set();
    elements.forEach((ele, i) => {
        if (i === 0){
            classes = new Set(ele.classes());
        }else{
            classes = [...classes].filter(x => ele.hasClass(x));
        }
    });
    return Array.from(classes);
}
const EH_NODES = ['.eh-source', '.eh-target', '.eh-hover']
export const getClassSuggestions = () => {
    let allClasses = getClassesUnion(G());
    window.cy.style().json().forEach(s => {
        const sel = s.selector;
        if (EH_NODES.includes(sel)){
            return;
        }
        let more = sel.match(CLASS_REG);
        if (more && more.length > 0) {
            more = more.map(s => s.substring(1)).filter(s => !EH_CLASSES.includes(s));
            allClasses = [...allClasses, ...more];
        }
    })
    return allClasses;
}

export const fit = (elements) => {
    if (!elements){
        window.cy.fit();
    }else{
        window.cy.fit(elements);
    }
}