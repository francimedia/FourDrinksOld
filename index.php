<!doctype html>
<head>
  <meta charset="utf-8">
  <title>Let's get drinks</title>
  <meta name="description" content="Let's get drinks">
  <meta name="viewport" content="width=device-width">
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/styles.css">

  <link rel="stylesheet" href="./css/jquery.mobile-1.2.0.min.css" />
  <script src="./js/jquery-1.8.2.min.js"></script>
  <script src="./js/jquery.mobile-1.2.0.min.js"></script>
  <script src="./js/jquery.geolocation.js"></script>
  <script type="text/javascript" src="./js/handlebars-1.0.rc.1.js"></script>
  <script type="text/javascript" src="./js/app.js"></script>

  <script type="text/javascript">
    var baseUrl = '//<?php echo $_SERVER['HTTP_HOST']; ?>/';
    var v = '<?php echo date('Ymd'); ?>';
  </script>

  <style type="text/css">
    .ui-header .ui-title, .ui-footer .ui-title {
      margin: .6em 5% .8em;
    }
  </style>
</head>

<body>
  
  <div data-role="page">

  <div data-role="header">
    <h1>
      <img src="./images/beer-vector.png" style="height: 60px; margin-right: 10px" />
      Let's get drinks</h1>
  </div><!-- /header -->

  <div data-role="content"> 

    
    <div id="login">
      <h2>Please log in</h2>
      <p>
        Select a location nearby and invite friends to get drinks
      </p>
      <a href="https://foursquare.com/oauth2/authenticate?client_id=DVPR0U2DZMCFP2Q3H1ETHJTFAQAHCSD5BMK51GG1QLPN2EHV&response_type=token&redirect_uri=https://<?php echo $_SERVER['HTTP_HOST']; ?>/">
        <img src="https://playfoursquare.s3.amazonaws.com/press/logo/connect-blue.png" />
      </a>
    </div> 
    
    <div id="step1">
      <h2>1. Select time & venue</h2>

<label for="select-choice-min" class="select">Time:</label>
<select name="select-choice-min" id="select-time" data-mini="false">
   <?php 
   $times = array(
      0 => '12:00am',
      1 => '1:00am',
      2 => '2:00am',
      3 => '3:00am',
      4 => '4:00am',
      5 => '5:00am',
      6 => '6:00am',
      7 => '7:00am',
      8 => '8:00am',
      9 => '9:00am',
      10 => '10:00am',
      11 => '11:00am',
      12 => '12:00pm',
      13 => '1:00pm',
      14 => '2:00pm',
      15 => '3:00pm',
      16 => '4:00pm',
      17 => '5:00pm',
      18 => '6:00pm',
      19 => '7:00pm',
      20 => '8:00pm',
      21 => '9:00pm',
      22 => '10:00pm',
      23 => '11:00pm'
    );

   foreach($times as $key => $time) : ?>
    <option value="<?php echo $time; ?>" <?php echo $key == 20 ? 'selected="selected"' : ''; ?>><?php echo $time; ?></option>
  <?php endforeach; ?>
  </select>
  <br><br>
      <div id="venues">
      </div>  
    </div>

    
    <div id="step2">
      <h2>2. Select some friends</h2>

      <div id="friends">
        
      </div>

  
      <fieldset class="ui-grid-a">
        <div class="ui-block-a"><button type="submit" id="go_back" data-theme="d" data-mini="true">Cancel</button></div>
        <div class="ui-block-b"><button type="submit" id="send_message" data-theme="a" data-mini="true">Submit</button></div>
      </fieldset>

    </div>


    <div id="step3">
      <h2>3. Order drinks!</h2>

       <p style="text-align: center"><img src="./images/beer-vector.png" style="height: 260px;" /></p>

       Debug:

       <textarea id="debug" style="height: 300px;"></textarea> 


    </div>    

  </div><!-- /content -->

</div><!-- /page -->

 

  <script id="venues-template" type="text/x-handlebars-template">
  <form id="venues_form">

    <ul data-role="listview" data-inset="true" data-filter="true">
      {{#each venues}}
      <li> 
        <a href="#" data-id="{{id}}" data-name="{{name}}" data-url="{{url}}">
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
        <input type="checkbox" value="{{id}}" name="user_id[]" class="user_id" id="user_{{id}}" />
        <img src="{{photo}}" style="height: 35px; margin-right: 10px" />
        {{username}}
        <input type="hidden" value="{{phone}}" name="user_phone[]" id="userphone_{{id}}" />
        <input type="hidden" value="{{firstName}}" name="username[]" id="username_{{id}}" />
              
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
