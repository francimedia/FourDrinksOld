var foursquareId = ""+108894512;
var foursquareFriendId = ""+108894513;
var auth_token = "HHQYVTJRQD4MS3QANEXGBS2PYKWUJHV5URB3X4VXRCFKSJBL";
var v = 20130105;
var currentUser = null;

var myApp = {

    init: function() {
      Parse.initialize("zhTHZJuAqvm4KSWuQ5rDFX6L5tDBSmLXUA130bZi", "ogQj2N9IAO8v9ZBwLZzpaYyJnmZe614hWri4Kaik");
      myApp.initUser();
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
              console.log(data);

              var tplData = {};
              tplData.friends = [];

              $.each(data.response.friends.items, function(key, val) {
                tplData.friends.push({
                  id: val.id,
                  username: val.firstName + " " + val.lastName,
                  photo: val.photo.prefix + "50x50" + val.photo.suffix,
                });
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
                myApp.createMeetup1();
              });

          },
            error: function() { alert('Failed!'); }
        });

   
    },

    getApiUrl: function(args) {
      return 'https://api.foursquare.com/v2/' + args;
    },

    getAccessToken: function() {
      return auth_token;
    },

    createMeetup1: function() {
      var friendId = $('input[name=user_id]:checked', '#friends_form').val();
      myApp.getUser(friendId, myApp.createMeetup2);
    },

    createMeetup2: function(friend) {
      console.log(friend);
      console.log(currentUser);
      var Meeting = Parse.Object.extend("Meeting");
      var meeting = new Meeting();

      console.log(friend);
 
      var relation1 = meeting.relation("user_id_1");
      relation1.add(currentUser);
      
      var relation2 = meeting.relation("user_id_2");
      relation2.add(friend); 

      meeting.save(null, {
        success: function(meeting) {
          // The object was saved successfully.
        },
        error: function(meeting, error) {
          // The save failed.
          // error is a Parse.Error with an error code and description.
        }
      });      
    },    

    getUser: function(user_id, callback) {

      var User = Parse.Object.extend("User");
      var query = new Parse.Query(User);
      query.equalTo("username", user_id);
      query.limit(1);
      query.find({
        success: function(results) {
          if(results.length == 0) {
            var user = new User();
            user.set('foursquare_user_id', user_id);
            user.set('username', ""+user_id);
            user.set('password', ""+user_id);
            console.log('save');
            user.save(null, {
              success: function(user) {
                // The object was saved successfully.
                callback(user);
              },
              error: function(user, error) {
                // The save failed.
                // error is a Parse.Error with an error code and description.
                console.log(error);
                callback(user);
              }
            });            

          }

          console.log(results);
          
          callback(results[0]);

        },
        error: function(error) {
          alert("Error: " + error.code + " " + error.message);
        }
      });

    },    

    setCurrentUser: function(user) {
      currentUser = user;
    },

    initUser: function() {

      myApp.getUser(foursquareId, myApp.setCurrentUser);

      return;

      Parse.User.logIn(foursquareId, foursquareId, {
        success: function(user) {
          console.log(user);
          currentUser = user;
          myApp.getFriends();
        },
        error: function(user, error) {

          var user = new Parse.User();
          user.set("username", foursquareId);
          user.set("password", foursquareId); 
           
          user.signUp(null, {
            success: function(user) {
              console.log(user);
              currentUser = user;
              myApp.getFriends();
            },
            error: function(user, error) {
              // Show the error message somewhere and let the user try again.
              alert("Error: " + error.code + " " + error.message);
            }
          });
        }
      });
 

    },

    saveUser: function() {


      var User = Parse.Object.extend("User");
      var user = new User();
       
      user.set("username", 'sdfdsf'); 
      user.set("password", '1'); 
       
      user.save(null, {
        success: function(user) {
          // The object was saved successfully.
        },
        error: function(user, error) {
          // The save failed.
          // error is a Parse.Error with an error code and description.
        }
      });

    }
};


myApp.init();
