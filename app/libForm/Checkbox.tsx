import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Skeleton from '@mui/material/Skeleton';

interface input {
    id: string
    label: string
    title: string
    disabled: boolean
    defaultValue?: boolean
    onChange?: Function
    required?: boolean
    loading?: boolean;
}

interface modelCheckbox {
    validateField: Function
    getValue: Function
}

export default forwardRef(({ loading = false, required = false, defaultValue = false, id, label, disabled, onChange, title }: input, ref) => {
    const [internalValue, setInternalValue] = useState<boolean>(defaultValue);

    const validateField = () => {
        const val = validate(internalValue as any)
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

    const validateAndChage = (newValue: boolean) => {
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
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width={100} height={24} />
        </div>
    ) : (
        <Tooltip title={title} arrow>
            <FormControlLabel
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

export type {modelCheckbox};