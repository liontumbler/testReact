import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import FormLabel from '@mui/material/FormLabel';
import Skeleton from '@mui/material/Skeleton';
import Checkbox, { type modelCheckbox, type checkboxProps }from "../libForm/Checkbox";

import Grid from '@mui/material/Grid';

interface checkboxes {
    checkboxes: Array<checkboxProps>
    loading?: boolean;
    description?: string
}

export default forwardRef(({checkboxes, loading, description} : checkboxes, ref) => {
    const [error, setError] = useState(false);
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

    return loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Skeleton del título */}
            {
                description ? <Skeleton variant="text" width={120} height={24} /> : null
            }
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Skeleton variant="rectangular" width={24} height={24} />
                <Skeleton variant="text" width={100} height={24} />
            </div>
        </div>
    ) : (
        <Grid container spacing={2} >
            {
                description ? <FormLabel
                    sx={{
                        color: error ? 'red' : 'inherit',
                        width: '100%'
                    }}
                >
                    {description}
                    <br />
                </FormLabel> : null
            }
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
                        loading={loading}
                    />
                </Grid> : null
            ))}
        </Grid>
    )
})

