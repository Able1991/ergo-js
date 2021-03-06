
//= require "events"


/**
 * Источник данных
 * 
 * Опции:
 * 	`lazy` "ленивое" создание элементов (только когда происходит обращение по ключу)
 * 
 * События:
 * 	`value:changed` изменился источник данных
 * 	`entry:changed` изменился элемент
 * 	`entry:added` добавлен элемент
 * 	`entry:deleted` удален элемент
 * 
 * @class
 * @name Ergo.core.DataSource
 * @extends Ergo.core.Object
 * 
 */
Ergo.declare('Ergo.core.DataSource', 'Ergo.core.Object', /** @lends Ergo.core.DataSource.prototype */{
	
	defaults: {
		plugins: [Ergo.Observable],
		lazy: true
	},
	
	
	_initialize: function(src, id, o) {
		
		/**
		 * Ключ связанных данных в источнике данных
		 * 
		 * @field id
		 */
		
		/**
		 * Источник данных
		 * 
		 * @field {Any|Ergo.core.DataSource}
		 */
		this.source = src;
				
		if(arguments.length == 2) {
			if($.isPlainObject(id)) o = id;
			else this.id = id;
		}
		else if(arguments.length == 3) {
			this.id = id;
		}
		
//		this._super(o || {});
		Ergo.core.DataSource.superclass._initialize.call(this, o || {});
		
		var self = this;
		var o = this.options;
		var val = this.get();
		
		/**
		 * Элементы данных
		 * 
		 * @field
		 */
		this.entries = $.isArray(val) ? new Ergo.core.Array() : new Ergo.core.Collection();
		
//		this.events = new Ergo.events.Observer(this);
		
		if(!o.lazy) {
			Ergo.each(val, function(v, i){	self.entry(i); });
		}
		
//		console.log('-- data --');
		
	},
	
	
	_destroy: function() {
		
		this.del();
		
		// очищаем регистрацию обработчиков событий
		this.events.unreg_all();
		// удаляем все дочерние элементы
		this.entries.apply_all('_destroy');
		
	},
	
	
	
	/**
	 * Получение вложенного элемента данных по ключу
	 * 
	 * @param {String|Any} i ключ
	 * @return {Ergo.core.DataSource} элемент данных
	 */
	entry: function(i) {
		
//		console.log('-- data entry --');
		
		var e = this;
		
		// если ключ - строка, то он может быть составным 
		if($.isString(i)) {
			var a = i.split('.');
			var i = a.pop();
			// двигаемся внутрь объекта по элементам ключа
			for(var j = 0; j < a.length; j++) e = e.entry(a[j]);
		}
				
		// если ключ существует, то возвращаем соответствующий элемент, иначе - создаем новый
		if(!e.entries.has_key(i)) {
			e.entries.set(i, e._factory(i));
		}
		
		return e.entries.get(i);
	},
	
	
	/**
	 * Фабрика вложенных элементов
	 * 
	 * По умолчанию используется класс Ergo.core.DataSource
	 * 
	 * @param {Any} i ключ
	 * @returns {Ergo.core.DataSource}
	 * 
	 */
	_factory: function(i) {
		return new Ergo.core.DataSource(this, i);		
	},
	
	
	
	/**
	 * Получение значения источника данных
	 * 
	 * Если метод вызывается без аргументов, то он ведет себя как геттер.
	 * Если определен аргумент, то метод является сеттером.
	 * 
	 * @param {Any} [v] значение
	 * @private
	 */
	_val: function(v) {
//		if('_cached' in this) return this._cached;
//		var v = undefined;

		if(arguments.length == 0) {
			v = (this.source instanceof Ergo.core.DataSource) ? this.source._val() : this.source;
			if('id' in this) {
				v = v ? v[this.id] : undefined;
			}
			
			if(this.options.format)
				v = this.options.format.call(this, v);			
			
		} 
		else {
			
			if(this.options.store)
				v = this.options.store.call(this, v);			
			
			if (this.source instanceof Ergo.core.DataSource) {
				('id' in this) ? this.source._val()[this.id] = v : this.source._val(v);
	  	}
			else {
				('id' in this) ? this.source[this.id] = v : this.source = v;
			}			
		}
//		this._cached = v;
		return v;
	},
	
	
	/**
	 * Получение значения элемента по ключу
	 *
	 * Если ключ не указан или не определен, то берется значение самого источника данных
	 * 
	 * @param {Numbre|String} [i] ключ
	 * @returns {Any}
	 */
	get: function(i) {
		if(i === undefined){
			// var v = (this.source instanceof Ergo.core.DataSource) ? this.source.get() : this.source;
			// if('id' in this) v = v[this.id];
			// return v;
			return this._val();
		}
		else {
//			console.log('-- data get --');
			return this.entry(i).get();			
		}
	},
	
	/**
	 * Полная копия значения
	 * 
	 * @param {Number|String} i ключ
	 * @returns {Any}
	 */
	copy: function(i) {
		return Ergo.deep_copy(this.get(i));
	},
	
	
	
	/**
	 * Изменение существующего элемента
	 * 
	 * Если аргумент один, то изменяется значение самого источника данных
	 * 
	 * @param {String|Number} [i] ключ
	 * @param {Any} val новое значение
	 * 
	 */
	set: function(i, newValue) {
		if(arguments.length == 1) {
			newValue = i;
			
			var oldValue = this.get();
						
						

			this.entries
				.filter(function(e){
					//FIXME упрощенная проверка присутствия ключа
					return (newValue && newValue[e.id] === undefined);
				})
				.each(function(e){	
					e._destroy(); 
				});


			if(this.entries.is_empty())
				this.entries = $.isArray(newValue) ? new Ergo.core.Array() : new Ergo.core.Collection();

			// удаляем все элементы
//			this.entries.filter(function(e) { return true; }).each(function(e){	e._destroy(); });
			// пересоздаем коллекцию элементов
			// положительный эффект в том, что можно поменять содержимое Object на Array и наоборот
//			this.entries = $.isArray(newValue) ? new Ergo.core.Array() : new Ergo.core.Collection();

						
			// var entries_to__destroy = [];
// 
			// this.entries.each(function(e){
// //				//FIXME упрощенная проверка присутствия ключа
// //				if(newValue[e.id] === undefined) entries_to__destroy.push(e);
				// entries_to__destroy.push(e);
			// });
// 			
			// for(var i = 0; i < entries_to__destroy.length; i++)
				// entries_to__destroy[i]._destroy();


			// опустошаем список элементов
//			this.entries.apply_all('_destroy');

			this._val(newValue);
			
			
			this.events.fire('value:changed', {'oldValue': oldValue, 'newValue': newValue});
			
			if(this.source instanceof Ergo.core.DataSource)
				this.source.events.fire('entry:changed', {entry: this});
			
			this._changed = true;
		}
		else {
			return this.entry(i).set(newValue);
		}
		
	},
	
	
	
	/**
	 * Добавление нового элемента
	 * 
	 * 
	 * @param {Any} value значение нового атрибута
	 * @param {String|Number} [index] индекс или ключ, куда должен быть добавлен атрибут 
	 * @returns {Ergo.core.DataSource}
	 */
	add: function(value, index) {
		
		var values = this.get();		
		
		var isLast = false;
			
		if($.isArray(values)) {
			
			if(index == null){
				values.push(value);
				index = values.length-1;
				isLast = true;
			}
			else {

				// меняем индексы элементов данных
				for(var i = values.length-1; i >= index; i--){
					var e = this.entries.get(i);
					// this.events.fire('onIndexChanged', {'oldIndex': j, 'newIndex': (j-1)});
					e.id = i+1;
					this.entries.set(i+1, e);
				}
				
				// добавляем новый элемент массива
				values.splice(index, 0, value);

				this.entries.set(index, this._factory(index));
				
			}
			
		}
		else {
//			throw new Error('Method "add" does not support object src');
			values[index] = value;
		}

		
		var e = this.entry(index);

		this.events.fire('entry:added', {'index': isLast ? undefined : index, 'entry': e});//, 'isLast': isLast});
		
		return e;
	},
	
	
	/**
	 * Удаление элемента.
	 * 
	 * Если метод вызывается без аргументов, то удаляется сам источник данных из родительского
	 * 
	 * @param {String|Number} [i] ключ
	 * 
	 */
	del: function(i) {
		
		if(i === undefined) {
			if(this.source instanceof Ergo.core.DataSource)
				this.source.del(this.id);
			else
				throw new Error('Unable to delete root data src');
		}
		else {
			var value = this.get();

			var deleted_entry = this.entry(i);
//			var deleted_entry = this.entries.remove_at(i);
			var deleted_value = value ? value[i] : undefined;
			
			
			this.entries.remove_at(i);
			
			if($.isArray(value)) {
				value.splice(i, 1);
				for(var j = i; j < value.length; j++)
					this.entries.get(j).id = j;
			}
			else {
				if(value) delete value[i];
			}
						
			// элемента могло и не быть в кэше и, если это так, то событие не генерируется
			if(deleted_entry)
				this.events.fire('entry:deleted', {'entry': deleted_entry, 'value': deleted_value});
		}
				
	},
	
	
	/**
	 * Последовательный обход всех вложенных элементов с поддержкой фильтрации
	 * 
	 * @param {Function} callback 
	 * 
	 */
	each: function(callback, filter, sorter) {
		
		var self = this;
		var values = this.get();
//		var keys = this.keys(this.options.filter);
		
		var criteria = filter || this.options.filter;

		Ergo.each(values, function(v, i){
			if(!criteria || criteria.call(self, v, i)) {
				callback.call(self, self.entry(i), i, v);
			}
		});
		
		// var keys = [];
		// if($.isArray(values)) {
			// for(var i = 0; i < values.length; i++) keys.push(i);
		// }
		// else {
			// for(var i in values) keys.push(i);			
		// }
		
		//TODO здесь могут применяться модификаторы списка ключей (сортировка, фильтрация)
		// if(this.options.filter){
			// keys = this.options.filter.call(this, values, keys);
		// }
		
		// for(var i = 0; i < keys.length; i++){
			// var k = keys[i];
			// callback.call(this, this.entry(k), k, values[k]);			
		// }
	},
	
/*	
	keys: function(criteria) {
		var keys = [];
		var values = this.get();
		
		Ergo.each(function(v, i){
			if(criteria || criteria.call(this, v, i)) keys.push(i);
		});
		
		return keys;
				
		// if($.isArray(values)) {
			// for(var i = 0; i < values.length; i++) keys.push(i);
		// }
		// else {
			// for(var i in values) keys.push(i);			
		// }
		// return keys
	},
*/	
	
	
	
	walk: function(callback) {
		//TODO
	},
	
	/**
	 * Проверка, изменялся ли источник данных или хотя бы один из его атрибутов/элементов
	 * 
	 * @returns {Boolean}
	 */
	changed: function() {
		if(this._changed) return true;
		var found = this.entries.find(function(e){ return e.changed(); });
		return found != null;
	},

	/*
	 * Удаление состояния о том, что источник данных или его атрибуты изменялись
	 */
	clean: function() {
		this._changed = false;
		this.entries.apply_all('clean');
	},
	
	
	/**
	 * Количество элементов в источнике данных
	 * 
	 * @returns {Number}
	 */
	size: function() {
		return Ergo.size(this._val());
	}
	
	
	
});




/**
 * Пространство имен для данных
 * 
 * @namespace Ergo.data
 */
Ergo.data = {};


Ergo.$data = Ergo.object;


