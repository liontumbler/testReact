export interface ButtonProps {
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