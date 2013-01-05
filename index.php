<!doctype html>
<head>
  <meta charset="utf-8">
  <title>My Parse App</title>
  <meta name="description" content="My Parse App">
  <meta name="viewport" content="width=device-width">
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/styles.css">
  <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
  <script type="text/javascript" src="./js/handlebars-1.0.rc.1.js"></script>
  <script type="text/javascript" src="./js/app.js"></script>
</head>

<body>
  
  <div id="main">
    <h1>Let's have drinks</h1>
    <div id="venues">
      
    </div>
    <div id="friends">
      
    </div>
 
  </div>


  <script id="venues-template" type="text/x-handlebars-template">
  <form id="venues_form">
    <ul class="venues">
      {{#each venues}}
      <li class="venue"> 
        <div class="body clearfix">
          <img src="{{photo}}" />
          <div class="right">
            <label for="venue_{{id}}">
              <input type="radio" value="{{id}}" name="venue_id[]" class="venue_id" id="venue_{{id}}" />
              <input type="hidden" value="{{name}}" name="venue_name[]" id="venue_name_{{id}}" />
              <input type="hidden" value="{{url}}" name="venue_url[]" id="venue_url_{{id}}" />
              {{name}}
            </label>
          </div>
        </div>
      </li>
      {{/each}}
      </ul>
    </form>

  </script>

  <script id="friends-template" type="text/x-handlebars-template">
  <form id="friends_form">
      <p>
        <input type="submit" value="Invite friends" class="create" />
      </p>
    <ul class="friends">
      {{#each friends}}
      <li class="friend"> 
        <div class="body clearfix">
          <img src="{{photo}}" />
          <div class="right">
            <label for="user_{{id}}">
              <input type="checkbox" value="{{id}}" name="user_id[]" class="user_id" id="user_{{id}}" />
              <input type="hidden" value="{{phone}}" name="user_phone[]" id="userphone_{{id}}" />
              <?php /* <input type="hidden" value="+16467251124" name="user_phone[]" id="userphone_{{id}}" /> */ ?>
              <input type="hidden" value="{{firstName}}" name="username[]" id="username_{{id}}" />
              {{username}}
              ({{phone}})
            </label>
          </div>
        </div>
      </li>
      {{/each}}
      </ul>
      <p>
        <input type="submit" value="Invite friends" class="create" />
      </p>
    </form>

  </script>


</body>

</html>
