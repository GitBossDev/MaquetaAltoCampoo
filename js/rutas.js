// ============================================
// DATOS DE RUTAS (Simulación de BBDD)
// ============================================

const rutasData = [
    {
        id: 1,
        nombre: "Sendero de los Puentes",
        lat: 43.0385,
        lng: -4.3795,
        dificultad: "baja",
        duracion: "corta",
        tipo: "circular",
        actividad: "senderismo",
        color: "#91C24E" // verde-claro
    },
    {
        id: 2,
        nombre: "Ruta del Valle del Híjar",
        lat: 43.0345,
        lng: -4.3840,
        dificultad: "baja",
        duracion: "media",
        tipo: "circular",
        actividad: "senderismo",
        color: "#91C24E" // verde-claro
    },
    {
        id: 3,
        nombre: "Ascenso al Pico Tres Mares",
        lat: 43.0420,
        lng: -4.3750,
        dificultad: "alta",
        duracion: "larga",
        tipo: "lineal",
        actividad: "senderismo",
        color: "#004441" // verde-bosque
    },
    {
        id: 4,
        nombre: "Ruta de los Robles Centenarios",
        lat: 43.0320,
        lng: -4.3890,
        dificultad: "media",
        duracion: "media",
        tipo: "circular",
        actividad: "senderismo",
        color: "#008071" // verde-cerceta
    },
    {
        id: 5,
        nombre: "Circuito BTT de Montaña",
        lat: 43.0395,
        lng: -4.3715,
        dificultad: "alta",
        duracion: "larga",
        tipo: "circular",
        actividad: "bici",
        color: "#004441" // verde-bosque
    },
    {
        id: 6,
        nombre: "Ruta Familiar del Río",
        lat: 43.0310,
        lng: -4.3825,
        dificultad: "baja",
        duracion: "corta",
        tipo: "lineal",
        actividad: "senderismo",
        color: "#91C24E" // verde-claro
    },
    {
        id: 7,
        nombre: "Travesía de las Cumbres",
        lat: 43.0445,
        lng: -4.3780,
        dificultad: "alta",
        duracion: "larga",
        tipo: "lineal",
        actividad: "senderismo",
        color: "#004441" // verde-bosque
    },
    {
        id: 8,
        nombre: "Sendero del Bosque Encantado",
        lat: 43.0355,
        lng: -4.3870,
        dificultad: "media",
        duracion: "media",
        tipo: "circular",
        actividad: "senderismo",
        color: "#008071" // verde-cerceta
    },
    {
        id: 9,
        nombre: "Ruta BTT del Valle",
        lat: 43.0330,
        lng: -4.3765,
        dificultad: "media",
        duracion: "media",
        tipo: "circular",
        actividad: "bici",
        color: "#008071" // verde-cerceta
    },
    {
        id: 10,
        nombre: "Mirador de las Águilas",
        lat: 43.0405,
        lng: -4.3810,
        dificultad: "media",
        duracion: "corta",
        tipo: "lineal",
        actividad: "senderismo",
        color: "#36944B" // verde-montania
    },
    {
        id: 11,
        nombre: "Ruta del Puerto de Palombera",
        lat: 43.0370,
        lng: -4.3967,
        dificultad: "alta",
        duracion: "larga",
        tipo: "lineal",
        actividad: "senderismo",
        color: "#004441" // verde-bosque
    },
    {
        id: 12,
        nombre: "Sendero del Río Hijar",
        lat: 43.0346,
        lng: -4.3922,
        dificultad: "baja",
        duracion: "media",
        tipo: "circular",
        actividad: "senderismo",
        color: "#91C24E" // verde-claro
    },
    {
        id: 13,
        nombre: "Ruta BTT de Brañavieja",
        lat: 43.0391,
        lng: -4.3952,
        dificultad: "media",
        duracion: "larga",
        tipo: "circular",
        actividad: "bici",
        color: "#008071" // verde-cerceta
    }
];

// ============================================
// VARIABLES GLOBALES
// ============================================

let mapa;
let marcadores = [];
let filtrosActivos = {
    dificultad: [],
    duracion: [],
    tipo: [],
    actividad: []
};

// ============================================
// INICIALIZACIÓN DEL MAPA
// ============================================

function inicializarMapa() {
    const contenedorMapa = document.getElementById('mapa-rutas');
    if (!contenedorMapa) return;

    // Coordenadas de Alto Campoo
    const altoCampoo = [43.036630, -4.386733];

    // Determinar zoom inicial según ancho de pantalla
    let zoomInicial = 14;
    if (window.innerWidth >= 1024) {
        zoomInicial = 13; // Desktop - más zoom out para ver más área
    } else if (window.innerWidth >= 768) {
        zoomInicial = 13; // Tablet
    } else {
        zoomInicial = 13; // Móvil
    }

    // Crear el mapa
    mapa = L.map('mapa-rutas').setView(altoCampoo, zoomInicial);

    // Añadir capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
        minZoom: 10
    }).addTo(mapa);

    // Mostrar todas las rutas
    mostrarRutas(rutasData);
    
    // Ajustar mapa cuando cambia el tamaño de ventana
    window.addEventListener('resize', () => {
        mapa.invalidateSize();
        ajustarVistaAlContenido();
    });
    
    // Ajustar vista inicial para mostrar todas las rutas
    setTimeout(() => {
        ajustarVistaAlContenido();
    }, 100);
}

// Ajustar automáticamente el zoom para mostrar todas las rutas
function ajustarVistaAlContenido() {
    if (marcadores.length > 0) {
        const grupo = L.featureGroup(marcadores);
        mapa.fitBounds(grupo.getBounds(), {
            padding: [50, 50],
            maxZoom: 14
        });
    }
}

// ============================================
// GESTIÓN DE MARCADORES
// ============================================

function mostrarRutas(rutas) {
    // Limpiar marcadores existentes
    marcadores.forEach(marcador => mapa.removeLayer(marcador));
    marcadores = [];

    // Crear nuevos marcadores (sin interacción)
    rutas.forEach(ruta => {
        const marcador = L.circleMarker([ruta.lat, ruta.lng], {
            radius: 12,
            fillColor: ruta.color,
            color: '#ffffff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8,
            interactive: false
        }).addTo(mapa);

        marcadores.push(marcador);
    });
}

// ============================================
// SISTEMA DE FILTROS
// ============================================

function aplicarFiltros() {
    let rutasFiltradas = rutasData;

    // Aplicar filtros activos
    Object.keys(filtrosActivos).forEach(categoria => {
        if (filtrosActivos[categoria].length > 0) {
            rutasFiltradas = rutasFiltradas.filter(ruta => 
                filtrosActivos[categoria].includes(ruta[categoria])
            );
        }
    });

    // Actualizar marcadores en el mapa
    mostrarRutas(rutasFiltradas);
}

function aplicarFiltrosDesdeFormulario() {
    let rutasFiltradas = rutasData;

    // Obtener valores de los selects
    const dificultad = document.getElementById('filtro-dificultad').value;
    const duracion = document.getElementById('filtro-duracion').value;
    const tipo = document.getElementById('filtro-tipo').value;
    const actividad = document.getElementById('filtro-actividad').value;

    // Aplicar filtros solo si tienen valor
    if (dificultad) {
        rutasFiltradas = rutasFiltradas.filter(ruta => ruta.dificultad === dificultad);
    }
    if (duracion) {
        rutasFiltradas = rutasFiltradas.filter(ruta => ruta.duracion === duracion);
    }
    if (tipo) {
        rutasFiltradas = rutasFiltradas.filter(ruta => ruta.tipo === tipo);
    }
    if (actividad) {
        rutasFiltradas = rutasFiltradas.filter(ruta => ruta.actividad === actividad);
    }

    // Mostrar rutas filtradas
    mostrarRutas(rutasFiltradas);
    
    // Ajustar vista después de filtrar
    setTimeout(() => {
        ajustarVistaAlContenido();
    }, 100);
}

function limpiarFiltros() {
    // Resetear todos los selects a "Todas"
    document.getElementById('filtro-dificultad').value = '';
    document.getElementById('filtro-duracion').value = '';
    document.getElementById('filtro-tipo').value = '';
    document.getElementById('filtro-actividad').value = '';

    // Mostrar todas las rutas
    mostrarRutas(rutasData);
}

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    inicializarMapa();

    // Selects de filtro
    document.getElementById('filtro-dificultad').addEventListener('change', aplicarFiltrosDesdeFormulario);
    document.getElementById('filtro-duracion').addEventListener('change', aplicarFiltrosDesdeFormulario);
    document.getElementById('filtro-tipo').addEventListener('change', aplicarFiltrosDesdeFormulario);
    document.getElementById('filtro-actividad').addEventListener('change', aplicarFiltrosDesdeFormulario);
    
    // Botón limpiar
    const botonLimpiar = document.getElementById('limpiar-filtros');
    if (botonLimpiar) {
        botonLimpiar.addEventListener('click', limpiarFiltros);
    }
});
