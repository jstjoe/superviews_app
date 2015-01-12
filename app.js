(function() {

  return {
    events: {
      'app.created':'onLoad',

      'getGroups.done':'gotGroups',
      'getLocales.done':'gotLocales',

      'click.filter':'filter'
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
    filter: function(e) {
      if(e) {e.preventDefault();}
      var groups = this.$('select.group').val(),
        locale = this.$('select.locale').val(),
        hours = this.$('select.hour').val();



    },
    sort: function() {

    }
  };

}());
