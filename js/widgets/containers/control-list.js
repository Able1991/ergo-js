
//= require <widgets/box>
//= require <widgets/split>



Ergo.declare('Ergo.widgets.ControlList', 'Ergo.widgets.Box', {
	
	defaults: {
		cls: 'ergo-control-list'
	}
	
//	$itemFactory: function(o) {
//		
//		if(o === '-')	o = {etype: 'split'}
//		
//		return Ergo.widgets.ControlList.superclass.$itemFactory.call(this, o);
//	}
	
	
}, 'control-list');


