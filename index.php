<!doctype html>
<head>
  <meta charset="utf-8">

  <title>My Parse App</title>
  <meta name="description" content="My Parse App">
  <meta name="viewport" content="width=device-width">
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/styles.css">
  <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
  <script type="text/javascript" src="http://www.parsecdn.com/js/parse-1.1.15.min.js"></script>
  <script type="text/javascript" src="./js/handlebars-1.0.rc.1.js"></script>
  <script type="text/javascript" src="./js/app.js"></script>
</head>

<body>
  
  <div id="main">
    
    <div id="friends">
      
    </div>
 
  </div>



  <script id="friends-template" type="text/x-handlebars-template">
  <form id="friends_form">
      <p>
        <input type="submit" value="Create MeetUp" class="create" />
      </p>
    <ul class="friends">
      {{#each friends}}
      <li class="friend"> 
        <div class="body clearfix">
          <img src="{{photo}}" />
          <div class="right">
            <label for="user_{{id}}">
              <input type="radio" value="{{id}}" name="user_id[]" id="user_{{id}}" />
              {{username}}
            </label>
          </div>
        </div>
      </li>
      {{/each}}
      </ul>
      <p>
        <input type="submit" value="Create MeetUp" class="create" />
      </p>
    </form>

  </script>


</body>

</html>
