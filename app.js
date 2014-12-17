(function() {

  return {
    events: {
      'app.created':'onLoad',

      'getGroups.done':'gotGroups',
      'getLocales.done':'gotLocales'
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
      this.showMaster();
    },
    showMaster: function() {
      this.switchTo('master', {
        groups: this.groups,
        locales: this.locales
      });
    },
    getViews: function() {
      // 

    },
    gotViews: function() {

    },
    filter: function() {
      
    }
  };

}());
