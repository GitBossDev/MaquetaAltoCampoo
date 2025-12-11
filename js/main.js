// ============================================
// MENÚ HAMBURGUESA
// ============================================

const menuHamburguesa = document.querySelector('.menu-hamburguesa');
const nav = document.querySelector('nav');

if (menuHamburguesa && nav) {
    menuHamburguesa.addEventListener('click', () => {
        nav.classList.toggle('activo');
        
        // Cambiar imagen del menú y aplicar clase activo solo al icono
        const icono = menuHamburguesa.querySelector('img');
        icono.classList.toggle('activo');
        
        if (nav.classList.contains('activo')) {
            icono.src = 'assets/icons/xmenuicon.png';
            icono.alt = 'Cerrar menú';
        } else {
            icono.src = 'assets/icons/menuicon.png';
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
            icono.src = 'assets/icons/menuicon.png';
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