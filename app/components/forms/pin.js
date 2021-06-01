import * as React from "react";
import { Field} from 'formik';
import cx from "classnames";
import {Label, ErrorText} from "./base";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { Spacer } from "app/components/assets";


const FieldComponent = ({
    field: { name, value, onChange, onBlur},
    form: { errors, touched },
    format,
    onComplete,
    ...props

}) => {
    const handleChange = onChange(name);
    const handleBlur = onBlur(name);
    const hasErrors = touched[name] && errors[name];

    const _formatValue = (val) => {
        return format ? format(val) : val;
    };

    const onFulfilled = (val) => {
        onComplete && onComplete(val);
    };

    return (
        <div className={"relative flex flex-col items-center"}>
            <div className={"flex flex-row max-w-lg mx-auto px-4"}>
                <PinInput size="lg" mask value={_formatValue(value)} onChange={handleChange} onComplete={onFulfilled}>
                    <PinInputField className={"w-16 h-28 mr-4 text-center text-2xl border-lightGrey rounded"}/>
                    <PinInputField className={"w-16 h-28 mr-4 text-center text-2xl border-lightGrey rounded"}/>
                    <PinInputField className={"w-16 h-28 mr-4 text-center text-2xl border-lightGrey rounded"}/>
                    <PinInputField className={"w-16 h-28 mr-4 text-center text-2xl border-lightGrey rounded"}/>
                </PinInput>
            </div>
            <Spacer className={"block h-2"} />
        </div>
    )
}

const PinField = ({name, ...props}) => {
    return <Field name={name} component={FieldComponent} {...props} />;
}

export default PinField;