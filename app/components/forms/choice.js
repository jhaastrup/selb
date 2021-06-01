import * as React from "react";
import {Label, ErrorText} from "./base";
import { Field, ErrorMessage } from 'formik';
import _ from 'lodash';
import ReactSelect from "react-select";
import CreatableSelect, { makeCreatableSelect } from "react-select/creatable";
import cx from "classnames";
import {useWindowDimensions} from "app/lib/hooks";
import { zeroFormat } from "numeral";

export const Select = ReactSelect;



const Wrapper = ({children, hasError}) => {
    const style = cx({
        "border-primary": hasError
    });

    return(
        <div className={`border-solid rounded border-backgroundGrey w-full hover:border-textGrey ${style}`}>
            {children}
        </div>
    )
}

const FieldComponent = ({
    field: { name, value = "", onChange, onBlur },
    form: { touched, errors, setFieldValue, handleBlur, setTouched },
    format,
    type="text",
    innerRef,
    placeholder,
    options=[],
    label,
    resizeLabel=true,
    htmlfor,
    showLabel= true,
    classnames="",
    isMulti = false,
    isSearchable = false,
    isCreatable = false,
    isClearable = false,
    labelProp = 'name',
    valueProp = 'pk',
    hideCaret = false,
    isLoading = false,
    onItemSelected,
    onInputChanged,
    subText,
    valueContainer,
    inputFontSize,
    inputFontWeight,
    selectBorderRadius,
    ...props
}) => {
     const getOptionLabel = (option) => option[labelProp];
    const getOptionValue = (option) => option[valueProp];

    const {width} = useWindowDimensions();
    const getValue = () => {
        if (options) {
            return isMulti
                ? options.filter((option) => value.indexOf(option[valueProp]) >= 0)
                : options.find((option) => option[valueProp] === value) || undefined;
        } else {
            return isMulti ? [] : undefined;
        }
    };

    const groupStyles = {
        display: 'flex',
        flexDirection: "collumn",
        alignItems: 'center',
        justifyContent: 'space-between',
      };
      const groupBadgeStyles = {
        backgroundColor: '#EBECF0',
        borderRadius: '2em',
        color: '#172B4D',
        display: 'inline-block',
        fontSize: 12,
        fontWeight: 'normal',
        lineHeight: '1',
        minWidth: 1,
        padding: '0.16666666666667em 0.5em',
        textAlign: 'center',
      };


      
    //   const formatGroupLabel = option => {
    //     const subtext = getSubtext(option)
    //     console.log("from group", subText)
    //     return(
    //         <div style={groupStyles}>
    //             <span>{option[labelProp]}</span>
    //             <span style={groupBadgeStyles}>{subtext || ""}</span>
    //         </div>
    //     )
    //   }


    const hasErrors = touched[name] && errors[name];
    const SelectComponent = isCreatable === true ? CreatableSelect : Select;

    const dropDownStyles = hideCaret ? { display: "none" } : {};

    const colorStyles = {
        control: (styles) => ({
            ...styles,
            boxShadow: "none",
            borderWidth: "1px",
            borderColor: "rgba(145,150,170,0.2)",
            borderRadius: selectBorderRadius || "0px",
            marginBottom: ".5rem",
            // fontSize: inputFontSize,
            // height: inputHeight,
            // minHeight: inputHeight,
            ":hover": {
                borderColor: "rgba(145,150,170,0.5)",
                cursor: "pointer"
            },
        }),
        placeholder: (styles) => ({
            ...styles,
            color: "#BBB",
            fontSize: width < 768 ? "16px" : inputFontSize || "16px",
            // textTransform: transform,
        }),
        singleValue: (provided, state) => {
            const opacity = state.isDisabled ? 0.5 : 1;
            const transition = "opacity 300ms";

            return { ...provided, 
                fontWeight: "500", 
                top: valueContainer || "50%", 
                textTransform: "Capitalize", 
                opacity, 
                transition,
                fontSize: "16px"
            };
        },
        dropdownIndicator: (styles) => ({
            ...styles,
            ...dropDownStyles,
        }),
        indicatorSeparator: (styles) => ({
            ...styles,
            ...dropDownStyles,
        }),
        option: (styles) => ({
            ...styles,
            fontSize: inputFontSize || "16px",
            fontWeight: inputFontWeight || "500",
            textTransform: "capitalize",
            backgroundColor: "#fff",
            color: "#000",
            borderBottom: "1px solid #f8f8f8 ",
            ":hover": {
                backgroundColor: "#f8f8f8",
                cursor: "pointer"
            },
            
        }),
    };

   

    return(
        <div className={"relative flex items-start flex-col"}>
            {showLabel ? (
                <Label hasErrors={hasErrors} htmlfor={htmlfor} labelText={label}/>
            ) : null}

            <Wrapper hasError={hasErrors}>
                <SelectComponent
                    ref={innerRef}
                    name={name}
                    value={getValue()}
                    styles={colorStyles}
                    getNewOptionData={(inputValue, optionLabel) => ({
                        id: optionLabel,
                        name: `Create ${inputValue}...`,
                        __isNew__: true,
                    })}
                    getOptionLabel={getOptionLabel}
                    getOptionValue={getOptionValue}
                    options={options}
                    placeholder={placeholder}
                    // formatGroupLabel={formatGroupLabel}
                    isMulti={isMulti}
                    isClearable={isClearable}
                    isSearchable={isSearchable}
                    isClearable={isClearable}
                    isLoading={isLoading}
                    onInputChange={(input) => {
                        onInputChanged && onInputChanged(input);
                    }}
                    
                    onChange={(option) => {
                        // Prevent crash when all elements are cleared manually.
                        if (!option) return setFieldValue(name, undefined);
                        const val = isMulti ? option.map((item) => item[valueProp]) : option[valueProp];
                        setFieldValue(name, val, true);
                        onItemSelected && onItemSelected(option);
                    }}
                   
                    {...props}
                />
            </Wrapper>
            <ErrorMessage name={name} component={ErrorText} />
        </div>
    )
}

const SelectField = ({ name, ...props }) => {
    return <Field name={name} component={FieldComponent} {...props} />;
};


export default SelectField;