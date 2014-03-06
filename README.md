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
    MyNamespace.Mew.Test.split('Bla bla bla bla', ' ', function(result) {
      //the callback for async query
      console.log(result); // result: ['Bla', 'bla', 'bla', 'bla']
    });
```

Protocol description and links to a server-side implementation.
http://www.sencha.com/products/extjs/extdirect


Example server-side implementation using the library https://github.com/Martin17/ExtDirect
```
<?php
    // file: /url/path/to/direct/api/index.php

    class Test {
        public function split($string, $delimiter) {
            return explode(" ", $string);
        }
    } 
    
    header('Content-type: application/json');

    Ext\Direct::$namespace   = 'MyNamespace.Mew';
    Ext\Direct::$descriptor  = 'My API';
    Ext\Direct::$id          = 'testid';
    Ext\Direct::$url         = '/url/path/to/direct/api';

    Ext\Direct::provide(['Test']);

?>
```
