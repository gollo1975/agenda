let frm = document.getElementById('formulario');
let eliminar = document.getElementById('btnEliminar');
var myModal = new bootstrap.Modal(document.getElementById('myModal'));

document.addEventListener('DOMContentLoaded', function() {
        var calendarEl = document.getElementById('calendar');
        var calendar = new FullCalendar.Calendar(calendarEl, {
          initialView: 'dayGridMonth',
          locale: 'es',
          headerToolbar:{
              left: 'prev next today',
              center: 'title',
              right: 'dayGridMonth timeGridWeek listWeek'
          },
          events: base_url + 'Home/listar',
          editable: true,
          dateClick: function(info){
            frm.reset();
            document.getElementById('id').value = '';
            eliminar.classList.add('d-none');
            document.getElementById('start').value = info.dateStr;
            document.getElementById('btnAccion').textContent = 'Registrar';
            document.getElementById('titulo').textContent = 'Crear agenda';
            myModal.show();  
          },
         eventClick : function (info){
          console.log(info);
          eliminar.classList.remove('d-none');
          document.getElementById('titulo').textContent = 'Modificar agenda';
          document.getElementById('btnAccion').textContent = 'Modificar';
          document.getElementById('id').value = info.event.id;
          document.getElementById('title').value = info.event.title;
          document.getElementById('start').value = info.event.startStr;
          document.getElementById('color').value = info.event.backgroundColor;
          myModal.show();
         },
         eventDrop: function(info){
            const id =  info.event.id;
            const fecha =  info.event.startStr;
            const url = base_url + 'Home/drop';
            const http = new XMLHttpRequest();
            const data = new FormData();
            data.append('id', id);
            data.append('fecha', fecha);
            http.open('POST', url, true);  
            http.send(data);
            http.onreadystatechange = function(){
                if(this.readyState == 4 && this.status == 200){
                  console.log(this.responseText);
                  const respuesta  = JSON.parse(this.responseText);
                  console.log(respuesta);
                  if (respuesta.estado) {
                    calendar.refetchEvents();
                  }
                  Swal.fire(
                    'Aviso',  
                    respuesta.msg,
                    respuesta.tipo,
                  )
                }
              }
         }

        })
        calendar.render();
        frm.addEventListener('submit', function(e){
          e.preventDefault();
          const title = document.getElementById('title').value;
          const fecha = document.getElementById('start').value;
          const color = document.getElementById('color').value;
          if(title == '' || fecha == '' || color == '' ){
            Swal.fire(
              'Aviso',
              'Todos los campos son requeridos.',
              'warning',
            )
          } else {
            const url = base_url + 'Home/registrar';
            const http = new XMLHttpRequest();
            http.open('POST', url, true);  
            http.send(new FormData(frm));
            http.onreadystatechange = function(){
              if(this.readyState == 4 && this.status == 200){
                const respuesta  = JSON.parse(this.responseText);
                if (respuesta.estado) {
                  calendar.refetchEvents();
                }
                myModal.hide();
                Swal.fire(
                  'Aviso',  
                  respuesta.msg,
                  respuesta.tipo,
                )
              }
            }

          }
        })
        eliminar.addEventListener('click', function(){
          myModal.hide();
          Swal.fire({
            title: 'Advertencia',
            text: "Esta serguro de eliminar la cita?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
             if (result.isConfirmed) {
                const id = document.getElementById('id').value;
                const url = base_url + 'Home/eliminar' + id;
                const http = new XMLHttpRequest();
                http.open('GET', url, true);  
                //http.send(new FormData(frm));
                http.onreadystatechange = function(){
                    if(this.readyState == 4 && this.status == 200){
                      console.log(this.responseText);
                      const respuesta  = JSON.parse(this.responseText);
                      console.log(respuesta);
                      if (respuesta.estado) {
                        calendar.refetchEvents();
                      }
                      Swal.fire(
                        'Aviso',  
                        respuesta.msg,
                        respuesta.tipo,
                      )
                    }
                 }
              }
           })       
        })
      });
