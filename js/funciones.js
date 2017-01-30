$(document).ready(function(){
    $(function(){
        $('.prueba').fadeIn(2500);
    });


   
    
    $(function(){
        $(".moamix1").moatext({effects:["lens","wave"]});
    });
});

$("div").ready(function(){
 $("#desaparece").mouseenter(function(){
        $(this).stop().fadeOut(1300);
       
    });
 $("#desaparece").mouseleave(function(){
 $(this).stop().fadeIn(1300); 
   });
 });


