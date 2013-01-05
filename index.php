<!doctype html>
<head>
  <meta charset="utf-8">
  <title>My Parse App</title>
  <meta name="description" content="My Parse App">
  <meta name="viewport" content="width=device-width">
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/styles.css">

  <link rel="stylesheet" href="http://code.jquery.com/mobile/1.2.0/jquery.mobile-1.2.0.min.css" />
  <script src="http://code.jquery.com/jquery-1.8.2.min.js"></script>
  <script src="http://code.jquery.com/mobile/1.2.0/jquery.mobile-1.2.0.min.js"></script>
  <script type="text/javascript" src="./js/handlebars-1.0.rc.1.js"></script>
  <script type="text/javascript" src="./js/app.js"></script>
</head>

<body>
  
  <div data-role="page">

  <div data-role="header">
    <h1>Let's have drinks</h1>
  </div><!-- /header -->

  <div data-role="content"> 
    
    <div id="step1">
      <h2>1. Select a venue</h2>
      <div id="venues">
      </div>  
    </div>

    
    <div id="step2">
      <h2>2. Select some friends</h2>

      <div id="friends">
        
      </div>

  
      <fieldset class="ui-grid-a">
        <div class="ui-block-a"><button type="submit" data-theme="d" data-mini="true">Cancel</button></div>
        <div class="ui-block-b"><button type="submit" data-theme="a" data-mini="true">Submit</button></div>
      </fieldset>
            
    </div>

  </div><!-- /content -->

</div><!-- /page -->

 

  <script id="venues-template" type="text/x-handlebars-template">
  <form id="venues_form">

    <ul data-role="listview" data-inset="true" data-filter="true">
      {{#each venues}}
      <li> 
        <a href="#">
              <input type="hidden" value="{{id}}" name="venue_id[]" class="venue_id" id="venue_{{id}}" />
              <input type="hidden" value="{{name}}" name="venue_name[]" id="venue_name_{{id}}" />
              <input type="hidden" value="{{url}}" name="venue_url[]" id="venue_url_{{id}}" />
              {{name}}
        </a>
      </li>
      {{/each}}
      </ul>
    </form>

  </script>

  <script id="friends-template" type="text/x-handlebars-template">
  

    {{#each friends}}
    <label>
      <input type="checkbox" name="checkbox-0" /> 
        <img src="{{photo}}" />
        {{username}}
    </label>
    {{/each}}

<?php /*
<form id="friends_form">
      <p>
        <input type="submit" value="Invite friends" class="create" />
      </p>
    <ul data-role="listview" data-inset="true" data-filter="true">
      {{#each friends}}
      <li class="friend"> 
        <div class="body clearfix">
          <img src="{{photo}}" />
          <div class="right">
            <label for="user_{{id}}">
              <input type="checkbox" value="{{id}}" name="user_id[]" class="user_id" id="user_{{id}}" />
              <input type="hidden" value="{{phone}}" name="user_phone[]" id="userphone_{{id}}" />
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
      */ ?>
    

  </script>


</body>

</html>
