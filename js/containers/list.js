


/**
 * Список
 * 
 * Работает только с ArrayDataSource
 * 
 */
Dino.declare('Dino.containers.List', 'Dino.containers.Box', {
	
	/**
	 * Подключаем данные.
	 * 
	 * data массив или ArrayDataSource
	 * 
	 */
	setData: function(data) {
		
		if(data == undefined) return;
		
		var o = this.options;
		
		if('dataId' in o)
			this.data = (data instanceof Dino.data.ArrayDataSource) ? data.item(o.dataId) : new Dino.data.ArrayDataSource(data, o.dataId);
		else
			this.data = (data instanceof Dino.data.ArrayDataSource) ? data : new Dino.data.ArrayDataSource(data);
		
		
		var self = this;
		
		// если добавлен новый элемент данных, то добавляем новый виджет
		this.data.events.reg('onItemAdded', function(e){
			self.addItem({
				'data': self.data.item(e.index)
			});
		});
		
		// если элемент данных удален, то удаляем соответствующий виджет
		this.data.events.reg('onItemDeleted', function(e){
			self.removeItem({data: self.item(e.index)});
		});
		
		// всем предопределенным виджетам подсоединяем источники данных
		this.eachItem(function(item, i){
			item.setData( self.data.item(i) )
		});
	},

	_dataChanged: function() {
		var self = this;
		this.data.each(function(val, i){
			self.addItem({ 'data': self.data.item(i) });
		});
	}
	
	
}, 'list');