


Dino.declare('Dino.widgets.ListBox', 'Dino.Widget', {
	
	_html: function() { return '<div></div>'; },
	
	defaultOptions: {
		cls: 'dino-border-all',
		components: {
			content: {
				weight: 2,
				dtype: 'box',
				cls: 'dino-scrollable-content dino-widget-content',
				content: {
					dtype: 'table',
					width: '100%',
					tableModel: {
						cell: {
							cls: 'dino-listbox-cell'	
						},
						row: {
							cls: 'dino-listbox-row',
							clickable: true,
							onClick: function() {
								this.parent.setSelectedItem(this);
							}
						}
					},
					components: {
						body: {
							onItemAdded: function(e) {
								this.parent.parent.parent.events.fire('onListItemAdded', {'listItem': e.item});
							}
						}
					}
				}
			},
			controls: {
				dtype: 'box',
				cls: 'dino-list-menu dino-border-top',
				defaultItem: {
//					dtype: 'text-button',
					cls: 'dino-list-menu-item'
				}
			}
		},
		editOnDblClick: false,
		closeButton: true
	},
	
	
	_init: function(o) {
		Dino.widgets.ListBox.superclass._init.apply(this, arguments);
		
		
		if('controls' in o) {
			var control_items = [];
			for(var i = 0; i < o.controls.length; i++) {
				var item = o.controls[i];
				if(Dino.isString(item)) item = {label: item};
				control_items.push(item);
			}
			Dino.utils.overrideOpts(o.components.controls, {items: control_items});			
		}
		
		
		
		var columns = []
		
		if('columns' in o) {
			for(var i = 0; i < o.columns.length; i++) {
				columns.push(o.columns[i]);
			}
		}
		else {
			columns.push({
				binding: 'auto',
				clickable: true,
				onDblClick: function() {
					var listBox = this.getParent(function(w) { return (w instanceof Dino.widgets.ListBox); })
					if(listBox.options.editOnDoubleClick) {
						this.startEdit();
					}
				}
			});
		}
		
		if(o.closeButton) {
			columns.push({
				cls: 'dino-icon-column',
				content: {
					dtype: 'icon',
					cls: 'ui-icon ui-icon-close dino-clickable',
					states: {
						'hover': ['ui-icon-closethick', 'ui-icon-close']
					},
					clickable: true,
					onClick: function() {
						var row = this.parent.getRow();
						var listBox = this.getParent(function(w) { return (w instanceof Dino.widgets.ListBox); })
						
						var e = new Dino.events.CancelEvent({target: row});
						listBox.events.fire('onDeleteListItem', e);
						
						if(!e.isCanceled) this.data.del();
					}
				}
			});
		}
		
		o.components.content.content.tableModel.columns = columns;
	},
	
	
	_opt: function(o) {
		Dino.widgets.ListBox.superclass._opt.apply(this, arguments);
		
		if('contentHeight' in o) this.content.opt('height', o.contentHeight);
				
	},
	
	
	getListItem: function(i) {
		return this.content.content.body.getItem(i);
	}
	
//	setSelected: function() {
//		this.content.content
//	}
	
	
	
}, 'list-box');






