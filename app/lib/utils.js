import { v4 as uuidv4 } from 'uuid';


export const toBase64 = (file) =>
new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.replace(/^data:.+;base64,/, ""));
    reader.onerror = (error) => reject(error);
});

export function uuid() {
    return uuidv4();
}

export function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}