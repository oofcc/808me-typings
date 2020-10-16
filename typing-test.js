$(function () 
{
    $(document).keydown(function (k) 
    {
        realWPM = Math.round((error_keystrokes / 5) / ((60.01 - countdown) / 60));
        
	if(realWPM < 0 || realWPM > 400)
    	{
        	realWPM = 0;
    	}

        $('#preview').html("<font size='+3'><b>WPM:</b> " + 
        realWPM + "<br><b>Key Strokes:</b> " + 
        error_keystrokes + "<br><b>Words:</b> " + 
        error_correct + "</<font size='+3'>");       
        
        $('#words').before("<div id='preview'></div>");        
    })
})