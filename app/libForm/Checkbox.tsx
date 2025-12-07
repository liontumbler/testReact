import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Skeleton from '@mui/material/Skeleton';

interface checkboxProps {
    id: string
    label: string
    title: string
    disabled: boolean
    defaultValue?: boolean
    onChange?: Function
    required?: boolean
    loading?: boolean;
    hidden?: boolean
    size?: object
}

interface modelCheckbox {
    validateField: Function
    getValue: Function
}

export default forwardRef(({ loading = false, required = false, defaultValue = false, id, label, disabled, onChange, title }: checkboxProps, ref) => {
    const [internalValue, setInternalValue] = useState<boolean>(defaultValue);
    const titleOriginal = title
    const [titleDinamic, setTitleDinamic] = useState<string>(title);
    const [error, setError] = useState(false);

    const validateField = () => {
        const val = validate(internalValue as any)
        showMsgValid(val.valid, val.msg)
        return val
    }

    const getValue = () => {
        return internalValue;
    }

    const validate = (value: boolean) => {
        let valid = true;
        let msg = ''
        if (value === false && required) {
            valid = false
            msg = `El campo ${label} ${'isRequired'}`
        }

        return {
            valid,
            msg
        }
    }

    const showMsgValid = (valid: boolean, msg: string) => {
        if (!valid) {
            setError(true)
            setTitleDinamic(msg)
        } else {
            setError(false)
            setTitleDinamic(titleOriginal)
        }
    }

    const validateAndChage = (newValue: boolean) => {
        const {valid, msg} = validate(newValue)
        showMsgValid(valid, msg)
        setInternalValue(newValue);
    }
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.checked
        validateAndChage(newValue)
        
        onChange ? onChange(newValue) : null
    }

    useImperativeHandle(ref, () => ({
        validateField,
        getValue
    }));

    return loading ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Skeleton variant="rectangular" width={24} height={24} />
            <Skeleton variant="text" width={100} height={24} />
        </div>
    ) : (
        <Tooltip title={titleDinamic} arrow>
            <FormControlLabel
                sx={{
                    // Cambia el color de la etiqueta según error
                    '& .MuiFormControlLabel-label': {
                        color: error ? 'red' : 'inherit',
                    },
                }}
                control={
                    <Checkbox 
                        disabled={disabled}
                        id={id}
                        name={id}
                        required={required}
                        checked={internalValue}
                        onChange={handleChange}
                    />
                }
                label={label}
            />
        </Tooltip>
    )
})

export type {modelCheckbox, checkboxProps};