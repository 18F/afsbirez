/**
 * Schema form service.
 * This service is not that useful outside of schema form directive
 * but makes the code more testable.
 */
angular.module('schemaForm').provider('schemaForm',[function(){

  var defaultFormDefinition = function(name,schema,options){
    var rules = defaults[schema.type];
    if (rules) {
      var def;
      for (var i=0;i<rules.length; i++) {
        def = rules[i](name,schema,options);
        //first handler in list that actually returns something is our handler!
        if (def) {
          return def;
        }
      }
    }
  };

  //Creates a form object with all common properties
  var stdFormObj = function(schema,options) {
    var f = {};
    if (schema.title) f.title = schema.title;
    if (schema.description) f.description = schema.description;
    if (options.required === true || schema.required === true) f.required = true;
    if (schema.default) f.default = schema.default;
    if (schema.maxLength) f.maxlength = schema.maxLength;
    if (schema.minLength) f.minlength = schema.maxLength;
    if (schema.readOnly || schema.readonly)  f.readonly  = schema.readOnly || schema.readonly;
    if (schema.minimum) f.minimum = schema.minimum + (schema.exclusiveMinimum?1:0);
    if (schema.maximum) f.maximum = schema.maximum - (schema.exclusiveMaximum?1:0);

    //Non standard attributes
    if (schema.validationMessage) f.validationMessage = schema.validationMessage;
    if (schema.enumNames) f.titleMap = schema.enumNames;
    f.schema = schema;
    return f;
  };


  var text = function(name,schema,options) {
    if (schema.type === 'string' && !schema.enum) {
      var f = stdFormObj(schema,options);
      f.key  = options.path;
      f.type = 'text';
      options.lookup[options.path] = f;
      return f;
    }
  };

  //default in json form for number and integer is a text field
  //input type="number" would be more suitable don't ya think?
  var number = function(name,schema,options) {
    if (schema.type === 'number') {
      var f = stdFormObj(schema,options);
      f.key  = options.path;
      f.type = 'number';
      options.lookup[options.path] = f;
      return f;
    }
  };

  var integer = function(name,schema,options) {
    if (schema.type === 'integer') {
      var f = stdFormObj(schema,options);
      f.key  = options.path;
      f.type = 'number';
      options.lookup[options.path] = f;
      return f;
    }
  };

  var checkbox = function(name,schema,options) {
    if (schema.type === 'boolean') {
      var f = stdFormObj(schema,options);
      f.key  = options.path;
      f.type = 'checkbox';
      options.lookup[options.path] = f;
      return f;
    }
  };


  var select = function(name,schema,options) {
    if (schema.type === 'string' && schema.enum) {
      var f = stdFormObj(schema,options);
      f.key  = options.path;
      f.type = 'select';
      if (!f.titleMap) {
        f.titleMap = {};
        schema.enum.forEach(function(name){
          f.titleMap[name] = name;
        });
      }
      options.lookup[options.path] = f;
      return f;
    }
  };

  var checkboxes = function(name,schema,options) {
    if (schema.type === 'array' && schema.items && schema.items.enum) {
      var f = stdFormObj(schema,options);
      f.key  = options.path;
      f.type = 'checkboxes';
      if (!f.titleMap) {
        f.titleMap = {};
        schema.items.enum.forEach(function(name){
          f.titleMap[name] = name;
        });
      }
      options.lookup[options.path] = f;
      return f;
    }
  };



  var fieldset = function(name,schema,options){

    if (schema.type === "object") {
      var f   = stdFormObj(schema,options);
      f.type  = 'fieldset';
      f.items = [];
      options.lookup[options.path] = f;

      //recurse down into properties
      angular.forEach(schema.properties,function(v,k){
        var path = options.path+'.'+k;
        if (options.ignore[path] !== true) {
          var required = schema.required && schema.required.indexOf(k) !== -1;

          var def = defaultFormDefinition(k,v,{
            path: path,
            required: required || false,
            lookup: options.lookup,
            ignore: options.ignore
          });
          if (def) {
            f.items.push(def);
          }
        }
      });

      return f;
    }

  };

  var array = function(name,schema,options){

    if (schema.type === 'array') {
      var f   = stdFormObj(schema,options);
      f.type  = 'array';
      f.key   = options.path;
      options.lookup[options.path] = f;

      var required = schema.required && schema.required.indexOf(options.path) !== -1;

      // The default is to always just create one child. This works since if the
      // schemas items declaration is of type: "object" then we get a fieldset.
      // We also follow json form notatation, adding empty brackets "[]" to
      // signify arrays.
      f.items = [defaultFormDefinition(options.path,schema.items,{
        path: options.path+'[]',
        required: required || false,
        lookup: options.lookup,
        ignore: options.ignore
      })];

      return f;
    }

  };

  //First sorted by schema type then a list.
  //Order has importance. First handler returning an form snippet will be used.
  var defaults = {
    string:  [ select, text ],
    object:  [ fieldset ],
    number:  [ number ],
    integer: [ integer ],
    boolean: [ checkbox ],
    array:   [ checkboxes, array ]
  };

  var postProcessFn = function(form) { return form; };


  /**
   * Provider API
   */
  this.defaults    = defaults;
  this.stdFormObj  = stdFormObj;

  /**
   * Register a post process function.
   * This function is called with the fully merged
   * form definition (i.e. after merging with schema)
   * and whatever it returns is used as form.
   */
  this.postProcess = function(fn) {
    postProcessFn = fn;
  };

  /**
   * Append default form rule
   * @param {string}   type json schema type
   * @param {Function} rule a function(propertyName,propertySchema,options) that returns a form definition or undefined
   */
  this.appendRule = function(type,rule) {
    if (!defaults[type]) {
      defaults[type] = [];
    }
    defaults[type].push(rule);
  };

  /**
   * Prepend default form rule
   * @param {string}   type json schema type
   * @param {Function} rule a function(propertyName,propertySchema,options) that returns a form definition or undefined
   */
  this.prependRule = function(type,rule) {
    if (!defaults[type]) {
      defaults[type] = [];
    }
    defaults[type].unshift(rule);
  };

  /**
   * Utility function to create a standard form object.
   * This does *not* set the type of the form but rather all shared attributes.
   * You probably want to start your rule with creating the form with this method
   * then setting type and any other values you need.
   * @param {Object} schema
   * @param {Object} options
   * @return {Object} a form field defintion
   */
  this.createStandardForm = stdFormObj;
  /* End Provider API */


  this.$get = function(){

    var service = {};

    service.merge = function(schema,form,ignore) {
      form  = form || ["*"];

      var stdForm = service.defaults(schema,ignore);

      //simple case, we have a "*", just put the stdForm there
      var idx = form.indexOf("*");
      if (idx !== -1) {
        form  = form.slice(0,idx)
                    .concat(stdForm.form)
                    .concat(form.slice(idx+1));
        return form;
      }

      //ok let's merge!
      //We look at the supplied form and extend it with schema standards
      var lookup = stdForm.lookup;
      return postProcessFn(form.map(function(obj){

        //handle the shortcut with just a name
        if (typeof obj === 'string') {
          obj = { key: obj };
        }

        //if it's a type with items, merge 'em!
        if (obj.items) {
          obj.items = service.merge(schema,obj.items,ignore);
        }

        //if its has tabs, merge them also!
        if (obj.tabs) {
          angular.forEach(obj.tabs,function(tab){
            tab.items = service.merge(schema,tab.items,ignore);
          });
        }

        //extend with std form from schema.
        if (obj.key && lookup[obj.key]) {
          return angular.extend(lookup[obj.key],obj);
        }

        return obj;
      }));
    };



    /**
     * Create form defaults from schema
     */
    service.defaults = function(schema,ignore) {
      var form   = [];
      var lookup = {}; //Map path => form obj for fast lookup in merging
      ignore = ignore || {};

      if (schema.type === "object") {
        angular.forEach(schema.properties,function(v,k){
            if (ignore[k] !== true) {
              var required = schema.required && schema.required.indexOf(k) !== -1;
              var def = defaultFormDefinition(k,v,{
                path: k,        //path to this property in dot notation. Root object has no name
                lookup: lookup,    //extra map to register with. Optimization for merger.
                ignore: ignore,    //The ignore list of paths (sans root level name)
                required: required //Is it required? (v4 json schema style)
              });
              if (def) {
                form.push(def);
              }
            }
        });

      } else {
        throw new Error('Not implemented. Only type "object" allowed at root level of schema.');
      }
      return { form: form, lookup: lookup };
    };


    //Utility functions
    /**
     * Traverse a schema, applying a function(schema,path) on every sub schema
     * i.e. every property of an object.
     */
    service.traverseSchema = function(schema,fn,path,ignoreArrays) {
      ignoreArrays = angular.isDefined(ignoreArrays) ? ignoreArrays : true;

      var traverse = function(schema,fn,path) {
        fn(schema,path);
        angular.forEach(schema.properties,function(prop,name){
          traverse(prop,fn,path===""?name:path+'.'+name);
        });

        //Only support type "array" which have a schema as "items".
        if (!ignoreArrays && schema.items) {
          traverse(schema.items,fn,path+'[]');
        }
      };

      traverse(schema,fn,path || "");
    };

    service.traverseForm = function(form, fn) {
      fn(form);
      angular.forEach(form.items, function(f) {
        service.traverseForm(f, fn);
      });

      if (form.tabs) {
        angular.forEach(form.tabs, function(tab) {
          angular.forEach(tab.items, function(f) {
            service.traverseForm(f, fn);
          });
        });
      }
    };


    return service;
  };

}]);
