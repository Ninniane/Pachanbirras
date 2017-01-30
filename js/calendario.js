

 //Ponemos el calendario en español
      YUI({lang: 'es-ES'}).use('calendar', function( Y ){
   
      var misReglas = null;

       //Función de ayuda para crear reglas
       function crearRegla( ano, mes, dias, nombre ){

         var regla = {};
         
         regla[ano] = {};
         regla[ano][mes - 1] = {}; 
         regla[ano][mes - 1][dias] = nombre;

         return regla;              
       }
       
       //Función de filtro para dar formato a las reglas
        function filtro( date, node, rules){
            if ( rules.indexOf('Pachangas') !== -1 )  node.addClass('Pachangas');
            if ( rules.indexOf('Cumpleañoss') !== -1 )  node.addClass('Cumpleañoss');
            if ( rules.indexOf('Pachanbirrass') !== -1 )  node.addClass('Pachanbirrass');
        }
        
        //Datos de eventos
        var eventos = {
          '2016': {
            '11': {
              '28': {
                'evento': 'Pachanga',
                'hora': '21:00',
                'descripcion': 'Pachanga en el Enrique Mas (partido aplazado)'
              }
            },
            '12': {
              '12': {
                'evento': 'Pachanbirras',
                'hora': '20:00',
                'descripcion': 'PACHANBIRRAS ORTIZ - FECRON UTD'
              },
              
              '19': {
                'evento': 'Pachanbirras',
                'hora': '21:00',
                'descripcion': 'CDK GLOBAL SPAIN - RESTAURANTE ORTIZ'
              }
            },
          },

          '2017': {
            '1': {
              '10': {
                'evento': 'Pachanbirras',
                'hora': '20:00',
                'descripcion': 'PARTIDO DE COPA: MORALEJA-REE - RESTAURANTE ORTIZ'
              },
              '16': {
                'evento': 'Pachanbirras',
                'hora': '21:00',
                'descripcion': 'CRISA FABRICACION - RESTAURANTE ORTIZ'
              },
              '23': {
                'evento': 'Pachanbirras',
                'hora': '20:00',
                'descripcion': 'RESTAURANTE ORTIZ - RSI'
              },
              '29': {
                'evento': 'Cumpleaños',
                'hora': 'Todo el día',
                'descripcion': 'Cumple de Dani. FELICIDADES!!'
              },
              '30': {
                'evento': 'Pachanbirras',
                'hora': '21:00',
                'descripcion': 'RESTAURANTE ORTIZ - REE TRES CANTOS'
              }
            },
            '2': {
              '7': {
                'evento': 'Pachanbirras',
                'hora': '20:00',
                'descripcion': 'NORMON - RESTAURANTE ORTIZ'
              },
              '13': {
                'evento': 'Pachanbirras',
                'hora': '21:00',
                'descripcion': 'NONAME SPORT - RESTAURANTE ORTIZ'
              },
              '20': {
                'evento': 'Pachanbirras',
                'hora': '21:00',
                'descripcion': 'RESTAURANTE ORTIZ - ADS CRISA'
              },
              '28': {
                'evento': 'Pachanbirras',
                'hora': '20:00',
                'descripcion': 'BAR PICAZO - RESTAURANTE ORTIZ'
              }
            },
            '3': {
              '6': {
                'evento': 'Pachanbirras',
                'hora': '21:00',
                'descripcion': 'RESTAURANTE ORTIZ - MORALEJA-REE'
              },
              '13': {
                'evento': 'Pachanbirras',
                'hora': '21:00',
                'descripcion': 'ALAMO CONSULTING  RESTAURANTE ORTIZ'
              },
              '27': {
                'evento': 'Pachanbirras',
                'hora': '21:00',
                'descripcion': 'RESTAURANTE ORTIZ - CDK GLOBAL SPAIN'
              }
            }
          }

        };       
 

       //Función que selecciona las reglas a aplicar al calendario según el mes
       function actualizarCalendario( fecha ){
       
         var Pachangas = [],
             Cumpleañoss = [],
             Pachanbirrass = [],
             ano = fecha.getFullYear(),
             mes = fecha.getMonth() + 1;
             
        //Extraemos los datos de los eventos del mes actual
        if ( eventos[ano] && eventos[ano][mes] ) {
          Y.Object.each( eventos[ ano ][ mes ], function( val, key ){
            if ( val.evento === 'Pachanga' ) Pachangas.push( key );
            if ( val.evento === 'Cumpleaños' ) Cumpleañoss.push( key );
            if ( val.evento === 'Pachanbirras' ) Pachanbirrass.push( key );
          });
        }

        Pachangas = Pachangas.join();
        Cumpleañoss = Cumpleañoss.join();
        Pachanbirrass = Pachanbirrass.join();
        

        //Creamos las reglas
        var diasPachangas = crearRegla( ano, mes, Pachangas, 'Pachangas'),
            diasCumpleañoss = crearRegla( ano, mes, Cumpleañoss, 'Cumpleañoss'),
            diasPachanbirrass = crearRegla( ano, mes, Pachanbirrass, 'Pachanbirrass');        
            
        misReglas = new Object();
        Y.aggregate( misReglas, diasPachangas );
        Y.aggregate( misReglas, diasCumpleañoss );
        Y.aggregate( misReglas, diasPachanbirrass );                    
  
        //Se las aplicamos al calendario
        calendario.set('customRenderer.rules', misReglas);
       }

            
                   
        
        var calendario = new Y.Calendar({
          boundingBox: '#calendario',
          height: '300px',
          width: '300px',
          date: new Date(),
          customRenderer: { rules: misReglas, filterFunction: filtro },
          render: true
        });

        actualizarCalendario( new Date() );

        calendario.on('dateChange', function( ev ){
          var nuevaFecha = ev.newVal;
          actualizarCalendario( nuevaFecha );
        });
        
        //Evento que se dispara al pinchar sobre algún día del calendario
        calendario.on('dateClick', function( ev ){
          var fechaSeleccionada = ev.date;
          mostrarEventoFecha( fechaSeleccionada );
        });
        
        function mostrarEventoFecha( fecha ){

          //Obtenemos las diferentes partes de la fecha
          var ano = fecha.getFullYear(),
             mes = fecha.getMonth() + 1,
             dia = fecha.getDate(),
             //plantilla para generar el html del cuadro de informacion             
             template = '<h2>{evento}</h2>' + 
                        '<div><b>Fecha:</b> {fecha} - {hora} </div>' +
                        '<p>{descripcion}</p>',
             evento, html;
             
          //Si hay eventos para dicha fecha lo mostramos en el panel INFO
          if ( eventos[ano][mes][dia] ){

            //Creamos un objeto con los datos necesarios para la plantilla
            evento = Y.aggregate( {fecha: [dia, mes, ano].join('/') }, eventos[ano][mes][dia] );
            html = Y.Lang.sub( template, evento );
            Y.one('#info').setHTML( html );
          }
             
        }
                
      });