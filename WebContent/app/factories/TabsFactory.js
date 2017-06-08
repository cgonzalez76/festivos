var app = angular.module("festivos.Factories", []);

app.factory('tabsFactory', 

	function($rootScope, $location, $window, $route, $routeParams, $location, $timeout, $q) {

	
		/*
		 * Tab Object
		 */
		function Tab (/*TabData*/ data, /*TabType*/ type, /*Boolean*/ unique) {
			this.id = Tab.composeTabID (data, type) + (unique ? ':' + commonsFactory.nextSeed() : '' );
			this.icon = data.icon;
			this.type = type;
			this.parenttitle = data.parenttitle;
			this.titlebase = data.title;
			this.title = data.title;
			this.active = data.active;
			this.templateurl = data.templateurl;
			this.attachment = data.attachment;
			this.access = data.access;
		}
		Tab.prototype.onClose = function (/*Tab*/ tab) {
			// must return a promise
			return $q.resolve(tab);
		};
		Tab.composeTabID = function (/*TabData*/ data, /*TabType*/ type) {
			return '' + type.value + '-' + data.id;
		};


		/*
		 * TabType: simulando una enumeración
		 */
		function TabType (value) {
		   this.value = value;
		   this.is = function (type) {
			   return this === type || this.value === type;
		   }
		   this.isMain = function () {
			   return this.is (TabType.MAIN);
		   }
		   this.isNewNode = function () {
			   return this.is (TabType.NEW_NODE);
		   }
		   this.isOpenNode = function () {
			   return this.is (TabType.OPEN_NODE);
		   }
		   this.isNewCluster = function () {
			   return this.is (TabType.NEW_CLUSTER);
		   }
		   this.isOpenCluster = function () {
			   return this.is (TabType.OPEN_CLUSTER);
		   }
		   this.isNewFlavor = function () {
			   return this.is (TabType.NEW_FLAVOR);
		   }
		   this.isOpenFlavor = function () {
			   return this.is (TabType.OPEN_FLAVOR);
		   }
		   this.isNewSite = function () {
			   return this.is (TabType.NEW_SITE);
		   }
		   this.isOpenSite = function () {
			   return this.is (TabType.OPEN_SITE);
		   }
		   this.isMonitorNode = function () {
			   return this.is (TabType.MONITOR_NODE);
		   }
		   this.isMonitorCluster = function () {
			   return this.is (TabType.MONITOR_CLUSTER);
		   }
		};
		TabType = {
			MAIN: new TabType (-1), 
			NEW_NODE: new TabType (0),
			OPEN_NODE: new TabType (1),
			NEW_CLUSTER: new TabType (2),
			OPEN_CLUSTER: new TabType (3),
			NEW_FLAVOR: new TabType (4),
			OPEN_FLAVOR: new TabType (5),
			NEW_SITE: new TabType (6),
			OPEN_SITE: new TabType (7),
			MONITOR_NODE: new TabType (10),
			MONITOR_CLUSTER: new TabType (11)
		}



		/*
	     * SectionUIPanel OBJECT 
	     */
		function SectionUIPanel (/*Object*/id, /*SectionUIPanelOptions*/ options) {
			this.id = id;

			this.icon = options && options.icon ? options.icon: '';
			this.title = options && options.title ? options.title: '';
			this.template = options && options.template ? options.template: '';
			this.listeners = options && options.listeners ? options.listeners: '';

			this.modified = false;
			this.modifiers = [];
			
		};
		SectionUIPanel.prototype.reportModifier = function (modifier, value) {
			if ( value && this.modifiers.indexOf (modifier) < 0 )
				this.modifiers.push (modifier);

			else if ( !value && (idx = this.modifiers.indexOf (modifier)) > -1 )
				this.modifiers.splice (idx,1);

			this.modified = this.modifiers.length > 0;
			
			/*
			 * implementa la interfaz listener por si se quiere que una sección notifique a otra en caso de ser modificada.
			 * Se pensó para Links pero actualmente no se usa este modelo en la aplicación; en su lugar se ha optado por deepWatch 
			 */
			if ( this.listeners )
				if (angular.isArray(this.listeners))
					this.listeners.forEach (function (listeners) {
						listeners.reportModifier (this, this.modified);
					});
				else
					this.listeners.reportModifier (this, this.modified);
		}
		
		
		/*
	     * SectionUIPanels OBJECT 
	     */
		function SectionUIPanels (sections) {
			var self = this;
			this.sections = {};
			this.current = null;

			if ( angular.isArray (sections) )
				sections.forEach (function (value) {
					if (value instanceof SectionUIPanel)
						self.sections [value.id] = value;
				});
		};
		SectionUIPanels.prototype.setPanel = function (panel, paneldefault) {
			var newpanel = null;

			var keys = Object.keys(this.sections);
			for (var x = 0; x < keys.length; x++) {
				if ( panel instanceof SectionUIPanel && this.sections[keys[x]].id === panel.id ) {
					newpanel = this.sections[keys[x]];
					break;
				} else if ( angular.isNumber (panel) ) {
					if ( panel > -1 && panel < keys.length )
						newpanel = this.sections[keys[panel]];
					else
						newpanel = this.sections[keys[0]];
				} else if ( this.sections[keys[x]].id === panel ) {
					newpanel = this.sections[keys[x]];
					break;
				}
			}
			
			if ( newpanel == null && paneldefault )
				newpanel = this.setPanel (paneldefault, null);
				
			return this.current = newpanel;
		};
		SectionUIPanels.prototype.is = function (panel) {
			if ( panel instanceof SectionUIPanel && this.current === panel )
				return true;
			else if ( this.current && this.current.id === panel )
				return true;
			return false;
		};
		SectionUIPanels.prototype.getPanel = function (panel) {
			var keys = Object.keys(this.sections);
			for (var x = 0; x < keys.length; x++) {
				if ( panel instanceof SectionUIPanel && this.sections[keys[x]].id === panel.id )
					return this.sections[keys[x]];
				else if ( this.sections[keys[x]].id === panel )
					return this.sections[keys[x]];
			}
			return null;
		};



	// ####################################################################################################################################################
	// ### PUBLIC METHODS #################################################################################################################################
	// ####################################################################################################################################################
		
		var service = {};

		//
		service.TabType = TabType;
		service.SectionUIPanel = SectionUIPanel;
		service.SectionUIPanels = SectionUIPanels;
		
		
		/*
		 * 
		 */
		service.maintab = {
				"id": "",
				"type": service.TabType.MAIN,
				"icon": "",
				"parenttitle": "",
				"title": "_main_tab_",
				"active": true,
				"templateurl": "",
				"access":null
		};
	
	
		//
		service.tabs = []; //storageFactory.getTabs() || []
	
	
	
		//
		service.clearTabs = function () {
			service.maintab = {
					"id": "",
					"type": service.TabType.MAIN,
					"icon": "",
					"parenttitle": "",
					"title": "_main_tab_",
					"active": true,
					"templateurl": "",
					"access":null
			};
			service.removeAllTabs ();
	
			//storageFactory.storeTabs (service.tabs);
		};


		/*
		 * addTab
		 */
		service.addTab = function (/*TabData*/ data, /*TabType*/ type, /*Boolean*/ unique) {

			var tab = null;
			var composedid = Tab.composeTabID (data, type);

			// buscamos si el tab ya está abierto
			for (var x = 0; x < service.tabs.length; x++) {
				if ( service.tabs[x].id === composedid 
				  && service.tabs[x].type === type ) {
					tab = service.tabs[x];
					break;
				}
			}


			// si no, lo creamos
			if (tab == null) {
				tab = new Tab (data, type, unique);

				service.tabs.push(tab);
			}

			if (data.active)
				service.setActiveTab (tab.id);

		};


		/*
		 * removeTab
		 */
		service.removeTab = function (/*Tab | String*/ foo) {

			var id = (foo instanceof Tab) ? foo.id : foo;

			for (var x = 0; x < service.tabs.length; x++)
				if ( service.tabs[x].id === id ) {
					service.tabs[x].active = false; //flag object as tab:!active
					service.tabs[x].closed = true; //flag object as tab:closed
					var removed = service.tabs.splice (x, 1);
					return {
						idx: x,
						tab: removed [0]
					};
				}

			return {
				idx: -1,
				tab: null
			};

		};


		/*
		 * findTab
		 */
		service.findTab = function (/*Tab | Function | String*/ foo) {

			var tab = null;

			// es tab, lo utilizamos directamente
			if (foo instanceof Tab)
				tab = foo;

			else if ( angular.isFunction (foo) )
				// es una función de filtro: le pasamos los tabs y que filtre
				for (var x = 0; x < service.tabs.length; x++)
					if ( foo (service.tabs[x]) ) {
						tab = service.tabs[x];
						break;
					}

			else
				// asumimos que es un id: buscamos tab
				for (var x = 0; x < service.tabs.length; x++)
					if ( service.tabs[x].id === foo ) {
						tab = service.tabs[x];
						break;
					}

			return tab;

		}

		
		/*
		 * closeTab
		 */
		service.closeTab = function (/*Event*/ event, /*Tab | Function | String*/ foo, /*Boolean*/ force) {

			if ( event ) event.stopPropagation();

			// buscamos el tab
			var tab = service.findTab (foo);

			// si hay tab... la cerramos
			if ( tab != null )
				if ( !force )
					// lanzamos onClose
					tab.onClose (tab).then (function () {
						// si promise resolved: cerramos TAB
						var res = service.removeTab (tab);
						if ( res.tab != null && res.tab.active )
							if ( service.tabs.length > 0 )
								service.setActiveTab (service.tabs[(res.idx>0?--res.idx:res.idx)].id);
							else
								breadcrumbFactory.clearPath ();
			        });

				else {
					var res = service.removeTab (tab);
					if ( res.tab != null && res.tab.active )
						if ( service.tabs.length > 0 )
							service.setActiveTab (service.tabs[(res.idx>0?--res.idx:res.idx)].id);
						else
							breadcrumbFactory.clearPath ();
				}

		};


		/*
		 * replaceTab
		 * Reemplazar TAB por otro
		 */
		service.replaceTab = function (/*Tab*/ oldtab, /*TabData*/ newdata, /*TabType*/ newtype) {

			var tab = null;

			// buscamos si ya existe tab con los nuevos datos
			for (var x = 0; x < service.tabs.length; x++) {
				if ( service.tabs[x].id === newdata.id 
				  && service.tabs[x].type === newtype ) {
					tab = service.tabs[x];
					break;
				}
			}

			if ( tab != null ) {
				// si ya existe cerramos el viejo
				service.removeTab (oldtab.id);

			} else {
				// sino, creamos el nuevo
				tab = new Tab (newdata, newtype, false);

				// y sustituimos el viejo por el nuevo
				for (var x = 0; x < service.tabs.length; x++) {
					if ( service.tabs[x].id === oldtab.id ) {
						service.tabs[x].active = false; //flag object as tab:!active
						service.tabs[x].closed = true; //flag object as tab:closed
						service.tabs.splice (x, 1, tab);
						break;
					}
				}

			}

			//
			service.setActiveTab (tab.id);

		};
		
	
	
		/*
		 * removeOthersTab
		 */
		service.removeOthersTab = function (/*String*/ id) {
			for ( var x = service.tabs.length -1; x >= 0; x-- )
				if ( service.tabs[x].id !== id ) {
					service.tabs[x].active = false; //flag object as tab:!active
					service.tabs[x].closed = true; //flag object as tab:closed
					service.tabs.splice (x, 1);
				} else
					service.setActiveTab (service.tabs[x].id);
		};

	
		/*
		 * removeAllTabs
		 */
		service.removeAllTabs = function () {
			service.tabs.forEach (function (tab) {
				tab.active = false; //flag object as tab:!active
				tab.closed = true; //flag object as tab:closed
			})
			service.tabs.splice (0, service.tabs.length);
		};


		/*
		 * setActiveTab
		 */
		service.setActiveTab = function (/*String*/ id) {
			// check main tab
			if ( service.maintab.id === id )
				service.maintab.active = true;

			else
				service.maintab.active = false;
	
	
			// check others tabs
			service.tabs.forEach(function (value, indx, array) {
	
				if (value.id === id) {
					if ( !$('#tabbutton_' + value.id).hasClass ('tabbutton_active') )
						$('#tabbutton_' + value.id).addClass('tabbutton_active');
					value.active = true;
					
					breadcrumbFactory.setPath (value.breadcrumbPath);
					
					$rootScope.$broadcast('activatedTab', value.id);
	
	
				} else {
					$('#tabbutton_' + value.id).removeClass('tabbutton_active');
					value.active = false;
				}
	
			});
	
	
		};
	
	
	
		//Todos los tipos URL pueden pasar objAction que lleva todos los campos  de una accion incluido permisos
		//Cambio para pasar más parametros al crear nuevos tabs
		service.openInMainTab = function (templateurl, id, objAction) {

			service.maintab.id = id;
			service.maintab.templateurl = $rootScope.composeUrl (templateurl, {"_ts":Date.now()});


			// anulamos los demás tabs
			service.setActiveTab(service.maintab.id); // service.maintab.id
	
		};

		service.openInNewTab = function (templateurl, id, objAction) {

			window.location.href = templateurl;	
		};

		/*
		 * 
		 */
		service.findDOMinTab = function (tabid, selector) {
			//normalmente tabid = $scope.current_tab.id
			var root = $('div[id="' + tabid + '"]');
        	return root.find (selector);
		}


		//
		return service;
	
	}
	
);
