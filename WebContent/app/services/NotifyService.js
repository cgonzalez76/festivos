var app = angular.module('festivos.Services');

app.service('NotifyService', 

	function ($filter, notify, tabsFactory) {
	
	    var notificationTemplate = 'app/views/notify.html';
	
	    function notificar(text, textDefault, notificationClass, duration) {
	        if (typeof text === "undefined") {
	            text = textDefault;
	        }

	        notify({
	        	html: true,
	            message:  text,
	            classes: notificationClass, //alert-info, alert-success, alert-warning, alert-danger
	            templateUrl: notificationTemplate,
	            duration: duration ? duration : 5000,
	            position: 'center'
	        });
	    }


	    return {
	    	notify: function (text, severity, tab) {
	    		switch (severity.toLowerCase()) {
		    		case 'several':
	    				this.several (text, tab);
	    				break;	
		    		case 'danger':
	    				this.danger (text, tab);
	    				break;
	    			case 'warning':
	    				this.warning (text, tab);
	    				break;
	    			case 'success':
	    				this.success (text, tab);
	    				break;
	    			case 'info':
	    				this.info (text, tab);
	    				break;
	    			default:
	    				notificar (text, '', '');
	    		}
	    	},
	    	several: function (text, tab) {

	    		// do not notify severals if tab do not match the requirements
	    		if ( !angular.isUndefinedOrNull (tab) )
	    			if ( (tab.type.isMain() && !tab.active) || tab.closed ) 
	    				return;

	            var textDefault = $filter('translate')('notifyService.several');
	            var notificationClass = "alert-danger";
	            notificar(text, textDefault, notificationClass, 15000);
	        },
	        danger: function (text, tab) {
	            var textDefault = $filter('translate')('notifyService.error');
	            var notificationClass = "alert-danger";
	            notificar(text, textDefault, notificationClass);
	        },
	        warning: function (text, tab) {
	            var textDefault = $filter('translate')('notifyService.advert');
	            var notificationClass = "alert-warning";
	            notificar(text, textDefault, notificationClass);
	        },
	        success: function (text, tab) {
	            var textDefault = $filter('translate')('notifyService.correct');
	            var notificationClass = "alert-success";
	            notificar(text, textDefault, notificationClass);
	        },
	        info: function (text, tab) {
	            var textDefault = $filter('translate')('notifyService.moreInfo');
	            var notificationClass = "alert-info";
	            notificar(text, textDefault, notificationClass);
	        }
	    };
	}

);
