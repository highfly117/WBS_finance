function Finance() {


    var counter = 0;
    var notfirsttime = 'false';
    var commaon = 'false';
    var query = "<Query><Where><Neq><FieldRef Name='LinkTitle'/><Value Type='Text'>''</Value></Neq></Where></Query>"



    $().SPServices 																										// this is the SPservices function that connects the sharepoint list to the web app (dashboard)
    ({
        operation: "GetListItems", 																						// This is the operation in this case to pull entries in from the listName
        listName: "WBSlist", 																							// This is the name of the list to pull from
        //CAMLQuery: query , 																							// this is the query to define the data you want if you want all entries just delete this line
        CAMLViewFields: "<ViewFields><FieldRef Name='LinkTitle' /><FieldRef Name='Spent' /></ViewFields>", 				// This defines what columns in the list to pull back
        completefunc: function(xData, Status) 																			// I dont know what this is doing it is part of the SPServices code
        {
            if (Status != 'error') {
                var SLarray = new Array();
                var currentSL = ''; 																					// this varable is here so that linktitle is only picked up once for each distinced entry as currentSL is set to latest linktitle		
                $(xData.responseXML).SPFilterNode("z:row").each(function() 												// I'm not sure what this does i think it's the function that creates rows of data
                    {
                        if ($(this).attr("ows_LinkTitle") != currentSL && $(this).attr("ows_LinkTitle") != undefined) 	// if this value of the column entry does not equal the previous linktitle and is not undefined then carry on
                        {
                            if (notfirsttime == 'true') 																// this is to move the linktitle into the next array entry since the first array entry is 0 the first time this code is skipped
                            { 
                                counter++; 																				// once the first[0] array entry is used we need to add one to the next entry and this makes counter move 1 each time for a new LinkTitle 
                            }

                            notfirsttime = 'true'; 																		// this is the switch that starts moving the linktitle counter to start adding to the counter
                            commaon = 'false'; 																			// this is to add comma's to the array in textoutput2 i dont think it's relevent here
                            SLarray[counter] = new Array(); 															// this sets the first array to new array(); I dont really know why
                            SLarray[counter][0] = $(this).attr("ows_LinkTitle"); 										// this sets the the Array table and the [counter] of the array to the first distincte linktitle i think
                            SLarray[counter][1] = 0; // Value in $														// this then sets the second entry [1] in the array to. so SLarray at this point would be (BOB,0) if the first link title was bob 
                            //SLarray[counter][2] = 0; // Number of Calls												// not relevent in this project	
                            //SLarray[counter][3] = 0; // hours															// not relevent in this project	
                            currentSL = $(this).attr("ows_LinkTitle"); 													// this sets currentSL to the linktitle so duplicate linktitles are not recorded in the output
                        }
						
                        var SpentFix = $(this).attr("ows_Spent").substring(7);											// once SLarray has its first LinkTitle this then pulls the Spent column value, however Spent is a computed field and has "float,#"" in front of the data so it needs cutting off 																															//thats what substring 
                        if (SpentFix != undefined) {																	// if the column entry is not empty carry on.
                            var mynumber = parseFloat(SpentFix);														// parseFloat just turns spentFix into a floating point number
                            SLarray[counter][1] += Math.round(mynumber);												// this adds Spent (now spentfix) into the second entry to the array because it's a += its an total for each line that that has the same LinkTitle
                            //SLarray[counter][2]++;
                            //var mynumber2 = parseFloat($(this).attr("ows_Actual_x0020_Effort"));
                            //SLarray[counter][3]+=Math.round(mynumber2);
                        }
                    });
                var textoutput = '[';
                var textoutput2 = '[';
                var commaon = false;
                var p=0;
                //$( "<tr><td rowspan='3'>1</td><td rowspan='3'>"+ SLarray[p][0] +"</td><td>3</td><td>4</td><td rowspan='3'>5</td><td rowspan='3'>"+ SLarray[p][1] +"</td><td>7</td><td rowspan='3'>8</td></tr>" ).prependTo( "#ResultsTable" );
                   for (var p = 0; p < SLarray.length; p++) {
                    //$('#tblData').append('<tr><td style="padding:5px;border:solid 1px #d1d1d1;">'+SLarray[p][0]+'</td><td style="padding:5px;border:solid 1px #d1d1d1;">'+SLarray[p]	[1]+'</td></tr>');
                    textoutput += '["' + SLarray[p][0] + '","' + SLarray[p][1] + '"]';
                    //$( "<tr><td rowspan='3'>1</td><td rowspan='3'>"+ SLarray[p][0] +"</td><td>3</td><td>4</td><td rowspan='3'>5</td><td rowspan='3'>"+ SLarray[p][1] +"</td><td>7</td><td rowspan='3'>8</td></tr>" ).appendTo( "#ResultsTable" );
                    if (commaon) {
                        textoutput2 += ',';
                    }
                    textoutput2 += '["' + SLarray[p][0] + '",' + SLarray[p][1] + ',' + SLarray[p][2] + ',' + SLarray[p][3] + ']';
                    commaon = true;
                }
                textoutput += ']';
                textoutput2 += ']';
                if (SLarray.length > 0) {
                   //$( "<tr><td rowspan='3'>1</td><td rowspan='3'>"+ SLarray[p][0] +"</td><td>3</td><td>4</td><td rowspan='3'>"+ SLarray[p][1] +"</td><td rowspan='3'>6</td><td>7</td><td rowspan='3'>8</td></tr>" ).appendTo( ".outputtest" );


                    //alert(textoutput);
                   
                } else {
                    $('#Data').html('<P>No data</P>');
                    $('#chart_div').hide();
                    $('#chart_div2').hide();
                    $('#table_div').hide();
                }
            } else {
                alert('ERROR!');
            }
        }
    });

}