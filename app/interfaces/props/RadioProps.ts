import type { InputProps } from '~/interfaces/props/InputProps';
export interface RadioProps {
    radios: Array<InputProps>
    defaultValue?: string
    onChange?: Function
    required?: boolean
    description: string
    row?: boolean
    loading?: boolean;
    hidden?: boolean
}
