// Función para obtener la lista de estudiantes// Función para obtener la lista de estudiantes (con medias y click para ver notas)
function getEstudiantes() {
    axios.get('https://api-notas-final-production.up.railway.app/api/estudiantes')
        .then(function (response) {
            const estudiantes = response.data;
            const studentsList = document.getElementById('students');
            studentsList.innerHTML = '';

            estudiantes.forEach(function (estudiante) {
                const li = document.createElement('li');
                li.classList.add('p-4', 'bg-gray-50', 'rounded', 'shadow', 'hover:bg-gray-100', 'cursor-pointer');
                li.textContent = `${estudiante.nombre} ${estudiante.apellidos} - Media: cargando...`;

                // Cargar la media de cada estudiante
                axios.get(`https://api-notas-final-production.up.railway.app/api/estudiantes/${estudiante.id}/media`)
                    .then(function (resMedia) {
                        const media = resMedia.data.media;
                        li.textContent = `${estudiante.nombre} ${estudiante.apellidos} - Media: ${media !== null ? media.toFixed(2) : 'Sin notas'}`;
                    })
                    .catch(function (error) {
                        console.log(error);
                        li.textContent = `${estudiante.nombre} ${estudiante.apellidos} - Media: error al obtener`;
                    });

                // Evento para ver sus notas por asignatura
                li.addEventListener('click', function () {
                    getNotasEstudiante(estudiante.id, `${estudiante.nombre} ${estudiante.apellidos}`);
                });

                studentsList.appendChild(li);
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}


// Función para obtener la lista de asignaturas
function getAsignaturas() {
    axios.get('https://api-notas-final-production.up.railway.app/api/asignaturas')
        .then(function (response) {
            const asignaturas = response.data;
            const assignmentsList = document.getElementById('assignments');
            assignmentsList.innerHTML = '';
            asignaturas.forEach(function (asignatura) {               
                const li = document.createElement('li');
                li.classList.add('p-4', 'bg-gray-50', 'rounded', 'shadow', 'hover:bg-gray-100');
                li.textContent = `${asignatura.nombre} - Curso: ${asignatura.curso} - Media: cargando...`;
                assignmentsList.appendChild(li);

                // Ahora pedimos la media de cada asignatura
                axios.get(`https://api-notas-final-production.up.railway.app/api/asignaturas/${asignatura.id}/media`)
                .then(function (resMedia) {
                    const media = resMedia.data.media;
                    li.textContent = `${asignatura.nombre} - Curso: ${asignatura.curso} - Media: ${media !== null ? media.toFixed(2) : 'Sin notas'}`;
                })
                .catch(function (error) {
                    console.log(error);
                    li.textContent = `${asignatura.nombre} - Curso: ${asignatura.curso} - Media: error al obtener`;
                });
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}

// Función para obtener la media global de las notas
function getMediaGlobal() {
    axios.get('https://api-notas-final-production.up.railway.app/api/media')
        .then(function (response) {
            const mediaGlobal = response.data.media_global;
            document.getElementById('global-media').textContent = `La media global de las notas es: ${mediaGlobal}`;
        })
        .catch(function (error) {
            console.log(error);
        });
}
// Nueva función para obtener las notas de un estudiante
function getNotasEstudiante(id, nombreCompleto) {
    axios.get(`https://api-notas-final-production.up.railway.app/api/estudiantes/${id}/notas`)
        .then(function (response) {
            const notas = response.data;
            const notesList = document.getElementById('notes-list');
            const title = document.getElementById('student-notes-title');
            const container = document.getElementById('student-notes');

            title.textContent = `Notas de ${nombreCompleto}`;
            notesList.innerHTML = ''; // Limpiar lista anterior

            if (notas.length === 0) {
                const li = document.createElement('li');
                li.textContent = 'Este estudiante no tiene notas registradas.';
                li.classList.add('text-gray-500', 'italic');
                notesList.appendChild(li);
            } else {
                notas.forEach(function (nota) {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <span class="font-semibold">${nota.asignatura}</span>: 
                        <span class="text-blue-600">${nota.nota}</span>
                    `;
                    li.classList.add('p-2', 'bg-gray-50', 'rounded', 'shadow');
                    notesList.appendChild(li);
                });
            }

            container.classList.remove('hidden'); // Mostrar contenedor
        })
        .catch(function (error) {
            console.log('Error al obtener notas del estudiante:', error);
        });
}
// Llamadas a las funciones cuando la página se cargue
window.onload = function() {
    getEstudiantes();
    getAsignaturas();
    getMediaGlobal();
    
};
