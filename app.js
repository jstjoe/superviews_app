(function() {

  return {
    events: {
      'app.created':'onLoad',

      'getGroups.done':'gotGroups',
      'getLocales.done':'gotLocales',

      'click .filter':'filter'
    },
    // defaultState: 'mockup',
    requests: {
      getGroups: function() {
        return {
          url: '/api/v2/groups.json'
        };
      },
      getLocales: function() {
        return {
          url: '/api/v2/locales.json'
        };
      },
      getView: function(viewID) {
        return {
          url:'/api/v2/views/' + viewID + '/execute.json'
        };
      }
    },

    onLoad: function() {
      this.ajax('getGroups');
      
    },
    gotGroups: function(response) {
      this.groups = response.groups;
      this.ajax('getLocales');
      
    },
    gotLocales: function(response) {
      this.locales = response.locales;
      this.getViews();
    },
    showMaster: function() {
      // this.switchTo('master', {
      //   groups: this.groups,
      //   locales: this.locales
      // });
    },

    getViews: function() {  // TODO? pass View IDs as parameters?
      console.log("Getting Views...");
      // get both View IDs from settings
      var view1 = this.setting('View_1');
      var view2 = this.setting('View_2');
      var promise1 = this.ajax('getView', view1);
      var promise2 = this.ajax('getView', view2);

      this.when(promise1, promise2).done(function(response1, response2) {
        var fullResponseRows = response1[0].rows.concat(response2[0].rows);
        this.gotViews(fullResponseRows); // call gotViews with response from both Views
      }.bind(this));
    },
    gotViews: function(rows) {
      this.uniqueRows = _.uniq(rows);
      console.log(this.uniqueRows);
      
      // this.filter();
      this.renderResults(this.uniqueRows);
    },
    filter: function(e) {
      if(e) {e.preventDefault();}
      // Collect filters from inputs
      var groups = this.$('select.group').val(),
        // locale = this.$('select.locale').val(),
        hours = this.$('select.hour').val();

      // Filter by group
      if(!groups) {
        this.filteredRows = this.uniqueRows;
      } else {
        this.filteredRows = _.filter(this.uniqueRows, function(row) {
          if(row.group_id) {
            return _.contains(groups, row.group_id.toString());
          } else {
            return false;
          }
        }.bind(this));
      }

      // TODO? Filter by locale

      // TODO filter by hours since created/reopened (first need to calculate those values)


      this.renderResults(this.filteredRows);
    },
    sort: function() {

    },
    renderResults: function(rows) {
      this.switchTo('master', {
        groups: this.groups,
        locales: this.locales,
        rows: rows
      });
    },
  };

}());
