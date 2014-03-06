(function($) {


    $.ExtDirect = function() {

        if (!Function.prototype.bind) {
            throw new Error('Browser does not support function bind.');
        }

        this.queue = {};
        this.buffer = 500;

    };
    $.ExtDirect.prototype.providers = {};

    $.ExtDirect.prototype.callRemote = function(providerId) {
        var q = this.queue[providerId];
        if (q) {
            var cblist = q.cblist;
            $.post(this.providers[providerId].url, JSON.stringify(q.calls), function(result) {

                if (!$.isArray(result) && typeof result === 'object') {
                    result = [result];
                }

                for (var i = 0;i < result.length;i++) {
                    var resRow =  result[i];

                    if (resRow.type === 'rpc') {
                        cblist[resRow.tid-1](resRow.result);
                    }
                }

            }, 'json');

            delete this.queue[providerId];
        }
    };

    $.ExtDirect.prototype.addRemodeMethodToCallQueue = function(args, mc, callback) {

        if (mc.direct.queue[mc.provider.id] === undefined) {
            mc.direct.queue[mc.provider.id] = {
                timeOut: false,
                calls: [],
                cblist: []
            };
        }

        var q = mc.direct.queue[mc.provider.id];

        if (!callback) {
            callback = function(){};
        } else {
            callback = callback[0];
        }

        q.calls.push({
            action: mc.action,
            data: args,
            method: mc.method,
            tid: q.calls.length + 1,
            type: 'rpc'
        });

        q.cblist.push(callback);

        if (!q.timeOut) {
            q.timeOut = setTimeout(function() {
                mc.direct.callRemote(mc.provider.id);
            }, mc.direct.buffer);
        }

    },

    $.ExtDirect.prototype.addProvider = function(provider) {

        var Action = function(actionName, provider, direct) {

            var methods = provider.actions[actionName];

            for (var i = 0; i < methods.length; i++) {
                var method = methods[i];

                this[method.name] = function() {
                    if (arguments.length == this.len) {
                        this.direct.addRemodeMethodToCallQueue(arguments, this);
                    } else if  (arguments.length == this.len + 1) {
                        this.direct.addRemodeMethodToCallQueue(Array.prototype.slice.call(arguments, 0, -1), this, Array.prototype.slice.call(arguments, -1));
                    }
                }.bind({ action: actionName, method: method.name, provider: provider, len: method.len, direct: direct});
            }
        };

        if (provider.type === 'remoting' && provider.url && provider.namespace && provider.id && typeof provider.actions === 'object') {
            this.providers[provider.id] = provider;

            var ns = this.ns(provider.namespace);

            for(var actionName in provider.actions) {
                if (provider.actions.hasOwnProperty(actionName)) {
                    ns[actionName] = new Action(actionName, provider, this);
                }
            }

        }

    }

    $.ExtDirect.prototype.ns = function() {
        var a=arguments, o=null, i, j, d;
        for (i=0; i<a.length; i=i+1) {
            d=a[i].split(".");
            o=window;
            for (j=0; j<d.length; j=j+1) {
                o[d[j]]=o[d[j]] || {};
                o=o[d[j]];
            }
        }
        return o;
    };

})(jQuery);