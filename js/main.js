// ============================================
// MENÚ HAMBURGUESA
// ============================================

const menuHamburguesa = document.querySelector('.menu-hamburguesa');
const nav = document.querySelector('nav');

if (menuHamburguesa && nav) {
    menuHamburguesa.addEventListener('click', () => {
        nav.classList.toggle('activo');
        
        // Cerrar dropdown de idioma y búsqueda si están abiertos
        const dropdownIdioma = document.querySelector('.dropdown-idioma');
        const barraBusqueda = document.querySelector('.barra-busqueda-desplegable');
        if (dropdownIdioma) dropdownIdioma.classList.remove('activo');
        if (barraBusqueda) barraBusqueda.classList.remove('activo');
        
        // Cambiar imagen del menú y aplicar clase activo solo al icono
        const icono = menuHamburguesa.querySelector('img');
        icono.classList.toggle('activo');
        
        // Detectar si estamos en la raíz o en una subcarpeta
        const rutaBase = window.location.pathname.includes('/pages/') ? '../assets/icons/' : 'assets/icons/';
        
        if (nav.classList.contains('activo')) {
            icono.src = rutaBase + 'xmenuicon.png';
            icono.alt = 'Cerrar menú';
        } else {
            icono.src = rutaBase + 'menuicon.png';
            icono.alt = 'Icono de menú';
        }
    });

    // Cerrar el menú al hacer click en un enlace
    const enlacesNav = document.querySelectorAll('nav a');
    enlacesNav.forEach(enlace => {
        enlace.addEventListener('click', () => {
            nav.classList.remove('activo');
            
            const icono = menuHamburguesa.querySelector('img');
            icono.classList.remove('activo');
            const rutaBase = window.location.pathname.includes('/pages/') ? '../assets/icons/' : 'assets/icons/';
            icono.src = rutaBase + 'menuicon.png';
            icono.alt = 'Icono de menú';
        });
    });
}

// ============================================
// CARRUSEL DE RUTAS
// ============================================

const carrusel = document.querySelector('.carrusel-rutas');
const botonAnterior = document.querySelector('.boton-anterior');
const botonSiguiente = document.querySelector('.boton-siguiente');
const indicadores = document.querySelectorAll('.indicador');
const tarjetas = document.querySelectorAll('.tarjeta-ruta');

if (carrusel && botonAnterior && botonSiguiente) {
    let indiceActual = 0;

    // Función para actualizar la posición del carrusel
    function actualizarCarrusel() {
        const anchoTarjeta = tarjetas[0].offsetWidth;
        const gap = 16; // var(--espaciado-medio)
        const desplazamiento = (anchoTarjeta + gap) * indiceActual;
        carrusel.scrollTo({
            left: desplazamiento,
            behavior: 'smooth'
        });
        
        // Actualizar indicadores
        indicadores.forEach((indicador, indice) => {
            if (indice === indiceActual) {
                indicador.classList.add('activo');
            } else {
                indicador.classList.remove('activo');
            }
        });
    }

    // Botón anterior
    botonAnterior.addEventListener('click', () => {
        if (indiceActual > 0) {
            indiceActual--;
            actualizarCarrusel();
        }
    });

    // Botón siguiente
    botonSiguiente.addEventListener('click', () => {
        if (indiceActual < tarjetas.length - 1) {
            indiceActual++;
            actualizarCarrusel();
        }
    });

    // Click en indicadores
    indicadores.forEach((indicador, indice) => {
        indicador.addEventListener('click', () => {
            indiceActual = indice;
            actualizarCarrusel();
        });
    });

    // Detectar scroll manual
    carrusel.addEventListener('scroll', () => {
        const anchoTarjeta = tarjetas[0].offsetWidth;
        const gap = 16;
        const scrollLeft = carrusel.scrollLeft;
        const nuevoIndice = Math.round(scrollLeft / (anchoTarjeta + gap));
        
        if (nuevoIndice !== indiceActual && nuevoIndice >= 0 && nuevoIndice < tarjetas.length) {
            indiceActual = nuevoIndice;
            // Actualizar solo indicadores, no hacer scroll
            indicadores.forEach((indicador, indice) => {
                if (indice === indiceActual) {
                    indicador.classList.add('activo');
                } else {
                    indicador.classList.remove('activo');
                }
            });
        }
    });
}

// ============================================
// DROPDOWN DE IDIOMAS
// ============================================

const botonIdioma = document.querySelector('.boton-idioma');
const dropdownIdioma = document.querySelector('.dropdown-idioma');

if (botonIdioma && dropdownIdioma) {
    // Toggle dropdown al hacer click en el botón
    botonIdioma.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownIdioma.classList.toggle('activo');
        
        // Cerrar búsqueda y menú hamburguesa si están abiertos
        const barraBusqueda = document.querySelector('.barra-busqueda-desplegable');
        const nav = document.querySelector('nav');
        const menuHamburguesa = document.querySelector('.menu-hamburguesa');
        
        if (barraBusqueda) {
            barraBusqueda.classList.remove('activo');
        }
        if (nav) {
            nav.classList.remove('activo');
            if (menuHamburguesa) {
                const icono = menuHamburguesa.querySelector('img');
                if (icono) {
                    icono.classList.remove('activo');
                    icono.src = 'assets/icons/menuicon.png';
                    icono.alt = 'Icono de menú';
                }
            }
        }
    });

    // Seleccionar idioma (placeholder - no ejecuta nada real)
    const opcionesIdioma = document.querySelectorAll('.opcion-idioma');
    opcionesIdioma.forEach(opcion => {
        opcion.addEventListener('click', () => {
            // Remover clase activo de todas las opciones
            opcionesIdioma.forEach(opt => opt.classList.remove('activo'));
            // Añadir clase activo a la opción seleccionada
            opcion.classList.add('activo');
            // Cerrar dropdown
            dropdownIdioma.classList.remove('activo');
            
            // Placeholder: aquí iría la lógica real de cambio de idioma
            console.log('Idioma seleccionado:', opcion.dataset.lang);
        });
    });

    // Cerrar dropdown al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!botonIdioma.contains(e.target) && !dropdownIdioma.contains(e.target)) {
            dropdownIdioma.classList.remove('activo');
        }
    });
}

// ============================================
// BARRA DE BÚSQUEDA DESPLEGABLE
// ============================================

const botonBusqueda = document.querySelector('.boton-busqueda');
const barraBusquedaDesplegable = document.querySelector('.barra-busqueda-desplegable');

if (botonBusqueda && barraBusquedaDesplegable) {
    // Toggle barra de búsqueda al hacer click en el botón
    botonBusqueda.addEventListener('click', (e) => {
        e.stopPropagation();
        barraBusquedaDesplegable.classList.toggle('activo');
        
        // Cerrar dropdown de idioma y menú hamburguesa si están abiertos
        if (dropdownIdioma) {
            dropdownIdioma.classList.remove('activo');
        }
        if (nav) {
            nav.classList.remove('activo');
            if (menuHamburguesa) {
                const icono = menuHamburguesa.querySelector('img');
                if (icono) {
                    icono.classList.remove('activo');
                    icono.src = 'assets/icons/menuicon.png';
                    icono.alt = 'Icono de menú';
                }
            }
        }
        
        // Enfocar el input si se abre
        if (barraBusquedaDesplegable.classList.contains('activo')) {
            const inputBusqueda = barraBusquedaDesplegable.querySelector('input');
            setTimeout(() => inputBusqueda.focus(), 100);
        }
    });

    // Placeholder: evento de búsqueda (no ejecuta nada real)
    const inputBusqueda = barraBusquedaDesplegable.querySelector('input');
    if (inputBusqueda) {
        inputBusqueda.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                console.log('Búsqueda:', inputBusqueda.value);
                // Placeholder: aquí iría la lógica real de búsqueda
                barraBusquedaDesplegable.classList.remove('activo');
            }
        });
    }

    // Cerrar barra de búsqueda al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!botonBusqueda.contains(e.target) && !barraBusquedaDesplegable.contains(e.target)) {
            barraBusquedaDesplegable.classList.remove('activo');
        }
    });
} 