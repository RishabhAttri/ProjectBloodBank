$(document).ready(function(){
    let btn = document.getElementById("btnSubmit")
    var resultRecieved = false
    btn.onclick = function(){
        let hID = document.getElementById("hospitalId")
        let name = document.getElementById("name")
        getResults(hID.value,name.value)
        
        
        function getResults(hID,name){
            $.ajax({
                url:`/getResult`,
                method:'POST',
                data:{hospitalId:hID,Name:name},
                success:function(result){
                    console.log(result)
                    console.log(result[0].zipCode)
                    closestHospitals(result[0].zipCode)
                },
                error: function(e) {
                    console.log(e);
                    alert("Either the id or the name is wrong")
                }
            })
        }

        function closestHospitals(zC){
            $.ajax({
                url:`/Query/getall?zipCode=${zC}`,
                method:'GET',
                success:function(result){
                    let list = document.getElementById('listBank')
                    for(let i=0;i<result.length;i++){
                        let li = document.createElement('li')
                        let text = document.createTextNode(result[i].BloodCampId + result[i].Name)
                        console.log(result[i])
                        li.appendChild(text)
                        list.appendChild(li)
                    }
                    resultRecieved = true
                },
                error:function(e){
                    console.log(e)
                }
            })
        }
    }