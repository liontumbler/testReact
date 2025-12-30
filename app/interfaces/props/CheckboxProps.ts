export interface CheckboxProps {
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