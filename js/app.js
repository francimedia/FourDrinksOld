jQuery.extend({
    stringify  : function stringify(obj) {
        var t = typeof (obj);
        if (t != "object" || obj === null) {
            // simple data type
            if (t == "string") obj = '"' + obj + '"';
            return String(obj);
        } else {
            // recurse array or object
            var n, v, json = [], arr = (obj && obj.constructor == Array);
 
            for (n in obj) {
                v = obj[n];
                t = typeof(v);
                if (obj.hasOwnProperty(n)) {
                    if (t == "string") v = '"' + v + '"'; else if (t == "object" && v !== null) v = jQuery.stringify(v);
                    json.push((arr ? "" : '"' + n + '":') + String(v));
                }
            }
            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
        }
    }
});


var auth_token = 1;
var myPosition = '40.739063,-74.005501';


var myApp = {

    username: '',
    selectedVenue: null,
    venues: [],
    currentPosition: {
      lat: '40.739063',
      lng: '-74.005501'
    },

    init: function() {

      auth_token = myApp.getAccessToken();

      myApp.navigation.initialize();

      if(typeof auth_token != 'undefined') {
        $('#login').hide();
        $('#step1').show();
        myApp.getUser();
        $.geolocation.get({win: myApp.locationSuccessCallback, fail: myApp.locationErrorCallback});
      }
    },

    locationSuccessCallback: function(position) {
      myApp.currentPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      myApp.getVenues();
    },

    locationErrorCallback: function(error) {
      // alert("No location info available. Error code: " + error.code);
      myApp.getVenues();
    },

    getUser: function() {

        $.ajax({
            url: myApp.getApiUrl('users/self'),
            data: {
              oauth_token : auth_token
            },  
            type: 'GET',
            crossDomain: true,
            dataType: 'jsonp',
            success: function(data) {
              myApp.username = data.response.user.firstName;

            },
            error: function() { alert('Failed!'); }
        });
    
    },

    getFriends: function() {

        $.ajax({
            url: myApp.getApiUrl('users/self/friends'),
            data: {
              oauth_token : auth_token,
              v : v
            },  
            type: 'GET',
            crossDomain: true,
            dataType: 'jsonp',
            success: function(data) {
              
              var tplData = {};
              tplData.friends = [];

              $.each(data.response.friends.items, function(key, val) {
                if(val.contact.phone != null) {
                  tplData.friends.push({
                    id: val.id,
                    username: val.firstName + " " + val.lastName,
                    firstName: val.firstName,
                    photo: val.photo.prefix + "50x50" + val.photo.suffix,
                    // photo: val.photo,
                    phone: val.contact.phone
                  });
                }
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


    getVenues: function() {

        $.ajax({
            url: myApp.getApiUrl('venues/explore'),
            data: {
              oauth_token : auth_token,
              ll : myApp.currentPosition.lat+','+myApp.currentPosition.lng,
              section : 'drinks',
              // limit : 10
            },  
            type: 'GET',
            crossDomain: true,
            dataType: 'jsonp',
            success: function(data) {

              var tplData = {};
              tplData.venues = [];

              $.each(data.response.groups[0].items, function(index, val) {
                
                if(index == 0) {
                  myApp.selectedVenue = val.venue;
                  myApp.navigation.calcRoute();
                }

                myApp.venues[val.venue.id] = val.venue;

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
              $('#venues_wrapper').hide();

              $('#venues a').click(function(event) {
                event.preventDefault();
                myApp.selectedVenue = myApp.venues[$(this).data('id')];
                myApp.navigation.calcRoute();

                $('html, body').animate({
                    scrollTop: $('#step1').offset().top
                });                

                $('#venues_wrapper').hide();

              });

              $('#invite_friends').click(function(event) {
                event.preventDefault();

                $('html, body').animate({
                    scrollTop: $('#step1').offset().top
                });   

                $('#step1').fadeOut(100, function() {
                  $('#step2').fadeIn();
                });
              });

              $('#change_location').click(function(event) {
                event.preventDefault();

                $('#venues_wrapper').show();

                $('html, body').animate({
                    scrollTop: $('#change_location_headline').offset().top
                });     
              });

              



              myApp.getFriends();

          },
            error: function() { alert('Failed!'); }
        });

   
    },    

    sendMessages: function() {
        
        var friends = [];
        var numbers = [];
        var friendsData = $('#friends input.user_id:checked');

        $.each(friendsData, function(key, row) {
          var id = $(row).val();
          friends.push($('#username_'+id).val());
          numbers.push($('#userphone_'+id).val());
        });

        var myData = {
              friends : friends,
              numbers : numbers,
              venue_url : myApp.selectedVenue.canonicalUrl, 
              venue_name : myApp.selectedVenue.name, 
              time : $('#select-time').val(),
              username: myApp.username
        };

        $.ajax({
            url: baseUrl+'sms.php',
            data: myData,  
            type: 'POST',
            crossDomain: true,
            dataType: 'JSON',
            success: function(data) { 

              $('#step2').fadeOut(100, function() {
                $('#step3').fadeIn();
              });

              $('#debug').val($.stringify(data));

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
    },

    navigation: {

      directionDisplay: null,
      directionsService: new google.maps.DirectionsService(),
      map: null,

      initialize: function() {
        myApp.navigation.directionsDisplay = new google.maps.DirectionsRenderer();
        var mapOptions = {
          center: new google.maps.LatLng(myApp.currentPosition.lat, myApp.currentPosition.lng),
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          mapTypeControl: false,
          mapTypeControl: false,
          overviewMapControl: false,
          panControl: false,
          scaleControl: false,
          streetViewControl: false,
          zoom: 14,
          styles: [
            {
              "stylers": [
                { "saturation": -69 },
                { "visibility": "simplified" }
              ]
            }
          ]
        }
        myApp.navigation.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
        myApp.navigation.directionsDisplay.setMap(myApp.navigation.map);
        
      },

      calcRoute: function(venue) { 

        if(venue == null) {
          venue = myApp.selectedVenue;
        }

        console.log(venue);

        if ( venue.categories[0].icon != null ) {
          var name = '<img src="'+venue.categories[0].icon+'" alt="" /> ' + venue.name + ' <span>('+venue.categories[0].name+')</span>';
        } else {
          var name = venue.name;
        }
        
        $('#current_venue_name').html(name);
        $('#current_venue_details').html(venue.location.address + ', ' + venue.location.address + ' // distance: ' + venue.location.distance + 'm');


        var selectedMode = $('#mode').val();
        var request = {
            origin: new google.maps.LatLng(myApp.currentPosition.lat, myApp.currentPosition.lng),
            destination: new google.maps.LatLng(venue.location.lat, venue.location.lng),
            // Note that Javascript allows us to access the constant
            // using square brackets and a string value as its
            // "property."
            travelMode: google.maps.TravelMode[selectedMode]
        };
        myApp.navigation.directionsService.route(request, function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            myApp.navigation.directionsDisplay.setDirections(response);
          }
        });
      }

    }
   
};

$(function() {
  myApp.init();
});
