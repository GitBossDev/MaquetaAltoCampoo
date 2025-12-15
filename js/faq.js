// ============================================
// FAQ - ACORDEÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const preguntasFaq = document.querySelectorAll('.pregunta-faq');
    
    preguntasFaq.forEach(pregunta => {
        pregunta.addEventListener('click', () => {
            const respuesta = pregunta.nextElementSibling;
            const icono = pregunta.querySelector('.icono-faq');
            const estaActivo = pregunta.classList.contains('activo');
            
            // Cerrar todas las preguntas activas
            preguntasFaq.forEach(p => {
                const r = p.nextElementSibling;
                const i = p.querySelector('.icono-faq');
                
                p.classList.remove('activo');
                p.setAttribute('aria-expanded', 'false');
                r.classList.remove('activa');
                i.textContent = '+';
            });
            
            // Si la pregunta clickeada no estaba activa, abrirla
            if (!estaActivo) {
                pregunta.classList.add('activo');
                pregunta.setAttribute('aria-expanded', 'true');
                respuesta.classList.add('activa');
                icono.textContent = '−';
            }
        });
    });
});
