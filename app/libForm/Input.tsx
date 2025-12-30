import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';

import type { InputProps } from '~/interfaces/props/InputProps';

export default forwardRef(({ loading = false, required = false, defaultValue = '', id, label, type, disabled, hidden = false, placeholder, inputRef, onChange, minLength, maxLength, min, max, title }: InputProps, ref) => {
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

    const transformDataNumber = (newValue: string) => {
        // Reemplaza todo lo que no sea número
        // newValue = newValue.replace(/\D/g, '');
        // newValue.replace(/[^0-9.]/g, '');

        // Eliminar todo lo que no sea dígito, punto o signo negativo
        newValue = newValue.replace(/[^0-9.-]/g, '');

        // Asegurarse de que el signo negativo esté solo al inicio
        newValue = newValue.replace(/(?!^)-/g, '');

        // Mantener solo el primer punto
        const parts = newValue.split('.');
        if (parts.length > 1) {
            newValue = parts.shift() + '.' + parts.join('');
        }

        // Evitar que inicie con punto
        if (newValue.startsWith('.')) {
            newValue = newValue.slice(1);
        }
    }
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value;
        if (type === 'number') {
            transformDataNumber(newValue)
        }

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
        !hidden ? 
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
        </Tooltip> : null
    )
})

