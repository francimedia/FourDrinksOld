var auth_token = 1;
var myPosition = '40.739063,-74.005501';


var myApp = {

    venue_url: '',
    venue_name: '',

    init: function() {

      auth_token = myApp.getAccessToken();

      if(typeof auth_token != 'undefined') {
        $('#login').hide();
        $('#step1').show();
        $('#step2').show();
        $.geolocation.get({win: myApp.locationSuccessCallback, fail: myApp.locationErrorCallback});
      }
    },

    locationSuccessCallback: function(position) {
      myApp.getVenues(position.coords.latitude, position.coords.longitude);
      myApp.getFriends();
    },

    locationErrorCallback: function(error) {
      alert("No location info available. Error code: " + error.code);
    },

    getFriends: function() {

        $.ajax({
            url: myApp.getApiUrl('users/self/friends'),
            data: {
              oauth_token : auth_token
            },  
            type: 'GET',
            crossDomain: true,
            dataType: 'jsonp',
            success: function(data) {
              console.log(data);
              var tplData = {};
              tplData.friends = [];

              $.each(data.response.friends.items, function(key, val) {
                // if(val.contact.phone != null) {
                  tplData.friends.push({
                    id: val.id,
                    username: val.firstName + " " + val.lastName,
                    firstName: val.firstName,
                    // photo: val.photo.prefix + "50x50" + val.photo.suffix,
                    photo: val.photo,
                    phone: val.contact.phone
                  });
                // }
              });

              tplData.friends.sort(function(a,b){
                  if(a.username<b.username) return -1;
                  if(a.username>b.username) return 1;
                  return 0;
              })

              var source   = $("#friends-template").html();
              var template = Handlebars.compile(source);
          
              var html    = template(tplData);
              
              $('#friends').html(html).trigger('create');
              $('#send_message').click(function(event) {
                event.preventDefault();
                myApp.sendMessages();
              });
              
              $('#go_back').click(function(event) {
                event.preventDefault();

                $('#step2').fadeOut(100, function() {
                  $('#step1').fadeIn();
                });
              });

          },
            error: function() { alert('Failed!'); }
        });

   
    },


    getVenues: function(latitude,longitude) {

        $.ajax({
            url: myApp.getApiUrl('venues/explore'),
            data: {
              oauth_token : auth_token,
              ll : latitude+','+longitude,
              section : 'drinks',
              // limit : 10
            },  
            type: 'GET',
            crossDomain: true,
            dataType: 'jsonp',
            success: function(data) {
              console.log('getVenues');
              console.log(data);

              var tplData = {};
              tplData.venues = [];

              $.each(data.response.groups[0].items, function(key, val) {
                tplData.venues.push({
                  id: val.venue.id,
                  name: val.venue.name,
                  // url: val.venue.shortUrl
                  url: val.venue.canonicalUrl
                });
              });
 
              var source   = $("#venues-template").html();
              var template = Handlebars.compile(source);
          
              var html    = template(tplData);
              
              $('#venues').html(html).trigger('create');

              $('#venues a').click(function(event) {
                myApp.venue_url = $(this).data('url');
                myApp.venue_name = $(this).data('name');

                console.log(myApp.venue_name);

                $('#step1').fadeOut(100, function() {
                  $('#step2').fadeIn();
                });
              });

          },
            error: function() { alert('Failed!'); }
        });

   
    },    

    sendMessages: function() {
        
        var friends = [];
        var numbers = [];
        var friendsData = $('#friends input.user_id:checked');

         
        console.log(friendsData);
        $.each(friendsData, function(key, row) {
          var id = $(row).val();
          friends.push($('#username_'+id).val());
          numbers.push($('#userphone_'+id).val());
        });

        var myData = {
              friends : friends,
              numbers : numbers,
              venue_url : myApp.venue_url,
              venue_name : myApp.venue_name
            };
        console.log(friends);
        console.log(myData);

        $.ajax({
            url: baseUrl+'sms.php',
            data: myData,  
            type: 'POST',
            crossDomain: true,
            dataType: 'jsonp',
            success: function(data) {
              console.log(data);

              $('#step2').fadeOut(100, function() {
                $('#step3').fadeIn();
              });

            },
            error: function() { 


              $('#step2').fadeOut(100, function() {
                $('#step3').fadeIn();
              });

              console.log('Failed!'); 
            }
        });

   
    },

    getApiUrl: function(args) {
      return 'https://api.foursquare.com/v2/' + args;
    },

  getAccessToken: function() {
    return myApp.getQueryVariable('access_token');
  },

  getQueryVariable: function(variable) { 
      var query = window.location.hash.substring(1);
      var vars = query.split('&');
      for (var i = 0; i < vars.length; i++) {
          var pair = vars[i].split('=');
          if (decodeURIComponent(pair[0]) == variable) {
              return decodeURIComponent(pair[1]);
          }
      }
      console.log('Query variable %s not found', variable);
  }
   
};

$(function() {
  myApp.init();
});
