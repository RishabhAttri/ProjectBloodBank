$(document).ready(function(){
    var btn=document.getElementById('btnSubmit');
    btn.onclick=function(){
        
        var id = document.getElementById('ID');
        var name = document.getElementById("Name");
        var area = document.getElementById("Area");
        var zipCode = document.getElementById("zipCode")
        var rows = []
        var count = 0
        var length;
        InsertBloodCamp();
        $('#files').parse({
            config: {
                delimiter: "auto",
                complete: parseFileValues,
            }
        });
  
        
        async function parseFileValues(results){
            var data = results.data;
            length=results.data.length
            for(i=1;i<data.length;i++){
                var row = data[i];
                var cells = row.join(",").split(",");
                // var data={col1:cells[5],col2:cells[6],col3:cells[7],col4:cells[8]}
                callApiForPred(cells[4],cells[5],cells[6],cells[7],i)
                rows.push(cells)
            }
            console.log(rows);
        }

        function callApiForPred(col1,col2,col3,col4,i){
            $.ajax({
                url: `https://mighty-tundra-22355.herokuapp.com/predict_api`,
                method :'POST',
                data:{col1:col1,col2:col2,col3:col3,col4:col4},
                success: function(result){
                    console.log("OK",result)
                    if(result=="BYE")
                        rows[i-1][8]=false;
                    else    
                        rows[i-1][8]=true;
                    count++;
                    if(count==length-1){
                        console.log(rows);
                        insertRows(rows);
                    }
                }});
        }
        function insertRows(rows){
            for(var i=0;i<rows.length;i++){
                var rowIns={Donor_id:rows[i][0],BloodCampId:id.value,BloodGrp:rows[i][1],Age:rows[i][2],Gender:rows[i][3],MonthsLastDon:rows[i][4],
                    TotDon:rows[i][5], VolDon:rows[i][6], MonthsFirstDon:rows[i][7], BloodDonNxt:rows[i][8]}
                $.ajax({
                    url:`/insertRowDonor`,
                    method:'POST',
                    data:rowIns,
                    success: function(result){
                        console.log("Inserted");
                    }
                })
            }
        }
        function InsertBloodCamp(){
            var data={BloodCampId:id.value,Name:name.value,Area:area.value,zipCode:zipCode.value}
            $.ajax({
                url:`/insertRowCamp`,
                method:"POST",
                data:data,
                success: function(result){
                    console.log("Camp Value Inserted")
                }
            })
        }
    }
    
})