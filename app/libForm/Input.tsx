import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
import Input from '@mui/material/Input';

interface inputProps {
    id: string
    label: string
    type: string
    title: string
    disabled: boolean
    minLength: string
    maxLength: string
    placeholder?: string
    inputRef?: any
    defaultValue?: string
    onChange?: Function
    required?: boolean
    min?: string
    max?: string
    loading?: boolean;
}

interface modelInput {
    validateField: Function
    getValue: Function
}

export default forwardRef(({ loading = false, required = false, defaultValue = '', id, label, type, disabled, placeholder, inputRef, onChange, minLength, maxLength, min, max, title }: inputProps, ref) => {
    const [internalValue, setInternalValue] = useState<string>(defaultValue);
    const [error, setError] = useState(false);
    const [helperText, setHelperText] = useState('');

    const validateField = () => {
        const val = validate(internalValue as any, type)
        showMsgValid(val.valid, val.msg)
        return val
    }

    const getValue = () => {
        return internalValue;
    }

    const validate = (value: string, type: string) => {
        let valid = true;
        let msg = ''
        if (value === '' && required) {
            valid = false
            // msg = `${t('theField')} ${label} ${t('isRequired')}`
            msg = `El campo ${label} es requerido`
        } else if ((value && value !== '') && (minLength && value.length < Number(minLength))) {
            valid = false
            msg = `El campo ${label} es de minimo ${minLength} caracteres` 
        } else if ((value && value !== '') && (maxLength && value.length > Number(maxLength))) {
            valid = false
            msg = `El campo ${label} es de maximo ${maxLength} caracteres` 
        } else if ((value && value !== '') && (min && Number(value) < Number(min))) {
            valid = false
            msg = `El campo ${label} es de minimo ${min}` 
        } else if ((value && value !== '') && (max && Number(value) > Number(max))) {
            valid = false
            msg = `El campo ${label} es de maximo ${min}` 
        } else if ((value && value !== '') && type === 'email') {
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!regex.test(value as string)) {
                valid = false
                msg = `El campo '${label}' formato invalido`
            }
        }

        return {
            valid,
            msg
        }
    }

    const showMsgValid = (valid: boolean, msg: string) => {
        if (!valid) {
            setError(true)
            setHelperText(msg)
        } else {
            setError(false)
            setHelperText('')
        }
    }

    const validateAndChage = (newValue: string, type: string) => {
        const {valid, msg} = validate(newValue, type)
        showMsgValid(valid, msg)
        setInternalValue(newValue);
    }
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        validateAndChage(newValue, type)
        
        onChange ? onChange(newValue) : null
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        validateAndChage(newValue, type)
    }

    useImperativeHandle(ref, () => ({
        validateField,
        getValue
    }));

    return loading ? (
        <Skeleton
            variant="rectangular"
            width="100%"
            height={56} // alto típico de un TextField
            sx={{ borderRadius: 1 }}
        />
    ) : (
        <Tooltip title={title} arrow>
            <TextField
                inputRef={inputRef}
                disabled={disabled}
                placeholder={placeholder ?? ''}
                id={id}
                name={id}
                label={label}
                type={type}
                required={required}
                fullWidth
                helperText={helperText}
                error={error}
                value={internalValue}
                onChange={handleChange}
                onBlur={handleBlur}
                inputProps={{
                    minLength: minLength,
                    maxLength: maxLength,
                    min: min,
                    max: max,
                }}
            />
        </Tooltip>
    )
})

export type {modelInput, inputProps};

