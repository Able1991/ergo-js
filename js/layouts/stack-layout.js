

Dino.declare('Dino.layouts.StackLayout', 'Dino.layouts.PlainLayout', {
	
	defaultOptions: {
		containerCls: 'dino-stack-layout',
		itemCls: 'dino-stack-item dino-hidden'
	},
	
	activate: function(i) {
		
		var item = (i instanceof _dino.Widget) ? i : this.container.getItem(i);
		
		this.container.eachItem(function(it){
			it.el.toggleClass('dino-hidden', (it != item));
		});
		
		if(item.layout) item.layout.update();
		
	}
	
}, 'stack-layout');