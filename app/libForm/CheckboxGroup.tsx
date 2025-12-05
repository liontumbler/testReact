import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';

import Checkbox, { type modelCheckbox, type checkboxProps }from "../libForm/Checkbox";

import Grid from '@mui/material/Grid';

interface checkboxes {
    checkboxes: Array<checkboxProps>
}

export default forwardRef(({checkboxes} : checkboxes, ref) => {
    const refCampos = useRef<React.RefObject<modelCheckbox | null>[]>([]);
    checkboxes.forEach((field: checkboxProps, key: number) => {
        refCampos.current[key] = React.createRef<modelCheckbox>();
    });

    const getValue = () => {
        const values = checkboxes.map((field: checkboxProps, key: number) => {
            if (!field.hidden) {
                return { [field.id]: refCampos.current[key].current?.getValue() }
            }
        })
        return values;
    }

    const validateField = () => {
        let response: {
            valid: boolean;
            checkboxes: any[];
        } = {
            valid: true,
            checkboxes: []
        }

        checkboxes.forEach((field: any, key: number) => {
            if (!field.hidden) {
                const { valid, msg } = refCampos.current[key].current?.validateField()
                if (!valid) {
                    response.valid = false
                    response.checkboxes.push(msg)
                }
            }
        });

        return response
    }

    useImperativeHandle(ref, () => ({
        validateField,
        getValue
    }));

    return (
        <Grid container spacing={2} >
            {checkboxes.map((field: checkboxProps, key: number) => (
                (!field.hidden) ? <Grid size={field.size ? field.size : { xs: 12, sm: 12, md: 6 }} key={key}>
                    <Checkbox
                        id={field.id}
                        label={field.label}
                        title={field.title}
                        defaultValue={field.defaultValue}
                        ref={refCampos.current[key]}
                        disabled={field.disabled}
                        required={true}
                        onChange={field.onChange}
                    />
                </Grid> : null
            ))}
        </Grid>
    )
})

