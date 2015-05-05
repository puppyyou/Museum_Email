var ableToClick = true;
var jsonFile = [];

$(document).ready(function() {

    console.log('selector.js init');

    $.getJSON('momadata.json').done(function(json){  
    
        // console.log('wooohoo',json.item.class[0].value);
        $.each(json, function(iterator, item) {     
            // get the img element from momadata.json file
             
            // console.log('AAaaa1',item.class[0].value);
            // console.log('AAaaa2',item.class[1].value);
            // console.log('AAaaa3',item.class[2].value);
            // console.log('AAaaa4',item.class[3].value);
            
            var li = $('<li style="display:inline-block">');
            var classVal = item.class[0].value + ' ' + item.class[1].value + ' ' + item.class[2].value + ' ' + item.class[3].value;
            //li.addClass(classVal).appendTo('#image-holder');
            li.addClass(classVal);
            $('.cd-gallery').children('ul').append(li);
            
            $('<img>')
                .attr('src', item.Img)
                .attr('id', iterator) 
                .attr('Floor', item.Floor)
                .attr('Department', item.Department)
                .attr('Name', item.Name)
                .attr('MoMA_number', item['MoMA_Number'])
                .appendTo(li)
                .click(clickHandler)
            
                console.log('Class.data -',classVal);
        });

        
    });


    $('.kicker').click(function() {
        console.log('kicker');
        ableToClick = true;
        $('.Good_1 img').remove();
        $("#reset_button").addClass("kicker");
        
        console.log("true");
    });

});

function clickHandler(){

   if (ableToClick) {

        // assign ID to image
        // click img : THIS
        var url = $(this).attr('src');
        var totalArray = $(".Good_1").children();
        var numImages;
        for (var i = 0; i < totalArray.length; i++) {
            if (totalArray[i].src == url) {                               
                return;
            }
        }
        
        +totalArray;

            if (totalArray.length >= 5) {
                console.log("woof");
                ableToClick = false;
                // alert("That's the last one");
                $(".kicker").removeClass("kicker");
               
        //remove class from CSS :  .hidden {display: none;}
            }


        var tempImg = document.createElement('img')
        tempImg.setAttribute('src', url)
        // append img to div .Good_1
        $('.Good_1').append(tempImg);
    }

}