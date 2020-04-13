$(document).ready(function(){
    let btn = document.getElementById("btnSubmit")
    var resultRecieved = false
    let resultsID = []

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
                url:`/Analysis/getall?zipCode=${zC}`,
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


    let age = document.getElementById('age')
    age.onclick = function(){
        if(resultRecieved==false){
            alert("Enter info If entered then no results found")
            return;
        }
        let x = document.getElementById("displayAgeGraph");
        x.style.display = "block";
        let AgeGrp = [10,20,30,40,50]
        let AgeCount = [0,0,0,0,0]
        let AgeJsonObj = {}
        let count = 0
        for(let i=0;i<resultsID.length;i++){
            for(let j=0;j<AgeGrp.length;j++){
                $.ajax({
                    url:'/countDonors',
                    method:"POST",
                    data:{BloodCampId:resultsID[i], age:AgeGrp[j],gender:"Any",bloodGrp:"Any"},
                    success:function(result){
                        AgeCount[j] += parseInt(result)
                        count++;
                        if(count== parseInt(resultsID.length * AgeGrp.length))
                            DisplayAge()
                    },
                    error:function(e){
                        console.log(e)
                    }
                })
            }
        }

        function DisplayAge(){
            for(let i=0;i<AgeGrp.length;i++)
            AgeJsonObj[AgeGrp[i]]=AgeCount[i]
            console.log("Age Count Here ",AgeJsonObj)

            var ctx = document.getElementById('ageBarGraph').getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['10-20', '20-30', '30-40', '40-50', 'Above 50'],
                    datasets: [{
                        label: 'Number of donors in different age groups',
                        data: AgeCount,
                        backgroundColor: [
                            '#003f5c','#58508d','#bc5090','#ff6361','#ffa600'
                        ],
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        }
    }


    let gender = document.getElementById('gender')
    gender.onclick = function(){
        if(resultRecieved==false){
            alert("Enter info If entered then no results found")
            return;
        }
        let x = document.getElementById("displayGenderGraph");
        x.style.display = "block";
        let GenderGrp = ['M','F']
        let GenderCount = [0,0]
        let GenderJsonObj = {}
        let count = 0;
        for(let i=0;i<resultsID.length;i++){
            for(let j=0;j<GenderGrp.length;j++){
                $.ajax({
                    url:'/countDonors',
                    method:"POST",
                    data:{BloodCampId:resultsID[i], age:"Any",gender:GenderGrp[j],bloodGrp:"Any"},
                    success:function(result){
                        GenderCount[j] += parseInt(result)
                        count++;
                        if(count== parseInt(resultsID.length * GenderGrp.length))
                            DisplayGender()
                    },
                    error:function(e){
                        console.log(e)
                    }
                })
            }
        }

        function DisplayGender(){
            for(let i=0;i<GenderGrp.length;i++)
            GenderJsonObj[GenderGrp[i]]=GenderCount[i]
            console.log("Gender Count Here ",GenderJsonObj)

            var ctx = document.getElementById('genderPieChart').getContext('2d');
            var myPieChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Male','Female'],
                    datasets: [{
                        label: 'Number of donors gender wise',
                        data: GenderCount,
                        backgroundColor: [
                            'rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)'
                        ],
                    }]
                },
            });
        }    
    }


    let BloodGrp = document.getElementById('BloodGrp')
    BloodGrp.onclick = function(){
        if(resultRecieved==false){
            alert("Enter info If entered then no results found")
            return;
        }
        if(resultRecieved==false){
            alert("Enter info If entered then no results found")
            return;
        }
        let x = document.getElementById("displayBloodGpGraph");
        x.style.display = "block";
        let BgGrp = ["O+","O-","B-","B+","AB+","AB-"]
        let BgCount = [0,0,0,0,0,0]
        let BgJsonObj = {}
        let count = 0
        for(let i=0;i<resultsID.length;i++){
            for(let j=0;j<BgGrp.length;j++){
                $.ajax({
                    url:'/countDonors',
                    method:"POST",
                    data:{BloodCampId:resultsID[i], age:"Any",gender:"Any",bloodGrp:BgGrp[i]},
                    success:function(result){
                        BgCount[j] += parseInt(result)
                        count++;
                        if(count== parseInt(resultsID.length * BgGrp.length))
                            DisplayBg()
                    },
                    error:function(e){
                        console.log(e)
                    }
                })
            }
        }

        function DisplayBg(){
            for(let i=0;i<BgGrp.length;i++)
            BgJsonObj[BgGrp[i]]=BgCount[i]
            console.log("Age Count Here ",BgJsonObj)

            var ctx = document.getElementById('bloodGrpBarGraph').getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: BgGrp,
                    datasets: [{
                        label: 'Number of different blood group donors',
                        data: BgCount,
                        backgroundColor: [
                            '#ffa600','#ff6361','#bc5090','#36a2eb','#58508d','#003f5c'
                        ],
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        }  
    }

})
