
//= require <core/all>


//Ergo.html = {};


Ergo.defineClass('Ergo.html.Widget', 'Ergo.core.Widget', {
	
	defaults: {
	}
	
}, 'html:widget');



Ergo.$html = function(o, etype) {
	
	if(!Ergo.alias(o.etype)) {
		o.etype = 'html:widget';
		o.html = '<'+etype+'/>';
	}
	
	return Ergo.object(o);
};

