
//= require "selectable"
//= require "focusable"


Ergo.declare_mixin('Ergo.mixins.ListNavigation', function(o) {
	
	Ergo.smart_override(o, {
		
//		extensions: [Ergo.Selectable, Ergo.Focusable],
		
		onKeyDown: function(e)	{
			
	    var catched = false;
	    var selected_row = this.selection.get();
	    if(selected_row) {
				
				var container = selected_row.parent;
	      
				if(e.keyCode == 38) {
	        var prev_row = selected_row.prev();// container.items.get(selected_row.index-1);
	        if(prev_row) {
	          this.selection.add( prev_row );
	          var pos = prev_row.el.offset().top - this.el.offset().top;
	          if(pos < 0) {
	            this.el.scrollTop(this.el.scrollTop() - prev_row.el.outerHeight());
	          }
	//                console.log(Ergo.format('%s, %s, %s', this.el.scrollTop(), this.parent.el.height(), offset));
	        }
	        catched = true;
	      }
	      if(e.keyCode == 40) {
	        var next_row = selected_row.next();// container.items.get(selected_row.index+1);
	        if(next_row) {
	          this.selection.add( next_row );
	          var pos = next_row.el.offset().top - this.el.offset().top;
	          if(this.el.height() - next_row.el.outerHeight() < pos) {
	            this.el.scrollTop(this.el.scrollTop() + next_row.el.outerHeight());
	          }
	//                console.log(Ergo.format('%s, %s, %s', this.el.scrollTop(), this.parent.el.height(), next_row.el.position().top));                
	        }
	        catched = true;
	      }
				if(e.keyCode == 13) {
					var editable = false;
					selected_row.walk(function(){
						if(!editable && this.is(Ergo.Editable)) {
							editable = this;
						}
					});
					
					if(editable) {
						editable.startEdit();
					}
					
					
				}
	    }              
	    
	    if(catched) e.baseEvent.preventDefault();
			
		}
		
		
		
	});	
	
}, 'listnavigation');
