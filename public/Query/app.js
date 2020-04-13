$(document).ready(function(){
    let btn = document.getElementById("btnSubmit")
    var resultRecieved = false
    let resultsID = []
    let queryBtn = document.getElementById('QueryBtn')

    btn.onclick = function(){
        let x = document.getElementById("closebb");
        x.style.display = "block";

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
                        resultsID.push(result[i].BloodCampId)
                    }
                    resultRecieved = true
                },
                error:function(e){
                    console.log(e)
                }
            })
        }
    }


    queryBtn.onclick = function(){
        let count =0;
        if(resultRecieved==false){
            alert("Please Enter the hospital details")
            return ;
        }
        let age = document.getElementById('Age')
        let gender = document.getElementById('Gender')
        let bloodGrp = document.getElementById('bloodGrp')
        let answer = 0
        let index;
        let len = resultsID.length
        for(let i=0; i<resultsID.length;i++){
            countDonors(i)
        }

        function countDonors(i){
            $.ajax({
                url:'/countDonors',
                method:"POST",
                data:{age:age.value,gender:gender.value,bloodGrp:bloodGrp.value,BloodCampId:resultsID[i]},
                success:function(result){
                    if(parseInt(result)>parseInt(answer)){
                        index=i+1;
                        answer=result;
                    }
                    count++;
                    if(count==len)
                        displayResult()
                },
                error:function(e){
                    console.log(e)
                }
            })
        }

        function displayResult(){
            let ans = document.getElementById('Ans')
            ans.style.display = "block";
            $.ajax({
                url:'/getBloodCamp',
                method:"POST",
                data:{ID:index},
                success:function(result){
                    let text = document.createTextNode(result[0].BloodCampId + " " + result[0].Name)
                    ans.appendChild(text)
                    ans.appendChild(document.createElement("br"))
                },
                error:function(e){
                    console.log(e)
                }
            })
        }
        
    }

})
