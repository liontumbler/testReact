import React, { type ReactNode, useState, forwardRef, useImperativeHandle, useEffect } from 'react';

import { useUser } from "../services/context/UserContext";
import { useNavigate, useLocation } from "react-router";

import { createTheme } from '@mui/material/styles';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';


import type { Router } from '@toolpad/core/AppProvider';
import logo from "../img/adminLig.svg";

import Protected from "./protecte/Protected";


import {
    AppProvider,
    type Session,
} from '@toolpad/core/AppProvider';

import { useTranslation } from "react-i18next";

interface modelInput {
    validateField: Function
    getValue: Function
}

interface Props {
    children: ReactNode;
    window?: () => Window
}

const demoTheme = createTheme({
    cssVariables: {
        colorSchemeSelector: 'data-toolpad-color-scheme',
    },
    colorSchemes: { light: true, dark: true },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 600,
            lg: 1200,
            xl: 1536,
        },
    },
});

export default forwardRef(({ children }: Props, ref) => {
    const { t } = useTranslation()
    const navig = useNavigate();
    const location = useLocation();
    const { logout, getPath, setPath, getMenus, geUser, isLogin } = useUser();

    const [open, setOpen] = useState<boolean>(true)
    const [menus, setMenus] = useState([])
    const [user, setUser] = useState<any>(null)
    const [permisos, setPermisos] = useState([])
    const [session, setSession] = React.useState<Session | null>(null);
    const [redirectTo, setRedirectTo] = React.useState<string>('/dashboard');
    const [isAllowed, setIsAllowed] = React.useState<boolean>(true);
    const [cargarVista, setCargarVista] = React.useState<boolean>(false);

    const handleLogout = () => {
        console.log('edwin', logout());
        
        if (logout()) {
            navig("/login")
        }
    }

    const submenus = (menus: any, permisos: any) => {
        const M = menus.map((menu: any) => {
            permisos.push(menu.permiso)
            let nav: any = {
                segment: menu.nombre,
                title: t(menu.nombre),
                //icon: <DashboardIcon />,
            }

            if (menu.menus && menu.menus.length > 0) {
                nav['children'] = submenus(menu.menus, permisos)
            }

            return nav;
        })

        return M
    }

    const fetchMenus = async () => {
        try {
            const m = await getMenus();

            const menusAux = m.menus;
            let permi: any = []
            const NAVEGACION = submenus(menusAux, permi)

            setMenus(NAVEGACION);

            const nuevosPermisos: any = [
                ...(m["permisos-globales"] || []),
                ...(permi || []),
            ];

            let hayPermisos = false;
            nuevosPermisos.forEach((permiso: any ) => {
                let nuevaCadena = location.pathname.slice(1).replace('/', '.')
                console.log(permiso, nuevaCadena);
                if (permiso === `${nuevaCadena}.view`) {
                    hayPermisos = true; 
                }
            });

            setIsAllowed(hayPermisos)
            setCargarVista(hayPermisos)
            setPermisos(nuevosPermisos);
            return true;
        } catch (err) {
            console.error("Error al cargar menús:", err);
        }
    };

    useEffect(() => {
        const path = getPath()
        if (path !== location.pathname) {
            //alert('recargue de vista')
            navig(path)
        } else {
            
            fetchMenus();

            const U = geUser() 
            setUser(U)

            setSession({
                user: {
                    name: `${U?.nombres} ${U?.apellidos}`,
                    email: U?.correo,
                    //image: 'https://avatars.githubusercontent.com/u/19550456',
                },
            })
        }
    }, []);

    const router: Router = {
        pathname: getPath(),
        searchParams: new URLSearchParams(),
        //navigate: (path: string | URL) => navig(path)
        navigate: (url: string | URL) => {
            const path = typeof url === 'string' ? url : url.pathname;
            setPath(path);
            navig(path)
        },
    };

    // useImperativeHandle(ref, () => ({
    //     validateField,
    //     getValue
    // }));

    

    const authentication = React.useMemo(() => {
        return {
            signIn: () => {},
            signOut: () => {
                console.log('xxx');
                
                setSession(null);
                handleLogout()
            },
        };
    }, []);



    return (
        <Protected isAllowed={isAllowed} redirectTo={redirectTo}>
            <AppProvider
                session={session}
                navigation={menus}
                router={router}
                theme={demoTheme}
                authentication={authentication}
                branding={{
                    title: "ligas",
                    logo: <img src={logo} width='50' />,
                    homeUrl: ''
                }}
            >
                <DashboardLayout defaultSidebarCollapsed={open}>
                    {permisos.toString()}
                    { cargarVista ? children : 'cargando...'}
                </DashboardLayout>
            </AppProvider>
        </Protected>
    )
})

export type { modelInput };
