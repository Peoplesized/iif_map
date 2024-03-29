// 
// Init
// 

function bootstrapFilters(filtersSource, dataCollection) {
  var filtersCollection, definitions;

  filtersCollection = new FilterChoices([]);
  
  definitions = new FilterDefinitions(filtersSource.definitions, {
    filtersCollection: filtersCollection,
    collectionToFilter: dataCollection
  });


  delete definitions.collectionToFilter;

  filtersCollection.definitions = definitions;
  filtersCollection.collectionToFilter = dataCollection;

  return filtersCollection;
}

// 
// FILTER DEFS
// 

FilterDefinition = Backbone.Model.extend({
  idAttribute: 'name',
  initialize: function(attributes) {
    // Remove Filter's 'choices'
    this.unset('choices');
  }
});

FilterDefinitions = Backbone.Collection.extend({
  model: FilterDefinition,
  initialize: function(models, options) {
    if (options.collectionToFilter && options.filtersCollection) {
      this.collectionToFilter = options.collectionToFilter;
      this.filtersCollection = options.filtersCollection;
    } else {
      throw 'Need to define collectionToFilter and filtersCollection'
    }

  },
  _prepareModel: function(model, options) {
    if (!model.choices && model.infer_choices_from_data) {
      this._inferChoicesFromCollection(model, options);
    } else {
      var definition = _.omit(model, 'choices');
      this.filtersCollection.add(model.choices, {definition: definition});
    }
    return Backbone.Collection.prototype._prepareModel.call(this, model, options);
  },
  // This is fairly custom. 
  // Deals with SRAPs being excluded from GeoSearch options
  _inferChoicesFromCollection: function(model, options) {
    var _this = this, definition = _.omit(model, 'choices');
    var valueField = definition.infer_value_field, titleField = definition.infer_title_field;
    var collectionChoices = this.collectionToFilter.map(function(collectionItem){
      return {
        value: collectionItem.get(valueField),
        title: collectionItem.get(titleField),
        srap: collectionItem.get('srap')
      }
    });
    _this.filtersCollection.add(collectionChoices, {definition: definition});
  },
  // FILTER QUERY 
  // 
  _prepareFilterQuery: function() {
    var _this = this;
    var queryGroups = {};

    var filtersToQueryWith = _.where(this.filtersCollection.toJSON(), {excluded: true});

    var attributeGroups = _.groupBy(filtersToQueryWith, 'attribute');

    _.each(attributeGroups, function(attributeGroup, index) {
      var combinator, values;

      // TODO: Refactor - at least move config out of here
      // These $nin and $in are inverted because the whole query is a $nor
      if (_this.get(index).get('invert_query')) {
        combinator = '$nin';
      } else {
        combinator = '$in';
      }
      values = _.pluck(attributeGroup, 'value');

      queryGroups[index] = _.object([combinator], [values]);
    });
    return {
      // Exclude everything in the querygroups
      $nor: queryGroups
    };
  }
});


// 
// FILTER OPTIONS
// 

FilterChoice = Backbone.Model.extend({
  initialize: function (model, options) {
    // Create value from title provided
    if (options.definition.infer_value_from_title) {
      model.value = app.utils.snake_case(model.title);
      this.set('value', model.value);
    }
    // Create ID from the provided attribute name and the value
    if (options.definition.name && model.value) {
      this.set('id', options.definition.name + ':' + model.value);
    }
    // Start with nothing excluded
    this.set('excluded', false);
    // Make sure each FilterChoice knows who it belongs to
    this.set('attribute', options.definition.name);
  },
  toggle: function(attr, silent) {
    if (!attr) {attr = 'excluded'}; 
    var data = {}, value = this.get(attr);
    data[attr] = !value;
    this.set(data, {silent: silent});
  }
});

FilterChoices = Backbone.Collection.extend({
  model: FilterChoice,
  _prepareModel: function (model, options) {
    // Don't create Choices for attributes with `disabled` flag set true
    if (model.disabled) {return };
    return Backbone.Collection.prototype._prepareModel.call(this, model, options);
  },
  // SETTERS and GETTERS
  getForAttribute: function(attribute) {
    return this.where({
      attribute: attribute
    });
  },
  getExcluded: function(attribute) {
    if (attribute) {
      return this.where({
        attribute: attribute,
        excluded: true
      });
    } else {
      return this.where({
        excluded: true
      });
    }
  },
  getNotExcluded: function(attribute) {
    if (attribute) {
      return this.where({
        attribute: attribute,
        excluded: false
      });
    } else {
      return this.where({
        excluded: false
      });
    }
  },
  setAllExcluded: function(attribute) {
    var filters = this.getNotExcluded(attribute);
    _.each(filters, function(choice) {
      choice.set('excluded', true);
    });
  },
  setAllNotExcluded: function(attribute) {
    var filters = this.getExcluded(attribute);
    _.each(filters, function(choice) {
      choice.set('excluded', false);
    });
  },
  setAllNotExcludedExceptGeoSearch: function(attribute) {
    var filters = this.getExcluded(attribute);
    filters = _.reject(filters, function(i){
      return i.get('isGeoSearch') === true;
    });
    _.each(filters, function(choice) {
      choice.set('excluded', false);
    });
  },
  setGeoSearchNotExcluded: function(){
    _.each(this.where({isGeoSearch: true}), function(model){
      model.set('excluded', false);
      model.unset('isGeoSearch');
    });
  },
  // PRESENTERS
  decorateForFiltersList: function(attribute) {
    var filterModels = this.where({
      attribute: attribute
    });
    if (filterModels == undefined) {
      return;
    }
    var counts = this.collectionToFilter.countBy(attribute);
    return _.map(filterModels, function(filterModel) {
      var jsonModel = filterModel.toJSON();
      jsonModel.activeCount = counts[filterModel.get('value')];
      return jsonModel;
    })
  },
  decorateForGeosearch: function() {
    var _this = this;

    // Find the 'name' of Defintions with 'geoSearch' flag
    var geoAttributes = _.map(this.definitions.where({
      geosearch: true
    }), function(definition) {
      return definition.get('name')
    });

    if (_.isEmpty(geoAttributes)) {
      console.log('Filters: no geosearch attributes found');
      return;
    }

    return _.map(geoAttributes, function(geoAttribute) {
      var _geoAttribute = geoAttribute;
      return {
        name: geoAttribute,
        choices: _this.filter(function(choice){
          // Exclude SRAPs from geoSearch results
          if (choice.get('srap')) { return false};
          return choice.get('attribute') === _geoAttribute;
        })
      }
    });
  },
  prepareFilterQuery: function() {
    return this.definitions._prepareFilterQuery();
  }
})