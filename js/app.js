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
    
    searchPosition: {
      lat: '40.739063',
      lng: '-74.005501'
    },

    init: function() {

      auth_token = myApp.getAccessToken();

      myApp.navigation.initialize();

      if(typeof auth_token != 'undefined') {
        $('#login').hide();
        $('#step1, #footer').show();
        $('#title').html('Want to get drinks here?');
        myApp.buttonEvents();
        myApp.getUser();

        $.geolocation.get({win: myApp.locationSuccessCallback, fail: myApp.locationErrorCallback});  
        
      }
    },

    locationSuccessCallback: function(position) {
      myApp.currentPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      if(ll==null) {
        myApp.searchPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        myApp.getVenues();
      } else {
        $('#search_mode_wrapper').show();
        myApp.checkMode();
      }
      
    },

    locationErrorCallback: function(error) {
      // alert("No location info available. Error code: " + error.code);
      myApp.getVenues();
    },

    buttonEvents: function() {

      $('#share_location_button').click(function(event) {
        event.preventDefault();
        $('#title').html('Share my location');
        // trash code..
        $('#step1, #step2, #step3').fadeOut(100, function() {
          $('#share_location_1').fadeIn();
        });
      });
      
      $('#share_location_submit').click(function(event) {
        event.preventDefault();
        myApp.shareLocation();
      });

       
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
              
              $('#friends, #share_location_friends').html(html).trigger('create');
              $('#send_message').click(function(event) {
                event.preventDefault();
                myApp.sendMessages();
              });
              
              $('#go_back').click(function(event) {
                event.preventDefault();

                $('#step2').fadeOut(100, function() {
                  $('#title').html('Want to get drinks here?');
                  $('#step1').fadeIn();
                  myApp.changeLocation();
                });
              });

          },
            error: function() { alert('Failed!'); }
        });

   
    },

    checkMode: function() {
        if($('#search_mode').val() == 'default') {
          myApp.meetAtTarget();
        } else {
          $.geolocation.get({win: myApp.meetInTheMiddleCallback, fail: myApp.locationErrorCallback});  
        }
    },
    
    meetAtTarget: function() {
      var llArray = ll.split(',');
      myApp.searchPosition = {
          lat: parseFloat(llArray[0]),
          lng: parseFloat(llArray[1])
      };
      myApp.getVenues();
    },
    
    meetInTheMiddleCallback: function() {
        var llArray = ll.split(',');
        console.log(llArray);
        myApp.searchPosition = {
            lat: ((myApp.currentPosition.lat + parseFloat(llArray[0])) / 2),
            lng: ((myApp.currentPosition.lng + parseFloat(llArray[1])) / 2)
        };

        console.log(myApp.searchPosition);
        myApp.getVenues();
    },
    
    getVenues: function() {

        $.ajax({
            url: myApp.getApiUrl('venues/explore'),
            data: {
              oauth_token : auth_token,
              ll : myApp.searchPosition.lat+','+myApp.searchPosition.lng,
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

                $('#title').html('Text your friends');

                $('html, body').animate({
                    scrollTop: 0
                });   

                $('#step1').fadeOut(100, function() {
                  $('#step2').fadeIn();
                });
              });

              $('#change_location').click(function(event) {
                event.preventDefault();
                myApp.changeLocation();
              }); 
              
              $('#step3 a, #show_route').click(function(event) {
                event.preventDefault();
                $('#step3').fadeOut(100, function() {
                  $('#step1').fadeIn();
                });
              }); 


              myApp.getFriends();

          },
            error: function() { alert('Failed!'); }
        });

   
    },    

    changeLocation: function() {
        $('#venues_wrapper').show();

        $('html, body').animate({
            scrollTop: $('#change_location_headline').offset().top
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


              $('html, body').animate({
                  scrollTop: $('#step2').offset().top
              }); 

              $('#title').html('Go and order drinks!');

              $('#step2').fadeOut(100, function() {
                $('#step3').fadeIn();
              });

              // $('#debug').val($.stringify(data));

            },
            error: function() { 
              console.log('Failed!'); 
            }
        });

   
    },

    shareLocation: function() {
        $.geolocation.get({win: myApp._shareLocation, fail: myApp.locationErrorCallback});  
    },

    _shareLocation: function() {
        var friends = [];
        var numbers = [];
        var friendsData = $('#share_location_friends input.user_id:checked');

        $.each(friendsData, function(key, row) {
          var id = $(row).val();
          friends.push($('#username_'+id).val());
          numbers.push($('#userphone_'+id).val());
        });

        var myData = {
              friends : friends,
              numbers : numbers,
              lat : myApp.currentPosition.lat,
              lng : myApp.currentPosition.lng
        };

        $.ajax({
            url: baseUrl+'sms.php',
            data: myData,  
            type: 'POST',
            crossDomain: true,
            dataType: 'JSON',
            success: function(data) { 



            },
            error: function() { 
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
        myApp.navigation.directionsDisplay1 = new google.maps.DirectionsRenderer();
        myApp.navigation.directionsDisplay2 = new google.maps.DirectionsRenderer({
          polylineOptions: new google.maps.Polyline({
            strokeColor: '#333333',
            strokeOpacity: 0.5
          })
        });
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
        myApp.navigation.directionsDisplay1.setMap(myApp.navigation.map);
        myApp.navigation.directionsDisplay2.setMap(myApp.navigation.map);
        myApp.navigation.directionsDisplay1.setOptions( { suppressMarkers: true } );
        myApp.navigation.directionsDisplay2.setOptions( { suppressMarkers: true } );
      },

      venueMarker: null,
      userMarker: null,
      friendMarker: null,

      calcRoute: function(venue) { 

        if(myApp.navigation.venueMarker) {
          myApp.navigation.venueMarker.setMap(null);  
        }
        
        if(myApp.navigation.userMarker) {
          myApp.navigation.userMarker.setMap(null);
        }

        if(myApp.navigation.friendMarker) {
          myApp.navigation.friendMarker.setMap(null);
        }

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


        if(ll != null) {
          var llArray = ll.split(',');

          var request = {
              origin: new google.maps.LatLng(parseFloat(llArray[0]), parseFloat(llArray[1])),
              destination: new google.maps.LatLng(venue.location.lat, venue.location.lng),
              travelMode: google.maps.TravelMode[selectedMode]
          };

          myApp.navigation.directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
              myApp.navigation.directionsDisplay2.setDirections(response);

              myApp.navigation.friendMarker = new google.maps.Marker({
                  position: new google.maps.LatLng(parseFloat(llArray[0]), parseFloat(llArray[1])),
                  map: myApp.navigation.map,
                  icon: baseUrl+'images/user_comment.png'
              });            

            }
          });
        }


        var request = {
            origin: new google.maps.LatLng(myApp.currentPosition.lat, myApp.currentPosition.lng),
            destination: new google.maps.LatLng(venue.location.lat, venue.location.lng),
            travelMode: google.maps.TravelMode[selectedMode]
        };

        myApp.navigation.directionsService.route(request, function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            myApp.navigation.directionsDisplay1.setDirections(response);

            myApp.navigation.venueMarker = new google.maps.Marker({
                position: new google.maps.LatLng(venue.location.lat, venue.location.lng),
                map: myApp.navigation.map,
                icon: (venue.categories[0].icon != null ? venue.categories[0].icon : baseUrl+'images/house.png')
            });            

            myApp.navigation.userMarker = new google.maps.Marker({
                position: new google.maps.LatLng(myApp.currentPosition.lat, myApp.currentPosition.lng),
                map: myApp.navigation.map,
                icon: baseUrl+'images/user.png'
            });            

          }
        });

      }

    }
   
};

$(function() {
  myApp.init();
});
