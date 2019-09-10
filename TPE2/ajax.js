"use strict";

document.addEventListener("DOMContentLoaded", iniciarPagina);
let url= "http://web-unicen.herokuapp.com/api/groups/81/tpe3";
function iniciarPagina () { 
    let ranking = {
        "puesto" : "Puesto",
        "jugador" : "Jugador",  
        "pais" : "Pais",
        "opciones" : "opciones"
    }
    
    function rank () {//cargo el encabezado de mi tabla
        tabla.innerHTML += "<thead>"+"<tr>"+"<th>"+ranking.puesto+"</th>"+"<th>"+ranking.jugador+"</th>"
        +"<th>"+ranking.pais+"</th>"+"<th>"+ ranking.opciones + "</th>" +"</tr>"+"</thead>"
    }
    
    async function cargar() {//cargo la tabla por completo
        try{
            let bodytabla=document.querySelector("#menu_tabla");
            bodytabla.innerHTML=" ";
            
            let rta = await fetch(url);
            if (rta.ok) {
                let json= await rta.json();
                for (const element of json.tpe3) {
                    let btnborrar= document.createElement("button");
                    let btneditar= document.createElement("button");
                    
                    btnborrar.innerHTML= "Borrar";
                    btneditar.innerHTML= "Editar";
                    
                    btnborrar.addEventListener("click", function(){borrar_fila(element._id)});
                    btneditar.addEventListener("click",function(){editar_fila(element._id,btneditar)});
                    
                    let tbl= document.createElement("tr");
                    
                    let tdpuesto=document.createElement("td")
                    let tdjugador=document.createElement("td")
                    let tdpais=document.createElement("td")
                    let tdbtns=document.createElement("td")            
                    
                    tdpuesto.innerHTML = element.thing.puesto;
                    tdjugador.innerHTML = element.thing.jugador;
                    tdpais.innerHTML = element.thing.pais;
                    
                    tdbtns.append(btnborrar,btneditar);
                    
                    tbl.append(tdpuesto, tdjugador, tdpais, tdbtns);
                    bodytabla.appendChild(tbl);
                }
            }
        }
        catch(e) {
        }
    }
    rank();
    cargar();
    setInterval(cargar,8000);//auto-actualizacion
    
    
    document.getElementById("enviar_fila").addEventListener("click",async function(){//cargo la fila en mi API
        let fila = { 
                    "thing":{
                        "puesto" : document.getElementById("puesto").value,
                        "jugador" : document.getElementById("jugador").value,
                        "pais" : document.getElementById("pais").value,
                        
                    }
                }
                try{
                    let rta = await fetch (url,{
                        "method": "POST",
                        "headers":{
                            "content-type": "application/json"
                        },
                        "body": JSON.stringify(fila)
                    });
                    let jsons= await rta.json();
                    cargar();
                    document.getElementById("puesto").value="";
                    document.getElementById("pais").value="";
                    document.getElementById("jugador").value="";
                
                }
                catch(e){
                    console.log(e)
                }
    });
    document.getElementById("enviar_tres").addEventListener("click",async function(){
        let fila = { 
            "thing":{
                "puesto" : document.getElementById("puesto").value,
                "pais" : document.getElementById("pais").value,
                "jugador" : document.getElementById("jugador").value,
            }
        }
        try{
            for (let i = 0; i < 3; i++) { //Cargo 3 filas iguales a mi API            
                let rta = await fetch (url,{
                    "method": "POST",
                    "headers":{
                        "content-type": "application/json"
                    },
                    "body": JSON.stringify(fila)
                });
                let jsons= await rta.json();
            }
            cargar();//imprimo la tabla
        }
        catch(e){
            console.log(e)
        }
});

    async function borrar_fila(id){
        try{
            let rta= await fetch(url + "/" + id,{
                "method": "DELETE"
            });
            let json= await rta.json();       
            cargar();
        }
        catch(e){
        }
    }
    //declaro variables a utilizar en mis funciones dentro de editar fila(y editar fila)
    let crear=false
    let cont=document.querySelector(".completa_tabla");
    let divin=document.querySelector(".inputs");
    let btns=document.querySelector(".buttons");
  
    async function editar_fila(id, btneditar){
        let fila = { 
            "thing":{
                "puesto" : document.getElementById("puesto").value,
                "jugador" : document.getElementById("jugador").value,
                "pais" : document.getElementById("pais").value,
            }
        }
        try{
            if((document.getElementById("puesto").value=='')&&(crear==false)){
                console.log("primer if");

                cont.classList.add("inputs_editar")
                let text1=document.createElement("h2");
                let aviso=document.createTextNode("Ingrese datos y presione Editar:");
                text1.appendChild(aviso);
                text1.setAttribute("id","h");
                
                let btncancelar= document.createElement("button");
                btncancelar.setAttribute("id","bt");
                btncancelar.innerHTML= "Cancelar";
                
                cont.insertBefore(text1,divin); 
                cont.appendChild(btncancelar);
                crear=true;

                
                
                
            }
            
            
            if((crear==true) && (document.getElementById("pais").value!="")){
                console.log("seg if");
                let rta=await fetch(url + "/" + id,{
                    "method": "PUT",
                    "mode": 'cors',
                    "headers": { "Content-Type": "application/json" },
                    "body": JSON.stringify(fila)
                });
                let jsons= await rta.json();
                cargar();

                if(crear==true){
                    console.log("3 if");
                    ocultarFormEditar (btneditar);
                }
            }
        }
        catch(e){
            console.log(e);
        }
    }
    
 
    
  
}