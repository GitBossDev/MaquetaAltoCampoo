// ============================================
// MENÚ HAMBURGUESA - ENFOQUE CSS-FIRST
// ============================================

(function() {
    const menuHamburguesa = document.querySelector('.menu-hamburguesa');
    if (!menuHamburguesa) return;
    
    const icono = menuHamburguesa.querySelector('img');
    const rutaBase = window.location.pathname.includes('/pages/') ? '../assets/icons/' : 'assets/icons/';
    
    // Toggle del menú
    menuHamburguesa.addEventListener('click', (e) => {
        e.stopPropagation();
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

if (carrusel && botonAnterior && botonSiguiente) {
    // Obtener tarjetas originales ANTES de clonar
    const tarjetasOriginales = Array.from(carrusel.querySelectorAll('.tarjeta-ruta'));
    const numTarjetasOriginales = tarjetasOriginales.length;
    
    // Guardar el contenedor original
    const contenedorOriginal = carrusel.cloneNode(false);
    
    // Clonar todas las tarjetas al final (para ir hacia la derecha)
    tarjetasOriginales.forEach(tarjeta => {
        const cloneFinal = tarjeta.cloneNode(true);
        carrusel.appendChild(cloneFinal);
    });
    
    // Clonar todas las tarjetas al inicio (para ir hacia la izquierda) 
    // Hacerlo en orden inverso para mantener la secuencia correcta
    for (let i = tarjetasOriginales.length - 1; i >= 0; i--) {
        const cloneInicio = tarjetasOriginales[i].cloneNode(true);
        carrusel.insertBefore(cloneInicio, carrusel.firstChild);
    }
    
    // Actualizar la lista de todas las tarjetas (incluyendo clones)
    const todasLasTarjetas = Array.from(carrusel.querySelectorAll('.tarjeta-ruta'));
    
    let indiceActual = 0;
    let scrollTimeout = null;
    let estaTransicionando = false;

    // Función para centrar tarjeta por índice real (con clones)
    function centrarTarjetaPorIndiceReal(indiceReal, conAnimacion = true) {
        if (indiceReal < 0 || indiceReal >= todasLasTarjetas.length) return;
        
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
    function centrarTarjeta(conAnimacion = true) {
        const indiceReal = numTarjetasOriginales + indiceActual;
        centrarTarjetaPorIndiceReal(indiceReal, conAnimacion);
        actualizarIndicadores();
    }

    // Función para actualizar indicadores
    function actualizarIndicadores() {
        if (indicadores.length > 0) {
            indicadores.forEach((indicador, indice) => {
                if (indice === indiceActual) {
                    indicador.classList.add('activo');
                } else {
                    indicador.classList.remove('activo');
                }
            });
        }
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
        
        // Verificar si estamos en los clones del inicio (primeras 5 tarjetas)
        if (indiceRealCercano < numTarjetasOriginales) {
            estaTransicionando = true;
            // Calcular qué tarjeta original corresponde
            const indiceOriginalCorrespondiente = indiceRealCercano;
            indiceActual = indiceOriginalCorrespondiente;
            // Saltar a la tarjeta original correspondiente (conjunto del medio)
            const nuevoIndiceReal = numTarjetasOriginales + indiceOriginalCorrespondiente;
            setTimeout(() => {
                centrarTarjetaPorIndiceReal(nuevoIndiceReal, false);
                estaTransicionando = false;
            }, 300);
        }
        // Verificar si estamos en los clones del final (últimas 5 tarjetas)
        else if (indiceRealCercano >= numTarjetasOriginales * 2) {
            estaTransicionando = true;
            // Calcular qué tarjeta original corresponde
            const indiceOriginalCorrespondiente = indiceRealCercano - (numTarjetasOriginales * 2);
            indiceActual = indiceOriginalCorrespondiente;
            // Saltar a la tarjeta original correspondiente (conjunto del medio)
            const nuevoIndiceReal = numTarjetasOriginales + indiceOriginalCorrespondiente;
            setTimeout(() => {
                centrarTarjetaPorIndiceReal(nuevoIndiceReal, false);
                estaTransicionando = false;
            }, 300);
        }
        // Estamos en las tarjetas originales (conjunto del medio)
        else {
            indiceActual = indiceRealCercano - numTarjetasOriginales;
        }
        
        actualizarIndicadores();
    }

    // Botón anterior
    botonAnterior.addEventListener('click', (e) => {
        e.preventDefault();
        if (estaTransicionando) return;
        
        // Ir a la tarjeta anterior en bucle
        indiceActual = indiceActual > 0 ? indiceActual - 1 : numTarjetasOriginales - 1;
        centrarTarjeta(true);
    });

    // Botón siguiente
    botonSiguiente.addEventListener('click', (e) => {
        e.preventDefault();
        if (estaTransicionando) return;
        
        // Ir a la siguiente tarjeta en bucle
        indiceActual = indiceActual < numTarjetasOriginales - 1 ? indiceActual + 1 : 0;
        centrarTarjeta(true);
    });

    // Click en indicadores
    if (indicadores.length > 0) {
        indicadores.forEach((indicador, indice) => {
            indicador.addEventListener('click', () => {
                if (estaTransicionando) return;
                indiceActual = indice;
                centrarTarjeta(true);
            });
        });
    }

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
    // Esperar un poco más para asegurar que el DOM esté completamente renderizado
    setTimeout(() => {
        const indiceReal = numTarjetasOriginales; // Primera tarjeta del conjunto original
        centrarTarjetaPorIndiceReal(indiceReal, false);
        actualizarIndicadores();
    }, 150);
}

// ============================================
// DROPDOWN DE IDIOMAS
// ============================================

const botonIdioma = document.querySelector('.boton-idioma');
const dropdownIdioma = document.querySelector('.dropdown-idioma');

if (botonIdioma && dropdownIdioma) {
    // Detectar si estamos en páginas de la carpeta pages/
    const rutaBaseIdioma = window.location.pathname.includes('/pages/') ? '../assets/icons/' : 'assets/icons/';
    
    // Toggle dropdown al hacer click en el botón
    botonIdioma.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownIdioma.classList.toggle('activo');
        
        // Cerrar búsqueda y menú hamburguesa si están abiertos
        const barraBusqueda = document.querySelector('.barra-busqueda-desplegable');
        const menuHamburguesa = document.querySelector('.menu-hamburguesa');
        
        if (barraBusqueda) {
            barraBusqueda.classList.remove('activo');
        }
        // Cerrar menú hamburguesa
        if (document.body.classList.contains('menu-abierto')) {
            document.body.classList.remove('menu-abierto');
            if (menuHamburguesa) {
                const icono = menuHamburguesa.querySelector('img');
                if (icono) {
                    icono.src = rutaBaseIdioma + 'menuicon.png';
                    icono.alt = 'Abrir menú';
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
    // Detectar si estamos en páginas de la carpeta pages/
    const rutaBaseBusqueda = window.location.pathname.includes('/pages/') ? '../assets/icons/' : 'assets/icons/';
    
    // Toggle barra de búsqueda al hacer click en el botón
    botonBusqueda.addEventListener('click', (e) => {
        e.stopPropagation();
        barraBusquedaDesplegable.classList.toggle('activo');
        
        // Cerrar dropdown de idioma y menú hamburguesa si están abiertos
        if (dropdownIdioma) {
            dropdownIdioma.classList.remove('activo');
        }
        // Cerrar menú hamburguesa
        const menuHamburguesa = document.querySelector('.menu-hamburguesa');
        if (document.body.classList.contains('menu-abierto')) {
            document.body.classList.remove('menu-abierto');
            if (menuHamburguesa) {
                const icono = menuHamburguesa.querySelector('img');
                if (icono) {
                    icono.src = rutaBaseBusqueda + 'menuicon.png';
                    icono.alt = 'Abrir menú';
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