(function() {

  return {
    events: {
      'app.created':'onLoad',
      'click .reload':'onLoad',

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
      },
      getUrl: function(url) {
        return {
          url: url
        };
      }
    },

    onLoad: function(e) {
      if(e) {e.preventDefault();}
      this.switchTo('spinner');
      this.ajax('getGroups');
      
    },
    gotGroups: function(response) {
      this.groups = response.groups;
      // TODO add pagination to get all
      var grouped = _.groupBy(this.groups, 'id');
      this.groupsByID = {};
      _.each(grouped, function(array) {
        this.groupsByID[array[0].id] = array[0];
      }.bind(this));

      console.dir(this.groupsByID);

      this.ajax('getLocales');
    },
    gotLocales: function(response) {
      this.locales = response.locales;
      this.loadViews();
    },

    // TODO: move loadViews here

    gotViews: function(rows) {
      console.log('Got Views!');
      this.uniqueRows = _.uniq(rows);
      
      this.filter(); // optionally filter, then render, the results
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

      // TODO Filter by locale

      // TODO filter by hours since created/reopened (first need to calculate those values)


      this.renderResults(this.filteredRows);
    },
    sort: function() {
      // TODO sort the results in JS

    },
    renderResults: function(rows) {
      _.each(rows, function(row) {
        row.group = this.groupsByID[row.group_id];
      }.bind(this));

      console.dir(rows);
      this.switchTo('master', {
        groups: this.groups,
        groupsByID: this.groupsByID,
        locales: this.locales,
        rows: rows
      });
    },




    loadViews: function() {
      var view1 = this.setting('View_1');
      var view2 = this.setting('View_2');
      // call paginate helper
      var tickets1 = this.paginate({
        request : 'getView',
        entity  : 'rows',
        id      : view1,
        page    : 1
      });
      var tickets2 = this.paginate({
        request : 'getView',
        entity  : 'rows',
        id      : view2,
        page    : 1
      });

      this.when(tickets1, tickets2).done(function(response1, response2) {
        var fullResponseRows = response1.concat(response2);
        this.gotViews(fullResponseRows); // call gotViews with response from both Views
      }.bind(this));

    },

    paginate: function(a) {
      var results = [];
      var initialRequest = this.ajax(a.request, a.id, a.page);
      // create and return a promise chain of requests to subsequent pages
      var allPages = initialRequest.then(function(data){
        results.push(data[a.entity]);
        var nextPages = [];
        var pageCount = Math.ceil(data.count / 100);
        for (; pageCount > 1; --pageCount) {
          nextPages.push(this.ajax(a.request, pageCount));
        }
        return this.when.apply(this, nextPages).then(function(){
          var entities = _.chain(arguments)
                          .flatten()
                          .filter(function(item){ return (_.isObject(item) && _.has(item, a.entity)); })
                          .map(function(item){ return item[a.entity]; })
                          .value();
          results.push(entities);
        }).then(function(){
          return _.chain(results)
                  .flatten()
                  .compact()
                  .value();
        });
      });
      return allPages;
    }
  };

}());
