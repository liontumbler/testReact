import React, { useState, forwardRef, useImperativeHandle } from 'react';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

interface buttonProps {
    refInput?: any
    type?: "button" | "submit" | "reset" | undefined
    onClick: (e: any) => void
    loading: boolean
    disabled: boolean
    content: string
    color?: "success" | "inherit" | "primary" | "secondary" | "error" | "info" | "warning"
    href?: string
    title: string
    icon?: string
    style?: object
}

interface modelInput {
    validarCampo: Function
    value: Function
    getId: Function
    setValue: Function
}

export default forwardRef(({ content, disabled, href, onClick, title, loading, icon, type, refInput, style, color }: buttonProps, ref) => {
    return (
        <Tooltip title={title} arrow>
            <Button 
                sx={style}
                ref={refInput}
                variant="contained"
                loading={loading}
                loadingPosition="end"
                endIcon={icon}
                disabled={disabled}
                {...(href ? { href } : {})}
                onClick={onClick}
                type={type}
                size="large"
                color={color}
            >
                {content}
            </Button>
        </Tooltip>
        
    )
})

export type {modelInput};

