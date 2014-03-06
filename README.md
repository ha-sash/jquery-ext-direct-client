jquery-ext-direct-client
========================

Ext.Direct client on jquery


## Example

Initialization
```
    $(function() {

        var Direct = new $.ExtDirect;

        /*
         /url/path/to/direct/api - standart ext.direct provider
         {
            "id":"...", "url":"/url/path/to/direct/api", "type":"remoting",
            "namespace":"MyNamespace.Mew", "descriptor":"My API",
            "actions":{"Test":[{"name":"split","len":2}]}
          }
         */
        $.get('/url/path/to/direct/api', function(provider) {
            Direct.addProvider(provider);
        }, 'json');
    });
```

Calling remote method
```
    MyNamespace.Mew.Test.split('Bla bla bla bla', '-', function(result) {
      //the callback for async query
      console.log(result);
    });
```
