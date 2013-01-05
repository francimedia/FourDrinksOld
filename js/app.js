var foursquareId = ""+108894512;
var foursquareFriendId = ""+108894513;
var auth_token = "HHQYVTJRQD4MS3QANEXGBS2PYKWUJHV5URB3X4VXRCFKSJBL";
var v = 20130105;
var myPosition = '40.739063,-74.005501';

var myApp = {

    init: function() {
      myApp.getVenues();
      myApp.getFriends();
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
              console.log('friends');
              console.log(data);

              var tplData = {};
              tplData.friends = [];

              $.each(data.response.friends.items, function(key, val) {
                if(typeof val.contact.phone != 'undefined') {
                  tplData.friends.push({
                    id: val.id,
                    username: val.firstName + " " + val.lastName,
                    firstName: val.firstName,
                    photo: val.photo.prefix + "50x50" + val.photo.suffix,
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
              
              $('#friends').html(html);
              $('#friends .create').click(function(event) {
                event.preventDefault();
                myApp.sendMessages();
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
              v : v,              
              ll : myPosition,
              section : 'drinks',
              limit : 10
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
                  url: val.venue.shortUrl
                });
              });
 
              var source   = $("#venues-template").html();
              var template = Handlebars.compile(source);
          
              var html    = template(tplData);
              
              $('#venues').html(html);

          },
            error: function() { alert('Failed!'); }
        });

   
    },    

    sendMessages: function() {
        var venue_id = $('input.venue_id:checked', '#venues_form').val();

        var friends = [];
        var numbers = [];
        var friendsData = $('#friends_form input.user_id:checked');

         
        console.log(friendsData);
        $.each(friendsData, function(key, row) {
          var id = $(row).val();
          friends.push($('#username_'+id).val());
          numbers.push($('#userphone_'+id).val());
        });

        var myData = {
              friends : friends,
              numbers : numbers,
              venue_url : $('#venue_url_'+venue_id).val(),
              venue_name : $('#venue_name_'+venue_id).val(),
            };
        console.log(friends);
        console.log(myData);

        $.ajax({
            url: '/sms.php',
            data: myData,  
            type: 'POST',
            crossDomain: false,
            dataType: 'jsonp',
            success: function(data) {
              console.log(data);
            },
            error: function() { alert('Failed!'); }
        });

   
    },

    getApiUrl: function(args) {
      return 'https://api.foursquare.com/v2/' + args;
    },

    getAccessToken: function() {
      return auth_token;
    }
   
};


myApp.init();
