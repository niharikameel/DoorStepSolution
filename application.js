 $(document).ready(function(){
 window.scrollTo(500, 0);
$('#login').click(function(){

}); 
});


//ajax call for sub services
function subservicesload(){
var id=$("#services").val();
 $.ajax ({
            type:'GET', 
            url: '/subservices/'+id,
            success: function(response) {
            if(response){
                response.forEach(function(service){
                 $("#subservices").append("<option value="+service.id+">"+service.name+"</option>");
                })
            }
            console.log(response);
            }
        });
        }