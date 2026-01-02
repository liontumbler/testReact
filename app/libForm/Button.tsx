import React, { useState, forwardRef, useImperativeHandle } from 'react';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

import type { ButtonProps } from '~/interfaces/props/ButtonProps';

interface modelInput {
    validarCampo: Function
    value: Function
    getId: Function
    setValue: Function
}

export default forwardRef(({ content, disabled, href, onClick, title, loading, icon, type, refInput, style, color }: ButtonProps, ref) => {
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

