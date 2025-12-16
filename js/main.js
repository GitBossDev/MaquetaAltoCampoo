// ============================================
// MENÚ HAMBURGUESA - ENFOQUE CSS-FIRST
// ============================================

(function() {
    const menuHamburguesa = document.querySelector('.menu-hamburguesa');
    if (!menuHamburguesa) return;
    
    const icono = menuHamburguesa.querySelector('img');
    const rutaBase = window.location.pathname.includes('/pages/') ? '../assets/icons/' : 'assets/icons/';
    
    // Toggle del menú
    menuHamburguesa.addEventListener('click', () => {
        const estaAbierto = document.body.classList.toggle('menu-abierto');
        
        // Cambiar icono
        if (icono) {
            if (estaAbierto) {
                icono.src = rutaBase + 'xmenuicon.png';
                icono.alt = 'Cerrar menú';
            } else {
                icono.src = rutaBase + 'menuicon.png';
                icono.alt = 'Abrir menú';
            }
        }
        
        // Cerrar otros dropdowns
        document.querySelector('.dropdown-idioma')?.classList.remove('activo');
        document.querySelector('.barra-busqueda-desplegable')?.classList.remove('activo');
    });
    
    // Cerrar menú al hacer click en un enlace
    document.querySelectorAll('nav a').forEach(enlace => {
        enlace.addEventListener('click', () => {
            document.body.classList.remove('menu-abierto');
            if (icono) {
                icono.src = rutaBase + 'menuicon.png';
                icono.alt = 'Abrir menú';
            }
        });
    });
    
    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!menuHamburguesa.contains(e.target) && !document.querySelector('nav')?.contains(e.target)) {
            if (document.body.classList.contains('menu-abierto')) {
                document.body.classList.remove('menu-abierto');
                if (icono) {
                    icono.src = rutaBase + 'menuicon.png';
                    icono.alt = 'Abrir menú';
                }
            }
        }
    });
    
    // Cerrar menú al redimensionar a desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) {
            document.body.classList.remove('menu-abierto');
            if (icono) {
                icono.src = rutaBase + 'menuicon.png';
                icono.alt = 'Abrir menú';
            }
        }
    });
})();

// ============================================
// CARRUSEL DE RUTAS - INFINITO CON CLONES
// ============================================

const carrusel = document.querySelector('.carrusel-rutas');
const botonAnterior = document.querySelector('.boton-anterior');
const botonSiguiente = document.querySelector('.boton-siguiente');
const indicadores = document.querySelectorAll('.indicador');

if (carrusel && botonAnterior && botonSiguiente && indicadores.length > 0) {
    // Obtener tarjetas originales
    const tarjetasOriginales = Array.from(document.querySelectorAll('.tarjeta-ruta'));
    const numTarjetasOriginales = tarjetasOriginales.length;
    
    // Clonar tarjetas al inicio y al final para efecto infinito
    tarjetasOriginales.forEach(tarjeta => {
        const cloneInicio = tarjeta.cloneNode(true);
        const cloneFinal = tarjeta.cloneNode(true);
        carrusel.insertBefore(cloneInicio, carrusel.firstChild);
        carrusel.appendChild(cloneFinal);
    });
    
    // Actualizar la lista de todas las tarjetas (incluyendo clones)
    const todasLasTarjetas = Array.from(document.querySelectorAll('.tarjeta-ruta'));
    
    let indiceActual = 0;
    let scrollTimeout = null;
    let estaTransicionando = false;

    // Función para obtener el gap entre tarjetas
    function obtenerGap() {
        const estilo = window.getComputedStyle(carrusel);
        return parseFloat(estilo.gap) || 0;
    }

    // Función para centrar tarjeta por índice real (con clones)
    function centrarTarjetaPorIndiceReal(indiceReal, conAnimacion = true) {
        const tarjeta = todasLasTarjetas[indiceReal];
        const anchoCarrusel = carrusel.offsetWidth;
        const posicionTarjeta = tarjeta.offsetLeft;
        const anchoTarjeta = tarjeta.offsetWidth;
        
        const scrollACentro = posicionTarjeta - (anchoCarrusel / 2) + (anchoTarjeta / 2);
        
        if (conAnimacion) {
            carrusel.scrollTo({
                left: scrollACentro,
                behavior: 'smooth'
            });
        } else {
            carrusel.scrollLeft = scrollACentro;
        }
    }

    // Función para centrar tarjeta y actualizar indicadores
    function centrarTarjeta() {
        const indiceReal = numTarjetasOriginales + indiceActual;
        centrarTarjetaPorIndiceReal(indiceReal, true);
        actualizarIndicadores();
    }

    // Función para actualizar indicadores
    function actualizarIndicadores() {
        indicadores.forEach((indicador, indice) => {
            if (indice === indiceActual) {
                indicador.classList.add('activo');
            } else {
                indicador.classList.remove('activo');
            }
        });
    }

    // Función para manejar el salto infinito
    function manejarSaltoInfinito() {
        if (estaTransicionando) return;
        
        const anchoCarrusel = carrusel.offsetWidth;
        const scrollLeft = carrusel.scrollLeft;
        const centro = scrollLeft + (anchoCarrusel / 2);
        
        // Encontrar la tarjeta más cercana al centro
        let distanciaMinima = Infinity;
        let indiceRealCercano = 0;
        
        todasLasTarjetas.forEach((tarjeta, indice) => {
            const posicionTarjeta = tarjeta.offsetLeft;
            const anchoTarjeta = tarjeta.offsetWidth;
            const centroTarjeta = posicionTarjeta + (anchoTarjeta / 2);
            const distancia = Math.abs(centro - centroTarjeta);
            
            if (distancia < distanciaMinima) {
                distanciaMinima = distancia;
                indiceRealCercano = indice;
            }
        });
        
        // Verificar si estamos en los clones del inicio
        if (indiceRealCercano < numTarjetasOriginales) {
            estaTransicionando = true;
            const indiceCorrespondiente = indiceRealCercano + numTarjetasOriginales;
            indiceActual = indiceRealCercano;
            setTimeout(() => {
                centrarTarjetaPorIndiceReal(indiceCorrespondiente, false);
                estaTransicionando = false;
            }, 300);
        }
        // Verificar si estamos en los clones del final
        else if (indiceRealCercano >= numTarjetasOriginales * 2) {
            estaTransicionando = true;
            const indiceCorrespondiente = indiceRealCercano - numTarjetasOriginales;
            indiceActual = indiceRealCercano - (numTarjetasOriginales * 2);
            setTimeout(() => {
                centrarTarjetaPorIndiceReal(indiceCorrespondiente, false);
                estaTransicionando = false;
            }, 300);
        }
        // Estamos en las tarjetas originales
        else {
            indiceActual = indiceRealCercano - numTarjetasOriginales;
        }
        
        actualizarIndicadores();
    }

    // Botón anterior
    botonAnterior.addEventListener('click', (e) => {
        e.preventDefault();
        if (estaTransicionando) return;
        
        indiceActual = indiceActual > 0 ? indiceActual - 1 : numTarjetasOriginales - 1;
        centrarTarjeta();
    });

    // Botón siguiente
    botonSiguiente.addEventListener('click', (e) => {
        e.preventDefault();
        if (estaTransicionando) return;
        
        indiceActual = indiceActual < numTarjetasOriginales - 1 ? indiceActual + 1 : 0;
        centrarTarjeta();
    });

    // Click en indicadores
    indicadores.forEach((indicador, indice) => {
        indicador.addEventListener('click', () => {
            if (estaTransicionando) return;
            indiceActual = indice;
            centrarTarjeta();
        });
    });

    // Detectar scroll manual
    carrusel.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            manejarSaltoInfinito();
        }, 150);
    });

    // Recalcular en resize
    window.addEventListener('resize', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const indiceReal = numTarjetasOriginales + indiceActual;
            centrarTarjetaPorIndiceReal(indiceReal, false);
        }, 200);
    });

    // Inicializar: posicionar en la primera tarjeta original (sin animación)
    setTimeout(() => {
        const indiceReal = numTarjetasOriginales;
        centrarTarjetaPorIndiceReal(indiceReal, false);
        actualizarIndicadores();
    }, 100);
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