



Dino.declare('Dino.framework.Application', 'Dino.BaseObject', {
	
	initialize: function(o) {
		Dino.framework.Application.superclass.initialize.apply(this, arguments);		
		
		var self = this;
		
//		$(window).ready(function() {
			
			// Растягиваем страницу на всю высоту окна	
		var h = $(window).height();
		var dh = $('body').outerHeight(true) - $('body').height();
		$('body').height(h - dh);
		$('body').attr('autoheight', true);	
		

		$(document).ajaxError(function(e, xhr, ajaxOpts, err) {
			growl.err(xhr.responseText, true);
		});
		
		
		this.root = $.dino(Dino.utils.overrideOpts({
			dtype: 'box',
			renderTo: 'body',
			cls: 'application'
		}, o));
		
		
		$(window).resize(function(){
			
			var h = $(window).height();
			var dh = $('body').outerHeight(true) - $('body').height();
			$('body').height(h - dh);
			
			self.root.$layoutChanged();
		});	
		
		this.init_default_growl();	 //<-- инициализируем growl	
			
//		});
		
	},
	
	
	init_default_growl: function() {
		
		this.growl = $.dino({
			dtype: 'growl',
			renderTo: 'body'
		});
	
		var self = this;
	
		growl = {
				info: function(m, isHtml) {this.msg(m, 'info', isHtml);},
				err: function(m, isHtml) {this.msg(m, 'critical', isHtml);},
				warn: function(m, isHtml) {this.msg(m, 'warning', isHtml);},
//				html: function(m, isHtml) { Dino.growl.addItem({html: m, icon: 'dino-icon-growlbox-info'}) },
				msg: function(m, type, isHtml) {
					var s = (Dino.isString(m)) ? m : Dino.pretty_print(m);
					var o = {
						icon: 'dino-icon-growlbox-'+type,
						state: type					
					};
					(isHtml) ? o.htmlMessage = s : o.message = s;
					self.growl.addItem(o);
				}
			}
		
		
	}
		
});